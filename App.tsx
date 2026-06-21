import React, { useState } from 'react';
import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import { Dashboard } from './src/screens/Dashboard';
import WeeklyReport from './src/screens/WeeklyReport';
import LogFood from './src/screens/LogFood';
import { FoodLog } from './src/utils/types';

import { useStorage } from './src/hooks/useStorage';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AuthScreen } from './src/screens/AuthScreen';

function MainApp() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'report' | 'log'>('dashboard');
  const { logs, calorieGoal, loading: storageLoading, addLog, updateLog, deleteLog, updateGoal } = useStorage();
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

  if (authLoading) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <View className="flex-1 bg-slate-950 items-center justify-center">
      <View className="flex-1 w-full max-w-xl bg-slate-950">
        {currentScreen === 'dashboard' && (
          <Dashboard
            logs={logs}
            calorieGoal={calorieGoal}
            onUpdateGoal={updateGoal}
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
      </View>
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
