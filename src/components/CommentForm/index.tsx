import { Box, Button, Container, Typography } from "@mui/material";
import { StyledButtonContainer, StyledLegend } from "./style";
import Input from "../Input";
import useInput from "../../hooks/use-input";
import { Comment, CommentsPages } from "../../global/types";
import { useEffect, useState } from "react";
import { addComment } from "../../utils/ajax-requests";
import useMyMutation from "../../hooks/use-mutation";
import { CommentFormProps } from "./types";
import { useQueryClient } from "react-query";
import useLoading from "../../hooks/use-loading";

const CommentForm: React.FC<CommentFormProps> = ({ pastryId }) => {
  const handleLoading = useLoading();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    isTouched: usernameIsTouched,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    resetHandler: usernameResetHandler,
  } = useInput();
  const {
    value: userEmailValue,
    isValid: userEmailIsValid,
    isTouched: userEmailIsTouched,
    changeHandler: userEmailChangeHandler,
    blurHandler: userEmailBlurHandler,
    resetHandler: userEmailResetHandler,
  } = useInput();
  const {
    value: userCommentValue,
    isValid: userCommentIsValid,
    isTouched: userCommentIsTouched,
    changeHandler: userCommentChangeHandler,
    blurHandler: userCommentBlurHandler,
    resetHandler: userCommentResetHandler,
  } = useInput();

  let isFormValid: boolean;

  isFormValid = usernameIsValid && userEmailIsValid && userCommentIsValid;

  const queryClient = useQueryClient();

  const { errorMessage, useMutation } = useMyMutation(
    addComment,
    null,
    (comment: Comment) => {
      queryClient.setQueryData<CommentsPages>("comments", (comments) => {
        if (!comments?.pages) {
          return {
            pageParams: comments?.pageParams || [],
            pages: [comment],
          };
        }
        const updatedComments = comments;

        updatedComments.pages.push(comment);
        return updatedComments;
      });
      setAlertMessage("Commentaire ajouté !");
      usernameResetHandler();
      userEmailResetHandler();
      userCommentResetHandler();
    }
  );
  const { status, mutate } = useMutation;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    const reqBody = {
      name: usernameValue,
      email: userEmailValue,
      date: new Date(),
      text: userCommentValue,
      pastryId,
    };

    mutate(reqBody);
  };

  useEffect(() => {
    handleLoading(status, alertMessage, errorMessage);
  }, [status, alertMessage, errorMessage]);

  return (
    <Container component="form" onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <StyledLegend>Laisser un commentaire</StyledLegend>
      </Box>
      <Input
        label="* Nom :"
        className={
          !usernameIsValid && usernameIsTouched ? "form__input--red" : ""
        }
        input={{
          id: "name",
          type: "text",
          value: usernameValue,
          onChange: usernameChangeHandler,
          onBlur: usernameBlurHandler,
          placeholder: "Taper le nom ici",
        }}
        errorMessage={{
          isVisible: !usernameIsValid && usernameIsTouched,
          text: "Champs requis",
        }}
      />
      <Input
        label="* Email :"
        className={
          !userEmailIsValid && userEmailIsTouched ? "form__input--red" : ""
        }
        input={{
          id: "email",
          onChange: userEmailChangeHandler,
          onBlur: userEmailBlurHandler,
          type: "email",
          value: userEmailValue,
          placeholder: "Taper l'email ici",
        }}
        errorMessage={{
          isVisible: !userEmailIsValid && userEmailIsTouched,
          text: "Adresse mail incorrecte",
        }}
      />
      <Input
        label="* Commentaire :"
        className={
          !userCommentIsValid && userCommentIsTouched ? "form__input--red" : ""
        }
        input={{
          id: "comment",
          onChange: userCommentChangeHandler,
          onBlur: userCommentBlurHandler,
          type: "textarea",
          value: userCommentValue,
          placeholder: "Taper le commentaire ici",
          rows: 6,
        }}
        errorMessage={{
          isVisible: !userCommentIsValid && userCommentIsTouched,
          text: "Champs requis",
        }}
      />
      <Typography paragraph fontSize={12}>* Informations obligatoires</Typography>
      <Typography paragraph>
        En utilisant ce formulaire, vous acceptez le stockage et le traitement
        de vos données par ce site.
      </Typography>
      <StyledButtonContainer>
        <Button
          type="submit"
          disabled={!isFormValid}
          sx={{ width: 200, m: "auto" }}
          variant="outlined"
          size="large"
        >
          Publier
        </Button>
      </StyledButtonContainer>
    </Container>
  );
};

export default CommentForm;
