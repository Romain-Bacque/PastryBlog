import { Container } from "@mui/material";
import FeaturedCards from "../FeaturedCards";
import { HomeProps } from "./types";

const Home: React.FC<HomeProps> = ({ recipes }) => {
  return (
    <Container component="section">
      <FeaturedCards recipes={recipes} />
    </Container>
  );
};

export default Home;
