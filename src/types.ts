export interface UserPreferences {
  mealTypes: string[];
  dietaryRestrictions: string[];
  excludedIngredients: string[];
}

export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  dietary: string[];
  ingredients: string[];
  instructions: string;
  image: string;
  tags: string[];
  sourceLink: string;
}

export type NavigateTo = (view: string, data?: Recipe) => void;

export type WeeklyPlan = Record<string, Recipe>;
