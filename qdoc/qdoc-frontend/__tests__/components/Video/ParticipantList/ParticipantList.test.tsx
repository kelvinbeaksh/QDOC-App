import EventEmitter from "events";
import React from "react";
import useVideoContext from "../../../../src/contexts/video-context";
import useSelectedParticipant from "../../../../src/hooks/videos/useSelectedParticipant/useSelectedParticipant";
import useMainParticipant from "../../../../src/hooks/videos/useMainParticipant/useMainParticipant";
import useScreenShareParticipant
  from "../../../../src/hooks/videos/useScreenShareParticipant/useScreenShareParticipant";
import { render, screen } from "@testing-library/react";
import ParticipantList from "../../../../src/components/Video/ParticipantList/ParticipantList";

jest.mock("../../../../src/components/Video/Participant/Participant", () => ({
  __esModule: true,
  // eslint-disable-next-line react/display-name
  default: ({ isSelected, participant, hideParticipant }) => <div data-testid="participant">
    <ul>
      {isSelected ?
        <li>sid:{participant.sid} isSelected:{(isSelected).toString()}</li> :
        <li>sid:{participant.sid} isSelected:false</li>
      }
      {hideParticipant ?
        <li>sid:{participant.sid} hideParticipant:{(hideParticipant).toString()}</li> :
        <li>sid:{participant.sid} hideParticipant:false</li>
      }
    </ul>
  </div>
}));
jest.mock("../../../../src/contexts/video-context");
jest.mock("../../../../src/hooks/videos/useSelectedParticipant/useSelectedParticipant");
jest.mock("../../../../src/hooks/videos/useMainParticipant/useMainParticipant");
jest.mock("../../../../src/hooks/videos/useScreenShareParticipant/useScreenShareParticipant");
const mockedVideoContext = useVideoContext as jest.Mock;
const mockUseSelectedParticipant = useSelectedParticipant as jest.Mock;
const mockUseMainParticipant = useMainParticipant as jest.Mock;
const mockUseScreenShareParticipant = useScreenShareParticipant as jest.Mock;

describe("the ParticipantList component", () => {
  let mockRoom: any;

  beforeEach(() => {
    mockUseSelectedParticipant.mockImplementation(() => [ null, () => {} ]);
    mockRoom = new EventEmitter();
    mockRoom.localParticipant = "localParticipant";
  });

  it("should correctly render Participant components", () => {
    const mockParticipant = { sid: 2 };
    mockUseSelectedParticipant.mockImplementation(() => [ mockParticipant, () => {} ]);
    mockRoom.participants = new Map([
      [ 0, { sid: 0 } ],
      [ 1, { sid: 1 } ],
      [ 2, mockParticipant ]
    ]);

    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.queryAllByTestId("participant").length).toEqual(4);
  });

  it("should add the isSelected prop to the first remote participant when it is selected", () => {
    const mockParticipant = { sid: 0 };
    mockUseSelectedParticipant.mockImplementation(() => [ mockParticipant, () => {} ]);
    mockRoom.participants = new Map([
      [ 0, mockParticipant ],
      [ 1, { sid: 1 } ]
    ]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.getByText("sid:0 isSelected:true")).toBeInTheDocument();
  });

  it("should not render anything when there are no remote particiants", () => {
    mockRoom.participants = new Map([]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.queryAllByTestId("participant").length).toEqual(0);
  });

  it("should add the hideParticipant prop when the participant is the mainParticipant", () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [ 0, mockParticipant ],
      [ 1, { sid: 1 } ]
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.getByText("sid:0 hideParticipant:true")).toBeInTheDocument();
    expect(screen.getByText("sid:1 hideParticipant:false")).toBeInTheDocument();
  });

  it("should not add the hideParticipant prop when the participant " +
    "is the mainParticipant and they are selected", () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [ 0, mockParticipant ],
      [ 1, { sid: 1 } ]
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockUseSelectedParticipant.mockImplementation(() => [ mockParticipant, () => {} ]);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.getByText("sid:0 hideParticipant:false")).toBeInTheDocument();
  });

  it("should not add the hideParticipant prop when the participant is the mainParticipant " +
    "and they are sharing their screen", () => {
    const mockParticipant = { sid: 0 };
    mockRoom.participants = new Map([
      [ 0, mockParticipant ],
      [ 1, { sid: 1 } ]
    ]);
    mockUseMainParticipant.mockImplementation(() => mockParticipant);
    mockUseScreenShareParticipant.mockImplementation(() => mockParticipant);
    mockedVideoContext.mockImplementation(() => ({ room: mockRoom }));
    render(<ParticipantList />);
    expect(screen.getByText("sid:0 hideParticipant:false")).toBeInTheDocument();
  });
});
