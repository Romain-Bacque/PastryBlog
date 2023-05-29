// hook import
import { memo, useEffect, useRef, useState } from "react";
// other import
import { debounce } from "lodash";
import axios from "axios";
// component import
import { Autocomplete } from "@mui/material";
import Input from "../../Input";
import useInput from "../../../hooks/use-input";
import { Recipe } from "../../../global/types";

// Component
function CustomSearchbar({ recipe }) {
  const {
    value: searchbarEntryValue,
    isValid: searchbarEntryIsValid,
    isTouched: searchbarEntryIsTouched,
    valueHandler: searchbarEntryValueHandler,
    changeHandler: searchbarEntryChangeHandler,
    blurHandler: searchbarEntryBlurHandler,
  } = useInput();
  const [selectedValue, setSelectedValue] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const getRecipesData = useRef(
    // 'debounce' prevent server spamming, and authorize ajax request a number of milliseconds after input value stopped change
    debounce(async (value) => {
      let data = [];

      if (value) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/api/recipes?text=${value}`
          );

          if (response.status === 200) {
            data = response.data.recipes;
          }
        } catch (err) {
          console.log(err);
        }
      }
      setRecipes(data);
    }, 300)
  ).current;

  useEffect(() => {
    if (searchbarEntryIsValid) {
      getRecipesData(searchbarEntryValue);
    }
  }, [searchbarEntryIsValid, searchbarEntryValue]);

  useEffect(() => {
    getRecipesData.cancel();
  }, [getRecipesData]);

  return (
    <Autocomplete
      freeSolo
      onChange={(_, value) => setSelectedValue(value)}
      onBlur={() => setRecipes([])}
      options={recipes} // 'recipes' is the list defined for autocompletion
      getOptionLabel={(option) => (option.title ? option.title : "")} // Display the 'title' property value of each object from the array of object provide in 'options' prop
      renderInput={(params) => (
        <Input
          onMouseEnter={() => console.log(selectedValue)}
          label="recipe"
          className={""}
          input={{
            params,
            rows: 6,
            id: "comment",
            onChange: searchbarEntryChangeHandler,
            onBlur: searchbarEntryBlurHandler,
            type: "textarea",
            value: searchbarEntryValue,
            placeholder: "Rechercher une recette...",
          }}
        />
      )}
    />
  );
}

CustomSearchbar.defaultProps = {
  recipe: null,
};

export default memo(CustomSearchbar);
