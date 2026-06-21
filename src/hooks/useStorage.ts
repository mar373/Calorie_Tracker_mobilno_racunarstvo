import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { FoodLog } from '../utils/types';

const STORAGE_KEY = '@food_logs';

export const useStorage = () => {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase Subscription
        const logsRef = ref(db, 'logs');
        const unsubscribe = onValue(logsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const logsList: FoodLog[] = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
                // Sort by timestamp descending
                logsList.sort((a, b) => b.timestamp - a.timestamp);
                setLogs(logsList);
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logsList));
            } else {
                setLogs([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Firebase error, falling back to local storage', error);
            loadLocalLogs();
        });

        return () => unsubscribe();
    }, []);

    const loadLocalLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        } catch (e) {
            console.error('Failed to load local logs', e);
        } finally {
            setLoading(false);
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

    return { logs, loading, addLog, updateLog, deleteLog };
};
