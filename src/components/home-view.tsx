"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  ChefHat,
  Search,
  Filter,
  Plus,
  Calendar,
  BookOpen,
  Settings,
  Clock,
  Users,
} from "lucide-react";
import { type UserPreferences, type Recipe, type NavigateTo } from "~/types";

export default function HomeView({
  recipes,
  userPreferences,
  onNavigate,
  onSaveRecipe,
}: {
  recipes: Recipe[];
  userPreferences: UserPreferences;
  onNavigate: NavigateTo;
  onSaveRecipe: (recipe: Recipe) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const getRecommendedRecipes = () => {
    return recipes
      .filter((recipe) => {
        // Simple recommendation logic based on user preferences
        if (userPreferences.dietaryRestrictions.length > 0) {
          return userPreferences.dietaryRestrictions.some((restriction) =>
            recipe.dietary.includes(restriction),
          );
        }
        return true;
      })
      .slice(0, 6);
  };

  const getRecentlyAdded = () => {
    return recipes.slice(-4);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const RecipeCard = ({
    recipe,
    showAddButton = true,
  }: {
    recipe: Recipe;
    showAddButton?: boolean;
  }) => (
    <Card className="min-w-[280px] cursor-pointer transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={recipe.image || "/placeholder.svg?height=160&width=280"}
          alt={recipe.name}
          className="h-40 w-full rounded-t-lg object-cover"
          onClick={() => onNavigate("recipe-detail", recipe)}
        />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {recipe.cuisine}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold">{recipe.name}</h3>
        <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.prepTime + recipe.cookTime}m
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings}
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {recipe.dietary.slice(0, 2).map((diet) => (
            <Badge key={diet} variant="outline" className="text-xs">
              {diet}
            </Badge>
          ))}
        </div>
        {showAddButton && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              onSaveRecipe(recipe);
              // Could show a toast notification here
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xl font-bold">MealPlan</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {searchQuery ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Search Results ({filteredRecipes.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recommended Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Recommended for You
              </h2>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {getRecommendedRecipes().map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Recently Added Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Recently Added</h2>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {getRecentlyAdded().map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Past Favorites Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Past Favorites</h2>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {recipes.slice(0, 4).map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed right-0 bottom-0 left-0 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              className="h-auto flex-col py-2"
              onClick={() => onNavigate("home")}
            >
              <ChefHat className="mb-1 h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col py-2"
              onClick={() => onNavigate("meal-planner")}
            >
              <Calendar className="mb-1 h-5 w-5" />
              <span className="text-xs">Planner</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col py-2"
              onClick={() => onNavigate("saved-recipes")}
            >
              <BookOpen className="mb-1 h-5 w-5" />
              <span className="text-xs">Saved</span>
            </Button>
            <Button
              variant="ghost"
              className="h-auto flex-col py-2"
              onClick={() => onNavigate("add-recipe")}
            >
              <Plus className="mb-1 h-5 w-5" />
              <span className="text-xs">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
