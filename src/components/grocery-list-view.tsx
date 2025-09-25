"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ArrowLeft, Copy, Download, ShoppingCart } from "lucide-react";
import { type NavigateTo, type WeeklyPlan } from "~/types";

type IngredientData = { count: number; recipes: string[]; days: string[] };
type GroupedList = Record<string, [string, IngredientData][]>;

const ingredientCategories = {
  Produce: [
    "tomatoes",
    "onions",
    "garlic",
    "lettuce",
    "cucumber",
    "broccoli",
    "green onions",
    "thai basil",
    "eggplant",
    "lemon",
  ],
  Dairy: [
    "eggs",
    "parmesan cheese",
    "feta cheese",
    "butter",
    "sour cream",
    "cheese",
  ],
  "Meat & Seafood": ["pancetta", "chicken breast", "ground beef", "chicken"],
  Pantry: [
    "spaghetti",
    "rice",
    "quinoa",
    "olive oil",
    "teriyaki sauce",
    "black pepper",
    "white wine",
    "arborio rice",
    "vegetable stock",
    "coconut milk",
    "green curry paste",
    "bamboo shoots",
  ],
  Other: ["taco shells", "salsa", "sesame seeds", "olives"],
};

export default function GroceryListView({
  weeklyPlan,
  onNavigate,
}: {
  weeklyPlan: WeeklyPlan;
  onNavigate: NavigateTo;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [groupBy, setGroupBy] = useState("category"); // "category" or "recipe"

  const generateShoppingList = () => {
    const allIngredients = Object.entries(weeklyPlan).flatMap(([day, recipe]) =>
      recipe.ingredients.map((ingredient) => ({
        ingredient,
        day,
        recipe: recipe.name,
      })),
    );

    const ingredientCounts = allIngredients.reduce(
      (acc: Record<string, IngredientData>, { ingredient, day, recipe }) => {
        acc[ingredient] ??= { count: 0, recipes: [], days: [] };
        acc[ingredient].count += 1;
        if (!acc[ingredient].recipes.includes(recipe)) {
          acc[ingredient].recipes.push(recipe);
        }
        if (!acc[ingredient].days.includes(day)) {
          acc[ingredient].days.push(day);
        }
        return acc;
      },
      {},
    );

    return ingredientCounts;
  };

  const categorizeIngredient = (ingredient: string) => {
    for (const [category, items] of Object.entries(ingredientCategories)) {
      if (
        items.some((item) =>
          ingredient.toLowerCase().includes(item.toLowerCase()),
        )
      ) {
        return category;
      }
    }
    return "Other";
  };

  const shoppingList = generateShoppingList();

  const groupedList =
    groupBy === "category"
      ? Object.entries(ingredientCategories).reduce(
          (acc: GroupedList, [category, _]) => {
            const categoryItems = Object.entries(shoppingList).filter(
              ([ingredient]) => categorizeIngredient(ingredient) === category,
            );
            if (categoryItems.length > 0) {
              acc[category] = categoryItems;
            }
            return acc;
          },
          {},
        )
      : Object.entries(weeklyPlan).reduce((acc: GroupedList, [day, recipe]) => {
          acc[`${day} - ${recipe.name}`] = recipe.ingredients.map(
            (ingredient) => [
              ingredient,
              shoppingList[ingredient] ?? {
                count: 1,
                recipes: [recipe.name],
                days: [day],
              },
            ],
          );
          return acc;
        }, {});

  const toggleItem = (ingredient: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [ingredient]: !prev[ingredient],
    }));
  };

  const copyList = () => {
    const listText = Object.entries(groupedList)
      .map(([group, items]) => {
        const itemList = items
          .map(
            ([ingredient, data]) =>
              `• ${ingredient} ${data.count > 1 ? `(${data.count}x)` : ""}`,
          )
          .join("\n");
        return `${group}:\n${itemList}`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(listText).catch((error) => {
      console.error("Failed to copy list to clipboard:", error);
    });
  };

  const downloadList = () => {
    const listText = Object.entries(groupedList)
      .map(([group, items]) => {
        const itemList = items
          .map(
            ([ingredient, data]) =>
              `- [ ] ${ingredient} ${data.count > 1 ? `(${data.count}x)` : ""}`,
          )
          .join("\n");
        return `## ${group}\n\n${itemList}`;
      })
      .join("\n\n");

    const markdown = `# Grocery List for the Week\n\n${listText}`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grocery-list.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalItems = Object.keys(shoppingList).length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("meal-planner")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Grocery List for the Week</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyList}>
                <Copy className="mr-2 h-4 w-4" />
                Copy List
              </Button>
              <Button variant="outline" size="sm" onClick={downloadList}>
                <Download className="mr-2 h-4 w-4" />
                Download (.md)
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {checkedCount} of {totalItems} items checked
                </span>
              </div>
              <div className="h-2 w-32 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Group by Category</SelectItem>
                <SelectItem value="recipe">Group by Recipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Shopping List */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {Object.keys(shoppingList).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                No meals planned yet
              </h3>
              <p className="mb-4 text-gray-600">
                Add some recipes to your weekly plan to generate a shopping list
              </p>
              <Button onClick={() => onNavigate("meal-planner")}>
                Go to Meal Planner
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedList).map(([group, items]) => (
              <Card key={group}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{group}</span>
                    <Badge variant="secondary">{items.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map(([ingredient, data]) => (
                      <div key={ingredient} className="flex items-center gap-3">
                        <Checkbox
                          id={ingredient}
                          checked={checkedItems[ingredient] ?? false}
                          onCheckedChange={() => toggleItem(ingredient)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={ingredient}
                            className={`cursor-pointer capitalize ${
                              checkedItems[ingredient]
                                ? "text-gray-500 line-through"
                                : ""
                            }`}
                          >
                            {ingredient}
                          </label>
                          {data.count > 1 && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {data.count}x
                            </Badge>
                          )}
                          {groupBy === "category" && (
                            <div className="mt-1 text-xs text-gray-500">
                              For: {data.recipes.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
