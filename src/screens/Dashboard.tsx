import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../utils/theme';
import { Plus, Flame, Activity, Zap, TrendingUp, Save, X } from 'lucide-react-native';
import { FoodLog } from '../utils/types';

const MacroItem = ({ label, value, total, color, icon: Icon }: any) => (
    <View className="flex-1 items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center mb-2`} style={{ backgroundColor: `${color}20` }}>
            <Icon size={20} color={color} />
        </View>
        <Text className="text-slate-400 text-xs mb-1">{label}</Text>
        <Text className="text-white font-bold">{value}g</Text>
        <View className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
            <View
                className="h-full rounded-full"
                style={{ backgroundColor: color, width: `${(value / total) * 100}%` }}
            />
        </View>
    </View>
);

import { CircularProgress } from '../components/CircularProgress';

export const Dashboard = ({ onShowReport, onAddLog, onEditLog, logs, calorieGoal, onUpdateGoal }: {
    onShowReport: () => void;
    onAddLog: () => void;
    onEditLog: (log: FoodLog) => void;
    logs: FoodLog[];
    calorieGoal: number;
    onUpdateGoal: (newGoal: number) => void;
}) => {
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState(calorieGoal.toString());

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const left = Math.max(0, calorieGoal - totalCalories);
    const progress = Math.min(1, totalCalories / calorieGoal);

    const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = logs.reduce((sum, log) => sum + log.fats, 0);

    const handleSaveGoal = () => {
        const goalNum = parseInt(newGoal);
        if (!isNaN(goalNum) && goalNum > 0) {
            onUpdateGoal(goalNum);
            setIsEditingGoal(false);
        }
    };

    return (
        <View className="flex-1">
            <ScrollView className="flex-1 bg-slate-950 px-6 pt-12">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-slate-400 text-sm">Welcome back,</Text>
                        <Text className="text-white text-2xl font-bold">Health Tracker</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onShowReport}
                        className="flex-row items-center bg-slate-800 px-4 py-2 rounded-full"
                    >
                        <Activity size={20} color={theme.colors.primary} className="mr-2" />
                        <Text className="text-white font-medium">Report</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => {
                    setNewGoal(calorieGoal.toString());
                    setIsEditingGoal(true);
                }}>
                    <Card className="items-center py-8 mb-6">
                        <CircularProgress
                            size={200}
                            strokeWidth={12}
                            progress={progress}
                            color={theme.colors.primary}
                        >
                            <View className="items-center">
                                <Flame size={32} color={theme.colors.primary} />
                                <Text className="text-white text-4xl font-bold mt-2">{left}</Text>
                                <Text className="text-slate-400 text-sm">kcal left / {calorieGoal}</Text>
                            </View>
                        </CircularProgress>
                        <View className="flex-row mt-8 space-x-8">
                            <MacroItem label="Protein" value={totalProtein} total={120} color="#fbbf24" icon={Zap} />
                            <MacroItem label="Carbs" value={totalCarbs} total={250} color="#6366f1" icon={Activity} />
                            <MacroItem label="Fats" value={totalFats} total={70} color="#10b981" icon={TrendingUp} />
                        </View>
                        <Text className="text-indigo-400 text-xs mt-4 opacity-70">Tap to change goal</Text>
                    </Card>
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold mb-4">Daily Logs</Text>

                {logs.length === 0 ? (
                    <View className="items-center py-10">
                        <Text className="text-slate-500 italic">No logs today. Start eating!</Text>
                    </View>
                ) : (
                    logs.map((log) => (
                        <TouchableOpacity key={log.id} onPress={() => onEditLog(log)}>
                            <Card className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-indigo-500/10 rounded-xl items-center justify-center mr-4">
                                        <Zap size={24} color="#6366f1" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-semibold">{log.name}</Text>
                                        <Text className="text-slate-400 text-xs">{log.mealType} • {log.amount}</Text>
                                    </View>
                                </View>
                                <Text className="text-white font-bold">{log.calories} kcal</Text>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}

                <View className="h-24" />
            </ScrollView>

            <TouchableOpacity
                onPress={onAddLog}
                className="absolute bottom-10 right-6 w-16 h-16 bg-indigo-500 rounded-full items-center justify-center shadow-lg shadow-indigo-500/50"
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>

            <Modal
                visible={isEditingGoal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsEditingGoal(false)}
            >
                <View className="flex-1 bg-black/60 items-center justify-center px-6">
                    <Card className="w-full max-w-sm p-6 bg-slate-900 border border-slate-800">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">Daily Calorie Goal</Text>
                            <TouchableOpacity onPress={() => setIsEditingGoal(false)}>
                                <X size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-8">
                            <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Target Calories</Text>
                            <TextInput
                                className="bg-slate-800 h-14 rounded-2xl px-4 text-white text-xl font-bold border border-slate-700"
                                keyboardType="numeric"
                                value={newGoal}
                                onChangeText={setNewGoal}
                                autoFocus={true}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSaveGoal}
                            className="bg-indigo-500 h-14 rounded-2xl items-center justify-center flex-row"
                        >
                            <Save size={20} color="white" className="mr-2" />
                            <Text className="text-white font-bold text-lg">Update Goal</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </Modal>
        </View>
    );
};
