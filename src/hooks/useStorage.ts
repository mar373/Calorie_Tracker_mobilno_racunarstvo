import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { FoodLog } from '../utils/types';
import { useAuth } from '../contexts/AuthContext';

export const useStorage = () => {
    const { user } = useAuth();
    const userId = user?.id ?? 'guest';

    // Per-user storage keys
    const STORAGE_KEY = `@food_logs_${userId}`;
    const GOAL_KEY = `@calorie_goal_${userId}`;

    // Per-user Firebase paths
    const FB_LOGS_PATH = `users/${userId}/logs`;
    const FB_GOAL_PATH = `users/${userId}/config/calorieGoal`;

    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [calorieGoal, setCalorieGoal] = useState(2400);
    const [loading, setLoading] = useState(true);

    const loadLocalData = useCallback(async () => {
        // Reset to defaults before loading to avoid stale data from previous user
        setLogs([]);
        setCalorieGoal(2400);
        setLoading(true);
        try {
            const [storedLogs, storedGoal] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY),
                AsyncStorage.getItem(GOAL_KEY)
            ]);
            if (storedLogs) setLogs(JSON.parse(storedLogs));
            if (storedGoal) setCalorieGoal(parseInt(storedGoal));
        } catch (e) {
            console.error('Failed to load local data', e);
        } finally {
            setLoading(false);
        }
    }, [STORAGE_KEY, GOAL_KEY]);

    useEffect(() => {
        if (!db) {
            console.warn('Firebase DB not initialized, using local storage.');
            loadLocalData();
            return;
        }

        // Reset state on user switch before subscribing
        setLogs([]);
        setCalorieGoal(2400);
        setLoading(true);

        // Firebase Logs Subscription (scoped to user)
        const logsRef = ref(db, FB_LOGS_PATH);
        const unsubscribeLogs = onValue(logsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const logsList: FoodLog[] = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
                logsList.sort((a, b) => b.timestamp - a.timestamp);
                setLogs(logsList);
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logsList));
            } else {
                setLogs([]);
            }
            setLoading(false);
        });

        // Firebase Goal Subscription (scoped to user)
        const goalRef = ref(db, FB_GOAL_PATH);
        const unsubscribeGoal = onValue(goalRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCalorieGoal(data);
                AsyncStorage.setItem(GOAL_KEY, data.toString());
            }
        });

        return () => {
            unsubscribeLogs();
            unsubscribeGoal();
        };
    }, [userId, FB_LOGS_PATH, FB_GOAL_PATH, STORAGE_KEY, GOAL_KEY, loadLocalData]);

    const updateGoal = async (newGoal: number) => {
        setCalorieGoal(newGoal);
        try {
            if (db) {
                const goalRef = ref(db, FB_GOAL_PATH);
                await set(goalRef, newGoal);
            }
            await AsyncStorage.setItem(GOAL_KEY, newGoal.toString());
        } catch (e) {
            console.error('Failed to update goal', e);
        }
    };

    const addLog = async (log: FoodLog) => {
        try {
            if (db) {
                const logsRef = ref(db, FB_LOGS_PATH);
                const newLogRef = push(logsRef);
                await set(newLogRef, { ...log, id: newLogRef.key });
                return;
            }
            throw new Error('No Firebase');
        } catch (e) {
            console.error('Failed to add to Firebase, updating local only', e);
            const updated = [log, ...logs];
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const updateLog = async (log: FoodLog) => {
        try {
            if (db) {
                const logRef = ref(db, `${FB_LOGS_PATH}/${log.id}`);
                await set(logRef, log);
                return;
            }
            throw new Error('No Firebase');
        } catch (e) {
            console.error('Failed to update Firebase', e);
            const updated = logs.map((l) => (l.id === log.id ? log : l));
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const deleteLog = async (id: string) => {
        try {
            if (db) {
                const logRef = ref(db, `${FB_LOGS_PATH}/${id}`);
                await remove(logRef);
                return;
            }
            throw new Error('No Firebase');
        } catch (e) {
            console.error('Failed to delete from Firebase', e);
            const updated = logs.filter((l) => l.id !== id);
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    return { logs, calorieGoal, loading, addLog, updateLog, deleteLog, updateGoal };
};
