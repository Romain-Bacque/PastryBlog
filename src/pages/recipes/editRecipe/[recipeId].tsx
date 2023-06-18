import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import csrfProtection from "../../../utils/csrfProtection";
import { getRecipeById } from "../../api/recipes";

// interfaces
interface IncomingMessageWithCSRF extends IncomingMessage {
  csrfToken: () => string | undefined;
}
interface ContextType extends NextPageContext {
  req: IncomingMessageWithCSRF | undefined;
  params: {
    recipeId: string;
  };
}

// prevent to generate RecipeForm during SSR
const EditRecipe = dynamic(
  () => import("../../../components/recipeForm/EditRecipe"),
  {
    ssr: false,
  }
);

const AddRecipePage: React.FC = () => {
  return <EditRecipe />;
};

export default AddRecipePage;

export async function getServerSideProps(context: ContextType) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: true, // Set to true if the redirect is permanent
      },
    };
  }
  const { recipeId } = context.params;

  const recipe = await getRecipeById(recipeId);

  const { req, res } = context;

  await csrfProtection(req, res);

  return {
    props: { csrfToken: req?.csrfToken(), recipe },
  };
}
