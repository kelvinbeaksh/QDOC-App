import AuthService from "../../src/services/auth-service";
import { authClient, UserRoles } from "../../src/clients/auth-client";
import firebase from "firebase";
import TechnicalError from "../../src/errors/technical-error";
import * as GenericError from "../../src/components/Errors/GenericError";

describe("AuthService", () => {
  const mockUserCredential = {} as firebase.auth.UserCredential;

  beforeEach(jest.clearAllMocks);

  describe("register", () => {
    it("should call authClient register with the right params", async () => {
      const spy = jest.spyOn(authClient, "register").mockResolvedValue(mockUserCredential);
      await AuthService.register("email", "password");
      expect(spy).toHaveBeenCalledWith("email", "password");
    });

    it("should return an error when authClient register errors", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(authClient, "register").mockRejectedValue(expectedError);
      await expect(AuthService.register("email", "password")).rejects
        .toThrow(new TechnicalError("error"));
    });
  });

  describe("delete", () => {
    it("should call authClient delete with firebase user to delete", async () => {
      const spy = jest.spyOn(authClient, "delete").mockResolvedValue();
      await AuthService.delete({ uid: "some-uid-auth" } as firebase.User);
      expect(spy).toHaveBeenCalledWith({ uid: "some-uid-auth" });
    });

    it("should return an error when authClient delete errors", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(authClient, "delete").mockRejectedValue(expectedError);
      await expect(AuthService.delete({ uid: "some-uid-auth" } as firebase.User)).rejects
        .toThrow(new TechnicalError("error"));
    });
  });

  describe("signOut", () => {
    it("should call authClient signOut", async () => {
      const spy = jest.spyOn(authClient, "signOut").mockResolvedValue(undefined);
      await AuthService.signOut();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should return an error when authClient signOut errors", async () => {
      const expectedError = new TechnicalError("error");
      const spy = jest.spyOn(GenericError, "showError");
      jest.spyOn(authClient, "signOut").mockRejectedValue(expectedError);
      await expect(AuthService.signOut()).rejects
        .toThrow(TechnicalError);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("signInWithEmailAndPassword", () => {
    it("should call authClient signInWithEmailAndPassword", async () => {
      const spy = jest.spyOn(authClient, "signInWithEmailAndPassword").mockResolvedValue(mockUserCredential);
      await AuthService.signInWithEmailAndPassword("email", "password");
      expect(spy).toHaveBeenCalledWith("email", "password");
    });

    it("should call showError when authClient signInWithEmailAndPassword errors", async () => {
      const expectedError = new TechnicalError("error");
      jest.spyOn(authClient, "signInWithEmailAndPassword").mockRejectedValue(expectedError);
      const spy = jest.spyOn(GenericError, "showError");
      await expect(AuthService.signInWithEmailAndPassword("email", "password")).rejects
        .toThrow(TechnicalError);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserPermissions", () => {
    it("should call authClient.getUserPermissions", async () => {
      jest.spyOn(authClient, "getUserPermissions").mockResolvedValue(
        { "role": UserRoles.PATIENT, "patientId": 1 }
      );
      const userPermission = await AuthService.getUserPermissions();
      expect(userPermission).toEqual({ "role": UserRoles.PATIENT, "patientId": 1 });
    });

    it("should throw TechnicalError when authClient.getUserPermissions errors", async () => {
      jest.spyOn(authClient, "getUserPermissions").mockRejectedValue(
        new Error("test")
      );
      await expect(AuthService.getUserPermissions()).rejects.toEqual(new TechnicalError("test"));
    });
  });
});
