/**
 * Core Engine — pure calculation functions, zero LLM dependency.
 * All fitness/nutrition math lives here.
 */

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type ActivityLevel =
  | "SEDENTARY"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";
export type FitnessGoal =
  | "FAT_LOSS"
  | "MUSCLE_GAIN"
  | "RECOMPOSITION"
  | "MAINTENANCE";

export interface UserMetrics {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  bodyFatPct?: number;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  bmr: number;
  tdee: number;
}

export interface CheckInData {
  currentWeightKg: number;
  previousWeightKg: number;
  adherencePct: number;
  weekNumber: number;
}

export interface AdjustmentResult {
  newCalories: number;
  newProteinG: number;
  newCarbsG: number;
  newFatG: number;
  reason: string;
  changeKcal: number;
}

export interface WorkoutDay {
  day: string;
  type: "strength" | "cardio" | "hiit" | "rest" | "active_recovery";
  exercises: WorkoutExercise[];
  durationMin: number;
  notes?: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  notes?: string;
}

export interface MealPlan {
  meal: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
}

export interface ShoppingItem {
  category: string;
  items: string[];
}

// ─── BMR (Mifflin-St Jeor) ────────────────────────────────────────────────

export function calculateBMR(metrics: UserMetrics): number {
  const { weightKg, heightCm, age, gender } = metrics;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "MALE") return Math.round(base + 5);
  if (gender === "FEMALE") return Math.round(base - 161);
  return Math.round(base - 78); // OTHER: average
}

// ─── TDEE ─────────────────────────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LOW: 1.375,
  MEDIUM: 1.55,
  HIGH: 1.725,
  VERY_HIGH: 1.9,
};

export function calculateTDEE(metrics: UserMetrics): number {
  const bmr = calculateBMR(metrics);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[metrics.activityLevel]);
}

// ─── Calorie Adjustment by Goal ───────────────────────────────────────────

export function adjustCalories(tdee: number, goal: FitnessGoal): number {
  switch (goal) {
    case "FAT_LOSS":
      return Math.round(tdee * 0.8); // 20% deficit
    case "MUSCLE_GAIN":
      return Math.round(tdee * 1.1); // 10% surplus
    case "RECOMPOSITION":
      return tdee; // maintenance
    case "MAINTENANCE":
      return tdee;
  }
}

// ─── Macro Calculation ────────────────────────────────────────────────────

export function calculateMacros(
  metrics: UserMetrics,
  goal: FitnessGoal
): MacroTargets {
  const bmr = calculateBMR(metrics);
  const tdee = calculateTDEE(metrics);
  const targetCalories = adjustCalories(tdee, goal);

  // Lean body mass for protein if body fat known
  const leanMassKg = metrics.bodyFatPct
    ? metrics.weightKg * (1 - metrics.bodyFatPct / 100)
    : metrics.weightKg * 0.85;

  const proteinG = Math.round(leanMassKg * 2.2);
  const fatG = Math.round(metrics.weightKg * 0.8);

  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
  const carbsG = Math.round(carbKcal / 4);

  return {
    calories: targetCalories,
    proteinG,
    carbsG,
    fatG,
    bmr,
    tdee,
  };
}

// ─── Weekly Adjustment ───────────────────────────────────────────────────

export function weeklyAdjustment(
  current: MacroTargets,
  checkIn: CheckInData,
  goal: FitnessGoal
): AdjustmentResult {
  const weightDelta = checkIn.previousWeightKg - checkIn.currentWeightKg;
  const weeklyLossRate = weightDelta; // kg/week
  let newCalories = current.calories;
  let reason = "";

  // Safety: don't make aggressive changes if adherence is low
  if (checkIn.adherencePct < 60) {
    reason = "Adherencia baja (<60%). Plan sin cambios agresivos esta semana. Enfocate en consistencia.";
  } else if (goal === "FAT_LOSS") {
    if (weeklyLossRate > 1) {
      // Losing too fast → add calories
      newCalories = current.calories + 200;
      reason = "Pérdida mayor a 1kg/sem. Añadimos 200kcal para proteger músculo.";
    } else if (weeklyLossRate < 0.1 && weeklyLossRate >= 0) {
      // Stalled → reduce
      newCalories = current.calories - 150;
      reason = "Estancamiento detectado. Reducimos 150kcal para reiniciar progreso.";
    } else if (weeklyLossRate < 0) {
      // Gaining on fat loss → reduce more
      newCalories = current.calories - 200;
      reason = "Subida de peso en objetivo fat loss. Reducimos 200kcal.";
    } else {
      reason = "Progreso óptimo. Mantenemos el plan actual.";
    }
  } else if (goal === "MUSCLE_GAIN") {
    if (weeklyLossRate > 0.2) {
      // Losing weight on bulk → add calories
      newCalories = current.calories + 200;
      reason = "Pérdida de peso en objetivo de ganancia. Añadimos 200kcal.";
    } else if (weeklyLossRate < -0.5) {
      // Gaining too fast (too much fat) → reduce
      newCalories = current.calories - 100;
      reason = "Ganancia demasiado rápida. Reducimos 100kcal para minimizar grasa.";
    } else {
      reason = "Ganancia muscular en rango óptimo. Mantenemos plan.";
    }
  } else {
    reason = "Recomposición: mantenemos calorías. Ajustamos proteína si es necesario.";
  }

  // Floor: never drop below 1200 (female) / 1400 (male)
  newCalories = Math.max(newCalories, 1200);

  const changeKcal = newCalories - current.calories;

  // Recalculate macros proportionally
  const proteinG = current.proteinG; // protein stays constant
  const fatG = current.fatG;         // fat stays constant
  const carbKcal = Math.max(0, newCalories - proteinG * 4 - fatG * 9);
  const newCarbsG = Math.round(carbKcal / 4);

  return {
    newCalories,
    newProteinG: proteinG,
    newCarbsG,
    newFatG: fatG,
    reason,
    changeKcal,
  };
}

// ─── Workout Plan Generator ───────────────────────────────────────────────

export function generateWorkoutPlan(
  goal: FitnessGoal,
  activityLevel: ActivityLevel
): WorkoutDay[] {
  const isAdvanced = activityLevel === "HIGH" || activityLevel === "VERY_HIGH";

  const workoutTemplates: Record<FitnessGoal, WorkoutDay[]> = {
    FAT_LOSS: [
      {
        day: "Lunes",
        type: "strength",
        durationMin: 45,
        exercises: [
          { name: "Sentadilla", sets: 4, reps: "12", restSec: 60 },
          { name: "Peso muerto rumano", sets: 3, reps: "12", restSec: 60 },
          { name: "Prensa de pierna", sets: 3, reps: "15", restSec: 45 },
          { name: "Zancadas", sets: 3, reps: "10 c/lado", restSec: 45 },
        ],
      },
      {
        day: "Martes",
        type: "hiit",
        durationMin: 25,
        exercises: [
          { name: "Sprint 30s / Caminata 90s", sets: 8, reps: "30s", restSec: 90 },
        ],
        notes: "En ayunas o 2h post comida",
      },
      {
        day: "Miércoles",
        type: "strength",
        durationMin: 45,
        exercises: [
          { name: "Press de banca", sets: 4, reps: "12", restSec: 60 },
          { name: "Remo con barra", sets: 4, reps: "12", restSec: 60 },
          { name: "Press militar", sets: 3, reps: "12", restSec: 60 },
          { name: "Dominadas / Jalón al pecho", sets: 3, reps: "8-10", restSec: 60 },
        ],
      },
      {
        day: "Jueves",
        type: "active_recovery",
        durationMin: 30,
        exercises: [{ name: "Caminata", sets: 1, reps: "30 min", restSec: 0 }],
        notes: "Ritmo conversacional",
      },
      {
        day: "Viernes",
        type: "hiit",
        durationMin: 30,
        exercises: [
          { name: "Burpees", sets: 4, reps: "10", restSec: 45 },
          { name: "Mountain climbers", sets: 4, reps: "20", restSec: 30 },
          { name: "Jump squats", sets: 4, reps: "12", restSec: 45 },
          { name: "Push-ups", sets: 4, reps: "12", restSec: 30 },
        ],
      },
      {
        day: "Sábado",
        type: "strength",
        durationMin: 50,
        exercises: [
          { name: "Sentadilla trasera", sets: 4, reps: "10", restSec: 90 },
          { name: "Hip thrust", sets: 4, reps: "12", restSec: 60 },
          { name: "Curl femoral", sets: 3, reps: "12", restSec: 45 },
          { name: "Extensión cuádriceps", sets: 3, reps: "15", restSec: 45 },
        ],
      },
      { day: "Domingo", type: "rest", durationMin: 0, exercises: [] },
    ],

    MUSCLE_GAIN: [
      {
        day: "Lunes",
        type: "strength",
        durationMin: 60,
        notes: "Pecho + Tríceps",
        exercises: [
          { name: "Press de banca plano", sets: 4, reps: "8-10", restSec: 120 },
          { name: "Press inclinado", sets: 3, reps: "10", restSec: 90 },
          { name: "Aperturas", sets: 3, reps: "12", restSec: 60 },
          { name: "Press francés", sets: 4, reps: "10", restSec: 60 },
          { name: "Extensión tríceps polea", sets: 3, reps: "12", restSec: 60 },
        ],
      },
      {
        day: "Martes",
        type: "strength",
        durationMin: 60,
        notes: "Espalda + Bíceps",
        exercises: [
          { name: "Peso muerto", sets: 4, reps: "6-8", restSec: 180 },
          { name: "Dominadas lastradas", sets: 4, reps: "8", restSec: 120 },
          { name: "Remo en cable", sets: 3, reps: "10", restSec: 90 },
          { name: "Curl con barra", sets: 4, reps: "10", restSec: 60 },
          { name: "Curl martillo", sets: 3, reps: "12", restSec: 60 },
        ],
      },
      { day: "Miércoles", type: "rest", durationMin: 0, exercises: [] },
      {
        day: "Jueves",
        type: "strength",
        durationMin: 60,
        notes: "Piernas",
        exercises: [
          { name: "Sentadilla", sets: 5, reps: "6-8", restSec: 180 },
          { name: "Prensa 45°", sets: 4, reps: "10", restSec: 120 },
          { name: "Zancadas con barra", sets: 3, reps: "10 c/lado", restSec: 90 },
          { name: "Curl femoral", sets: 4, reps: "12", restSec: 60 },
          { name: "Gemelos sentado", sets: 4, reps: "15", restSec: 45 },
        ],
      },
      {
        day: "Viernes",
        type: "strength",
        durationMin: 55,
        notes: "Hombros + Core",
        exercises: [
          { name: "Press militar", sets: 4, reps: "8-10", restSec: 120 },
          { name: "Elevaciones laterales", sets: 4, reps: "15", restSec: 45 },
          { name: "Face pulls", sets: 3, reps: "15", restSec: 45 },
          { name: "Plancha", sets: 3, reps: "45-60s", restSec: 60 },
          { name: "Crunch con cable", sets: 3, reps: "15", restSec: 45 },
        ],
      },
      {
        day: "Sábado",
        type: "active_recovery",
        durationMin: 30,
        exercises: [{ name: "Cardio suave / natación", sets: 1, reps: "30 min", restSec: 0 }],
      },
      { day: "Domingo", type: "rest", durationMin: 0, exercises: [] },
    ],

    RECOMPOSITION: [
      {
        day: "Lunes",
        type: "strength",
        durationMin: 50,
        notes: "Full Body A",
        exercises: [
          { name: "Sentadilla", sets: 4, reps: "10", restSec: 90 },
          { name: "Press de banca", sets: 4, reps: "10", restSec: 90 },
          { name: "Peso muerto rumano", sets: 3, reps: "10", restSec: 90 },
          { name: "Remo con mancuerna", sets: 3, reps: "12", restSec: 60 },
        ],
      },
      {
        day: "Martes",
        type: "cardio",
        durationMin: 35,
        exercises: [{ name: "Cardio moderado (bici/elíptica)", sets: 1, reps: "35 min", restSec: 0 }],
        notes: "Zona 2 (60-70% FC máx)",
      },
      {
        day: "Miércoles",
        type: "strength",
        durationMin: 50,
        notes: "Full Body B",
        exercises: [
          { name: "Press militar", sets: 4, reps: "10", restSec: 90 },
          { name: "Peso muerto", sets: 3, reps: "8", restSec: 120 },
          { name: "Jalón al pecho", sets: 4, reps: "10", restSec: 60 },
          { name: "Hip thrust", sets: 3, reps: "12", restSec: 60 },
        ],
      },
      { day: "Jueves", type: "rest", durationMin: 0, exercises: [] },
      {
        day: "Viernes",
        type: "strength",
        durationMin: 50,
        notes: "Full Body C",
        exercises: [
          { name: "Sentadilla frontal", sets: 3, reps: "10", restSec: 90 },
          { name: "Press inclinado", sets: 4, reps: "10", restSec: 90 },
          { name: "Curl femoral", sets: 3, reps: "12", restSec: 60 },
          { name: "Dominadas", sets: 3, reps: "max", restSec: 90 },
        ],
      },
      {
        day: "Sábado",
        type: "hiit",
        durationMin: 20,
        exercises: [
          { name: "Tabata (20s trabajo / 10s descanso)", sets: 8, reps: "20s", restSec: 10 },
        ],
      },
      { day: "Domingo", type: "rest", durationMin: 0, exercises: [] },
    ],

    MAINTENANCE: [
      {
        day: "Lunes",
        type: "strength",
        durationMin: 45,
        exercises: [
          { name: "Sentadilla", sets: 3, reps: "10", restSec: 90 },
          { name: "Press de banca", sets: 3, reps: "10", restSec: 90 },
          { name: "Remo", sets: 3, reps: "10", restSec: 90 },
        ],
      },
      { day: "Martes", type: "cardio", durationMin: 30, exercises: [{ name: "Cardio libre", sets: 1, reps: "30 min", restSec: 0 }] },
      { day: "Miércoles", type: "rest", durationMin: 0, exercises: [] },
      {
        day: "Jueves",
        type: "strength",
        durationMin: 45,
        exercises: [
          { name: "Peso muerto", sets: 3, reps: "8", restSec: 120 },
          { name: "Press militar", sets: 3, reps: "10", restSec: 90 },
          { name: "Dominadas", sets: 3, reps: "max", restSec: 90 },
        ],
      },
      { day: "Viernes", type: "cardio", durationMin: 30, exercises: [{ name: "Cardio libre", sets: 1, reps: "30 min", restSec: 0 }] },
      { day: "Sábado", type: "active_recovery", durationMin: 45, exercises: [{ name: "Deporte / actividad libre", sets: 1, reps: "45 min", restSec: 0 }] },
      { day: "Domingo", type: "rest", durationMin: 0, exercises: [] },
    ],
  };

  const plan = workoutTemplates[goal];

  if (isAdvanced) {
    return plan.map((day) => ({
      ...day,
      exercises: day.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets + 1,
      })),
    }));
  }

  return plan;
}

// ─── Nutrition Plan Generator ─────────────────────────────────────────────

export function generateNutritionPlan(
  macros: MacroTargets,
  goal: FitnessGoal
): MealPlan[] {
  const { calories, proteinG, carbsG, fatG } = macros;

  const meals: MealPlan[] = [
    {
      meal: "Desayuno",
      time: "07:00-08:00",
      calories: Math.round(calories * 0.25),
      protein: Math.round(proteinG * 0.25),
      carbs: Math.round(carbsG * 0.3),
      fat: Math.round(fatG * 0.2),
      foods: getBreakfastFoods(goal),
    },
    {
      meal: "Snack AM",
      time: "10:00-10:30",
      calories: Math.round(calories * 0.1),
      protein: Math.round(proteinG * 0.1),
      carbs: Math.round(carbsG * 0.1),
      fat: Math.round(fatG * 0.1),
      foods: getSnackFoods(goal, "am"),
    },
    {
      meal: "Almuerzo",
      time: "13:00-14:00",
      calories: Math.round(calories * 0.35),
      protein: Math.round(proteinG * 0.35),
      carbs: Math.round(carbsG * 0.35),
      fat: Math.round(fatG * 0.35),
      foods: getLunchFoods(goal),
    },
    {
      meal: "Snack PM / Pre-entreno",
      time: "16:30-17:00",
      calories: Math.round(calories * 0.1),
      protein: Math.round(proteinG * 0.15),
      carbs: Math.round(carbsG * 0.15),
      fat: Math.round(fatG * 0.05),
      foods: getSnackFoods(goal, "pm"),
    },
    {
      meal: "Cena",
      time: "19:30-20:30",
      calories: Math.round(calories * 0.2),
      protein: Math.round(proteinG * 0.15),
      carbs: Math.round(carbsG * 0.1),
      fat: Math.round(fatG * 0.3),
      foods: getDinnerFoods(goal),
    },
  ];

  return meals;
}

function getBreakfastFoods(goal: FitnessGoal): string[] {
  const options: Record<FitnessGoal, string[]> = {
    FAT_LOSS: ["4 claras + 1 huevo entero revueltos", "Avena 50g con canela", "Café negro o té verde"],
    MUSCLE_GAIN: ["3 huevos enteros + 2 claras", "Avena 80g con plátano", "Leche entera 200ml", "1 cda. mantequilla de maní"],
    RECOMPOSITION: ["2 huevos + 2 claras", "Tostada integral", "Yogur griego 150g", "Frutas del bosque"],
    MAINTENANCE: ["2 huevos revueltos", "Pan integral 2 rebanadas", "Fruta de temporada"],
  };
  return options[goal];
}

function getSnackFoods(goal: FitnessGoal, timing: "am" | "pm"): string[] {
  if (timing === "am") {
    return goal === "MUSCLE_GAIN"
      ? ["Yogur griego 200g", "Nueces 30g", "1 plátano"]
      : ["Yogur griego 150g", "Almendras 20g"];
  }
  return goal === "FAT_LOSS"
    ? ["Proteína whey 30g con agua", "Manzana"]
    : ["Proteína whey 30g", "Plátano", "Arroz de arroz 2 tortas"];
}

function getLunchFoods(goal: FitnessGoal): string[] {
  const options: Record<FitnessGoal, string[]> = {
    FAT_LOSS: ["Pechuga de pollo 180g a la plancha", "Brócoli + espinacas salteadas 200g", "Batata cocida 100g", "Aceite de oliva 1 cdta."],
    MUSCLE_GAIN: ["Carne de res magra 200g o salmón 180g", "Arroz integral 150g cocido", "Vegetales mixtos 200g", "Aceite de oliva 1 cda."],
    RECOMPOSITION: ["Proteína magra 160g (pollo/pavo/atún)", "Arroz integral 100g", "Ensalada grande con vegetales", "Aceite de oliva 1 cdta."],
    MAINTENANCE: ["Proteína a elección 150g", "Carbohidrato complejo 120g", "Vegetales a gusto"],
  };
  return options[goal];
}

function getDinnerFoods(goal: FitnessGoal): string[] {
  const options: Record<FitnessGoal, string[]> = {
    FAT_LOSS: ["Salmón 150g al horno", "Espárragos + zucchini asados", "Ensalada verde con limón"],
    MUSCLE_GAIN: ["Carne magra 180g", "Batata 120g", "Brócoli al vapor", "Ricota 100g"],
    RECOMPOSITION: ["Pechuga de pavo 160g", "Vegetales al horno", "Humus 50g"],
    MAINTENANCE: ["Proteína magra 140g", "Vegetales variados", "Pequeña porción de carbohidrato"],
  };
  return options[goal];
}

// ─── Shopping List Generator ──────────────────────────────────────────────

export function generateShoppingList(goal: FitnessGoal): ShoppingItem[] {
  const base: ShoppingItem[] = [
    {
      category: "Proteínas",
      items: ["Pechuga de pollo (1kg)", "Salmón fresco (500g)", "Huevos (12 unidades)", "Yogur griego sin azúcar (500g)", "Atún en agua (4 latas)", "Proteína whey (opcional)"],
    },
    {
      category: "Carbohidratos complejos",
      items: ["Avena integral (500g)", "Arroz integral (1kg)", "Batata / camote (1kg)", "Pan integral (1 paquete)", "Quinoa (500g)"],
    },
    {
      category: "Vegetales",
      items: ["Brócoli (1kg)", "Espinaca fresca (500g)", "Zucchini (4 unidades)", "Espárragos (500g)", "Lechuga romana (1 planta)", "Tomates (500g)", "Pepino (2 unidades)"],
    },
    {
      category: "Frutas",
      items: ["Plátanos (6 unidades)", "Manzanas (4 unidades)", "Frutas del bosque congeladas (400g)", "Limones (4 unidades)"],
    },
    {
      category: "Grasas saludables",
      items: ["Aceite de oliva virgen extra (250ml)", "Almendras sin sal (200g)", "Nueces (150g)", "Aguacate (2 unidades)"],
    },
    {
      category: "Condimentos y otros",
      items: ["Sal marina", "Pimienta negra", "Canela", "Ajo en polvo", "Cúrcuma", "Salsa de soja baja en sodio"],
    },
  ];

  if (goal === "MUSCLE_GAIN") {
    base[0].items.push("Carne de res magra (500g)", "Ricota (300g)");
    base[1].items.push("Mantequilla de maní natural (250g)");
  }

  return base;
}

// ─── Progress Metrics ─────────────────────────────────────────────────────

export function calculateProgress(
  initialWeight: number,
  currentWeight: number,
  goal: FitnessGoal
): {
  weightDelta: number;
  onTrack: boolean;
  progressMessage: string;
} {
  const delta = initialWeight - currentWeight;
  let onTrack = false;
  let progressMessage = "";

  if (goal === "FAT_LOSS") {
    onTrack = delta > 0;
    progressMessage = delta > 0
      ? `Has perdido ${delta.toFixed(1)}kg. Excelente progreso.`
      : delta === 0
      ? "Peso estable. Ajustemos el plan esta semana."
      : `Has ganado ${Math.abs(delta).toFixed(1)}kg. Revisemos adherencia y plan.`;
  } else if (goal === "MUSCLE_GAIN") {
    onTrack = delta < 0;
    progressMessage = delta < 0
      ? `Has ganado ${Math.abs(delta).toFixed(1)}kg. Revisamos que sea músculo.`
      : "Peso estable en fase de volumen. Subamos calorías ligeramente.";
  } else {
    onTrack = Math.abs(delta) < 0.5;
    progressMessage = onTrack
      ? "Manteniendo peso objetivo. Perfecto."
      : `Variación de ${Math.abs(delta).toFixed(1)}kg. Ajustamos.`;
  }

  return { weightDelta: delta, onTrack, progressMessage };
}
