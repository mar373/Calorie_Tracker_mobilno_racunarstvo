import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodLog } from '../utils/types';

const STORAGE_KEY = '@food_logs';

export const useStorage = () => {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        } catch (e) {
            console.error('Failed to load logs', e);
        } finally {
            setLoading(false);
        }
    };

    const saveLogs = async (newLogs: FoodLog[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
            setLogs(newLogs);
        } catch (e) {
            console.error('Failed to save logs', e);
        }
    };

    const addLog = (log: FoodLog) => {
        const updated = [log, ...logs];
        saveLogs(updated);
    };

    const updateLog = (log: FoodLog) => {
        const updated = logs.map((l) => (l.id === log.id ? log : l));
        saveLogs(updated);
    };

    const deleteLog = (id: string) => {
        const updated = logs.filter((l) => l.id !== id);
        saveLogs(updated);
    };

    return { logs, loading, addLog, updateLog, deleteLog };
};
