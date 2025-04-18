import { act, renderHook } from "@testing-library/react-hooks";
import Video, { LocalTrack, Room } from "twilio-video";
import * as VideoHelper from "../../../../src/utils/video-helper";
import { mockRoom } from "../../../../__mocks__/twilio-video";
import useRoom from "../../../../src/hooks/videos/useRoom/useRoom";

const mockVideoConnect = Video.connect as jest.Mock;

describe("the useRoom hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Video, "connect").mockResolvedValue(mockRoom as unknown as Room);
  });
  afterEach(() => mockRoom.removeAllListeners());

  it("should set isConnecting to true while connecting to the room", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
    expect(result.current.isConnecting).toBe(false);
    act(() => {
      result.current.connect("token");
    });
    expect(result.current.isConnecting).toBe(true);
    await waitForNextUpdate();
    expect(Video.connect).toHaveBeenCalledTimes(1);
    expect(result.current.room!.disconnect).not.toHaveBeenCalled();
    expect(result.current.isConnecting).toBe(false);
  });

  it("should set the priority of video tracks to low", async () => {
    const { result } = renderHook(() => useRoom([ { kind: "video" } as LocalTrack ], () => {}, {}));
    await act(async () => {
      await result.current.connect("token");
    });
    expect(mockRoom.localParticipant.videoTracks[0].setPriority)
      .toHaveBeenCalledWith("low");
  });

  it("should return a room after connecting to a room", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
    act(() => {
      result.current.connect("token");
    });
    await waitForNextUpdate();
    expect(result.current.room!.state).toEqual("connected");
  });

  it("should add a listener for the \"beforeUnload\" event when connected to a room", async () => {
    const spy = jest.spyOn(window, "addEventListener");
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
    act(() => {
      result.current.connect("token");
    });
    await waitForNextUpdate();
    expect(spy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should remove the listener for the \"beforeUnload\" event when the room is disconnected", async () => {
    jest.spyOn(window, "removeEventListener");
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
    act(() => {
      result.current.connect("token");
    });
    await waitForNextUpdate();
    result.current.room!.emit("disconnected");
    await waitForNextUpdate();
    expect(window.removeEventListener).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should call onError and set isConnecting to false when there is an error", async () => {
    const mockOnError = jest.fn();
    // eslint-disable-next-line prefer-promise-reject-errors
    mockVideoConnect.mockImplementationOnce(() => Promise.reject("mockError"));
    const { result } = renderHook(() => useRoom([], mockOnError, {}));
    await act(() => result.current.connect("token"));
    expect(mockOnError).toHaveBeenCalledWith("mockError");
    expect(result.current.isConnecting).toBe(false);
  });

  it("should reset the room object on disconnect", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
    act(() => {
      result.current.connect("token");
    });
    await waitForNextUpdate();
    expect(result.current.room!.state).toBe("connected");
    result.current.room!.emit("disconnected");
    await waitForNextUpdate();
    expect(result.current.room).toBe(null);
  });

  describe("when isMobile is true", () => {
    // @ts-ignore
    VideoHelper.isMobile = true;

    it("should add a listener for the \"pagehide\" event when connected to a room", async () => {
      jest.spyOn(window, "addEventListener");
      const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
      act(() => {
        result.current.connect("token");
      });
      await waitForNextUpdate();
      expect(window.addEventListener).toHaveBeenCalledWith("pagehide", expect.any(Function));
    });

    it("should remove the listener for the \"pagehide\" event when the room is disconnected", async () => {
      jest.spyOn(window, "removeEventListener");
      const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, {}));
      act(() => {
        result.current.connect("token");
      });
      await waitForNextUpdate();
      result.current.room!.emit("disconnected");
      await waitForNextUpdate();
      expect(window.removeEventListener).toHaveBeenCalledWith("pagehide", expect.any(Function));
    });
  });
});
