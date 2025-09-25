"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ArrowLeft, Clock, Users, ChefHat, Calendar, Edit, Copy, Download, ChevronDown, ChevronUp } from "lucide-react"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function RecipeDetailView({ recipe, onNavigate, onAddToPlan, onSaveRecipe }) {
  const [ingredientsOpen, setIngredientsOpen] = useState(true)
  const [instructionsOpen, setInstructionsOpen] = useState(true)
  const [selectedDay, setSelectedDay] = useState("")

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Recipe not found</p>
      </div>
    )
  }

  const handleAddToPlan = () => {
    if (selectedDay) {
      onAddToPlan(selectedDay, recipe)
      // Could show a toast notification here
    }
  }

  const copyToClipboard = () => {
    const recipeText = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.map((ing) => `• ${ing}`).join("\n")}\n\nInstructions:\n${recipe.instructions}`
    navigator.clipboard.writeText(recipeText)
  }

  const exportAsMarkdown = () => {
    const markdown = `# ${recipe.name}

**Cuisine:** ${recipe.cuisine}  
**Prep Time:** ${recipe.prepTime} minutes  
**Cook Time:** ${recipe.cookTime} minutes  
**Servings:** ${recipe.servings}  
**Difficulty:** ${recipe.difficulty}

${recipe.dietary.length > 0 ? `**Dietary:** ${recipe.dietary.join(", ")}\n` : ""}

## Ingredients

${recipe.ingredients.map((ing) => `- ${ing}`).join("\n")}

## Instructions

${recipe.instructions}
`

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${recipe.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
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
              <h1 className="text-2xl font-bold line-clamp-1">{recipe.name}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsMarkdown}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Recipe Image and Info */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={recipe.image || "/placeholder.svg?height=300&width=800"}
                alt={recipe.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white text-black">{recipe.cuisine}</Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Prep Time</p>
                    <p className="font-semibold">{recipe.prepTime}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-500 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>

              {recipe.dietary.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.dietary.map((diet) => (
                    <Badge key={diet} variant="outline">
                      {diet}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex gap-2 flex-1">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddToPlan} disabled={!selectedDay}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Plan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Section */}
        <Card className="mb-6">
          <Collapsible open={ingredientsOpen} onOpenChange={setIngredientsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                {ingredientsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Instructions Section */}
        <Card>
          <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                <h2 className="text-xl font-semibold">Instructions</h2>
                {instructionsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{recipe.instructions}</p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  )
}
