import React from "react";
import useLocalVideoToggle from "../../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle";
import useDevices from "../../../../src/hooks/videos/useDevices/useDevices";
import { render, screen } from "@testing-library/react";
import ToggleVideoButton from "../../../../src/components/Video/ToggleVideoButton/ToggleVideoButton";
import userEvent from "@testing-library/user-event";
import { DeviceInfo } from "../../../../src/types/twilio";

jest.mock("../../../../src/hooks/videos/useDevices/useDevices");
jest.mock("../../../../src/hooks/videos/useLocalVideoToggle/useLocalVideoToggle");

const mockUseLocalVideoToggle = useLocalVideoToggle as jest.Mock<any>;
const mockUseDevices = useDevices as jest.Mock<DeviceInfo>;

describe.skip("the ToggleVideoButton component", () => {
  beforeEach(() => {
    mockUseDevices.mockImplementation(
      () => ({ hasVideoInputDevices: true } as unknown as DeviceInfo)
    );
  });

  it("should render correctly when video is enabled", () => {
    mockUseLocalVideoToggle.mockImplementation(() => [ true, () => {} ]);
    render(<ToggleVideoButton />);
    expect(screen.getByRole("button", { name: "Stop Video" }))
      .toBeInTheDocument();
  });

  it("should render correctly when video is disabled", () => {
    mockUseLocalVideoToggle.mockImplementation(() => [ false, () => {} ]);
    render(<ToggleVideoButton />);
    expect(screen.getByRole("button", { name: "Start Video" }))
      .toBeInTheDocument();
  });

  it("should render correctly when no video devices exist", () => {
    mockUseLocalVideoToggle.mockImplementation(() => [ true, () => {} ]);
    mockUseDevices.mockImplementationOnce(
      () => ({ hasVideoInputDevices: false } as unknown as DeviceInfo)
    );
    render(<ToggleVideoButton />);
    expect(screen.getByRole("button", { name: "No Video" }))
      .toBeDisabled();
  });

  it("should call the correct toggle function when clicked", () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [ false, mockFn ]);
    render(<ToggleVideoButton />);
    const btn = screen.getByRole("button", { name: "Start Video" });
    userEvent.click(btn);
    expect(mockFn).toHaveBeenCalled();
  });

  it("should throttle the toggle function to 200ms", () => {
    const mockFn = jest.fn();
    mockUseLocalVideoToggle.mockImplementation(() => [ false, mockFn ]);
    render(<ToggleVideoButton />);
    const btn = screen.getByRole("button", { name: "Start Video" });
    Date.now = () => 100000;
    userEvent.click(btn); // should register
    Date.now = () => 100500;
    userEvent.click(btn); // Should be ignored
    Date.now = () => 100501;
    userEvent.click(btn); // Should register
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
