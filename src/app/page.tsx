"use client";

import { useState } from "react";
import SignUpView from "../components/sign-up-view";
import WelcomePreferencesView from "../components/welcome-preferences-view";
import HomeView from "../components/home-view";
import MealPlannerView from "../components/meal-planner-view";
import SavedRecipesView from "../components/saved-recipes-view";
import AddRecipeView from "../components/add-recipe-view";
import RecipeDetailView from "../components/recipe-detail-view";
import GroceryListView from "../components/grocery-list-view";
import SettingsView from "../components/settings-view";
import { mockRecipes } from "../data/mock-data";
import {
  type UserPreferences,
  type Recipe,
  type NavigateTo,
  type WeeklyPlan,
} from "../types";

export default function MealPlannerApp() {
  const [currentView, setCurrentView] = useState("signup");
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    mealTypes: [],
    dietaryRestrictions: [],
    excludedIngredients: [],
  });
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const navigateTo: NavigateTo = (view, data) => {
    setCurrentView(view);
    if (data) {
      if (view === "recipe-detail") {
        setSelectedRecipe(data);
      }
    }
  };

  const handleSignUp = () => {
    setCurrentView("welcome-preferences");
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentView("home");
  };

  const addToSavedRecipes = (recipe: Recipe) => {
    setSavedRecipes((prev) => [...prev, recipe]);
  };

  const addToPlan = (day: string, recipe: Recipe) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: recipe,
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "signup":
        return <SignUpView onSignUp={handleSignUp} />;
      case "welcome-preferences":
        return (
          <WelcomePreferencesView onComplete={handlePreferencesComplete} />
        );
      case "home":
        return (
          <HomeView
            recipes={recipes}
            userPreferences={userPreferences}
            onNavigate={navigateTo}
            onSaveRecipe={addToSavedRecipes}
          />
        );
      case "meal-planner":
        return (
          <MealPlannerView
            weeklyPlan={weeklyPlan}
            recipes={recipes}
            onNavigate={navigateTo}
            onUpdatePlan={setWeeklyPlan}
          />
        );
      case "saved-recipes":
        return (
          <SavedRecipesView
            savedRecipes={savedRecipes}
            allRecipes={recipes}
            onNavigate={navigateTo}
            onUpdateSaved={setSavedRecipes}
          />
        );
      case "add-recipe":
        return (
          <AddRecipeView
            onNavigate={navigateTo}
            onAddRecipe={(recipe: Recipe) => {
              setRecipes((prev) => [
                ...prev,
                { ...recipe, id: prev.length + 1 },
              ]);
              setSavedRecipes((prev) => [
                ...prev,
                { ...recipe, id: prev.length + 1 },
              ]);
            }}
          />
        );
      case "recipe-detail":
        return selectedRecipe ? (
          <RecipeDetailView
            recipe={selectedRecipe}
            onNavigate={navigateTo}
            onAddToPlan={addToPlan}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            No recipe selected
          </div>
        );
      case "grocery-list":
        return (
          <GroceryListView weeklyPlan={weeklyPlan} onNavigate={navigateTo} />
        );
      case "settings":
        return (
          <SettingsView
            userPreferences={userPreferences}
            onNavigate={navigateTo}
            onUpdatePreferences={setUserPreferences}
            onLogout={() => setCurrentView("signup")}
          />
        );
      default:
        return (
          <HomeView
            recipes={recipes}
            userPreferences={userPreferences}
            onNavigate={navigateTo}
            onSaveRecipe={addToSavedRecipes}
          />
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
}
