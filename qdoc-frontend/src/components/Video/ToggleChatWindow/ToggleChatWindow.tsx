import React, { useEffect, useState } from "react";
import useChatContext from "../../../hooks/videos/useChatContext/useChatContext";
import useVideoContext from "../../../contexts/video-context";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

export const ANIMATION_DURATION = 700;

const ToggleChatButton = () => {
  const [ shouldAnimate, setShouldAnimate ] = useState(false);
  const { isChatWindowOpen, setIsChatWindowOpen, conversation } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
    setIsBackgroundSelectionOpen(false);
  };

  useEffect(() => {
    if (shouldAnimate) {
      setTimeout(() => setShouldAnimate(false), ANIMATION_DURATION);
    }
  }, [ shouldAnimate ]);

  useEffect(() => {
    if (conversation && !isChatWindowOpen) {
      const handleNewMessage = () => setShouldAnimate(true);
      conversation.on("messageAdded", handleNewMessage);
      return () => {
        conversation.off("messageAdded", handleNewMessage);
      };
    }
    return () => {};
  }, [ conversation, isChatWindowOpen ]);

  return (
    <Button
      size={"small"}
      onClick={toggleChatWindow}
      disabled={false}
      icon={<MessageOutlined />} />
  );
};

export default ToggleChatButton;
