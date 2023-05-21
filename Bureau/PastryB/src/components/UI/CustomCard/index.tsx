import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomCardProps } from "./types";
import Link from "next/link";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import TagsList from "../TagsList";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;

  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CustomCard: React.FC<CustomCardProps> = ({
  _id,
  title,
  date,
  image,
  description,
  content,
  isLinkShown,
  categories,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    router.replace(`recipes/${_id}`);
  };

  return (
    <Card style={{ width: 800, maxWidth: "90%" }}>
      <CardHeader
        sx={{ cursor: "pointer" }}
        onClick={handleCardClick}
        title={title}
        subheader={date}
      />
      <CardMedia
        sx={{ cursor: "pointer" }}
        onClick={handleCardClick}
        component="img"
        height="194"
        image={image}
        alt={`image ${title}`}
      />
      <CardContent>
        <TagsList list={categories} />
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" noWrap={isLinkShown} paragraph>
            {content}
          </Typography>
          {isLinkShown && (
            <Button variant="outlined">
              <Link style={{ color: "inherit" }} href={`recipes/${_id}`}>
                Plus de détails
              </Link>
            </Button>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CustomCard;
