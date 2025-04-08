import React, { createContext, useContext, useState, useEffect } from "react";
import { Participant, Room } from "twilio-video";

type SelectedParticipantContextType = [Participant | null, (participant: Participant) => void];

export const selectedParticipantContext = createContext<SelectedParticipantContextType>(null!);

const useSelectedParticipant = () => {
  const [ selectedParticipant, setSelectedParticipant ] = useContext(selectedParticipantContext);
  return [ selectedParticipant, setSelectedParticipant ] as const;
};

export default useSelectedParticipant;

type SelectedParticipantProviderProps = {
  room: Room | null;
  children: React.ReactNode;
};

export const SelectedParticipantProvider = ({ room, children }: SelectedParticipantProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [ selectedParticipant, _setSelectedParticipant ] = useState<Participant | null>(null);
  const setSelectedParticipant = (participant: Participant) =>
    _setSelectedParticipant(prevParticipant => (prevParticipant === participant ? null : participant));

  useEffect(() => {
    if (room) {
      const onDisconnect = () => _setSelectedParticipant(null);
      const handleParticipantDisconnected = (participant: Participant) =>
        _setSelectedParticipant(prevParticipant => (prevParticipant === participant ? null : prevParticipant));

      room.on("disconnected", onDisconnect);
      room.on("participantDisconnected", handleParticipantDisconnected);
      return () => {
        room.off("disconnected", onDisconnect);
        room.off("participantDisconnected", handleParticipantDisconnected);
      };
    }
    return () => {};
  }, [ room ]);

  return (
    <selectedParticipantContext.Provider value={[ selectedParticipant, setSelectedParticipant ]}>
      {children}
    </selectedParticipantContext.Provider>
  );
};
