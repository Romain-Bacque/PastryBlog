import { Container, Divider, Stack } from "@mui/material";
import CustomCard from "../UI/CustomCard";
import { AllRecipesProps, CategoryType, Recipe } from "./types";
import { StyledTitle } from "./style";
import { useCallback, useEffect, useState } from "react";
import Category from "../Category";

const AllRecipes: React.FC<AllRecipesProps> = ({ categories, recipes }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const handleSelectedCategories = useCallback(
    (selectedCategories: CategoryType[]) => {
      if (!(selectedCategories?.length > 0)) {
        setFilteredRecipes(recipes);
        return;
      }

      const filteredRecipes = recipes.filter((recipe) =>
        selectedCategories.some(
          (selectedCategorie) => selectedCategorie._id === recipe.tagId
        )
      );

      setFilteredRecipes(filteredRecipes);
    },
    []
  );

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, []);

  return (
    <Container>
      <StyledTitle component="h2">Toutes mes recettes</StyledTitle>
      <Category
        categories={categories}
        onSelectedCategories={handleSelectedCategories}
      />
      <Stack
        mt="2rem"
        justifyContent="center"
        alignItems="center"
        spacing={10}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        {filteredRecipes.map((filteredRecipe) => (
          <CustomCard
            key={filteredRecipe._id}
            _id={filteredRecipe._id}
            categories={categories}
            isLinkShown
            title={filteredRecipe.title}
            date={filteredRecipe.date}
            image={filteredRecipe.image}
            description={filteredRecipe.description}
            content={filteredRecipe.content}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default AllRecipes;
