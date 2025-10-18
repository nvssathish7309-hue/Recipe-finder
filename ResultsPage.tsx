
import React from 'react';
import { SearchType, ResultsData, IngredientList, Recipe } from '../types';
import LoadingSpinner from './common/LoadingSpinner';

interface ResultsPageProps {
  searchType: SearchType;
  searchQuery: string;
  results: ResultsData;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-8 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    New Search
  </button>
);

const RecipeDetailsResult: React.FC<{ data: IngredientList }> = ({ data }) => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Recipe: <span className="text-emerald-600">{data.recipeName}</span></h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
              <h4 className="font-semibold text-xl text-gray-800 border-b pb-2 mb-4">Ingredients</h4>
              <ul className="space-y-2">
                  {data.ingredients.map((ing, index) => (
                      <li key={index} className="flex justify-between items-baseline bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                          <span className="font-medium text-gray-700">{ing.name}</span>
                          <span className="text-sm text-gray-500">{ing.amount}</span>
                      </li>
                  ))}
              </ul>
          </div>
          <div className="md:col-span-3">
              <h4 className="font-semibold text-xl text-gray-800 border-b pb-2 mb-4">Instructions</h4>
              <ol className="list-decimal list-inside space-y-4 text-gray-700 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
                  {data.instructions.map((step, i) => <li key={i} className="pl-2 leading-relaxed">{step}</li>)}
              </ol>
          </div>
      </div>
    </div>
  );

const RecipeListResult: React.FC<{ data: Recipe[] }> = ({ data }) => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800">Recipe Ideas</h2>
    <div className="mt-6 space-y-8">
      {data.map((recipe, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-2xl font-bold text-emerald-700">{recipe.recipeName}</h3>
          <p className="mt-2 text-gray-600">{recipe.description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 border-b pb-2 mb-3">Ingredients</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 border-b pb-2 mb-3">Instructions</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResultsPage: React.FC<ResultsPageProps> = ({ searchType, results, isLoading, error, onBack }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800">An Error Occurred</h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      );
    }
    if (!results) {
      return <p className="text-center text-gray-500">No results found.</p>;
    }

    if (searchType === SearchType.RECIPE && 'ingredients' in results && 'instructions' in results) {
      return <RecipeDetailsResult data={results as IngredientList} />;
    }

    if (searchType === SearchType.INGREDIENTS && Array.isArray(results)) {
      return <RecipeListResult data={results as Recipe[]} />;
    }

    return <p className="text-center text-gray-500">Could not display results.</p>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <BackButton onClick={onBack} />
      {renderContent()}
    </div>
  );
};

export default ResultsPage;