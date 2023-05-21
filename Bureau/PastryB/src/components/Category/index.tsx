// hook import
import { memo, useEffect, useState } from "react";
// component import
import {
  Container,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import TagsList from "../UI/TagsList";
// types import
import { Categorie, CategoryProps } from "./types";

// Component
const Category: React.FC<CategoryProps> = ({
  categories,
  onSelectedCategories,
}) => {
  const [selectedCategoriesList, setSelectedCategoriesList] = useState<
    Categorie[]
  >([]);

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: tag } = event.target;
    const { options } = event.target;
    const { id } = options[options.selectedIndex];

    if (!id) return; // Prevent to select option with "Choisir une catégorie" value

    if (
      !selectedCategoriesList.find(
        (category) => Number(category._id) === Number(id)
      )
    ) {
      setSelectedCategoriesList((prevState) => [
        ...prevState,
        { _id: id, tag },
      ]);
    }
  };

  const handleTagDelete = (value: Categorie) => {
    const filteredSelectedCategoriesList = selectedCategoriesList.filter(
      (category) => category._id !== value._id
    );

    setSelectedCategoriesList(filteredSelectedCategoriesList);
  };

  useEffect(() => {
    onSelectedCategories(selectedCategoriesList);
  }, [selectedCategoriesList, onSelectedCategories]);

  return categories?.length > 0 ? (
    <Container sx={{ marginTop: 2 }}>
      <TagsList list={selectedCategoriesList} onTagDelete={handleTagDelete} />
      <FormControl fullWidth>
        <InputLabel
          variant="standard"
          htmlFor="category"
          sx={{ fontSize: "1.5rem" }}
        >
          Quelle catégorie(s) de patisserie(s) ?
        </InputLabel>
        <NativeSelect
          defaultValue="Choisir une catégorie"
          id="category"
          onChange={handleOptionSelect}
        >
          <option key={null} id="" disabled>
            Choisir une catégorie
          </option>
          {categories.map((category) => (
            <option key={category._id} id={category._id} value={category.tag}>
              {category.tag}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Container>
  ) : null;
};

export default memo(Category);
