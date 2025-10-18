import React, { useState } from 'react';
import { SearchType } from '../types';

interface SearchPageProps {
  onSearch: (query: string, type: SearchType) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<SearchType>(SearchType.RECIPE);
  const [recipeQuery, setRecipeQuery] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');

  const handleAddIngredient = () => {
    const trimmedIngredient = currentIngredient.trim();
    if (trimmedIngredient && !ingredients.find(ing => ing.toLowerCase() === trimmedIngredient.toLowerCase())) {
      setIngredients([...ingredients, trimmedIngredient]);
      setCurrentIngredient('');
    }
  };

  const handleIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === SearchType.RECIPE && recipeQuery.trim()) {
      onSearch(recipeQuery, SearchType.RECIPE);
    } else if (activeTab === SearchType.INGREDIENTS && ingredients.length > 0) {
      onSearch(ingredients.join(', '), SearchType.INGREDIENTS);
    }
  };

  const TabButton: React.FC<{
    type: SearchType;
    label: string;
    icon: React.ReactNode;
  }> = ({ type, label, icon }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
        activeTab === type
          ? 'bg-white text-gray-800 border-b-2 border-emerald-600'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const RecipeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );

  const IngredientsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-700 tracking-tight">Find a Recipe or Ingredients</h2>
        <p className="mt-2 text-md text-gray-500">Select a tab below to begin your culinary journey.</p>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex">
          <TabButton type={SearchType.RECIPE} label="Find by Recipe" icon={<RecipeIcon />} />
          <TabButton type={SearchType.INGREDIENTS} label="Find by Ingredients" icon={<IngredientsIcon />} />
        </div>
        <div className="p-8">
          <form onSubmit={handleSearch}>
            {activeTab === SearchType.RECIPE ? (
              <div>
                <label htmlFor="recipe-search" className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <input
                  id="recipe-search"
                  type="text"
                  value={recipeQuery}
                  onChange={(e) => setRecipeQuery(e.target.value)}
                  placeholder="e.g., Chocolate Chip Cookies"
                  className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                <p className="text-xs text-gray-500 mt-2">Enter the name of a dish to find its ingredients.</p>
              </div>
            ) : (
              <div>
                <label htmlFor="ingredients-search" className="block text-sm font-medium text-gray-700 mb-1">Add Ingredients</label>
                <div className="flex gap-2">
                  <input
                    id="ingredients-search"
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={handleIngredientKeyDown}
                    placeholder="e.g., Flour, Sugar, Eggs..."
                    className="flex-grow w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-emerald-100 text-emerald-800 font-semibold px-4 py-2 rounded-md hover:bg-emerald-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter an ingredient and press Enter or click Add.</p>
                {ingredients.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md border">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full animate-fade-in">
                        <span>{ingredient}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient)}
                          className="ml-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-300 p-0.5 transition"
                          aria-label={`Remove ${ingredient}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              className="mt-6 w-full flex justify-center items-center bg-emerald-600 text-white font-semibold py-3 px-4 rounded-md shadow-md hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed"
              disabled={
                (activeTab === SearchType.RECIPE && !recipeQuery.trim()) ||
                (activeTab === SearchType.INGREDIENTS && ingredients.length === 0)
              }
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
