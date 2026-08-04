import { Spin } from "antd";
import styles from "./LoadingPage.module.scss";

export const LoadingPage = () => {
  return (
    <div className={styles.wrapper}>
      <Spin size="large">
        <div className={styles.spinPad} />
      </Spin>
    </div>
  );
};
