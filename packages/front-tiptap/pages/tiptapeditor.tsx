import dynamic from 'next/dynamic';
import Chat from '~/../components/Chat';
import { classNames } from '~/../lib/utils';
import styles from '../styles/TipTapStyles.module.scss';
import { useAuth } from '../lib/auth/useAuth';

const Tiptap = dynamic(() => import('../components/TipTap'), { ssr: false });

export default function Editor() {
  const { userName } = useAuth();
  return (
    <>
      <div className={classNames(styles.mainContainer, 'flex w-full')}>
        <Tiptap user={userName} className="flex-auto max-w-5xl" />
        <div className="divider divider-vertical"></div>
        <Chat />
      </div>
    </>
  );
}
