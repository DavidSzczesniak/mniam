"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Clock,
  Users,
} from "lucide-react";
import { type Recipe, type NavigateTo, type WeeklyPlan } from "~/types";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlannerView({
  weeklyPlan,
  recipes,
  onNavigate,
  onUpdatePlan,
}: {
  weeklyPlan: WeeklyPlan;
  recipes: Recipe[];
  onNavigate: NavigateTo;
  onUpdatePlan: React.Dispatch<React.SetStateAction<WeeklyPlan>>;
}) {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");

  const addRecipeToDay = (day: string, recipe: Recipe) => {
    onUpdatePlan((prev) => ({
      ...prev,
      [day]: recipe,
    }));
    setShowRecipeSelector(false);
  };

  const removeRecipeFromDay = (day: string) => {
    onUpdatePlan((prev) => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
  };

  const openRecipeSelector = (day: string) => {
    setSelectedDay(day);
    setShowRecipeSelector(true);
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
                onClick={() => onNavigate("home")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Your Weekly Plan</h1>
            </div>
            <Button onClick={() => onNavigate("grocery-list")}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Generate Grocery List
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Plan Grid */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyPlan[day] ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        weeklyPlan[day].image ||
                        "/placeholder.svg?height=80&width=80"
                      }
                      alt={weeklyPlan[day].name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">
                        {weeklyPlan[day].name}
                      </h3>
                      <div className="mb-2 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {weeklyPlan[day].prepTime + weeklyPlan[day].cookTime}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {weeklyPlan[day].servings}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {weeklyPlan[day].dietary.map((diet) => (
                          <Badge
                            key={diet}
                            variant="outline"
                            className="text-xs"
                          >
                            {diet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onNavigate("recipe-detail", weeklyPlan[day])
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRecipeFromDay(day)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="h-24 w-full border-2 border-dashed border-gray-300 hover:border-gray-400"
                    onClick={() => openRecipeSelector(day)}
                  >
                    <Plus className="mr-2 h-6 w-6" />
                    Add Recipe
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recipe Selector Dialog */}
      <Dialog open={showRecipeSelector} onOpenChange={setShowRecipeSelector}>
        <DialogContent className="max-h-[80vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Choose a recipe for {selectedDay}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                >
                  <div className="flex gap-3 p-4">
                    <img
                      src={
                        recipe.image || "/placeholder.svg?height=60&width=60"
                      }
                      alt={recipe.name}
                      className="h-15 w-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">{recipe.name}</h3>
                      <div className="mb-2 flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prepTime + recipe.cookTime}m
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {recipe.cuisine}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addRecipeToDay(selectedDay, recipe)}
                        className="w-full"
                      >
                        Add to {selectedDay}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
