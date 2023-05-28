import { getSession } from "next-auth/react";
import AllRecipes from "../../components/AllRecipes";
import Loader from "../../components/UI/Loader";
import { getAllCategories } from "../api/recipes";
import { NextPageContext } from "next";
import { ExtendedSession, Recipe } from "../../global/types";
import { getUserFavoritesRecipes } from "../api/recipes/favorites";

interface FavoritesProps {
  userId: string;
  recipes: Recipe[];
  categories: { _id: string; tag: string }[];
}

const FavoritesPage: React.FC<FavoritesProps> = ({ categories, recipes }) => {
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

  return (
    <AllRecipes categories={categories} recipes={recipes} isFavoritesPage />
  );
};

export default FavoritesPage;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true, // Set to true if the redirect is permanent
      },
    };
  }

  const recipes = await getUserFavoritesRecipes(
    (session as ExtendedSession).user.id!
  );
  const categories = await getAllCategories();

  return {
    props: {
      userId: session.user?.email,
      recipes,
      categories,
    },
  };
}
