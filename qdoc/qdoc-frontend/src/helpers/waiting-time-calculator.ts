const WAITING_TIME_PER_PAX = 8;

export const waitingTimeCalculator = (numPatients: number): number => {
  if (numPatients === 0) {
    return 0;
  }
  return WAITING_TIME_PER_PAX * numPatients;
};
