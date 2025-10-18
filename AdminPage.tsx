import React, { useState } from 'react';
import { Ingredient, IngredientList } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminPage: React.FC = () => {
  const [managedRecipes, setManagedRecipes] = useLocalStorage<IngredientList[]>('managedRecipes', []);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState('');
  const [currentIngredientName, setCurrentIngredientName] = useState('');
  const [currentIngredientAmount, setCurrentIngredientAmount] = useState('');

  const handleAddIngredient = () => {
    if (currentIngredientName.trim() && currentIngredientAmount.trim()) {
      setIngredients([
        ...ingredients,
        { name: currentIngredientName.trim(), amount: currentIngredientAmount.trim() }
      ]);
      setCurrentIngredientName('');
      setCurrentIngredientAmount('');
    }
  };
  
  const handleIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipeName.trim() && ingredients.length > 0 && instructions.trim()) {
      const newRecipe: IngredientList = {
        recipeName: newRecipeName.trim(),
        ingredients,
        instructions: instructions.trim().split('\n').filter(line => line.trim() !== ''),
      };
      if (managedRecipes.some(recipe => recipe.recipeName.toLowerCase() === newRecipe.recipeName.toLowerCase())) {
        alert('A recipe with this name already exists.');
        return;
      }
      setManagedRecipes([...managedRecipes, newRecipe].sort((a, b) => a.recipeName.localeCompare(b.recipeName)));
      setNewRecipeName('');
      setIngredients([]);
      setInstructions('');
    }
  };

  const handleDeleteRecipe = (recipeNameToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete the recipe "${recipeNameToDelete}"?`)) {
        setManagedRecipes(managedRecipes.filter(recipe => recipe.recipeName !== recipeNameToDelete));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-700 tracking-tight">Manage Recipes</h2>
        <p className="mt-2 text-md text-gray-500">Add or remove recipes from your local collection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Recipe Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Add New Recipe</h2>
          <form onSubmit={handleSaveRecipe} className="space-y-4">
            <div>
              <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700">Recipe Name</label>
              <input
                id="recipe-name"
                type="text"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                placeholder="e.g., Classic Pancakes"
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h3>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor="ingredient-name" className="text-xs text-gray-500">Name</label>
                  <input id="ingredient-name" type="text" value={currentIngredientName} onChange={(e) => setCurrentIngredientName(e.target.value)} onKeyDown={handleIngredientKeyDown} placeholder="Flour" className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="w-28">
                  <label htmlFor="ingredient-amount" className="text-xs text-gray-500">Amount</label>
                  <input id="ingredient-amount" type="text" value={currentIngredientAmount} onChange={(e) => setCurrentIngredientAmount(e.target.value)} onKeyDown={handleIngredientKeyDown} placeholder="2 cups" className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <button type="button" onClick={handleAddIngredient} className="bg-emerald-100 text-emerald-800 font-semibold px-4 py-1.5 rounded-md hover:bg-emerald-200 text-sm h-full">Add</button>
              </div>

              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                {ingredients.length > 0 ? ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md animate-fade-in">
                    <span className="text-sm text-gray-800">
                      <span className="font-semibold">{ing.name}</span> ({ing.amount})
                    </span>
                    <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500 hover:text-red-700 text-lg font-bold leading-none px-1">&times;</button>
                  </div>
                )) : <p className="text-xs text-center text-gray-400 p-2 border rounded-md">No ingredients added yet.</p>}
              </div>
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="1. Mix the dry ingredients...&#10;2. Add the wet ingredients...&#10;3. Cook on a hot griddle..."
                rows={5}
                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
               <p className="text-xs text-gray-500 mt-1">Enter each step on a new line.</p>
            </div>

            <button
              type="submit"
              disabled={!newRecipeName.trim() || ingredients.length === 0 || !instructions.trim()}
              className="w-full bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
            >
              Save Recipe
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Managed Recipes</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {managedRecipes.length > 0 ? (
              managedRecipes.map((recipe, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-emerald-700">{recipe.recipeName}</h3>
                      <h4 className="font-medium text-sm text-gray-700 mt-3 mb-1">Ingredients:</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        {recipe.ingredients.map((ing, i) => <li key={i}><span className="font-medium text-gray-700">{ing.name}</span>: {ing.amount}</li>)}
                      </ul>
                       <h4 className="font-medium text-sm text-gray-700 mt-3 mb-1">Instructions:</h4>
                       <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                          {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                       </ol>
                    </div>
                    <button onClick={() => handleDeleteRecipe(recipe.recipeName)} className="text-gray-400 hover:text-red-600 font-bold text-xl ml-4 p-1 leading-none">&times;</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No local recipes found.</p>
                <p className="text-xs mt-1">Add a recipe using the form on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;