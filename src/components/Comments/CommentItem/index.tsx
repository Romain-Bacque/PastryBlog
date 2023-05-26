import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { CommentsItemProps } from "./types";
import { StyledBox, StyledDeleteIcon } from "./style";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ResponseItem from "../ResponseItem";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "../../../global/types";

const CommentsItem: React.FC<CommentsItemProps> = ({
  _id,
  name,
  date,
  text,
  responses,
  onClick,
  onDelete,
}) => {
  const { data: session } = useSession();

  return (
    <Stack
      key={_id}
      direction="column"
      divider={<Divider orientation="horizontal" flexItem />}
      spacing={2}
      m="1rem auto"
      width="90%"
    >
      <StyledBox key={_id}>
        {(session as ExtendedSession)?.user.role === "admin" && (
          <StyledDeleteIcon
            onClick={() => onDelete("comments", _id)}
            titleAccess="Supprimer le commentaire"
          />
        )}
        <Box>
          <Typography textTransform="uppercase">{name}</Typography>
          <Typography>
            <AccessTimeIcon />
            {date}
          </Typography>
          <Typography>{text}</Typography>
        </Box>
        {(session as ExtendedSession)?.user.role === "admin" && (
          <Button
            onClick={() => onClick(_id)}
            sx={{ height: "fit-content" }}
            variant="text"
          >
            Répondre
          </Button>
        )}
      </StyledBox>
      {responses?.length > 0 &&
        responses.map((response) => (
          <ResponseItem key={response._id} onDelete={onDelete} {...response} />
        ))}
    </Stack>
  );
};

export default CommentsItem;
