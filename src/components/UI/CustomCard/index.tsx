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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomCardProps } from "./types";
import Link from "next/link";
import { Button, Divider } from "@mui/material";
import { useRouter } from "next/router";
import TagsList from "../TagsList";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useMyMutation from "../../../hooks/use-mutation";
import { useQuery, useQueryClient } from "react-query";
import {
  addUserFavorite,
  deleteUserFavorite,
  getUserFavorites,
} from "../../../utils/ajax-requests";
import { ExtendedSession } from "../../../global/types";
import useLoading from "../../../hooks/use-loading";

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

const queryKey = "favorites";

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
  const handleLoading = useLoading();
  const [getFavoritesErrorMessage, setGetFavoritesErrorMessage] =
    useState<string>("");
  const [iconButtonProps, setIconButtonProps] = useState({});
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    status: getFavoritesStatus,
    data,
    isError,
    refetch,
  } = useQuery(
    queryKey,
    async () => {
      if (session?.user) {
        const favoritesData = await getUserFavorites(
          (session as ExtendedSession).user.id!
        );

        return favoritesData;
      }
    },
    {
      enabled: false, // Automatically prevent the request triggering when the component is mounted
      staleTime: 3600_000,
    }
  );

  const favorites = data || [];

  const queryClient = useQueryClient();

  const {
    errorMessage: addFavoriteErrorMessage,
    useMutation: addFavoriteMutation,
  } = useMyMutation(addUserFavorite, async () => {
    await queryClient.cancelQueries(queryKey);

    const prevFavorites = queryClient.getQueryData(queryKey);

    const updatedFavorites = favorites.concat(_id);

    queryClient.setQueryData(queryKey, updatedFavorites);

    return { ctxFunc: () => queryClient.setQueryData(queryKey, prevFavorites) };
  });
  const { status: addFavoriteStatus, mutate: addFavoriteMutate } =
    addFavoriteMutation;

  const {
    errorMessage: deleteFavoriteErrorMessage,
    useMutation: deleteFavoriteMutation,
  } = useMyMutation(deleteUserFavorite, async () => {
    await queryClient.cancelQueries(queryKey);

    const prevFavorites = queryClient.getQueryData(queryKey);
    const updatedFavorites = favorites.filter((favorite) => favorite !== _id);

    queryClient.setQueryData(queryKey, updatedFavorites);

    return { ctxFunc: () => queryClient.setQueryData(queryKey, prevFavorites) };
  });
  const { status: deleteFavoriteStatus, mutate: deleteFavoriteMutate } =
    deleteFavoriteMutation;

  const isRecipeInUserFavorites = (RecipeId: string) => {
    const isInFavoritesList = favorites?.find(
      (favorite) => favorite === RecipeId
    );

    return isInFavoritesList;
  };

  const handleFavorites = (id: string) => {
    if (!session) return;

    if (!isRecipeInUserFavorites(id)) {
      // add favorite
      addFavoriteMutate({
        userId: (session as ExtendedSession).user.id!,
        recipeId: id,
      });
    } else {
      // remove favorite
      deleteFavoriteMutate({
        userId: (session as ExtendedSession).user.id!,
        recipeId: id,
      });
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardClick = () => {
    router.replace(`recipes/${_id}`);
  };

  useEffect(() => {
    setIconButtonProps({
      title: !session
        ? "Vous devez être connecté pour pouvoir ajouter une recette en favories"
        : isRecipeInUserFavorites(_id)
        ? "Retirer des recettes favories"
        : "Ajouter aux recettes favories",
      color: session && isRecipeInUserFavorites(_id) ? "secondary" : "default",
    });
  }, [data]);

  useEffect(() => {
    if (session?.user) {
      // get user favorites
      refetch();
    }
  }, []);

  useEffect(() => {
    // handle get favorite error message handler
    if (isError) {
      setGetFavoritesErrorMessage("Une erreur est survenue!");
    }
  }, []);

  // get favorite snackbar
  useEffect(() => {
    handleLoading(getFavoritesStatus, null, getFavoritesErrorMessage);
  }, [getFavoritesStatus, getFavoritesErrorMessage]);

  // add favorite snackbar
  useEffect(() => {
    handleLoading(addFavoriteStatus, null, addFavoriteErrorMessage);
  }, [addFavoriteStatus, null, addFavoriteErrorMessage]);

  // delete favorite snackbar
  useEffect(() => {
    handleLoading(deleteFavoriteStatus, null, deleteFavoriteErrorMessage);
  }, [deleteFavoriteStatus, null, deleteFavoriteErrorMessage]);

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
        <IconButton
          onClick={() => session && handleFavorites(_id)}
          {...iconButtonProps}
          aria-label="add to favorites"
        >
          <FavoriteIcon />
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
        <Divider light />
        <CardContent>
          <div
            style={{ marginBottom: "2rem" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {isLinkShown && (
            <Button sx={{ ml: "auto" }} variant="outlined">
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
