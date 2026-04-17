export type Gender = 'male' | 'female';
export type Goal = 'fat loss' | 'muscle gain' | 'recomposition';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'athlete';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type EatingPreference = '3 meals' | '4 meals' | 'intermittent fasting';

export interface FitnessReasoning {
  bmr: number;
  activityFactor: number;
  frequencyFactor: number;
  bodyFatFactor: number;
  tdee: number;
  calorieTarget: number;
  changePercent: number;
  proteinPerKg: number;
  notes: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateBMR(gender: Gender, age: number, weight: number, height: number) {
  const modifier = gender === 'female' ? -161 : 5;
  return Math.round(10 * weight + 6.25 * height - 5 * age + modifier);
}

export function activityFactor(level: ActivityLevel) {
  const values: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.65,
    athlete: 1.8,
  };
  return values[level] ?? 1.45;
}

export function trainingFrequencyFactor(days: number) {
  if (days <= 2) return 0.94;
  if (days <= 3) return 1;
  if (days <= 5) return 1 + (days - 3) * 0.03;
  return 1.12;
}

export function bodyFatAdjustment(bodyFat?: number) {
  if (!bodyFat) return 1;
  return clamp(1 + (25 - bodyFat) * 0.004, 0.95, 1.05);
}

export function calorieTarget(tdee: number, goal: Goal) {
  const adjustments: Record<Goal, number> = {
    'fat loss': -0.18,
    'muscle gain': 0.15,
    recomposition: -0.06,
  };
  const caps: Record<Goal, number> = {
    'fat loss': -0.25,
    'muscle gain': 0.2,
    recomposition: 0.12,
  };

  const changePercent = clamp(adjustments[goal], caps[goal], Math.abs(caps[goal]));
  const rawTarget = Math.round(tdee * (1 + changePercent));
  const calorieTarget = Math.max(1200, rawTarget);
  const notes: string[] = [];

  if (rawTarget !== calorieTarget) {
    notes.push('Calories were clamped to a safe minimum of 1200 kcal.');
  }

  if (goal === 'fat loss') {
    notes.push('Using a moderate deficit to preserve muscle and avoid extreme calorie loss.');
  }

  if (goal === 'muscle gain') {
    notes.push('A smaller surplus is selected to maximize lean mass while limiting fat gain.');
  }

  if (goal === 'recomposition') {
    notes.push('A slight deficit supports fat loss while keeping protein high for muscle retention.');
  }

  return { calorieTarget, changePercent, notes };
}

export function proteinPerKg(goal: Goal, bodyFat?: number) {
  let grams = goal === 'fat loss' ? 2.2 : goal === 'muscle gain' ? 1.8 : 2.0;
  if (bodyFat && bodyFat < 18) grams += 0.1;
  if (bodyFat && bodyFat > 28) grams -= 0.1;
  return clamp(grams, 1.6, 2.4);
}

export function calculateMacros(calories: number, weight: number, goal: Goal, bodyFat?: number) {
  const proteinPerKgValue = proteinPerKg(goal, bodyFat);
  const protein = Math.round(weight * proteinPerKgValue);
  const fatRatio = goal === 'muscle gain' ? 0.24 : goal === 'fat loss' ? 0.26 : 0.25;
  let fat = Math.round((calories * fatRatio) / 9);
  let carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  if (carbs < 0) {
    fat = Math.max(25, Math.round((calories - protein * 4) / 9));
    carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  }

  return { protein, carbs, fat, proteinPerKg: proteinPerKgValue };
}

export function calculateNutritionPlan(options: {
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  trainingFrequency: number;
  bodyFat?: number;
}) {
  const { gender, age, weight, height, goal, activityLevel, trainingFrequency, bodyFat } = options;
  const notes: string[] = [];

  const bmr = calculateBMR(gender, age, weight, height);
  const activityFactorValue = activityFactor(activityLevel);
  const frequencyFactorValue = trainingFrequencyFactor(trainingFrequency);
  const bodyFatFactorValue = bodyFatAdjustment(bodyFat);
  const tdee = Math.round(bmr * activityFactorValue * frequencyFactorValue * bodyFatFactorValue);
  const targetData = calorieTarget(tdee, goal);
  const macros = calculateMacros(targetData.calorieTarget, weight, goal, bodyFat);

  if (bodyFat) {
    notes.push(`Body fat adjustment factor applied at ${bodyFat.toFixed(1)}% body fat.`);
  }

  return {
    calories: targetData.calorieTarget,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    proteinPerKg: macros.proteinPerKg,
    reasoning: {
      bmr,
      activityFactor: activityFactorValue,
      frequencyFactor: frequencyFactorValue,
      bodyFatFactor: bodyFatFactorValue,
      tdee,
      calorieTarget: targetData.calorieTarget,
      changePercent: targetData.changePercent,
      proteinPerKg: macros.proteinPerKg,
      notes: [...notes, ...targetData.notes],
    },
  };
}

export function adjustCaloriesForCheckin(currentCalories: number, goal: Goal, rating: number) {
  const delta = rating >= 4 ? -0.05 : rating <= 2 ? 0.05 : 0;
  const proposed = Math.round(currentCalories * (1 + delta));
  return clamp(proposed, Math.max(1200, Math.round(currentCalories * 0.85)), Math.round(currentCalories * 1.12));
}

export function formatCalories(value?: number) {
  return value ? `${value} kcal` : 'TBD';
}
