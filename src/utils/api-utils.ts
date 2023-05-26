import path from "path";
import fs from "fs";

const dataPath = path.join(process.cwd(), "data");
const recipesDataFile = path.join(dataPath, "recipes-list.json");
const categoriesDataFile = path.join(dataPath, "categories-list.json");

function getCategoriesData() {
  const categories = fs.readFileSync(categoriesDataFile, "utf-8");

  return JSON.parse(categories);
}

export function getAllCategories() {
  const recipes = getCategoriesData();

  return recipes;
}

function getRecipesData() {
  const recipes = fs.readFileSync(recipesDataFile, "utf-8");

  return JSON.parse(recipes);
}

export function getAllRecipes() {
  const recipes = getRecipesData();

  return recipes;
}

export function getFeaturedRecipes() {
  const recipes = getRecipesData();

  const filteredRecipes = recipes.filter((recipe) => recipe.isFeatured);

  return filteredRecipes;
}

export function getRecipeById(recipeId) {
  const recipes = getRecipesData();

  const recipe = recipes.find((recipe) => recipe.id === recipeId);

  return recipe;
}
