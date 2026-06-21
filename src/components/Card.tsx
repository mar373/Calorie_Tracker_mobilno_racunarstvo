import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../utils/theme';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <View
            className={`bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 ${className}`}
        >
            {children}
        </View>
    );
};
