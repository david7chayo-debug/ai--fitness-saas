import {
  calculateNutritionPlan,
  Goal,
  EatingPreference,
  Experience,
  ActivityLevel,
} from '@/lib/core-engine';

export interface PersonalizedPlanInput {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  bodyFat?: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  trainingExperience: Experience;
  trainingFrequency: number;
  eatingPreference: EatingPreference;
  dietaryRestrictions: string;
  premium: boolean;
}

export interface PersonalizedPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: string;
  trainingSplit: string;
  shoppingList: string;
  explanation: string;
  reasoning: ReturnType<typeof calculateNutritionPlan>['reasoning'];
}

function buildMealPlan(
  goal: Goal,
  eatingPreference: EatingPreference,
  dietaryRestrictions: string,
  calories: number,
) {
  const restrictions = dietaryRestrictions ? ` Avoid ${dietaryRestrictions}.` : '';

  if (eatingPreference === 'intermittent fasting') {
    return `Meal 1: Large protein-packed salad with lean chicken or tofu, mixed greens, avocado, and olive oil.\nMeal 2: High-protein seafood bowl with quinoa, vegetables, and a side of steamed greens.\nSnack: Protein shake or Greek yogurt during your eating window.${restrictions}`;
  }

  if (eatingPreference === '4 meals') {
    return `Meal 1: Oats with berries, nuts, and a whey or plant-based protein addition.\nMeal 2: Turkey or lentil wrap with vegetables and hummus.\nMeal 3: Grilled fish or chicken with roasted root vegetables.\nMeal 4: Cottage cheese or tofu bowl with mixed greens and seeds.${restrictions}`;
  }

  return `Meal 1: Overnight oats or eggs with spinach and whole grain toast.\nMeal 2: Power bowl with grilled protein, brown rice, and veggies.\nMeal 3: Lean steak or tempeh with roasted vegetables and a side salad.${restrictions}`;
}

function buildTrainingSplit(
  goal: Goal,
  experience: Experience,
  frequency: number,
  activityLevel: ActivityLevel,
) {
  const intensity = experience === 'beginner' ? 'focus on movement quality' : experience === 'intermediate' ? 'build progressive overload' : 'push intensity while prioritizing recovery';
  const frequencyDescription =
    frequency <= 3
      ? 'a full-body training routine 3 times per week'
      : frequency === 4
      ? 'a balanced upper/lower split over 4 weekly sessions'
      : 'a structured 5-day split with focused muscle group work and recovery days';

  const goalFocus =
    goal === 'fat loss'
      ? 'Each session includes compound lifts, conditioning, and ample recovery to support your deficit safely.'
      : goal === 'muscle gain'
      ? 'Each session emphasizes strength, volume, and moderate conditioning to support growth without excess fatigue.'
      : 'Each session blends strength and metabolic work to support body recomposition with consistency.';

  return `${frequencyDescription}, ${intensity}. ${goalFocus} Your plan matches a ${activityLevel} lifestyle and ${frequency}-day training cadence.`;
}

function buildShoppingList(goal: Goal, eatingPreference: EatingPreference, dietaryRestrictions: string) {
  const base = [
    'lean protein sources',
    'leafy greens',
    'seasonal vegetables',
    'whole grains',
    'healthy fats',
    'berries',
  ];

  const goalItems =
    goal === 'fat loss'
      ? ['salmon', 'chicken breast', 'broccoli', 'cauliflower', 'almonds']
      : goal === 'muscle gain'
      ? ['lean beef', 'eggs', 'sweet potatoes', 'brown rice', 'Greek yogurt']
      : ['turkey', 'quinoa', 'spinach', 'avocado', 'beans'];

  const fastingItems = eatingPreference === 'intermittent fasting' ? ['protein powder', 'nuts', 'high-fiber vegetables'] : [];
  const list = [...base, ...goalItems, ...fastingItems];

  const restrictions = dietaryRestrictions ? ` Exclude ${dietaryRestrictions}.` : '';
  return `${list.join(', ')}.${restrictions}`;
}

export function generatePersonalizedPlan(input: PersonalizedPlanInput): PersonalizedPlan {
  const nutrition = calculateNutritionPlan({
    gender: input.gender,
    age: input.age,
    weight: input.weight,
    height: input.height,
    goal: input.goal,
    activityLevel: input.activityLevel,
    trainingFrequency: input.trainingFrequency,
    bodyFat: input.bodyFat,
  });

  const meals = buildMealPlan(input.goal, input.eatingPreference, input.dietaryRestrictions, nutrition.calories);
  const trainingSplit = buildTrainingSplit(input.goal, input.trainingExperience, input.trainingFrequency, input.activityLevel);
  const shoppingList = buildShoppingList(input.goal, input.eatingPreference, input.dietaryRestrictions);

  const explanation = input.premium
    ? `This premium plan uses ${nutrition.calories} kcal to support your ${input.goal} objective with a tailored macro split. Protein is set to ${nutrition.protein}g because it supports lean mass and recovery while training ${input.trainingFrequency} days per week. The meal structure fits ${input.eatingPreference} and your diet preferences, and the training split is designed around your ${input.trainingExperience} experience level.`
    : `This plan uses ${nutrition.calories} kcal and a macro balance built for your goal. Upgrade to premium for deeper personalization, weekly recalibration, and extended coaching support.`;

  return {
    calories: nutrition.calories,
    protein: nutrition.protein,
    carbs: nutrition.carbs,
    fat: nutrition.fat,
    meals,
    trainingSplit,
    shoppingList,
    explanation,
    reasoning: nutrition.reasoning,
  };
}
