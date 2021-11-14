import "../styles/globals.css";
import "../components/Tiptap/index.scss";
import "../components/Tiptap/MenuBar.scss";
import "../components/Tiptap/MenuItem.scss";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
