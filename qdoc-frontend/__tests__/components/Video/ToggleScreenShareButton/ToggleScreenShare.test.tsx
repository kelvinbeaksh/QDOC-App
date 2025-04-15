import React from "react";
import useVideoContext from "../../../../src/contexts/video-context";
import { render, screen } from "@testing-library/react";
import ToggleScreenShareButton, { SCREEN_SHARE_TEXT }
  from "../../../../src/components/Video/ToggleScreenShareButton/ToggleScreenShareButton";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../src/hooks/videos/useScreenShareParticipant/useScreenShareParticipant");
jest.mock("../../../../src/contexts/video-context");
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

const mockToggleScreenShare = jest.fn();

Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getDisplayMedia: () => {}
  },
  configurable: true
});

describe("the ToggleScreenShareButton component", () => {
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ toggleScreenShare: mockToggleScreenShare }));
  });
  it("should render correctly when screenSharing is allowed", () => {
    render(<ToggleScreenShareButton />);
    expect(screen.getByRole("button", { name: SCREEN_SHARE_TEXT })).toBeInTheDocument();
  });

  it("should call the correct toggle function when clicked", () => {
    render(<ToggleScreenShareButton />);
    const btn = screen.getByRole("button", { name: SCREEN_SHARE_TEXT });
    userEvent.click(btn);
    expect(mockToggleScreenShare).toHaveBeenCalled();
  });

  it("should render the screenshare button with the correct messaging if screensharing is not supported", () => {
    Object.defineProperty(navigator, "mediaDevices", { value: { getDisplayMedia: undefined } });
    render(<ToggleScreenShareButton />);
    const btn = screen.getByRole("button", { name: SCREEN_SHARE_TEXT });
    expect(btn).toBeDisabled();
  });
});
