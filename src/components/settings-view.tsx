"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Switch } from "~/components/ui/switch"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { ArrowLeft, User, Filter, Database, LogOut, Download, X } from "lucide-react"

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

export default function SettingsView({ userPreferences, onNavigate, onUpdatePreferences, onLogout }) {
  const [preferences, setPreferences] = useState(userPreferences)
  const [ingredientInput, setIngredientInput] = useState("")
  const [syncEnabled, setSyncEnabled] = useState(true)

  const handleMealTypeChange = (mealType, checked) => {
    const updatedMealTypes = checked
      ? [...preferences.mealTypes, mealType]
      : preferences.mealTypes.filter((type) => type !== mealType)

    const updatedPrefs = { ...preferences, mealTypes: updatedMealTypes }
    setPreferences(updatedPrefs)
    onUpdatePreferences(updatedPrefs)
  }

  const handleDietaryRestrictionChange = (restriction, checked) => {
    const updatedRestrictions = checked
      ? [...preferences.dietaryRestrictions, restriction]
      : preferences.dietaryRestrictions.filter((r) => r !== restriction)

    const updatedPrefs = { ...preferences, dietaryRestrictions: updatedRestrictions }
    setPreferences(updatedPrefs)
    onUpdatePreferences(updatedPrefs)
  }

  const addExcludedIngredient = () => {
    if (ingredientInput.trim() && !preferences.excludedIngredients.includes(ingredientInput.trim())) {
      const updatedPrefs = {
        ...preferences,
        excludedIngredients: [...preferences.excludedIngredients, ingredientInput.trim()],
      }
      setPreferences(updatedPrefs)
      onUpdatePreferences(updatedPrefs)
      setIngredientInput("")
    }
  }

  const removeExcludedIngredient = (ingredient) => {
    const updatedPrefs = {
      ...preferences,
      excludedIngredients: preferences.excludedIngredients.filter((i) => i !== ingredient),
    }
    setPreferences(updatedPrefs)
    onUpdatePreferences(updatedPrefs)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addExcludedIngredient()
    }
  }

  const exportData = () => {
    const data = {
      preferences: preferences,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "meal-planner-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Edit Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Meal Types</Label>
                <div className="grid grid-cols-2 gap-3">
                  {mealTypeOptions.map((mealType) => (
                    <div key={mealType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`meal-${mealType}`}
                        checked={preferences.mealTypes.includes(mealType)}
                        onCheckedChange={(checked) => handleMealTypeChange(mealType, checked)}
                      />
                      <Label htmlFor={`meal-${mealType}`}>{mealType}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Dietary Restrictions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryRestrictionOptions.map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dietary-${restriction}`}
                        checked={preferences.dietaryRestrictions.includes(restriction)}
                        onCheckedChange={(checked) => handleDietaryRestrictionChange(restriction, checked)}
                      />
                      <Label htmlFor={`dietary-${restriction}`}>{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Excluded Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Excluded Ingredients
              </CardTitle>
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
              {preferences.excludedIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferences.excludedIngredients.map((ingredient) => (
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

          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cloud Sync</p>
                  <p className="text-sm text-gray-600">
                    {syncEnabled ? "Your data is synced to the cloud" : "Data stored locally only"}
                  </p>
                </div>
                <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" onClick={exportData} className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Backup / Export Data
                </Button>
                <p className="text-sm text-gray-600">Export your recipes, meal plans, and preferences as a JSON file</p>
              </div>
            </CardContent>
          </Card>

          {/* Log Out */}
          <Card>
            <CardContent className="pt-6">
              <Button variant="destructive" onClick={onLogout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
