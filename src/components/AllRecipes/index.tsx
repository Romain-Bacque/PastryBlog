import { Container, Divider, Stack } from "@mui/material";
import CustomCard from "../UI/CustomCard";
import { AllRecipesProps, CategoryType, Recipe } from "./types";
import { StyledTitle } from "./style";
import { useCallback, useEffect, useState } from "react";
import Category from "../Category";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Tag } from "../../global/types";

const AllRecipes: React.FC<AllRecipesProps> = ({
  categories,
  recipes,
  isFavoritesPage,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

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

  const hasSelectedTag = (recipe: Recipe, categoryList: Tag[]) => {
    const filteredList = categoryList.filter((object1) => {
      const filteredBrewery = recipe.categories.some(
        (object2) => Number(object1._id) === Number(object2.id)
      );
      return filteredBrewery;
    });
    return !!filteredList.length;
  };

  useEffect(() => setFilteredRecipes(recipes), []);

  // redirect user if he is not logged
  useEffect(() => {
    if (isFavoritesPage && !session) router.replace("/");
  });

  return (
    <Container>
      <StyledTitle component="h2">{`${
        isFavoritesPage ? "Recettes favories" : "Toutes mes recettes"
      }`}</StyledTitle>
      {filteredRecipes?.length > 0 && (
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
        {filteredRecipes?.length > 0 ? (
          filteredRecipes
            .filter((filteredRecipe) => {
              if (!selectedCategories.length) return true; // If there is no category selected, then filter by category is not applied
              return hasSelectedTag(filteredRecipe, selectedCategories); // filter by selected category(ies)
            })
            .map((filteredRecipe) => (
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
            ))
        ) : (
          <p>Aucune Recette.</p>
        )}
      </Stack>
    </Container>
  );
};

export default AllRecipes;
