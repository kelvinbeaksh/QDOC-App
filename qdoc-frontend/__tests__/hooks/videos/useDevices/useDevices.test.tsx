import { act, renderHook } from "@testing-library/react-hooks";
import useDevices from "../../../../src/hooks/videos/useDevices/useDevices";
import { getDeviceInfo } from "../../../../src/utils/video-helper";

jest.mock("../../../../src/utils/video-helper", () => ({ getDeviceInfo: jest.fn(() => Promise.resolve()) }));

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// @ts-ignore
navigator.mediaDevices = {
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener
};

describe("the useDevices hook", () => {
  afterEach(jest.clearAllMocks);

  it("should return the correct default values", async () => {
    const { result, waitForNextUpdate } = renderHook(useDevices);
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "audioInputDevices": Array [],
        "audioOutputDevices": Array [],
        "hasAudioInputDevices": false,
        "hasVideoInputDevices": false,
        "videoInputDevices": Array [],
      }
    `);

    await waitForNextUpdate();
  });

  it.skip("should respond to \"devicechange\" events", async () => {
    const { waitForNextUpdate } = renderHook(useDevices);
    expect(getDeviceInfo).toHaveBeenCalledTimes(1);

    expect(mockAddEventListener).toHaveBeenCalledWith("devicechange", expect.any(Function));
    act(() => {
      mockAddEventListener.mock.calls[0][1]();
    });

    await waitForNextUpdate();
    expect(getDeviceInfo).toHaveBeenCalledTimes(2);
  });

  it.skip("should remove \"devicechange\" listener on component unmount", async () => {
    const { waitForNextUpdate, unmount } = renderHook(useDevices);
    await waitForNextUpdate();
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith("devicechange", expect.any(Function));
  });
});
