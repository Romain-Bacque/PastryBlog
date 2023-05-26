import { Box, Button, Divider, Stack } from "@mui/material";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { Comment, CommentsProps, CommentState } from "./types";
import CommentItem from "./CommentItem";
import { useEffect, useState } from "react";
import ResponseForm from "../ResponseForm";
import CustomModal from "../UI/CustomModal";
import SimpleModalContent from "../UI/SimpleModalContent";
import { deleteComment, getPageCommentsById } from "../../utils/ajax-requests";
import useMyMutation from "../../hooks/use-mutation";
import Loader from "../UI/Loader";
import { CommentsPages } from "../../global/types";
import useLoading from "../../hooks/use-loading";

const Comments: React.FC<CommentsProps> = ({ pastryId }) => {
  const handleLoading = useLoading();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<CommentState>({
    commentKind: null,
    commentId: null,
  });
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [commentToRespond, setCommentToRespond] = useState<string | null>(null);
  const {
    data: commentsData,
    isFetching: isFetchingComments,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "comments",
    async ({ pageParam = 1 }) => await getPageCommentsById(pastryId, pageParam),
    {
      staleTime: 10_000, // after a certain number of millisec, the request is outdated
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.length <= 0) return;
        return allPages.length + 1;
      },
    }
  );

  const comments: Comment[] = commentsData?.pages?.flat() || [];

  const queryClient = useQueryClient();

  const { errorMessage, useMutation } = useMyMutation(
    deleteComment,
    null,
    (comments: Comment[]) => {
      const data: CommentsPages = queryClient.getQueryData("comments")!;

      const updatedData = { ...data, pages: comments };

      queryClient.setQueryData("comments", updatedData);
      setAlertMessage("Commentaire supprimé !");
    }
  );
  const { status, mutate } = useMutation;

  const handleCommentFormDisplay = (commentId: string) => {
    setCommentToRespond(commentId);
  };

  const handleModal = (
    commentKind: "comments" | "responses",
    commentId: string
  ) => {
    setIsOpen(true);
    setComment({ commentKind, commentId });
  };

  const handleCommentDelete = () => {
    setIsOpen(false);
    if (comment.commentKind && comment.commentId) {
      mutate({
        commentKind: comment.commentKind,
        commentId: comment.commentId,
        pastryId,
      });
    }
  };

  useEffect(() => {
    handleLoading(status, alertMessage, errorMessage);
  }, [status, alertMessage, errorMessage]);

  if (isLoadingComments) {
    return <p>...Veuillez patienter</p>;
  }

  return (
    <Box>
      {isFetchingComments && <Loader />}
      <CustomModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <SimpleModalContent
          onValidate={handleCommentDelete}
          onCancel={() => setIsOpen(false)}
          title="Suppression du commentaire"
          description="Etes-vous sûr de vouloir supprimer ce commentaire ?"
        />
      </CustomModal>
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
        mt="1rem"
      >
        {comments?.length > 0 &&
          comments.map((comment) => (
            <Box
              key={comment._id}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {comment?.pastryId === pastryId && (
                <CommentItem
                  onDelete={handleModal}
                  onClick={handleCommentFormDisplay}
                  {...comment}
                />
              )}
              {comment?._id === commentToRespond && (
                <ResponseForm
                  onCancel={() => setCommentToRespond(null)}
                  commentId={comment._id}
                  pastryId={pastryId}
                />
              )}
            </Box>
          ))}
      </Stack>
      {hasNextPage && comments?.length > 0 && (
        <Button
          sx={{ m: "2rem auto 0" }}
          disabled={isFetchingComments || isLoadingComments}
          onClick={() => fetchNextPage()}
        >
          Page suivante
        </Button>
      )}
    </Box>
  );
};

export default Comments;
