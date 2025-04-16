import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Message } from "@twilio/conversations/lib/message";
import { throttle } from "lodash";
import { Button, Space } from "antd-mobile";
import usePrevious from "../../../../hooks/videos/usePrevious/usePrevious";
import { DownOutline } from "antd-mobile-icons";
import "./MessageListScrollContainer.scss";

interface MessageListScrollContainerState {
  isScrolledToBottom: boolean;
  showButton: boolean;
  messageNotificationCount: number;
}

/*
 * This component is a scrollable container that wraps around the 'MessageList' component.
 * The MessageList will ultimately grow taller than its container as it continues to receive
 * new messages, and users will need to have the ability to scroll up and down the chat window.
 * A "new message" button will be displayed when the user receives a new message, and is not scrolled
 * to the bottom. This button will be hidden if the user clicks on it, or manually scrolls
 * to the bottom. Otherwise, this component will auto-scroll to the bottom when a new message is
 * received, and the user is already scrolled to the bottom.
 *
 * Note that this component is tested with Cypress only.
 */
const MessageListScrollContainer = (props: { messages: Message[], children: ReactNode }): ReactElement => {
  const chatThreadRef = React.createRef<HTMLDivElement>();
  const [ scrollContainerState, setScrollContainerState ] =
    useState<MessageListScrollContainerState>({
      isScrolledToBottom: true,
      showButton: false,
      messageNotificationCount: 0
    });
  const prevStateMessages: Message[] = usePrevious<Message[]>(props.messages);
  const prevScrollContainerState: MessageListScrollContainerState = usePrevious(scrollContainerState);

  const scrollToBottom = () => {
    const innerScrollContainerEl = chatThreadRef.current!;
    innerScrollContainerEl.scrollTop = innerScrollContainerEl!.scrollHeight;
  };

  const handleScroll = throttle(() => {
    const innerScrollContainerEl = chatThreadRef.current!;
    // Because this.handleScroll() is a throttled method,
    // it's possible that it can be called after this component unmounts, and this element will be null.
    // Therefore, if it doesn't exist, don't do anything:
    if (!innerScrollContainerEl) return;

    // On systems using display scaling, scrollTop may return a decimal value, so we need to account for this in the
    // "isScrolledToBottom" calculation.
    const isScrolledToBottom =
      Math.abs(
        innerScrollContainerEl.clientHeight + innerScrollContainerEl.scrollTop - innerScrollContainerEl!.scrollHeight
      ) < 1;

    setScrollContainerState(prevState => ({
      ...prevState,
      ...{
        isScrolledToBottom, showButton: isScrolledToBottom ? false : prevState.showButton
      }
    }));
  }, 300);

  const handleClick = () => {
    const innerScrollContainerEl = chatThreadRef.current!;

    innerScrollContainerEl.scrollTo({ top: innerScrollContainerEl.scrollHeight, behavior: "smooth" });

    setScrollContainerState(prevState => ({
      ...prevState,
      ...{ showButton: false }
    }));
  };

  useEffect(() => {
    scrollToBottom();
    chatThreadRef.current!.addEventListener("scroll", handleScroll);
    return () => {
      const innerScrollContainerEl = chatThreadRef.current!;
      innerScrollContainerEl.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (prevScrollContainerState && prevStateMessages) {
      const hasNewMessages = props.messages.length !== prevStateMessages.length;
      if (prevScrollContainerState.isScrolledToBottom && hasNewMessages) {
        scrollToBottom();
      } else if (hasNewMessages) {
        const numberOfNewMessages = props.messages.length - prevStateMessages.length;
        setScrollContainerState(prevState => ({
          ...prevState,
          ...{
            showButton: !prevState.isScrolledToBottom,
            messageNotificationCount: prevState.showButton ?
              prevState.messageNotificationCount + numberOfNewMessages : 1
          }
        }));
      }
    }
  }, [ props.messages, scrollContainerState ]);

  return (
    <div className={"message-list-scroll-outer-container"}>
      <div className={"message-list-scroll-inner-container"} ref={chatThreadRef}>
        <div className={"message-list-container"}>
          { props.children }
          <Button
            className={`message-list-button ${scrollContainerState.showButton && "message-list-show-button"}`}
            onClick={handleClick}
            color="primary">
            <Space>
              {scrollContainerState.messageNotificationCount} new message
              <DownOutline/>
            </Space>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageListScrollContainer;
