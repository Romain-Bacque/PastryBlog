import { Divider, Stack } from "@mui/material";
import CustomCard from "../UI/CustomCard";
import { FeaturedRecipesProps } from "./types";

const FeaturedRecipes: React.FC<FeaturedRecipesProps> = ({ recipes }) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={10}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <CustomCard isLinkShown {...recipe} key={recipe._id} />
        ))
      ) : (
        <p>Aucune Recette en vedette.</p>
      )}
    </Stack>
  );
};

export default FeaturedRecipes;
