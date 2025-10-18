
import { GoogleGenAI, Type } from "@google/genai";
import { IngredientList, Recipe } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ingredientListSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: {
      type: Type.STRING,
      description: "The name of the recipe provided by the user."
    },
    ingredients: {
      type: Type.ARRAY,
      description: "A list of ingredients for the recipe.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the ingredient."
          },
          amount: {
            type: Type.STRING,
            description: "The quantity or amount of the ingredient (e.g., '2 cups', '1 tbsp')."
          },
        },
        required: ["name", "amount"]
      },
    },
    instructions: {
        type: Type.ARRAY,
        description: "Step-by-step instructions to prepare the dish.",
        items: {
            type: Type.STRING
        }
    }
  },
  required: ["recipeName", "ingredients", "instructions"]
};

const recipeListSchema = {
  type: Type.ARRAY,
  description: "A list of recipe suggestions.",
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The name of the suggested recipe."
      },
      description: {
        type: Type.STRING,
        description: "A brief, enticing description of the dish."
      },
      ingredients: {
        type: Type.ARRAY,
        description: "A comprehensive list of all ingredients required for this recipe.",
        items: {
          type: Type.STRING
        }
      },
      instructions: {
        type: Type.ARRAY,
        description: "Step-by-step instructions to prepare the dish.",
        items: {
          type: Type.STRING
        }
      }
    },
    required: ["recipeName", "description", "ingredients", "instructions"]
  }
};


export const findIngredientsForRecipe = async (recipeName: string): Promise<IngredientList> => {
  const prompt = `Provide a detailed list of ingredients with their specific amounts, and step-by-step preparation instructions for the following recipe: "${recipeName}". Format the output as a JSON object that strictly follows the provided schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ingredientListSchema,
    },
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as IngredientList;
  } catch (e) {
    console.error("Failed to parse JSON for ingredients:", e);
    throw new Error("The API returned an unexpected format for ingredients.");
  }
};

export const findRecipesForIngredients = async (ingredients: string): Promise<Recipe[]> => {
  const prompt = `Based on the following ingredients: "${ingredients}", please suggest 3 to 5 creative and delicious recipes. For each recipe, provide a short description, a complete list of required ingredients, and clear preparation instructions. Ensure the output is a JSON array that strictly adheres to the provided schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeListSchema,
    },
  });
  
  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as Recipe[];
  } catch(e) {
    console.error("Failed to parse JSON for recipes:", e);
    throw new Error("The API returned an unexpected format for recipes.");
  }
};