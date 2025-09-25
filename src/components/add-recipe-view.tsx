"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { ArrowLeft, Upload, Link, X, Wand2 } from "lucide-react";
import { type NavigateTo, type Recipe } from "~/types";

const cuisineOptions = [
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Thai",
  "Indian",
  "Chinese",
  "American",
  "French",
  "Other",
];
const difficultyOptions = ["Easy", "Medium", "Hard"];
const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-carb",
];

export default function AddRecipeView({
  onNavigate,
  onAddRecipe,
}: {
  onNavigate: NavigateTo;
  onAddRecipe: (recipe: Recipe) => void;
}) {
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    name: "",
    cuisine: "",
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    difficulty: "Easy",
    dietary: [],
    ingredients: [],
    instructions: "",
    image: "",
    tags: [],
    sourceLink: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [showAutofill, setShowAutofill] = useState(false);

  const handleDietaryChange = (dietary: string, checked: boolean) => {
    if (checked) {
      setRecipe((prev) => ({ ...prev, dietary: [...prev.dietary, dietary] }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        dietary: prev.dietary.filter((d) => d !== dietary),
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !recipe.tags.includes(tagInput.trim())) {
      setRecipe((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSourceLinkChange = (value: string) => {
    setRecipe((prev) => ({ ...prev, sourceLink: value }));
    setShowAutofill(value.trim().length > 0);
  };

  const handleAutofill = () => {
    // Simulate autofill from URL
    setRecipe((prev) => ({
      ...prev,
      name: "Autofilled Recipe Name",
      ingredients: ["2 cups flour", "1 cup sugar", "3 eggs", "1 tsp vanilla"],
      instructions:
        "1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350°F for 25 minutes",
    }));
    setShowAutofill(false);
  };

  const handleSave = () => {
    if (recipe.name && recipe.ingredients && recipe.instructions) {
      const newRecipe = {
        ...recipe,
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        servings: recipe.servings || 1,
        ingredients: recipe.ingredients,
        image: "/custom-recipe.png",
      };
      onAddRecipe(newRecipe);
      onNavigate("saved-recipes");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("saved-recipes")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Add New Recipe</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={
                !recipe.name || !recipe.ingredients || !recipe.instructions
              }
            >
              Save Recipe
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    value={recipe.name}
                    onChange={(e) =>
                      setRecipe((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter recipe name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cuisine">Cuisine</Label>
                    <Select
                      value={recipe.cuisine}
                      onValueChange={(value) =>
                        setRecipe((prev) => ({ ...prev, cuisine: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineOptions.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={recipe.difficulty}
                      onValueChange={(value) =>
                        setRecipe((prev) => ({ ...prev, difficulty: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prepTime">Prep Time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={recipe.prepTime}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          prepTime: Number(e.target.value),
                        }))
                      }
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cookTime">Cook Time (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={recipe.cookTime}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          cookTime: Number(e.target.value),
                        }))
                      }
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={recipe.servings}
                      onChange={(e) =>
                        setRecipe((prev) => ({
                          ...prev,
                          servings: Number(e.target.value),
                        }))
                      }
                      placeholder="4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dietary Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((dietary) => (
                    <div key={dietary} className="flex items-center space-x-2">
                      <Checkbox
                        id={dietary}
                        checked={recipe.dietary.includes(dietary)}
                        onCheckedChange={(checked: boolean) =>
                          handleDietaryChange(dietary, checked)
                        }
                      />
                      <Label htmlFor={dietary}>{dietary}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sourceLink">Source Link (optional)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        id="sourceLink"
                        value={recipe.sourceLink}
                        onChange={(e) => handleSourceLinkChange(e.target.value)}
                        placeholder="https://example.com/recipe"
                        className="pl-10"
                      />
                    </div>
                    {showAutofill && (
                      <Button variant="outline" onClick={handleAutofill}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Autofill
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <div className="mb-2 flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag"
                    />
                    <Button variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="image">Recipe Image</Label>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingredients *</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={recipe.ingredients}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      ingredients: e.target.value
                        .split("\n")
                        .filter((n) => n.trim()),
                    }))
                  }
                  placeholder="Enter each ingredient on a new line:&#10;&#10;2 cups all-purpose flour&#10;1 tsp baking powder&#10;1/2 cup butter, softened&#10;1 cup sugar"
                  className="min-h-[200px]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter each ingredient on a new line
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions *</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={recipe.instructions}
                  onChange={(e) =>
                    setRecipe((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  placeholder="Enter cooking instructions:&#10;&#10;1. Preheat oven to 350°F (175°C)&#10;2. In a large bowl, mix flour and baking powder&#10;3. In another bowl, cream butter and sugar&#10;4. Combine wet and dry ingredients&#10;5. Bake for 25-30 minutes"
                  className="min-h-[300px]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Write step-by-step cooking instructions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
