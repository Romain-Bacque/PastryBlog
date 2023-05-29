// hook import
import { memo, useCallback, useEffect, useRef, useState } from "react";
// other import
import PropTypes from "prop-types";
import { debounce } from "lodash";
import axios from "axios";
// component import
import { Autocomplete } from "@mui/material";
import Input from "../../Input";

// Component
function CustomSearchbar({ setInputStatus, location }) {
  const isFirstRender = useRef(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const [breweriesLocations, setBreweriesLocations] = useState([]);
  const getGeoapiData = useRef(
    // 'debounce' prevent server spamming, and authorize ajax request a number of milliseconds after input value stopped change
    debounce(async (value) => {
      let data = [];

      if (value) {
        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&filter=countrycode:fr&format=json&limit=15&lang=fr&apiKey=${process.env.REACT_APP_APIKEY}`
          );

          if (response.status === 200) {
            data = response.data.results.map((brewery) => ({
              address: brewery.formatted,
              lat: brewery.lat,
              lon: brewery.lon,
            }));
          }
        } catch (err) {
          console.log(err);
        }
      }
      setBreweriesLocations(data);
    }, 300)
  ).current;

  const handleInputChange = useCallback(
    (name, status) => {
      if (!status.isValid) return getGeoapiData(status.value);
      setInputStatus((prevState) => ({
        ...prevState,
        [name]: { isValid: status.isValid, value: selectedValue },
      }));
    },
    [getGeoapiData, setInputStatus, selectedValue]
  );

  useEffect(() => {
    getGeoapiData.cancel();
  }, [getGeoapiData]);

  useEffect(() => {
    if (location?.address && isFirstRender.current) {
      setBreweriesLocations([location]);
      setSelectedValue(location);
      isFirstRender.current = false;
    }
  }, [location]);

  return (
    <Autocomplete
      freeSolo
      onChange={(_, value) => setSelectedValue(value)}
      onBlur={() => setBreweriesLocations([])}
      options={breweriesLocations} // 'breweriesLocations' is the list defined for autocompletion
      getOptionLabel={(option) => (option.address ? option.address : "")} // Display the 'address' property value of each object from the array of object provide in 'options' prop
      defaultValue={location || null}
      renderInput={(params) => (
 
        <Input
        label="recipe"
        onInputChange={handleInputChange}
        selectedValue={selectedValue}

        input={{
          params,
          rows: 6,
          id: "comment",
          onChange: adminCommentChangeHandler,
          onBlur: adminCommentBlurHandler,
          type: "textarea",
          value: adminCommentValue,
          placeholder: "Rechercher une recette...",
        }}
      )}
    />
  );
}

CustomSearchbar.propTypes = {
  setInputStatus: PropTypes.func.isRequired,
  location: PropTypes.shape({
    address: PropTypes.string,
    lat: PropTypes.string,
    lon: PropTypes.string,
  }),
};

CustomSearchbar.defaultProps = {
  location: null,
};

export default memo(CustomSearchbar);