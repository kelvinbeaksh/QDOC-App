/* eslint-disable react/display-name */
import React from "react";
import useVideoContext from "../../../../src/contexts/video-context";
import { act, render, screen } from "@testing-library/react";
import PreJoinScreens from "../../../../src/components/Video/PreJoinScreens/PreJoinScreens";
import { useUserContext } from "../../../../src/contexts/user-context";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    room: "test"
  })
}));

jest.mock("../../../../src/contexts/video-context");
jest.mock("../../../../src/contexts/user-context");
jest.mock("../../../../src/components/Video/PreJoinScreens/DeviceSelectionScreen/DeviceSelectionScreen",
  () => {
    return {
      __esModule: true,
      default: ({ name, roomName }) => {
        return <div data-testid="device-selection-screen">{roomName} {name}</div>;
      }
    };
  });

jest.mock("../../../../src/components/Video/PreJoinScreens/MediaErrorSnackbar/MediaErrorNotification",
  () => {
    return {
      __esModule: true,
      default: () => {
        return <div data-testid='media-error-notification'/>;
      }
    };
  });

const mockUseVideoContext = useVideoContext as jest.Mock;
const mockUseUserContext = useUserContext as jest.Mock;

describe("the PreJoinScreens component", () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() =>
      ({ getAudioAndVideoTracks: () => Promise.resolve() }));
    mockUseUserContext.mockImplementation(() => ({
      user: { email: "test@gmail.com" }
    }));
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should show the DeviceSelection screen", () => {
    render(<PreJoinScreens />);

    screen.getByTestId("device-selection-screen");
  });

  it("should capture errors from getAudioAndVideoTracks and call showMediaErrorNotification", async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    mockUseVideoContext.mockImplementation(() => ({ getAudioAndVideoTracks: () => Promise.reject("testError") }));

    render(<PreJoinScreens />);

    await act(async () => {
      await new Promise(setImmediate);
    });

    expect(screen.getByTestId("media-error-notification")).toBeInTheDocument();
  });
});
