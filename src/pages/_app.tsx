import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import favicon from "@/public/favicon.ico";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={favicon.src} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
