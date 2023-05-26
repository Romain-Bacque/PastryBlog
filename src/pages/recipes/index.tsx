import AllRecipes from "../../components/AllRecipes";
import Loader from "../../components/UI/Loader";
import { getAllCategories, getAllRecipes } from "../api/recipes";

interface AllRecipesProps {
  recipes: {
    _id: string;
    image?: string;
    title: string;
    date: string;
    description: string;
    content: string;
  }[];
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

export async function getStaticProps() {
  const recipes = await getAllRecipes();
  const categories = await getAllCategories();

  return {
    props: {
      recipes,
      categories,
    },
    revalidate: 60,
  };
}
