import { Container } from "@mui/material";
import FeaturedRecipes from "../FeaturedRecipes";
import { HomeProps } from "./types";

const Home: React.FC<HomeProps> = ({ recipes }) => {
  return (
    <Container component="section">
      <FeaturedRecipes recipes={recipes} />
    </Container>
  );
};

export default Home;
