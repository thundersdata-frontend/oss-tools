import React from 'react';
import { LayoutContext } from '@/pages/context';
import classnames from 'classnames';
import styles from './index.module.less';

interface FixedButtonWrapProps {
  goBackLink?: string;
}

const FixedButtonWrap: React.FC<FixedButtonWrapProps> = ({ children }) => (
  <LayoutContext.Consumer>
    {(collapsed) => (
      <div
        className={
          collapsed
            ? classnames(styles.actionWrap, styles.collapsed)
            : classnames(styles.actionWrap, styles.uncollapsed)
        }
      >
        {children}
      </div>
    )}
  </LayoutContext.Consumer>
);

export default FixedButtonWrap;
