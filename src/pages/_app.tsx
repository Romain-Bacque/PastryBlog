import Head from "next/head";
import { AppProps } from "next/app"; // Use it to type _app component props
import "../styles/globals.css";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import store from "../store/index";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { StrictMode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <StrictMode>
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </Layout>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
    </StrictMode>
  );
};

export default MyApp;
