"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Globe,
  User,
} from "lucide-react";
import { type Recipe, type NavigateTo } from "~/types";

export default function SavedRecipesView({
  savedRecipes,
  allRecipes,
  onNavigate,
  onUpdateSaved,
}: {
  savedRecipes: Recipe[];
  allRecipes: Recipe[];
  onNavigate: NavigateTo;
  onUpdateSaved: React.Dispatch<React.SetStateAction<Recipe[]>>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Combine saved recipes with all recipes for display
  const displayRecipes = [
    ...savedRecipes,
    ...allRecipes.filter(
      (recipe) => !savedRecipes.some((saved) => saved.id === recipe.id),
    ),
  ];

  const filteredRecipes = displayRecipes
    .filter((recipe) => {
      const matchesSearch = recipe.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (filterBy === "manual") {
        return (
          matchesSearch && savedRecipes.some((saved) => saved.id === recipe.id)
        );
      }
      if (filterBy === "web") {
        return (
          matchesSearch && !savedRecipes.some((saved) => saved.id === recipe.id)
        );
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "time")
        return a.prepTime + a.cookTime - (b.prepTime + b.cookTime);
      if (sortBy === "cuisine") return a.cuisine.localeCompare(b.cuisine);
      return 0;
    });

  const removeFromSaved = (recipeId: number) => {
    onUpdateSaved((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  const isSaved = (recipeId: number) => {
    return savedRecipes.some((saved) => saved.id === recipeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("home")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Saved Recipes</h1>
            </div>
            <Button onClick={() => onNavigate("add-recipe")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Recipe
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recipes</SelectItem>
                <SelectItem value="manual">Added Manually</SelectItem>
                <SelectItem value="web">From Web</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="time">Sort by Time</SelectItem>
                <SelectItem value="cuisine">Sort by Cuisine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 text-sm text-gray-600">
          {filteredRecipes.length} recipe
          {filteredRecipes.length !== 1 ? "s" : ""} found
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={recipe.image || "/placeholder.svg?height=200&width=300"}
                  alt={recipe.name}
                  className="h-48 w-full cursor-pointer object-cover"
                  onClick={() => onNavigate("recipe-detail", recipe)}
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge variant="secondary">{recipe.cuisine}</Badge>
                  <Badge variant="outline" className="bg-white">
                    {isSaved(recipe.id) ? (
                      <User className="mr-1 h-3 w-3" />
                    ) : (
                      <Globe className="mr-1 h-3 w-3" />
                    )}
                    {isSaved(recipe.id) ? "Manual" : "Web"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="mb-2 line-clamp-2 font-semibold">
                  {recipe.name}
                </h3>

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

                <div className="mb-4 flex flex-wrap gap-1">
                  {recipe.dietary.slice(0, 3).map((diet) => (
                    <Badge key={diet} variant="outline" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => onNavigate("recipe-detail", recipe)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  {isSaved(recipe.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromSaved(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="py-12 text-center">
            <p className="mb-4 text-gray-500">
              No recipes found matching your criteria
            </p>
            <Button onClick={() => onNavigate("add-recipe")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Recipe
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
