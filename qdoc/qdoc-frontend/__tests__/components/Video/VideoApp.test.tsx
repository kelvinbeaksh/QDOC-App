/* eslint-disable react/display-name */
import React from "react";
import useRoomState from "../../../src/hooks/videos/useRoomState/useRoomState";
import useHeight from "../../../src/hooks/videos/useHeight/useHeight";
import { render, screen } from "@testing-library/react";
import VideoApp from "../../../src/components/Video/VideoApp";
import { useAppState } from "../../../src/state/VideoAppState";
import useRestartAudioTrackOnDeviceChange
  from "../../../src/hooks/videos/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange";
import useVideoContext from "../../../src/contexts/video-context";
import useLocalTracks from "../../../src/hooks/videos/useLocalTracks/useLocalTracks";
import useLocalVideoToggle from "../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle";
import useDevices from "../../../src/hooks/videos/useDevices/useDevices";
import { DeviceInfo } from "../../../src/types/twilio";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    room: "test"
  })
}));

jest.mock("../../../src/components/Video/Room/Room", () => ({
  __esModule: true,
  default: () => {
    return <div/>;
  }
}));
jest.mock("../../../src/components/Video/MenuBar/MenuBar", () => ({
  __esModule: true,
  default: () => {
    return <div/>;
  }
}));
jest.mock("../../../src/components/Video/ParticipantList/ParticipantList", () => ({
  __esModule: true,
  default: () => {
    return <div data-testid="participant-list-sider"/>;
  }
}));
jest.mock("../../../src/hooks/videos/useLocalTracks/useLocalTracks");
jest.mock("../../../src/hooks/videos/useDevices/useDevices");
jest.mock("../../../src/contexts/video-context");
jest.mock("../../../src/hooks/videos/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange");
jest.mock("../../../src/hooks/videos/useRoomState/useRoomState");
jest.mock("../../../src/state/VideoAppState");
jest.mock("../../../src/hooks/videos/useConnectionOptions/useConnectionOptions");
jest.mock("../../../src/hooks/videos/useHeight/useHeight");
jest.mock("../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle");

const mockUseDevices = useDevices as jest.Mock<DeviceInfo>;
const mockUseRoomState = useRoomState as jest.Mock;
const mockUseLocalTracks = useLocalTracks as jest.Mock;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;
const mockUseHeight = useHeight as jest.Mock<any>;
const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseRestartAudioTrackOnDeviceChange = useRestartAudioTrackOnDeviceChange as jest.Mock<any>;
const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock<any>;

describe("the VideoApp component", () => {
  beforeEach(() => {
    mockUseDevices.mockImplementation(() => ({
      hasVideoInputDevices: false
    } as DeviceInfo));

    mockUseVideoContext.mockImplementation(() => ({
      room: jest.fn(),
      localTracks: [],
      getAudioAndVideoTracks: () => (Promise.resolve({}))
    }));
    mockUseLocalVideoToggle.mockImplementation(() => []);
    mockUseLocalTracks.mockImplementation(() => ({
      localTracks: []
    }));
    mockUseHeight.mockImplementation(() => "500px");
    mockUseRestartAudioTrackOnDeviceChange.mockImplementation(() => jest.fn());
    mockUseAppState.mockImplementation(() => ({
      settings: {
        dominantSpeakerPriority: "high"
      },
      error: null,
      setError: jest.fn()
    }));
  });

  it("should render correctly when disconnected from a room", () => {
    mockUseRoomState.mockImplementation(() => "disconnected");
    render(<VideoApp />);
    expect(screen.getByText("Camera Preview")).toBeInTheDocument();
  });

  it("should render correctly when connected (or reconnecting) to a room", () => {
    mockUseRoomState.mockImplementation(() => "connected");
    render(<VideoApp />);
    expect(screen.getByTestId("video-footer")).toBeInTheDocument();
    expect(screen.getByTestId("video-room")).toBeInTheDocument();
  });
});
