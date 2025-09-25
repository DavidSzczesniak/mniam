"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { ChefHat, Search, Filter, Plus, Calendar, BookOpen, Settings, Clock, Users } from "lucide-react"

export default function HomeView({ recipes, userPreferences, onNavigate, onAddToPlan, onSaveRecipe }) {
  const [searchQuery, setSearchQuery] = useState("")

  const getRecommendedRecipes = () => {
    return recipes
      .filter((recipe) => {
        // Simple recommendation logic based on user preferences
        if (userPreferences.dietaryRestrictions.length > 0) {
          return userPreferences.dietaryRestrictions.some((restriction) => recipe.dietary.includes(restriction))
        }
        return true
      })
      .slice(0, 6)
  }

  const getRecentlyAdded = () => {
    return recipes.slice(-4)
  }

  const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const RecipeCard = ({ recipe, showAddButton = true }) => (
    <Card className="min-w-[280px] cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={recipe.image || "/placeholder.svg?height=160&width=280"}
          alt={recipe.name}
          className="w-full h-40 object-cover rounded-t-lg"
          onClick={() => onNavigate("recipe-detail", recipe)}
        />
        <Badge className="absolute top-2 left-2" variant="secondary">
          {recipe.cuisine}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{recipe.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {recipe.prepTime + recipe.cookTime}m
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {recipe.servings}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
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
              onSaveRecipe(recipe)
              // Could show a toast notification here
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Plan
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xl font-bold">MealPlan</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("settings")}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {searchQuery ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results ({filteredRecipes.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Recommended Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
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
              <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
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
              <h2 className="text-xl font-semibold mb-4">Past Favorites</h2>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => onNavigate("home")}>
              <ChefHat className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => onNavigate("meal-planner")}>
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Planner</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => onNavigate("saved-recipes")}>
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-xs">Saved</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => onNavigate("add-recipe")}>
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
