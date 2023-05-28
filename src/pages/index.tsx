import Home from "../components/Home";
import Loader from "../components/UI/Loader";
import { getFeaturedRecipes } from "./api/recipes";

// aliases
interface HomePageProps {
  recipes: {
    _id: string;
    image?: string;
    title: string;
    date: string;
    description: string;
    content: string;
  }[];
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { recipes } = props;

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

  return <Home recipes={recipes} />;
};

export default HomePage;

export async function getStaticProps() {
  const recipes = await getFeaturedRecipes();

  return {
    props: {
      recipes,
    },
    revalidate: 10,
  };
}
