import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import csrfProtection from "../../utils/csrfProtection";

interface IncomingMessageWithCSRF extends IncomingMessage {
  csrfToken: () => string | undefined;
}

interface ContextType extends NextPageContext {
  req: IncomingMessageWithCSRF | undefined;
}

interface ForgotPasswordPageProps {
  csrfToken: string;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  csrfToken,
}) => {
  return <ForgotPassword csrfToken={csrfToken} />;
};

export default ForgotPasswordPage;

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
