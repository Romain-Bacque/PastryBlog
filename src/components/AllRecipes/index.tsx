import { Container, Divider, Stack } from "@mui/material";
import CustomCard from "../UI/CustomCard";
import { AllRecipesProps } from "./types";
import { StyledTitle } from "./style";
import { useEffect, useState } from "react";
import Category from "../Category";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Recipe, Tag } from "../../global/types";

const AllRecipes: React.FC<AllRecipesProps> = ({
  categories,
  recipes,
  isFavoritesPage,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<Tag[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const hasSelectedTag = (recipe: Recipe, categoryList: Tag[]) => {
    const filteredList = categoryList.filter((object1) => {
      const filteredRecipe = recipe.categories?.some(
        (object2) => object1._id === object2?._id
      );
      return filteredRecipe;
    });
    return !!filteredList.length;
  };

  // redirect user if he is not logged
  useEffect(() => {
    if (isFavoritesPage && !session) router.replace("/");
  });

  return (
    <Container>
      <StyledTitle component="h2">{`${
        isFavoritesPage ? "Recettes favories" : "Toutes mes recettes"
      }`}</StyledTitle>
      {recipes?.length > 0 && (
        <Category
          categories={categories}
          onSelectedCategories={setSelectedCategories}
        />
      )}
      <Stack
        mt="2rem"
        justifyContent="center"
        alignItems="center"
        spacing={10}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {recipes?.length > 0 ? (
          recipes
            .filter((filteredRecipe) => {
              if (!selectedCategories.length) return true; // If there is no category selected, then filter by category is not applied
              return hasSelectedTag(filteredRecipe, selectedCategories); // filter by selected category(ies)
            })
            .map((filteredRecipe) => (
              <CustomCard
                key={filteredRecipe._id}
                _id={filteredRecipe._id}
                categories={filteredRecipe.categories}
                isLinkShown
                title={filteredRecipe.title}
                date={filteredRecipe.date}
                image={filteredRecipe.image}
                description={filteredRecipe.description}
                content={filteredRecipe.content}
              />
            ))
        ) : (
          <p>Aucune Recette.</p>
        )}
      </Stack>
    </Container>
  );
};

export default AllRecipes;
