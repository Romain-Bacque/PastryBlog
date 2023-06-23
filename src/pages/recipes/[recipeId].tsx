import { GetStaticPropsContext } from "next";
import RecipeDetails from "../../components/RecipeDetails";
import Loader from "../../components/UI/Loader";
import { getFeaturedRecipes, getRecipeById } from "../api/recipes";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

interface Recipe {
  _id: string;
  image?: string;
  title: string;
  date: string;
  description: string;
  content: string;
}
interface CustomContext extends GetStaticPropsContext {
  params: {
    recipeId: string;
  };
}
interface RecipeDetailsPageProps {
  recipe: Recipe;
}

const RecipeDetailsPage: React.FC<RecipeDetailsPageProps> = ({ recipe }) => {
  if (!recipe) {
    return <Loader />;
  }

  return <RecipeDetails {...recipe} />;
};

export default RecipeDetailsPage;

export async function getStaticProps(context: CustomContext) {
  const { recipeId } = context.params;
  const recipe = await getRecipeById(recipeId);

  // Create a new instance of JSDOM with an empty string as the initial HTML content (we create an artifical DOM environment somehow)
  const window = new JSDOM("").window;

  // Use the createDOMPurify function to create an instance of DOMPurify linked to the created virtual window
  const DOMPurify = createDOMPurify(window);

  const sanitizedRecipe = {
    ...recipe,
    content: recipe ? DOMPurify.sanitize(recipe.content) : "",
  };

  return {
    props: {
      recipe: sanitizedRecipe,
    },
  };
}

export async function getStaticPaths() {
  const recipes = await getFeaturedRecipes();

  const paths = recipes.map((recipe) => ({
    params: { recipeId: recipe._id },
  }));

  return {
    paths,
    fallback: true, // When fallback is set to true, it enables fallback mode for paths that are not pre-rendered statically.
  };
}
