import { Box, Typography } from "@mui/material";
import { ResponseItemProps } from "./types";
import {
  IconsContainer,
  StyledBox,
  StyledDeleteIcon,
  StyledEditIcon,
} from "./style";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { updateResponse } from "../../../utils/ajax-requests";
import useMyMutation from "../../../hooks/use-mutation";
import useLoading from "../../../hooks/use-loading";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "../../../global/types";

const ResponseItem: React.FC<ResponseItemProps> = ({
  _id,
  date,
  text,
  onDelete,
}) => {
  const { data: session } = useSession();
  const handleLoading = useLoading();
  const [isEditable, setIsEditable] = useState(false);
  const [responseValue, setResponseValue] = useState(text);
  const editableDivValueRef = useRef("");
  const editableDivRef = useRef<HTMLDivElement>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { errorMessage, useMutation } = useMyMutation(updateResponse, () => {
    const prevResponse = responseValue;

    setAlertMessage("Réponse modifiée avec succès.");
    setResponseValue(editableDivValueRef.current);

    return { ctxFunc: () => setResponseValue(prevResponse) };
  });
  const { status, isSuccess, mutate } = useMutation;

  const handleResponseUpdate = () => {
    if (
      !editableDivValueRef.current ||
      editableDivValueRef.current === responseValue
    )
      return;

    const reqBody = {
      date: new Date(),
      text: editableDivValueRef.current,
    };

    mutate({ reqBody, _id });
  };

  function sanitizeContent(content: string): string {
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

    return sanitizedContent;
  }

  const responseChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const content = event.target.innerText;
    const sanitizedContent = sanitizeContent(content);

    editableDivValueRef.current = sanitizedContent;
  };

  useEffect(() => {
    if (isSuccess) {
      setIsEditable(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleLoading(status, alertMessage, errorMessage);
  }, [status, alertMessage, errorMessage]);

  return (
    <StyledBox key={_id}>
      <IconsContainer>
        {(session as ExtendedSession)?.user.role === "admin" && (
          <StyledDeleteIcon
            onClick={() => onDelete("responses", _id)}
            titleAccess="Supprimer la réponse"
          />
        )}
        {(session as ExtendedSession)?.user.role === "admin" && (
          <StyledEditIcon
            onClick={() => {
              editableDivRef.current?.focus();
              setIsEditable(true);
            }}
            titleAccess="Editer la réponse"
          />
        )}
      </IconsContainer>
      <Box width="100%">
        <Typography textTransform="uppercase">Célia</Typography>
        <Typography>
          <AccessTimeIcon />
          {date}
        </Typography>
        <div
          ref={editableDivRef}
          contentEditable={isEditable}
          onInput={responseChangeHandler}
          onBlur={handleResponseUpdate}
          dangerouslySetInnerHTML={{ __html: responseValue }}
        />
      </Box>
    </StyledBox>
  );
};

export default ResponseItem;
