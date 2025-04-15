import React, { ReactElement } from "react";
import { Layout } from "antd";

const VideoLayout = ({ children }): ReactElement => {
  return <Layout>
    {children}
  </Layout>;
};

export default VideoLayout;
