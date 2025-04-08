import React from "react";
import useChatContext from "../../../hooks/videos/useChatContext/useChatContext";
import MessageList from "./MessageList/MessageList";
import ChatInput from "./ChatInput/ChatInput";
import { Popup } from "antd-mobile";
import "./ChatWindow.scss";

const ChatWindow = () => {
  const { isChatWindowOpen, setIsChatWindowOpen, messages, conversation } = useChatContext();

  const onClose = () => {
    setIsChatWindowOpen(false);
  };

  return (
    <Popup
      position="right"
      bodyStyle={{ display: "flex" }}
      onMaskClick={onClose}
      visible={isChatWindowOpen}>
      <div className="chat-window-container">
        <div className="chat-header-container">Chat</div>
        <MessageList messages={messages} />
        <ChatInput conversation={conversation} isChatWindowOpen={isChatWindowOpen}/>
      </div>
    </Popup>
  );
};

export default ChatWindow;
