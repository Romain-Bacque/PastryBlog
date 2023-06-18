import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { StyledButtonContainer, StyledLegend } from "./style";
import Input from "../../Input";
import useInput from "../../../hooks/use-input";
import { addRecipe } from "../../../utils/ajax-requests";
import useMyMutation from "../../../hooks/use-mutation";
import React, { useEffect, useState } from "react";
import useLoading from "../../../hooks/use-loading";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { modules, formats } from "../../UI/CustomQuillToolbar";
import ReactQuill from "react-quill";
import Category from "../../Category";
import { AddRecipeProps } from "./types";
import { Tag } from "../../../global/types";

const AddRecipe: React.FC<AddRecipeProps> = ({ categories, csrfToken }) => {
  const handleLoading = useLoading();
  const [alertMessage, setAlertMessage] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const {
    value: recipeTitleValue,
    isValid: recipeTitleIsValid,
    isTouched: recipeTitleIsTouched,
    changeHandler: recipeTitleChangeHandler,
    blurHandler: recipeTitleBlurHandler,
    resetHandler: recipeTitleResetHandler,
  } = useInput();
  const [inputFileStatus, setInputFileStatus] = useState<{
    file: string | null;
    value: string | null;
  }>({
    file: "",
    value: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<Tag[]>([]);
  const {
    value: recipeDescriptionValue,
    isValid: recipeDescriptionIsValid,
    isTouched: recipeDescriptionIsTouched,
    changeHandler: recipeDescriptionChangeHandler,
    blurHandler: recipeDescriptionBlurHandler,
    resetHandler: recipeDescriptionResetHandler,
  } = useInput();

  const formIsValid =
    recipeTitleIsValid &&
    recipeDescriptionIsValid &&
    articleContent.length > 100;

    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formIsValid) return;

    const reqBody = {
      date: new Date(),
      title: recipeTitleValue,
      image: inputFileStatus.file || null,
      categories: selectedCategories,
      description: recipeDescriptionValue,
      content: articleContent,
      csrfToken,
    };

    mutate(reqBody);
  };

  const { errorMessage, useMutation } = useMyMutation(addRecipe, null, () => {
    recipeTitleResetHandler();
    recipeDescriptionResetHandler();
    setArticleContent("");
    setAlertMessage("Recette ajoutée !");
  });
  const { status, mutate } = useMutation;

  // Function to convert a Blob to Base64 string
  const convertBlobToBase64 = (blob: Blob): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      // Create a new FileReader object
      const reader = new FileReader();

      // Event handler when reading is complete
      reader.onloadend = () => {
        // The result property of the FileReader object contains the Base64 string
        const base64String = reader.result as string;
        // Resolve the promise with the Base64 string
        resolve(base64String);
      };

      // Event handler for errors during reading
      reader.onerror = () => {
        // Reject the promise with an error if there is an issue converting Blob to Base64
        reject(new Error("Error converting Blob to Base64"));
      };

      // Read the Blob as a Data URL, which will result in a Base64 string
      reader.readAsDataURL(blob);
    });
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileToBase64 = await convertBlobToBase64(event.target.files![0]);

    setInputFileStatus({
      file: fileToBase64,
      value: event.target.value,
    });
  }

  useEffect(() => {
    handleLoading(status, alertMessage, errorMessage);
  }, [status, alertMessage, errorMessage]);

  return (
    <>
      <div className="App">
        <div className="container">
          <div className="row">
            <Container component="form" onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <StyledLegend>Ajouter une recette</StyledLegend>
              </Box>
              <div className="form-row">
                <Input
                  label="titre *"
                  className={
                    !recipeTitleIsValid && recipeTitleIsTouched
                      ? "form__input--red"
                      : ""
                  }
                  input={{
                    id: "comment",
                    onChange: recipeTitleChangeHandler,
                    onBlur: recipeTitleBlurHandler,
                    type: "text",
                    value: recipeTitleValue,
                    placeholder: "Taper le titre ici",
                  }}
                  errorMessage={{
                    isVisible: !recipeTitleIsValid && recipeTitleIsTouched,
                    text: "Champs requis",
                  }}
                />
                <TextField
                  label="photo de la recette"
                  InputLabelProps={{ shrink: true }}
                  id="image"
                  type="file"
                  name="image"
                  value={inputFileStatus.value}
                  onChange={handleFileChange}
                  sx={{ mb: "2rem", p: 0 }}
                />
                <Category
                  categories={categories}
                  onSelectedCategories={setSelectedCategories}
                />
                <Input
                  label="description *"
                  className={
                    !recipeDescriptionIsValid && recipeDescriptionIsTouched
                      ? "form__input--red"
                      : ""
                  }
                  input={{
                    id: "comment",
                    onChange: recipeDescriptionChangeHandler,
                    onBlur: recipeDescriptionBlurHandler,
                    type: "textarea",
                    value: recipeDescriptionValue,
                    placeholder: "Taper la description ici",
                    rows: 4,
                  }}
                  errorMessage={{
                    isVisible:
                      !recipeDescriptionIsValid && recipeDescriptionIsTouched,
                    text: "Champs requis",
                  }}
                />
                <div className="clearfix"></div>
                <div className="form-group col-md-12 editor">
                  <label className="font-weight-bold">
                    Recette <span className="required"> * </span>{" "}
                  </label>
                  <QuillToolbar toolbarId={"t1"} />
                  <ReactQuill
                    theme="snow"
                    value={articleContent}
                    onChange={setArticleContent}
                    placeholder={"Ecrivez votre superbe recette..."}
                    modules={modules("t1")}
                    formats={formats}
                  />
                </div>
                <br />
                <Typography paragraph fontSize={12}>
                  * Informations obligatoires
                </Typography>
                <StyledButtonContainer>
                  <Button
                    type="submit"
                    disabled={!formIsValid}
                    sx={{ width: "200px", m: "auto" }}
                    variant="outlined"
                    size="large"
                  >
                    Publier
                  </Button>
                </StyledButtonContainer>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
