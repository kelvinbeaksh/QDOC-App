/* eslint-disable @typescript-eslint/return-await */
import { showError } from "../components/Errors/GenericError";

type UnUsed = unknown;

export const GenericErrorWrapper = () => (
  _: UnUsed,
  __: UnUsed,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  const descriptorCopy = { ...descriptor };
  const originalMethod = descriptorCopy.value;
  descriptorCopy.value = async (...args: any[]) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return await originalMethod.apply(this, args);
    } catch (error) {
      showError(error);
      throw error;
    }
  };
  return descriptorCopy;
};
