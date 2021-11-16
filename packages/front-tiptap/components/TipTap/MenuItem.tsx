import React from 'react';
import styles from './MenuItem.module.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface Props {
  icon?: string;
  title?: string;
  action?: () => any;
  isActive?: () => any;
  type?: any;
}

const MenuItem = ({ icon, title, action, isActive = null }: Props) => (
  <button
    className={`${styles.menuItem} ${
      isActive && isActive() ? styles.isActive : ''
    }`}
    onClick={action}
    title={title}
  >
    <svg className="remix">
      <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
    </svg>
  </button>
);

export default MenuItem;
