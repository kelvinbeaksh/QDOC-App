/* eslint-disable react/display-name */
import React from "react";
import { useAppState } from "../../../../../src/state/VideoAppState";
import useVideoContext from "../../../../../src/contexts/video-context";
import { render, screen, waitFor } from "@testing-library/react";
import DeviceSelectionScreen
  from "../../../../../src/components/Video/PreJoinScreens/DeviceSelectionScreen/DeviceSelectionScreen";
import useChatContext from "../../../../../src/hooks/videos/useChatContext/useChatContext";
import userEvent from "@testing-library/user-event";
import useLocalVideoToggle from "../../../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle";

const mockUseAppState = useAppState as jest.Mock;
const mockUseVideoContext = useVideoContext as jest.Mock;
const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock;
const mockUseChatContext = useChatContext as jest.Mock;

const mockConnect = jest.fn(() => Promise.resolve({}));
const mockChatConnect = jest.fn(() => Promise.resolve({}));
const mockGetToken = jest.fn(() => Promise.resolve({ token: "mockToken" }));

jest.mock(
  "../../../../../src/components/Video/PreJoinScreens/DeviceSelectionScreen/LocalVideoPreview/LocalVideoPreview",
  () => ({ __esModule: true, default: ({ identity }) => <div>{identity}</div> })
);

jest.mock(
  "../../../../../src/components/Video/ToggleAudioButton/ToggleAudioButton",
  () => ({ __esModule: true, default: ({ disabled }) => <button disabled={disabled}>Toggle Audio</button> })
);
jest.mock(
  "../../../../../src/components/Video/ToggleVideoButton/ToggleVideoButton",
  () => ({ __esModule: true, default: ({ disabled }) => <button disabled={disabled}>Toggle Video</button> })
);
jest.mock(
  "../../../../../src/components/Video/PreJoinScreens/DeviceSelectionScreen/SettingsMenu/SettingsMenu",
  () => ({
    __esModule: true,
    default() {
      return <div>Setting menu</div>;
    }
  })
);
jest.mock("../../../../../src/contexts/video-context");
jest.mock("../../../../../src/state/VideoAppState");
jest.mock("../../../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle");
jest.mock("../../../../../src/hooks/videos/useChatContext/useChatContext");

describe("the DeviceSelectionScreen component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken, isFetching: false }));
    mockUseVideoContext.mockImplementation(() => ({
      connect: mockConnect,
      isAcquiringLocalTracks: false,
      isConnecting: false
    }));
    mockUseLocalVideoToggle.mockImplementation(() => []);
    mockUseChatContext.mockImplementation(() => ({ connect: mockChatConnect }));
  });

  describe("when connecting to a room", () => {
    it("should show the loading screen", () => {
      mockUseVideoContext.mockImplementationOnce(() => ({
        connect: mockConnect,
        isAcquiringLocalTracks: false,
        isConnecting: true
      }));
      render(<DeviceSelectionScreen name='test name' roomName='test room name' />);
      expect(screen.getByRole("img",
        { name: "loading" })).toBeInTheDocument();
    });
  });

  describe.skip("when acquiring local tracks", () => {
    it("should disable the toggle video, audio buttons", () => {
      mockUseVideoContext.mockImplementationOnce(() => ({
        connect: mockConnect,
        isAcquiringLocalTracks: true,
        isConnecting: false
      }));
      render(<DeviceSelectionScreen name='test name' roomName='test room name' />);
      expect(screen.getByRole("button",
        { name: /toggle video/i })).toBeDisabled();
      expect(screen.getByRole("button",
        { name: /toggle audio/i })).toBeDisabled();
      expect(screen.getByRole("button",
        { name: /join now/i })).toBeDisabled();
    });
  });

  describe.skip("when isConnecting and isFetching is false", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should fetch a token and connect to the Video SDK only when the Join Now button is clicked",
      () => {
        mockUseAppState.mockImplementation(() => ({ getToken: mockGetToken, isFetching: false }));
        render(<DeviceSelectionScreen name="test name" roomName="test room name" />);
        const btn = screen.getByRole("button", { name: "Join Now" });
        userEvent.click(btn);
        expect(mockGetToken).toHaveBeenCalledWith("test name", "test room name");
      });

    it("should call videoConnect and chatConnect when the Join Now button is clicked",
      async () => {
        mockUseAppState.mockImplementation(() => ({ getToken: () => Promise.resolve({ token: "mockToken" }),
          isFetching: false }));
        render(<DeviceSelectionScreen name="test name" roomName="test room name" />);
        userEvent.click(screen.getByRole("button", { name: "Join Now" }));
        await waitFor(() => {
          expect(mockChatConnect).toHaveBeenCalledWith("mockToken");
          expect(mockConnect).toHaveBeenCalledWith("mockToken");
        });
      });
  });

  describe("when fetching a token", () => {
    beforeEach(() => {
      mockUseAppState
        .mockImplementation(() => ({ getToken: mockGetToken, isFetching: true }));
      mockUseVideoContext.mockImplementation(() => ({
        connect: mockConnect,
        isAcquiringLocalTracks: false,
        isConnecting: false
      }));
    });

    it("should show the loading screen", () => {
      render(<DeviceSelectionScreen name='test name' roomName='test room name' />);
      expect(screen.getAllByRole(
        "img", { name: "loading" }
      )).toBeTruthy();
    });
  });
});
