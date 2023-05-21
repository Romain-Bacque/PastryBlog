import { Divider, Stack } from "@mui/material";
import CustomCard from "../UI/CustomCard";
import { FeaturedCardsProps } from "./types";

const FeaturedCards: React.FC<FeaturedCardsProps> = ({ recipes }) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={10}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      {recipes.map((recipe) => (
        <CustomCard isLinkShown {...recipe} key={recipe._id} />
      ))}
    </Stack>
  );
};

export default FeaturedCards;
