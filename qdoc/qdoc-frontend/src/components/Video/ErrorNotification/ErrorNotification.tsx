import React, { ReactElement, useEffect } from "react";
import { notification } from "antd";

const ErrorNotification = (props: { error }): ReactElement => {
  useEffect(() => {
    notification.error({ message: props.error.message });
  });
  return <></>;
};

export default ErrorNotification;
