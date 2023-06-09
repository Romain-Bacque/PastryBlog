import { Recipe } from "../../global/types";
import CommentForm from "../CommentForm";
import Comments from "../Comments";
import {
  StyledDate,
  StyledDescription,
  StyledImage,
  StyledTitle,
} from "./style";
import { Box, Container, Divider, Typography } from "@mui/material";

const RecipeDetails: React.FC<Recipe> = ({
  _id,
  image,
  title,
  date,
  description,
  content,
}) => {
  return (
    <Container component="section">
      <Box>
        <StyledTitle component="h2">{title}</StyledTitle>
        <StyledDate>{date}</StyledDate>
        {image && (
          <StyledImage
            alt={`image ${image}`}
            src={image}
            width={400}
            height={300}
          />
        )}
        <StyledDescription paragraph>{description}</StyledDescription>
        <Typography fontWeight={700} component="span">
          Recette :
        </Typography>
        <Typography mb="2rem" paragraph component="h2">
          {content}
        </Typography>
        <Divider />
      </Box>
      <CommentForm pastryId={_id} />
      <Comments pastryId={_id} />
    </Container>
  );
};

export default RecipeDetails;
