export interface FoodLog {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    amount: string;
    timestamp: number;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface FoodItem {
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatsPer100g: number;
}
