import { notification } from "antd";
import { ArgsProps } from "antd/lib/notification";

export const showNotification =
  ({ placement = "topRight", top = 130, message, description, icon }:ArgsProps): void => {
    notification.open({
      placement,
      top,
      message,
      description,
      icon
    });
  };

export const showSuccessNotification = (
  { placement = "topRight", top = 130, message, description }: ArgsProps
): void => {
  notification.success({
    placement,
    top,
    message,
    description
  });
};

export const showErrorNotification = ({ placement = "topRight", top = 130, message, description }: ArgsProps)
: void => {
  notification.error({
    placement,
    top,
    message,
    description,
    style: { maxHeight: "80vh", overflowY: "auto", whiteSpace: "pre-line" }
  });
};
