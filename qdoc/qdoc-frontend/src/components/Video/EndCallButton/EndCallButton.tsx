import React from "react";

import Button from "antd/lib/button";
import useVideoContext from "../../../contexts/video-context";
import { CloseCircleOutlined } from "@ant-design/icons";

const EndCallButton = () => {
  const { room } = useVideoContext();

  return (
    <Button size="small" onClick={() => room!.disconnect()} icon={<CloseCircleOutlined />}/>
  );
};
export default EndCallButton;
