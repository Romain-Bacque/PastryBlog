import { Box, Button, Container } from "@mui/material";
import { StyledButtonContainer, StyledLegend } from "./style";
import Input from "../Input";
import useInput from "../../hooks/use-input";
import { Response, ResponseFormProps } from "./types";
import { useQueryClient } from "react-query";
import { addResponse } from "../../utils/ajax-requests";
import useMyMutation from "../../hooks/use-mutation";
import { useEffect, useState } from "react";
import { CommentsPages } from "../../global/types";
import useLoading from "../../hooks/use-loading";

const ResponseForm: React.FC<ResponseFormProps> = ({
  commentId,
  pastryId,
  onCancel,
}) => {
  const handleLoading = useLoading();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const {
    value: adminCommentValue,
    isValid: adminCommentIsValid,
    isTouched: adminCommentIsTouched,
    changeHandler: adminCommentChangeHandler,
    blurHandler: adminCommentBlurHandler,
    resetHandler: adminCommentResetHandler,
  } = useInput();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminCommentIsValid) return;

    const reqBody = {
      date: new Date(),
      text: adminCommentValue,
    };

    mutate({ reqBody, commentId, pastryId });
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
      adminCommentResetHandler();
      setAlertMessage("Réponse ajoutée !");
    }
  );
  const { status, mutate } = useMutation;

  useEffect(() => {
    handleLoading(status, alertMessage, errorMessage);
  }, [status, alertMessage, errorMessage]);

  return (
    <Container component="form" onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <StyledLegend>Laisser une réponse</StyledLegend>
        <Button
          sx={{ height: "fit-content" }}
          variant="text"
          onClick={onCancel}
        >
          Annuler
        </Button>
      </Box>
      <Input
        label="Commentaire"
        className={
          !adminCommentIsValid && adminCommentIsTouched
            ? "form__input--red"
            : ""
        }
        input={{
          rows: 6,
          id: "comment",
          onChange: adminCommentChangeHandler,
          onBlur: adminCommentBlurHandler,
          type: "textarea",
          value: adminCommentValue,
          placeholder: "Taper le commentaire ici",
        }}
        errorMessage={{
          isVisible: !adminCommentIsValid && adminCommentIsTouched,
          text: "Champs requis",
        }}
      />
      <StyledButtonContainer>
        <Button
          type="submit"
          disabled={!adminCommentIsValid}
          sx={{ width: "200px", m: "auto" }}
          variant="outlined"
          size="large"
        >
          Publier
        </Button>
      </StyledButtonContainer>
    </Container>
  );
};

export default ResponseForm;
