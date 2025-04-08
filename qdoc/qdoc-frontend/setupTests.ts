import '@testing-library/jest-dom/extend-expect';
import crypto from 'crypto'

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});

Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => {
      },
      removeListener: () => {
      }
    };
  }
});


export const mockTrack: any = { stop: jest.fn() };

export const mockMediaDevices = {
    getDisplayMedia: () =>
      Promise.resolve({
        getTracks: jest.fn(() => [ mockTrack ])
      })
} as unknown as MediaDevices;

// @ts-ignore
global.navigator.mediaDevices = mockMediaDevices;


jest.mock("firebase/app", () => {
  return {
    initializeApp: jest.fn(),
    auth: () => {
      return {
        useEmulator: jest.fn()
      };
    }
  };
});
jest.mock('@twilio/video-processors', () => ({}));
// https://github.com/ant-design/ant-design/issues/21096
