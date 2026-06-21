import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { FoodLog } from '../utils/types';

const STORAGE_KEY = '@food_logs';

export const useStorage = () => {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [calorieGoal, setCalorieGoal] = useState(2400);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            console.warn('Firebase DB not initialized, using local storage.');
            loadLocalData();
            return;
        }

        // Firebase Logs Subscription
        const logsRef = ref(db, 'logs');
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

        // Firebase Goal Subscription
        const goalRef = ref(db, 'userConfig/calorieGoal');
        const unsubscribeGoal = onValue(goalRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCalorieGoal(data);
                AsyncStorage.setItem('@calorie_goal', data.toString());
            }
        });

        return () => {
            unsubscribeLogs();
            unsubscribeGoal();
        };
    }, []);

    const loadLocalData = async () => {
        try {
            const [storedLogs, storedGoal] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY),
                AsyncStorage.getItem('@calorie_goal')
            ]);
            if (storedLogs) setLogs(JSON.parse(storedLogs));
            if (storedGoal) setCalorieGoal(parseInt(storedGoal));
        } catch (e) {
            console.error('Failed to load local data', e);
        } finally {
            setLoading(false);
        }
    };

    const updateGoal = async (newGoal: number) => {
        setCalorieGoal(newGoal);
        try {
            if (db) {
                const goalRef = ref(db, 'userConfig/calorieGoal');
                await set(goalRef, newGoal);
            }
            await AsyncStorage.setItem('@calorie_goal', newGoal.toString());
        } catch (e) {
            console.error('Failed to update goal', e);
        }
    };

    const addLog = async (log: FoodLog) => {
        try {
            const logsRef = ref(db, 'logs');
            const newLogRef = push(logsRef);
            await set(newLogRef, { ...log, id: newLogRef.key });
        } catch (e) {
            console.error('Failed to add to Firebase, updating local only', e);
            const updated = [log, ...logs];
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const updateLog = async (log: FoodLog) => {
        try {
            const logRef = ref(db, `logs/${log.id}`);
            await set(logRef, log);
        } catch (e) {
            console.error('Failed to update Firebase', e);
            const updated = logs.map((l) => (l.id === log.id ? log : l));
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const deleteLog = async (id: string) => {
        try {
            const logRef = ref(db, `logs/${id}`);
            await remove(logRef);
        } catch (e) {
            console.error('Failed to delete from Firebase', e);
            const updated = logs.filter((l) => l.id !== id);
            setLogs(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    return { logs, calorieGoal, loading, addLog, updateLog, deleteLog, updateGoal };
};
