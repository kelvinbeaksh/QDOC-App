import React from "react";
import ParticipantTracks from "../../../../src/components/Video/ParticipantTracks/ParticipantTracks";
import usePublications from "../../../../src/hooks/videos/usePublications/usePublications";
import { render, screen } from "@testing-library/react";

jest.mock("../../../../src/hooks/videos/usePublications/usePublications");
jest.mock("../../../../src/components/Video/Publication/Publication", () => ({
  __esModule: true,
  // eslint-disable-next-line react/display-name
  default: ({ publication }) => {
    return <div data-testid='publication'>
      <ul>
        <li>trackName:{publication.trackName}</li>
        <li>kind:{publication.kind}</li>
        <li>trackSid:{publication.trackSid}</li>
      </ul>
    </div>;
  }
}));

const mockUsePublications = usePublications as jest.Mock;

describe("the ParticipantTracks component", () => {
  beforeEach(() => {
    mockUsePublications.mockImplementation(() =>
      [
        { trackSid: 0, kind: "video", trackName: "" },
        { trackSid: 1, kind: "audio", trackName: "" }
      ]);
  });

  it("should render an array of publications", () => {
    render(<ParticipantTracks participant={"mockParticipant" as any} />);
    expect(usePublications).toHaveBeenCalledWith("mockParticipant");
    expect(screen.queryAllByTestId("publication").length).toEqual(2);
  });

  it("should filter out any screen share publications", () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: "screen", trackSid: 0, kind: "video" },
      { trackName: "", trackSid: 1, kind: "video" }
    ]);
    render(<ParticipantTracks participant={"mockParticipant" as any} />);
    expect(screen.queryAllByTestId("publication").length).toEqual(1);
    expect(screen.getByText("trackName:")).toBeInTheDocument();
    expect(screen.getByText("trackSid:1")).toBeInTheDocument();
    expect(screen.getByText("kind:video")).toBeInTheDocument();
  });
  //
  describe("with enableScreenShare prop", () => {
    it("should filter out camera publications when a screen share publication is present", () => {
      mockUsePublications.mockImplementation(() => [
        { trackName: "screen", trackSid: 0, kind: "video" },
        { trackName: "", trackSid: 1, kind: "video" }
      ]);
      render(<ParticipantTracks participant={"mockParticipant" as any} enableScreenShare />);
      expect(screen.queryAllByTestId("publication").length).toEqual(1);
      expect(screen.getByText("trackName:screen")).toBeInTheDocument();
      expect(screen.getByText("trackSid:0")).toBeInTheDocument();
      expect(screen.getByText("kind:video")).toBeInTheDocument();
    });

    it("should render camera publications when a screen share publication is absent", () => {
      mockUsePublications.mockImplementation(() => [ { trackName: "", trackSid: 1, kind: "video" } ]);
      render(<ParticipantTracks participant={"mockParticipant" as any} enableScreenShare />);
      expect(screen.queryAllByTestId("publication").length).toEqual(1);
      expect(screen.getByText("trackName:")).toBeInTheDocument();
      expect(screen.getByText("trackSid:1")).toBeInTheDocument();
      expect(screen.getByText("kind:video")).toBeInTheDocument();
    });
  });
});
