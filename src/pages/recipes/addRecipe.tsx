import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import csrfProtection from "../../utils/csrfProtection";

// interfaces
interface IncomingMessageWithCSRF extends IncomingMessage {
  csrfToken: () => string | undefined;
}
interface ContextType extends NextPageContext {
  req: IncomingMessageWithCSRF | undefined;
}

// prevent to generate RecipeForm during SSR
const RecipeForm = dynamic(() => import("../../components/RecipeForm"), {
  ssr: false,
});

const AddRecipePage: React.FC = () => {
  return <RecipeForm />;
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

  const { req, res } = context;

  await csrfProtection(req, res);

  return {
    props: { csrfToken: req?.csrfToken() },
  };
}
