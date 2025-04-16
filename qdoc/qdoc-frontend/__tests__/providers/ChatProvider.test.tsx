import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Client } from "@twilio/conversations";
import { mockConversation } from "../../__mocks__/@twilio/conversations";
import useVideoContext from "../../src/contexts/video-context";
import useChatContext from "../../src/hooks/videos/useChatContext/useChatContext";
import { ChatProvider } from "../../src/providers/ChatProvider";

jest.mock("@twilio/conversations");
jest.mock("../../src/contexts/video-context");
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockOnError = jest.fn();
const mockClient = {
  getConversationByUniqueName: (_: string) => {
    return Promise.resolve(mockConversation);
  }
} as Client;

const mockRoom = { sid: "mockRoomSid" };

const wrapper: React.FC = ({ children }) =>
  <ChatProvider>{children}</ChatProvider>;

describe("the ChatProvider component", () => {
  let mockClientCreate: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockClientCreate = jest.spyOn(Client, "create").mockResolvedValue(mockClient);
    jest.spyOn(mockConversation, "getMessages").mockResolvedValue({ items: [ "mockMessage" ] });
    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom, onError: mockOnError }));
  });

  it("should return a Conversation after connect has been called and after a room exists", async () => {
    // Setup mock as if user is not connected to a room
    mockUseVideoContext.mockImplementation(() => ({}));
    const { result, rerender, waitForNextUpdate } = renderHook(useChatContext, { wrapper });

    result.current.connect("mockToken");
    await waitForNextUpdate();
    expect(mockClientCreate).toHaveBeenCalledWith("mockToken");

    // conversation should be null as there is no room
    expect(result.current.conversation).toBe(null);

    mockUseVideoContext.mockImplementation(() => ({ room: mockRoom }));

    // Rerender hook now that there is a room
    rerender();
    await waitForNextUpdate();

    expect(result.current.conversation).toBe(mockConversation);
  });

  it("should load all messages after obtaining a conversation", async () => {
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.messages).toEqual([ "mockMessage" ]);
  });

  it("should add new messages to the \"messages\" array", async () => {
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    act(() => {
      mockConversation.emit("messageAdded", "newMockMessage");
    });

    expect(result.current.messages).toEqual([ "mockMessage", "newMockMessage" ]);
  });

  it("should set hasUnreadMessages to true when initial messages are " +
    "loaded while the chat window is closed", async () => {
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });

    expect(result.current.hasUnreadMessages).toBe(false);

    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.hasUnreadMessages).toBe(true);
  });

  it("should not set hasUnreadMessages to true when initial messages " +
    "are loaded while the chat window is open", async () => {
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });

    // Open chat window before connecting
    act(() => {
      result.current.setIsChatWindowOpen(true);
    });

    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.hasUnreadMessages).toBe(false);
  });

  it("should set hasUnreadMessages to true when a message is received while then chat window is closed", async () => {
    // Setup mock so that no messages are loaded after a conversation is obtained.
    jest.spyOn(mockConversation, "getMessages").mockResolvedValue({ items: [] });

    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.hasUnreadMessages).toBe(false);

    act(() => {
      mockConversation.emit("messageAdded", "mockmessage");
    });

    expect(result.current.hasUnreadMessages).toBe(true);
  });

  it("should not set hasUnreadMessages to true when a message is received while then chat window is open", async () => {
    // Setup mock so that no messages are loaded after a conversation is obtained.
    jest.spyOn(mockConversation, "getMessages").mockResolvedValue({ items: [] });
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.hasUnreadMessages).toBe(false);

    // Open chat window and receive message
    act(() => {
      result.current.setIsChatWindowOpen(true);
      mockConversation.emit("messageAdded", "mockmessage");
    });

    expect(result.current.hasUnreadMessages).toBe(false);
  });

  it("should set hasUnreadMessages to false when the chat window is opened", async () => {
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(result.current.hasUnreadMessages).toBe(true);

    act(() => {
      result.current.setIsChatWindowOpen(true);
    });

    expect(result.current.hasUnreadMessages).toBe(false);
  });

  it("should call onError when there is an error connecting with the conversations client",
    // eslint-disable-next-line jest/no-done-callback
    done => {
      mockClientCreate.mockRejectedValue(new Error("mock error"));
      const { result } = renderHook(useChatContext, { wrapper });
      result.current.connect("mockToken");

      setImmediate(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          new Error("There was a problem connecting to Twilio's conversation service.")
        );
        done();
      });
    });

  it("should call onError when there is an error obtaining the conversation", async () => {
    jest.spyOn(mockClient, "getConversationByUniqueName").mockRejectedValue(new Error("mock error"));
    const { result, waitForNextUpdate } = renderHook(useChatContext, { wrapper });
    result.current.connect("mockToken");
    await waitForNextUpdate();

    expect(mockOnError).toHaveBeenCalledWith(
      new Error("There was a problem getting the Conversation associated with this room.")
    );
  });
});
