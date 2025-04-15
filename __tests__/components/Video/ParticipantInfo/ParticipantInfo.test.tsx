import React from "react";
import usePublications from "../../../../src/hooks/videos/usePublications/usePublications";
import useIsTrackSwitchedOff from "../../../../src/hooks/videos/useIsTrackSwitchedOff/useIsTrackSwitchedOff";
import useParticipantIsReconnecting
  from "../../../../src/hooks/videos/useParticipantIsReconnecting/useParticipantIsReconnecting";
import { render, screen } from "@testing-library/react";
import ParticipantInfo from "../../../../src/components/Video/ParticipantInfo/ParticipantInfo";

jest.mock("../../../../src/components/Video/NetworkQualityLevel/NetworkQualityLevel",
  () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: () => <div/>
  }));
jest.mock("../../../../src/hooks/videos/usePublications/usePublications");
jest.mock("../../../../src/hooks/videos/useIsTrackSwitchedOff/useIsTrackSwitchedOff");
jest.mock("../../../../src/hooks/videos/useParticipantIsReconnecting/useParticipantIsReconnecting");

const mockUsePublications = usePublications as jest.Mock;
const mockUseIsTrackSwitchedOff = useIsTrackSwitchedOff as jest.Mock;
const mockUseParticipantIsReconnecting = useParticipantIsReconnecting as jest.Mock<boolean>;

describe("the ParticipantInfo component", () => {
  it("should render the AvatarIcon component when no video tracks are published", () => {
    mockUsePublications.mockImplementation(() => []);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByRole("img", { name: "user" })).toBeInTheDocument();
  });

  it("should not display the AvatarIcon component when a video track is published", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.queryByRole("img", { name: "user" })).not.toBeInTheDocument();
  });

  it("should render the AvatarIcon component when the video track is switchedOff", () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => true);
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByRole("img", { name: "user" })).toBeInTheDocument();
  });

  it("should not render the reconnecting UI when the user is connected", () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => false);
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.queryByText("Reconnecting")).not.toBeInTheDocument();
  });
  //
  it("should render the reconnecting UI when the user is reconnecting", () => {
    mockUseParticipantIsReconnecting.mockImplementationOnce(() => true);
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();
  });

  it("should add display none to container component when hideParticipant prop is true", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: "mockIdentity" } as any}
        hideParticipant={true}
      >
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("participant-info")).toHaveStyle("display: none");
  });

  it("should not add hideParticipant class to container component when hideParticipant prop is false", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: "mockIdentity" } as any}
        hideParticipant={false}
      >
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("participant-info")).not.toHaveStyle("display: none");
  });

  it("should add cursorPointer class to container component when onClick prop is present", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo isSelected={false} participant={{ identity: "mockIdentity" } as any} onClick={() => {}}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("participant-info")).toHaveStyle("cursor: pointer");
  });

  it("should not add cursorPointer class to container component when onClick prop is not present", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("participant-info")).not.toHaveStyle("cursor: pointer");
  });

  it("should render the PinIcon component when the participant is selected", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={true} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("pin")).toBeInTheDocument();
  });

  it("should not render the PinIcon component when the participant is not selected", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.queryByTestId("pin")).not.toBeInTheDocument();
  });

  it("should render the ScreenShareIcon component when the participant is sharing their screen", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "screen", kind: "video" } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByTestId("screen-share")).toBeInTheDocument();
  });

  it("should not render the ScreenShareIcon component when the participant is not sharing their screen", () => {
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.queryByTestId("screen-share")).not.toBeInTheDocument();
  });

  it("should add \"(You)\" to the participants identity when they are the localParticipant", () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo
        onClick={() => {}}
        isSelected={false}
        participant={{ identity: "mockIdentity" } as any}
        isLocalParticipant
      >
        mock children
      </ParticipantInfo>
    );
    expect(screen.getByText("mockIdentity (You)")).toBeInTheDocument();
  });

  it("should not add \"(You)\" to the participants identity when they are the localParticipant", () => {
    mockUseIsTrackSwitchedOff.mockImplementation(() => false);
    mockUsePublications.mockImplementation(() => [ { trackName: "", kind: "video", on: jest.fn, off: jest.fn } ]);
    render(
      <ParticipantInfo onClick={() => {}} isSelected={false} participant={{ identity: "mockIdentity" } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(screen.queryByText("mockIdentity (You)")).not.toBeInTheDocument();
  });
});
