import dynamic from "next/dynamic";
import styles from "../styles/Tiptap.module.scss";

const Tiptap = dynamic(() => import("../components/Tiptap"), { ssr: false });

export default function Home() {
  return (
    <>
      <div className={styles.mainContainer}>
        <Tiptap />
      </div>
    </>
  );
}
