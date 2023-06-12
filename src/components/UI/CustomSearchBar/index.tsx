// hook import
import { useEffect, useRef, useState } from "react";
// other import
import { debounce } from "lodash";
import axios from "axios";
// component import
import { TextField } from "@mui/material";
import useInput from "../../../hooks/use-input";
import { Recipe } from "../../../global/types";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { StyledAutoComplete } from "./style";

// Component
function CustomSearchbar() {
  const {
    value: searchbarEntryValue,
    isValid: searchbarEntryIsValid,
    changeHandler: searchbarEntryChangeHandler,
    blurHandler: searchbarEntryBlurHandler,
  } = useInput();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const getRecipesData = useRef(
    // 'debounce' prevent server spamming, and authorize ajax request a number of milliseconds after input value stopped change
    debounce(async (value) => {
      let data = [];

      if (value) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/api/recipes?search=${value}`
          );

          if (response.status === 200) {
            data = response.data;
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
    return () => {
      getRecipesData.cancel(); // Throw away any pending invocation of the debounced function.
    };
  }, []);

  return (
    <StyledAutoComplete
      freeSolo
      onChange={(_, value) => setSelectedValue(value as Recipe | null)}
      onBlur={() => setRecipes([])}
      options={recipes} // 'recipes' is the list defined for autocompletion
      getOptionLabel={(option: any) =>
        option instanceof Object && option.title ? option.title : ""
      } // Display the 'title' property value of each object from the array of object provide in 'options' prop
      defaultValue={null}
      renderInput={(params) => (
        <TextField
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (!selectedValue || !("_id" in selectedValue)) return;
              router.replace(`/recipes/${selectedValue._id}`);
            }
          }}
          {...params}
          id="comment"
          onChange={searchbarEntryChangeHandler}
          onBlur={searchbarEntryBlurHandler}
          type="text"
          value={searchbarEntryValue}
          placeholder="Rechercher une recette..."
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon />,
          }}
        />
      )}
    />
  );
}

export default CustomSearchbar;
