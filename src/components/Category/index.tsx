// hook import
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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

const defaultValue = "Choisir une catégorie";

// Component
const Category: React.FC<CategoryProps> = forwardRef(
  ({ categories, onSelectedCategories }, ref) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [selectedCategoriesList, setSelectedCategoriesList] = useState<
      Categorie[]
    >([]);

    const handleOptionSelect = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { value: tag } = event.target;
      const { options } = event.target;
      const { id } = options[options.selectedIndex];

      if (!id) return; // Prevent to select option with "Choisir une catégorie" value

      if (!selectedCategoriesList.find((category) => category._id === id)) {
        setSelectedCategoriesList((prevState) => [
          ...prevState,
          { _id: id, tag },
        ]);
      }
      setSelectedValue(defaultValue);
    };

    const handleTagDelete = (value: Categorie) => {
      const filteredSelectedCategoriesList = selectedCategoriesList.filter(
        (category) => category._id !== value._id
      );

      setSelectedCategoriesList(filteredSelectedCategoriesList);
    };

    // Customize instance that is exposed to parent component when ref is used
    useImperativeHandle(ref, () => ({
      // eslint-disable-next-line no-restricted-syntax
      resetSelectedValue() {
        setSelectedCategoriesList([]);
      },
    }));

    useEffect(() => {
      onSelectedCategories(selectedCategoriesList);
    }, [selectedCategoriesList, onSelectedCategories]);

    return categories?.length > 0 ? (
      <Container sx={{ m: "1rem 0 2rem", p: "0!important" }}>
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
            id="category"
            onChange={handleOptionSelect}
            value={selectedValue}
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
  }
);

export default memo(Category);
