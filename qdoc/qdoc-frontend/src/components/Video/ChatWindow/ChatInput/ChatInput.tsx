import React, { useEffect, useRef, useState } from "react";
import { Conversation } from "@twilio/conversations/lib/conversation";
import { Button, Form, TextArea } from "antd-mobile";
import { SendOutlined } from "@ant-design/icons";
import "./ChatInput.scss";

interface ChatInputProps {
  conversation: Conversation;
  isChatWindowOpen: boolean;
}

const ChatInput = ({ conversation, isChatWindowOpen }: ChatInputProps) => {
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [ messageBody, setMessageBody ] = useState("");

  useEffect(() => {
    if (isChatWindowOpen) {
      // When the chat window is opened, we will focus on the text input.
      // This is so the user doesn't have to click on it to begin typing a message.
      textInputRef.current?.focus();
    }
  }, [ isChatWindowOpen ]);

  const handleSendMessage = async ({ message }) => {
    await conversation.sendMessage(message.trim());
    setMessageBody("");
  };

  const handleChange = (message: string) => {
    setMessageBody(message);
  };

  return (
    <div className="chat-input-container">
      <Form
        onFinish={handleSendMessage}
        footer={
          <Button block type='submit' color='primary'>
            <SendOutlined/>
          </Button>}>
        <Form.Item name="message" rules={[ { pattern: /\S/ } ]}>
          <TextArea
            value={messageBody}
            placeholder="Write a message"
            autoSize={true}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default ChatInput;
