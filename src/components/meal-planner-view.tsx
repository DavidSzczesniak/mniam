"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Badge } from "~/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, ShoppingCart, Clock, Users } from "lucide-react"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealPlannerView({ weeklyPlan, recipes, onNavigate, onUpdatePlan }) {
  const [showRecipeSelector, setShowRecipeSelector] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")

  const addRecipeToDay = (day, recipe) => {
    onUpdatePlan((prev) => ({
      ...prev,
      [day]: recipe,
    }))
    setShowRecipeSelector(false)
  }

  const removeRecipeFromDay = (day) => {
    onUpdatePlan((prev) => {
      const updated = { ...prev }
      delete updated[day]
      return updated
    })
  }

  const openRecipeSelector = (day) => {
    setSelectedDay(day)
    setShowRecipeSelector(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Your Weekly Plan</h1>
            </div>
            <Button onClick={() => onNavigate("grocery-list")}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Generate Grocery List
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Plan Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
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
                      src={weeklyPlan[day].image || "/placeholder.svg?height=80&width=80"}
                      alt={weeklyPlan[day].name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{weeklyPlan[day].name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
                          <Badge key={diet} variant="outline" className="text-xs">
                            {diet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onNavigate("recipe-detail", weeklyPlan[day])}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeRecipeFromDay(day)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="dashed"
                    className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-gray-400"
                    onClick={() => openRecipeSelector(day)}
                  >
                    <Plus className="h-6 w-6 mr-2" />
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
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a recipe for {selectedDay}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex gap-3 p-4">
                    <img
                      src={recipe.image || "/placeholder.svg?height=60&width=60"}
                      alt={recipe.name}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{recipe.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prepTime + recipe.cookTime}m
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {recipe.cuisine}
                        </Badge>
                      </div>
                      <Button size="sm" onClick={() => addRecipeToDay(selectedDay, recipe)} className="w-full">
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
  )
}
