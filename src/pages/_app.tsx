import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import favicon from "@/public/favicon.ico";
import { NetworkProvider } from "@/context/networkContext/networkContext";
import { UserProvider } from "@/context/userContext/userContext";
import { ToastProvider } from "@/context/toastContext/toastContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={favicon.src} />
      </Head>
      <NetworkProvider>
        <UserProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </UserProvider>
      </NetworkProvider>
    </>
  );
}
