import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ResetPassword from "../../components/auth/ResetPassword";
import csrfProtection from "../../utils/csrfProtection";

interface IncomingMessageWithCSRF extends IncomingMessage {
  csrfToken: () => string | undefined;
}

interface ContextType extends NextPageContext {
  req: IncomingMessageWithCSRF | undefined;
}

interface ResetPasswordPageProps {
  csrfToken: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ csrfToken }) => {
  return <ResetPassword csrfToken={csrfToken} />;
};

export default ResetPasswordPage;

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
