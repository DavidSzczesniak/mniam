"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { ChefHat, X } from "lucide-react"

const mealTypeOptions = ["Vegetarian", "Meat-based", "Pescatarian", "Flexitarian", "Plant-based"]

const dietaryRestrictionOptions = [
  "Gluten-free",
  "Vegan",
  "Dairy-free",
  "Nut-free",
  "Keto",
  "Paleo",
  "Low-carb",
  "Mediterranean",
]

export default function WelcomePreferencesView({ onComplete }) {
  const [mealTypes, setMealTypes] = useState([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState([])
  const [excludedIngredients, setExcludedIngredients] = useState([])
  const [ingredientInput, setIngredientInput] = useState("")

  const handleMealTypeChange = (mealType, checked) => {
    if (checked) {
      setMealTypes([...mealTypes, mealType])
    } else {
      setMealTypes(mealTypes.filter((type) => type !== mealType))
    }
  }

  const handleDietaryRestrictionChange = (restriction, checked) => {
    if (checked) {
      setDietaryRestrictions([...dietaryRestrictions, restriction])
    } else {
      setDietaryRestrictions(dietaryRestrictions.filter((r) => r !== restriction))
    }
  }

  const addExcludedIngredient = () => {
    if (ingredientInput.trim() && !excludedIngredients.includes(ingredientInput.trim())) {
      setExcludedIngredients([...excludedIngredients, ingredientInput.trim()])
      setIngredientInput("")
    }
  }

  const removeExcludedIngredient = (ingredient) => {
    setExcludedIngredients(excludedIngredients.filter((i) => i !== ingredient))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addExcludedIngredient()
    }
  }

  const handleContinue = () => {
    onComplete({
      mealTypes,
      dietaryRestrictions,
      excludedIngredients,
    })
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Let's get to know your food preferences</h1>
          <p className="text-gray-600">This helps us recommend the perfect recipes for you</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meal Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {mealTypeOptions.map((mealType) => (
                  <div key={mealType} className="flex items-center space-x-2">
                    <Checkbox
                      id={mealType}
                      checked={mealTypes.includes(mealType)}
                      onCheckedChange={(checked) => handleMealTypeChange(mealType, checked)}
                    />
                    <Label htmlFor={mealType}>{mealType}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dietary Restrictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {dietaryRestrictionOptions.map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={dietaryRestrictions.includes(restriction)}
                      onCheckedChange={(checked) => handleDietaryRestrictionChange(restriction, checked)}
                    />
                    <Label htmlFor={restriction}>{restriction}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exclude Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., onions, mushrooms"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={addExcludedIngredient} variant="outline">
                  Add
                </Button>
              </div>
              {excludedIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {excludedIngredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                      {ingredient}
                      <button
                        onClick={() => removeExcludedIngredient(ingredient)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button onClick={handleContinue} className="w-full" size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
