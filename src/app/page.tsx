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

export default function MealPlannerApp() {
  const [currentView, setCurrentView] = useState("signup");
  const [user, setUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    mealTypes: [],
    dietaryRestrictions: [],
    excludedIngredients: [],
  });
  const [recipes, setRecipes] = useState(mockRecipes);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigateTo = (view, data = null) => {
    setCurrentView(view);
    if (data) {
      if (view === "recipe-detail") {
        setSelectedRecipe(data);
      }
    }
  };

  const handleSignUp = (email, password) => {
    setUser({ email });
    setCurrentView("welcome-preferences");
  };

  const handlePreferencesComplete = (preferences) => {
    setUserPreferences(preferences);
    setCurrentView("home");
  };

  const addToSavedRecipes = (recipe) => {
    setSavedRecipes((prev) => [...prev, recipe]);
  };

  const addToPlan = (day, recipe) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: recipe,
    }));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "signup":
        return <SignUpView onSignUp={handleSignUp} onNavigate={navigateTo} />;
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
            onAddToPlan={addToPlan}
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
            onAddRecipe={(recipe) => {
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
        return (
          <RecipeDetailView
            recipe={selectedRecipe}
            onNavigate={navigateTo}
            onAddToPlan={addToPlan}
            onSaveRecipe={addToSavedRecipes}
          />
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
            onLogout={() => {
              setUser(null);
              setCurrentView("signup");
            }}
          />
        );
      default:
        return (
          <HomeView
            recipes={recipes}
            userPreferences={userPreferences}
            onNavigate={navigateTo}
          />
        );
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
}
