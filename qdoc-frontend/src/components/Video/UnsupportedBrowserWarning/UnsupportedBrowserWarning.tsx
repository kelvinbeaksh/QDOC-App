import React, { ReactElement } from "react";
import Video from "twilio-video";
import { Row, Typography } from "antd";

const UnsupportedBrowserWarning = (props:{ children: ReactElement }): ReactElement => {
  if (!Video.isSupported) {
    return (
      <Row justify="center">
        <Typography.Title level={4}>
                Browser or context not supported
        </Typography.Title>
        <Typography.Text>
                Please open this application in one of the{" "}
          <a
            href="https://www.twilio.com/docs/video/javascript#supported-browsers"
            target="_blank"
            rel="noopener noreferrer"
          >
                  supported browsers
          </a>
                .
          <br />
                If you are using a supported browser, please ensure that this app is served over a{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
            target="_blank"
            rel="noopener noreferrer"
          >
                  secure context
          </a>{" "}
                (e.g. https or localhost).
        </Typography.Text>
      </Row>
    );
  }

  return props.children;
};

export default UnsupportedBrowserWarning;
