import { Box, Button, Container, Typography } from "@mui/material";
import { StyledButtonContainer, StyledLegend } from "./style";
import Input from "../Input";
import useInput from "../../hooks/use-input";
import { Response } from "./types";
import { useQueryClient } from "react-query";
import { addResponse } from "../../utils/ajax-requests";
import useMyMutation from "../../hooks/use-mutation";
import { useEffect, useState } from "react";
import { CommentsPages } from "../../global/types";
import useLoading from "../../hooks/use-loading";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { modules, formats } from "../UI/CustomQuillToolbar";
import ReactQuill from "react-quill";

const RecipeForm: React.FC = () => {
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
  const {
    value: recipeDescriptionValue,
    isValid: recipeDescriptionIsValid,
    isTouched: recipeDescriptionIsTouched,
    changeHandler: recipeDescriptionChangeHandler,
    blurHandler: recipeDescriptionBlurHandler,
    resetHandler: recipeDescriptionResetHandler,
  } = useInput();

  const formIsValid =
    recipeTitleIsValid && recipeDescriptionIsValid && articleContent.length > 100;

    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formIsValid) return;

    const reqBody = {
      date: new Date(),
      title: recipeTitleValue,
      description: recipeDescriptionValue,
      content: articleContent,
    };

    mutate({ reqBody });
  };

  const queryClient = useQueryClient();

  const { errorMessage, useMutation } = useMyMutation(
    addResponse,
    null,
    (response: Response) => {
      queryClient.setQueryData<CommentsPages>("comments", (comments) => {
        const updatedData = {
          pageParams: comments?.pageParams || [],
          pages:
            comments?.pages.flat().map((comment) => {
              if (comment._id === response.commentId) {
                let updatedResponses: Response[];

                if (comment.responses && comment.responses.length > 0) {
                  comment.responses.push(response);
                  updatedResponses = comment.responses;
                } else {
                  updatedResponses = [response];
                }
                return {
                  ...comment,
                  responses: updatedResponses,
                };
              } else return comment;
            }) || [],
        };

        return updatedData;
      });
      recipeTitleResetHandler();
      recipeDescriptionResetHandler();
      setArticleContent("");
      setAlertMessage("Recette ajoutée !");
    }
  );
  const { status, mutate } = useMutation;

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

export default RecipeForm;
