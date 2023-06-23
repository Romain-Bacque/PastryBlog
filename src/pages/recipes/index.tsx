import AllRecipes from "../../components/AllRecipes";
import Loader from "../../components/UI/Loader";
import { Recipe } from "../../global/types";
import { getAllCategories, getAllRecipes } from "../api/recipes";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

interface AllRecipesProps {
  recipes: Recipe[];
  categories: { _id: string; tag: string }[];
}

const AllRecipesPage: React.FC<AllRecipesProps> = ({ categories, recipes }) => {
  if (!recipes) {
    return <Loader />;
  }

  if (!(recipes.length > 0)) {
    return (
      <p style={{ width: "fit-content", margin: "auto" }}>
        Aucune recette enregistrée.
      </p>
    );
  }

  return <AllRecipes categories={categories} recipes={recipes} />;
};

export default AllRecipesPage;

export async function getServerSideProps() {
  const recipes = await getAllRecipes();
  const categories = await getAllCategories();

  // Create a new instance of JSDOM with an empty string as the initial HTML content (we create an artifical DOM environment somehow)
  const window = new JSDOM("").window;

  // Use the createDOMPurify function to create an instance of DOMPurify linked to the created virtual window
  const DOMPurify = createDOMPurify(window);

  const sanitizedRecipes = recipes.map((recipe) => ({
    ...recipe,
    content: DOMPurify.sanitize(recipe.content),
  }));

  return {
    props: {
      recipes: sanitizedRecipes,
      categories,
    },
  };
}
