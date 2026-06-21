import React, { useState } from 'react';
import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { Dashboard } from './src/screens/Dashboard';
import WeeklyReport from './src/screens/WeeklyReport';
import LogFood from './src/screens/LogFood';
import { FoodLog } from './src/utils/types';

import { useStorage } from './src/hooks/useStorage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'report' | 'log'>('dashboard');
  const { logs, loading, addLog, updateLog, deleteLog } = useStorage();
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

  const handleSaveLog = (log: FoodLog) => {
    if (editingLog) {
      updateLog(log);
    } else {
      addLog(log);
    }
    setEditingLog(null);
    setCurrentScreen('dashboard');
  };

  const handleDeleteLog = (id: string) => {
    deleteLog(id);
    setEditingLog(null);
    setCurrentScreen('dashboard');
  };

  const handleEditLog = (log: FoodLog) => {
    setEditingLog(log);
    setCurrentScreen('log');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {currentScreen === 'dashboard' && (
        <Dashboard
          logs={logs}
          onShowReport={() => setCurrentScreen('report')}
          onAddLog={() => {
            setEditingLog(null);
            setCurrentScreen('log');
          }}
          onEditLog={handleEditLog}
        />
      )}
      {currentScreen === 'report' && (
        <WeeklyReport onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'log' && (
        <LogFood
          initialLog={editingLog}
          onBack={() => setCurrentScreen('dashboard')}
          onSave={handleSaveLog}
          onDelete={handleDeleteLog}
        />
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
