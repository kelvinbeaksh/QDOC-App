import { FirebaseConfig } from "../../src/config/config";
import { AuthClient, UserRoles } from "../../src/clients/auth-client";
import firebase from "firebase/app";
import "firebase/auth";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import IdTokenResult = firebase.auth.IdTokenResult;

class TestError extends Error {
  public readonly code:string;

  public constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

describe("AuthClient", () => {
  const mockFirebaseConfig: FirebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
  };
  const mockFirebaseApp = {} as firebase.app.App;
  const mockUser = {
    sendEmailVerification: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn()
  } as unknown as firebase.User;
  const mockAuth = {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    useEmulator: jest.fn(),
    currentUser: mockUser
  } as unknown as firebase.auth.Auth;

  beforeEach(() => {
    jest.spyOn(firebase, "initializeApp").mockReturnValue(mockFirebaseApp);
    jest.spyOn(firebase, "auth").mockReturnValue(mockAuth);
  });

  describe("register", () => {
    it("should call firebase with the right params", async () => {
      const authRegisterSpy = jest.spyOn(mockAuth, "createUserWithEmailAndPassword")
        .mockResolvedValue(
          { user: null, credential: null }
        );
      const authClient = new AuthClient(mockFirebaseConfig);
      await authClient.register("email", "password");
      expect(authRegisterSpy).toHaveBeenCalledWith("email", "password");
    });

    describe("errors scenarios", () => {
      it("should return business error when the email is already used", async () => {
        const authError = new TestError("auth/email-already-in-use", "email already in use");
        jest.spyOn(mockAuth, "createUserWithEmailAndPassword")
          .mockRejectedValue(authError);
        const authClient = new AuthClient(mockFirebaseConfig);
        await expect(authClient.register("email", "password")).rejects
          .toThrowError(BusinessError);
      });

      it("should return business error when the email address is not valid", async () => {
        const authError = new TestError("auth/invalid-email", "email already in use");
        jest.spyOn(mockAuth, "createUserWithEmailAndPassword").mockRejectedValue(authError);
        const authClient = new AuthClient(mockFirebaseConfig);
        await expect(authClient.register("email", "password")).rejects
          .toThrowError(BusinessError);
      });

      it("should return technical error when the auth operation-not-allowed", async () => {
        const authError = new TestError("auth/operation-not-allowed", "auth operation not allowed");
        jest.spyOn(mockAuth, "createUserWithEmailAndPassword").mockRejectedValue(authError);
        const authClient = new AuthClient(mockFirebaseConfig);
        await expect(authClient.register("email", "password")).rejects
          .toThrowError(TechnicalError);
      });
    });
  });

  describe("signOut", () => {
    it("should call firebase signOut", async () => {
      const authSignOutSpy = jest.spyOn(mockAuth, "signOut");
      const authClient = new AuthClient(mockFirebaseConfig);

      await authClient.signOut();
      expect(authSignOutSpy).toHaveBeenCalledWith();
    });
  });

  describe("signInWithEmailAndPassword", () => {
    it("should call firebase signInWithEmailAndPassword", async () => {
      const authSignInWithEmailAndPasswordSpy = jest.spyOn(mockAuth, "signInWithEmailAndPassword");
      const authClient = new AuthClient(mockFirebaseConfig);

      await authClient.signInWithEmailAndPassword("email", "password");
      expect(authSignInWithEmailAndPasswordSpy).toHaveBeenCalledWith("email", "password");
    });

    it("should return business error if the password is incorrect", async () => {
      const incorrectPasswordError = new TestError("auth/wrong-password", "incorrect password");
      jest.spyOn(mockAuth, "signInWithEmailAndPassword")
        .mockRejectedValue(incorrectPasswordError);
      const authClient = new AuthClient(mockFirebaseConfig);

      await expect(authClient.signInWithEmailAndPassword("email", "password"))
        .rejects
        .toThrow(BusinessError);
    });

    it("should return business error if the user is disabled", async () => {
      const userDisabledError = new TestError("auth/user-disabled", "user is disabled");
      jest.spyOn(mockAuth, "signInWithEmailAndPassword")
        .mockRejectedValue(userDisabledError);
      const authClient = new AuthClient(mockFirebaseConfig);

      await expect(authClient.signInWithEmailAndPassword("email", "password"))
        .rejects
        .toThrow(BusinessError);
    });

    it("should return technical error if there is other errors", async () => {
      const otherError = new TestError("others", "others");
      jest.spyOn(mockAuth, "signInWithEmailAndPassword")
        .mockRejectedValue(otherError);
      const authClient = new AuthClient(mockFirebaseConfig);

      await expect(authClient.signInWithEmailAndPassword("email", "password"))
        .rejects
        .toThrow(TechnicalError);
    });
  });

  describe("getUserPermissions", () => {
    it("should return the user permissions", async () => {
      jest.spyOn(mockUser, "getIdTokenResult").mockResolvedValue(
        { claims: { "role": "PATIENT", "clinicId": 1 } } as unknown as IdTokenResult
      );
      const authClient = new AuthClient(mockFirebaseConfig);
      const userPermission = await authClient.getUserPermissions();
      expect(userPermission).toEqual({ "role": UserRoles.PATIENT, "clinicId": 1 });
    });

    describe("when there is no role or clinicId", () => {
      it("should return an empty object", async () => {
        jest.spyOn(mockUser, "getIdTokenResult").mockResolvedValue(
          { claims: {} } as unknown as IdTokenResult
        );
        const authClient = new AuthClient(mockFirebaseConfig);
        const userPermission = await authClient.getUserPermissions();
        expect(userPermission).toEqual({});
      });
    });

    describe("when there is no current user", () => {
      it("should return an empty object", async () => {
        mockAuth.currentUser = null;
        const authClient = new AuthClient(mockFirebaseConfig);
        const userPermission = await authClient.getUserPermissions();
        expect(userPermission).toEqual({});
      });
    });
  });
});
