import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../utils/theme';
import { ChevronLeft, Search, Save, Trash2 } from 'lucide-react-native';
import { FoodLog } from '../utils/types';

const LogFood = ({ onBack, onSave, onDelete, initialLog }: any) => {
    const [name, setName] = useState(initialLog?.name || '');
    const [calories, setCalories] = useState(initialLog?.calories?.toString() || '');
    const [protein, setProtein] = useState(initialLog?.protein?.toString() || '');
    const [carbs, setCarbs] = useState(initialLog?.carbs?.toString() || '');
    const [fats, setFats] = useState(initialLog?.fats?.toString() || '');
    const [amount, setAmount] = useState(initialLog?.amount || '');

    const handleSave = () => {
        onSave({
            id: initialLog?.id || Math.random().toString(36).substr(2, 9),
            name,
            calories: parseInt(calories) || 0,
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fats: parseInt(fats) || 0,
            amount,
            timestamp: Date.now(),
            mealType: 'Lunch', // Simplified for now
        });
    };

    return (
        <ScrollView className="flex-1 bg-slate-950 px-6 pt-12">
            <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={onBack}
                        className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-4"
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">
                        {initialLog ? 'Edit Log' : 'Log Food'}
                    </Text>
                </View>
                {initialLog && (
                    <TouchableOpacity onPress={() => onDelete(initialLog.id)}>
                        <Trash2 size={24} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Food Name</Text>
                    <View className="flex-row items-center bg-slate-800/50 rounded-2xl px-4 border border-slate-700/50">
                        <Search size={20} color={theme.colors.text.secondary} className="mr-2" />
                        <TextInput
                            className="flex-1 h-12 text-white"
                            placeholder="Search or enter manually"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <View className="flex-row space-x-4">
                    <View className="flex-1">
                        <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Amount</Text>
                        <TextInput
                            className="bg-slate-800/50 h-12 rounded-2xl px-4 text-white border border-slate-700/50"
                            placeholder="e.g. 150g"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 text-xs font-bold uppercase mb-2 ml-1">Calories</Text>
                        <TextInput
                            className="bg-slate-800/50 h-12 rounded-2xl px-4 text-white border border-slate-700/50"
                            placeholder="kcal"
                            keyboardType="numeric"
                            placeholderTextColor={theme.colors.text.secondary}
                            value={calories}
                            onChangeText={setCalories}
                        />
                    </View>
                </View>

                <Text className="text-slate-400 text-xs font-bold uppercase mt-4 mb-2 ml-1">Macros (optional)</Text>
                <View className="flex-row space-x-3">
                    {['Protein', 'Carbs', 'Fats'].map((macro) => (
                        <View key={macro} className="flex-1">
                            <TextInput
                                className="bg-slate-800/50 h-12 rounded-2xl px-4 text-white border border-slate-700/50"
                                placeholder={macro}
                                keyboardType="numeric"
                                placeholderTextColor={theme.colors.text.secondary}
                                value={macro === 'Protein' ? protein : macro === 'Carbs' ? carbs : fats}
                                onChangeText={macro === 'Protein' ? setProtein : macro === 'Carbs' ? setCarbs : setFats}
                            />
                        </View>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                onPress={handleSave}
                className="mt-12 bg-indigo-500 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-indigo-500/50"
            >
                <Save size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg">Save Log</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default LogFood;
