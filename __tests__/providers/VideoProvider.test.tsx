import { EventEmitter } from "events";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { Room, TwilioError } from "twilio-video";
import useHandleRoomDisconnection from "../../src/hooks/videos/useHandleRoomDisconnection/useHandleRoomDisconnection";
import { VideoProvider } from "../../src/providers/VideoProvider";
import useVideoContext from "../../src/contexts/video-context";
import useRoom from "../../src/hooks/videos/useRoom/useRoom";
import useHandleTrackPublicationFailed
  from "../../src/hooks/videos/useHandleTrackPublicationFailed/useHandleTrackPublicationFailed";
import useRestartAudioTrackOnDeviceChange
  from "../../src/hooks/videos/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange";
import useLocalTracks from "../../src/hooks/videos/useLocalTracks/useLocalTracks";

jest.mock("../../src/hooks/videos/useRoom/useRoom");
jest.mock("../../src/hooks/videos/useLocalTracks/useLocalTracks");
jest.mock("../../src/hooks/videos/useHandleRoomDisconnection/useHandleRoomDisconnection");
jest.mock("../../src/hooks/videos/useHandleTrackPublicationFailed/useHandleTrackPublicationFailed");
jest.mock("../../src/hooks/videos/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange");

const mockUseLocalTrack = useLocalTracks as jest.Mock;
const mockUseRoom = useRoom as jest.Mock;

const mockRoom = new EventEmitter() as Room;

describe("the VideoProvider component", () => {
  beforeEach(() => {
    mockUseLocalTrack.mockImplementation(() => ({
      localTracks: [ { name: "mockTrack" } ],
      getLocalVideoTrack: () => {},
      getLocalAudioTrack: () => {},
      isAcquiringLocalTracks: true,
      removeLocalAudioTrack: () => {},
      removeLocalVideoTrack: () => {}
    }));
    mockUseRoom.mockImplementation(() => ({ room: mockRoom,
      isConnecting: false,
      connect: () => {} }));
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  it("should correctly return the Video Context object", () => {
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider onError={() => {}} options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    const expectedSettings = {
      type: "none",
      index: 0
    };
    expect(result.current).toMatchObject({
      isConnecting: false,
      localTracks: [ { name: "mockTrack" } ],
      room: mockRoom,
      onError: expect.any(Function),
      connect: expect.any(Function),
      getLocalVideoTrack: expect.any(Function),
      getLocalAudioTrack: expect.any(Function),
      removeLocalVideoTrack: expect.any(Function),
      isAcquiringLocalTracks: true,
      toggleScreenShare: expect.any(Function),
      isBackgroundSelectionOpen: false,
      setIsBackgroundSelectionOpen: expect.any(Function),
      backgroundSettings: expectedSettings,
      setBackgroundSettings: expect.any(Function)
    });
    expect(useRoom).toHaveBeenCalledWith([ { name: "mockTrack" } ], expect.any(Function), {
      dominantSpeaker: true
    });
    expect(useHandleRoomDisconnection).toHaveBeenCalledWith(
      mockRoom,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      false,
      expect.any(Function)
    );
    expect(useHandleTrackPublicationFailed).toHaveBeenCalledWith(mockRoom, expect.any(Function));
    expect(useRestartAudioTrackOnDeviceChange).toHaveBeenCalledWith(result.current.localTracks);
  });

  it("should call the onError function when there is an error", () => {
    const mockOnError = jest.fn();
    const wrapper: React.FC = ({ children }) => (
      <VideoProvider onError={mockOnError} options={{ dominantSpeaker: true }}>
        {children}
      </VideoProvider>
    );
    const { result } = renderHook(useVideoContext, { wrapper });
    result.current.onError({} as TwilioError);
    expect(mockOnError).toHaveBeenCalledWith({});
  });
});
