import React from "react";
import useLocalAudioToggle from "../../../../src/hooks/videos/useLocalAudioToggle/useLocalAudioToggle";
import useVideoContext from "../../../../src/contexts/video-context";
import { render, screen } from "@testing-library/react";
import ToggleAudioButton from "../../../../src/components/Video/ToggleAudioButton/ToggleAudioButton";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../src/hooks/videos/useLocalAudioToggle/useLocalAudioToggle");
jest.mock("../../../../src/contexts/video-context");
const mockUseLocalAudioToggle = useLocalAudioToggle as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe.skip("ToggleAudioButton component", () => {
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({ localTracks: [ { kind: "audio" } ] }));
  });

  it("should render correctly when audio is enabled", () => {
    mockUseLocalAudioToggle.mockImplementation(() => [ true, () => {} ]);
    render(<ToggleAudioButton />);
    expect(screen.getByRole("img", { name: "audio-muted" }))
      .toBeInTheDocument();
    expect(screen.getByText("Mute")).toBeInTheDocument();
  });

  it("should render correctly when audio is disabled", () => {
    mockUseLocalAudioToggle.mockImplementation(() => [ false, () => {} ]);
    render(<ToggleAudioButton />);
    expect(screen.getByRole("button", { name: "audio Unmute" }))
      .toBeInTheDocument();
    expect(screen.getByText("Unmute")).toBeInTheDocument();
  });

  //
  it("should render correctly when there are no audio tracks", () => {
    mockUseLocalAudioToggle.mockImplementation(() => [ true, () => {} ]);
    mockUseVideoContext.mockImplementationOnce(() => ({ localTracks: [ { kind: "video" } ] }));
    render(<ToggleAudioButton />);
    expect(screen.getByText("No Audio")).toBeInTheDocument();
  });

  it("should call the correct toggle function when clicked", () => {
    const mockFn = jest.fn();
    mockUseLocalAudioToggle.mockImplementation(() => [ false, mockFn ]);
    render(<ToggleAudioButton />);
    const btn = screen.getByRole("button", { name: "audio Unmute" });
    userEvent.click(btn);
    expect(mockFn).toHaveBeenCalled();
  });
});
