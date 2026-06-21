import { useState, useEffect, useCallback } from 'react';
import { foodApi } from '../services/api';
import { FoodLog } from '../utils/types';
import { useAuth } from '../contexts/AuthContext';

export const useStorage = () => {
    const { user, isAuthenticated } = useAuth();
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [calorieGoal, setCalorieGoal] = useState(2400);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!isAuthenticated) return;

        setLogs([]);
        setCalorieGoal(2400);
        setLoading(true);

        try {
            const [fetchedLogs, fetchedGoal] = await Promise.all([
                foodApi.getLogs(),
                foodApi.getGoal(),
            ]);
            setLogs(fetchedLogs || []);
            setCalorieGoal(fetchedGoal || 2400);
        } catch (error) {
            console.error('Greška pri učitavanju podataka:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Učitaj podatke kada se korisnik prijavi ili promijeni
    useEffect(() => {
        loadData();
    }, [loadData, user?.id]);

    const updateGoal = async (newGoal: number) => {
        setCalorieGoal(newGoal);
        try {
            await foodApi.updateGoal(newGoal);
        } catch (error) {
            console.error('Greška pri ažuriranju cilja:', error);
        }
    };

    const addLog = async (log: FoodLog) => {
        try {
            const savedLog = await foodApi.createLog(log);
            setLogs((prev) => [savedLog, ...prev]);
        } catch (error) {
            console.error('Greška pri dodavanju obroka:', error);
        }
    };

    const updateLog = async (log: FoodLog) => {
        try {
            const updatedLog = await foodApi.updateLog(log.id, log);
            setLogs((prev) => prev.map((l) => (l.id === log.id ? updatedLog : l)));
        } catch (error) {
            console.error('Greška pri ažuriranju obroka:', error);
        }
    };

    const deleteLog = async (id: string) => {
        try {
            await foodApi.deleteLog(id);
            setLogs((prev) => prev.filter((l) => l.id !== id));
        } catch (error) {
            console.error('Greška pri brisanju obroka:', error);
        }
    };

    return { logs, calorieGoal, loading, addLog, updateLog, deleteLog, updateGoal };
};
