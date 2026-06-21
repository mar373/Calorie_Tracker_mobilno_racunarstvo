import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components/Card';
import { theme } from '../utils/theme';
import { BarChart3, ChevronLeft, Calendar, Download } from 'lucide-react-native';

const WeeklyReport = ({ onBack }: { onBack: () => void }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [1800, 2100, 1600, 2400, 1900, 1700, 2000];
    const maxValue = Math.max(...values);

    return (
        <ScrollView className="flex-1 bg-slate-950 px-6 pt-12">
            <View className="flex-row items-center mb-8">
                <TouchableOpacity
                    onPress={onBack}
                    className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center mr-4"
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">Weekly Report</Text>
            </View>

            <Card className="mb-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                        <Calendar size={20} color={theme.colors.primary} className="mr-2" />
                        <Text className="text-slate-400">June 14 - June 21</Text>
                    </View>
                    <TouchableOpacity className="bg-indigo-500/10 px-3 py-1 rounded-full flex-row items-center">
                        <Download size={16} color={theme.colors.primary} className="mr-1" />
                        <Text className="text-indigo-500 text-xs font-bold">Export</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-end justify-between h-40 px-2">
                    {values.map((v, i) => (
                        <View key={i} className="items-center flex-1">
                            <View
                                className="w-4 rounded-t-full bg-indigo-500"
                                style={{ height: `${(v / maxValue) * 100}%` }}
                            />
                            <Text className="text-slate-500 text-[10px] mt-2">{days[i]}</Text>
                        </View>
                    ))}
                </View>
            </Card>

            <View className="flex-row space-x-4 mb-6">
                <Card className="flex-1 items-center">
                    <Text className="text-slate-400 text-xs mb-1">Avg. Daily</Text>
                    <Text className="text-white text-xl font-bold">1,928</Text>
                    <Text className="text-slate-500 text-[10px]">kcal</Text>
                </Card>
                <Card className="flex-1 items-center">
                    <Text className="text-slate-400 text-xs mb-1">Max Intake</Text>
                    <Text className="text-white text-xl font-bold">2,400</Text>
                    <Text className="text-slate-500 text-[10px]">kcal</Text>
                </Card>
            </View>

            <Text className="text-white text-lg font-bold mb-4">Insights</Text>
            <Card className="mb-8">
                <View className="flex-row items-center mb-3">
                    <BarChart3 size={20} color={theme.colors.success} className="mr-2" />
                    <Text className="text-white font-semibold">Great Consistency!</Text>
                </View>
                <Text className="text-slate-400 text-sm leading-5">
                    You've stayed within 10% of your calorie goal for 5 out of the last 7 days. Your protein intake is up by 12% compared to last week.
                </Text>
            </Card>
        </ScrollView>
    );
};

export default WeeklyReport;
