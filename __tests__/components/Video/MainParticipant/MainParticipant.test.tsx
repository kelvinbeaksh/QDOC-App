import React from "react";
import useMainParticipant from "../../../../src/hooks/videos/useMainParticipant/useMainParticipant";
import useSelectedParticipant from "../../../../src/hooks/videos/useSelectedParticipant/useSelectedParticipant";
import useScreenShareParticipant
  from "../../../../src/hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import useVideoContext from "../../../../src/contexts/video-context";
import { render, screen } from "@testing-library/react";
import MainParticipant from "../../../../src/components/Video/MainParticipant/MainParticipant";

jest.mock("../../../../src/hooks/videos/useMainParticipant/useMainParticipant");
jest.mock("../../../../src/hooks/videos/useSelectedParticipant/useSelectedParticipant");
jest.mock("../../../../src/hooks/videos/useScreenShareParticipant/useScreenShareParticipant");
jest.mock("../../../../src/contexts/video-context");
jest.mock("../../../../src/components/Video/ParticipantTracks/ParticipantTracks",
  () => {
    return {
      __esModule: true,
      // eslint-disable-next-line react/display-name
      default: ({ enableScreenShare, videoPriority, isLocalParticipant }) => {
        return <div data-testid='participant-tracks'>
          <ul>
            {videoPriority ? <li>videoPriority:{videoPriority}</li> : <li>empty videoPriority</li>}
            <li>enableScreenShare {enableScreenShare.toString()}</li>
            <li>isLocalParticipant {isLocalParticipant.toString()}</li>
          </ul>
        </div>;
      }
    };
  });

jest.mock("../../../../src/components/Video/MainParticipantInfo/MainParticipantInfo",
  () => {
    return {
      __esModule: true,
      // eslint-disable-next-line react/display-name
      default: ({ children }) => {
        return <div data-testid='main-participant-info'>{children}</div>;
      }
    };
  });

const mockUseMainParticipant = useMainParticipant as jest.Mock;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock;
const mockUseVideoContext = useVideoContext as jest.Mock;

const mockLocalParticipant = {};

describe("the MainParticipant component", () => {
  beforeEach(() => {
    mockUseVideoContext.mockImplementation(() => ({
      room: {
        localParticipant: mockLocalParticipant
      }
    }));
  });

  it("should set the videoPriority to high when the main participant is the selected participant", () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [ mockParticipant ]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    render(<MainParticipant />);
    expect(screen.getByTestId("participant-tracks")).toBeInTheDocument();
    expect(screen.getByText("videoPriority:high")).toBeInTheDocument();
  });

  it("should set the videoPriority to high when the main participant is sharing their screen", () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [ {} ]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => mockParticipant);
    render(<MainParticipant />);
    expect(screen.getByTestId("participant-tracks")).toBeInTheDocument();
    expect(screen.getByText("videoPriority:high")).toBeInTheDocument();
  });

  describe("when the main participant is the localParticipant", () => {
    beforeEach(() => {
      const mockParticipant = {};
      mockUseMainParticipant.mockImplementation(() => mockParticipant);
      mockUseSelectedParticipant.mockImplementation(() => [ {} ]);
      mockUseScreenShareParticipant.mockImplementation(() => mockParticipant);
      mockUseVideoContext.mockImplementation(() => ({
        room: {
          localParticipant: mockParticipant
        }
      }));

      render(<MainParticipant />);
    });

    it("should not set the videoPriority", () => {
      expect(screen.getByText("empty videoPriority")).toBeInTheDocument();
    });

    it("should set the enableScreenShare prop to false", () => {
      expect(screen.getByText("enableScreenShare false")).toBeInTheDocument();
    });

    it("should set the isLocalParticipant prop to true", () => {
      expect(screen.getByText("isLocalParticipant true")).toBeInTheDocument();
    });
  });

  it("should set the videoPriority to null when the main participant " +
    "is not the selected participant and they are not sharing their screen", () => {
    const mockParticipant = {};
    mockUseMainParticipant.mockImplementationOnce(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementationOnce(() => [ {} ]);
    mockUseScreenShareParticipant.mockImplementationOnce(() => ({}));
    render(<MainParticipant />);
    expect(screen.getByText("empty videoPriority")).toBeInTheDocument();
  });
});
