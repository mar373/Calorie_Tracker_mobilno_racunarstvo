import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../utils/theme';
import { Plus, Flame, Activity, Zap, TrendingUp } from 'lucide-react-native';

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

import { FoodLog } from '../utils/types';

export const Dashboard = ({ onShowReport, onAddLog, onEditLog, logs }: {
    onShowReport: () => void;
    onAddLog: () => void;
    onEditLog: (log: FoodLog) => void;
    logs: FoodLog[];
}) => {
    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const goal = 2400;
    const left = Math.max(0, goal - totalCalories);

    const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFats = logs.reduce((sum, log) => sum + log.fats, 0);

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
                        className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center"
                    >
                        <Activity size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                <Card className="items-center py-8 mb-6">
                    <View className="w-48 h-48 rounded-full border-8 border-indigo-500/20 items-center justify-center">
                        <View className="items-center">
                            <Flame size={32} color={theme.colors.primary} />
                            <Text className="text-white text-4xl font-bold mt-2">{left}</Text>
                            <Text className="text-slate-400 text-sm">kcal left</Text>
                        </View>
                    </View>
                    <View className="flex-row mt-8 space-x-8">
                        <MacroItem label="Protein" value={totalProtein} total={120} color="#fbbf24" icon={Zap} />
                        <MacroItem label="Carbs" value={totalCarbs} total={250} color="#6366f1" icon={Activity} />
                        <MacroItem label="Fats" value={totalFats} total={70} color="#10b981" icon={TrendingUp} />
                    </View>
                </Card>

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
        </View>
    );
};
