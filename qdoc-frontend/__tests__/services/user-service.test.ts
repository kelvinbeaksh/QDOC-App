import AuthService, { UserCredential } from "../../src/services/auth-service";
import UserService from "../../src/services/user-service";
import { UserRoles } from "../../src/clients/auth-client";
import { apiClient } from "../../src/clients/api-client";
import * as GenericError from "../../src/components/Errors/GenericError";

describe("UserService", () => {
  const formValues = {
    firstName: "firstName",
    lastName: "lastName",
    mobileNumber: "91234321",
    mobileInternationalCode: "+65",
    email: "hello@gmail.com",
    password: "password",
    passwordConfirmation: "password",
    dateOfBirth: "2020-01-01",
    clinicId: "1"
  };
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(jest.clearAllMocks);

  describe("#signUp", () => {
    describe("success scenarios", () => {
      beforeEach(() => {
        jest.spyOn(AuthService, "register").mockResolvedValue({ user: { uid: "auth-id" } } as UserCredential);
      });

      it("should call Auth service to register user with the correct params", async () => {
        jest.spyOn(apiClient, "post").mockResolvedValue({});

        await UserService.signUp(UserRoles.PATIENT, formValues);
        expect(AuthService.register).toHaveBeenCalledWith(formValues.email, formValues.password);
      });

      it.each([
        [ UserRoles.PATIENT, "/patients" ],
        [ UserRoles.ADMIN, "/admins" ],
        [ UserRoles.CLINIC_STAFF, "/clinic-staffs" ]
      ])("should call apiClient with the correct params to create %s",
        async (role, path) => {
          jest.spyOn(apiClient, "post").mockResolvedValue({});

          await UserService.signUp(role, formValues);
          expect(apiClient.post).toHaveBeenCalledWith(path,
            {
              "authId": "auth-id",
              "email": "hello@gmail.com",
              "firstName": "firstName",
              "lastName": "lastName",
              "mobileNumber": "+6591234321",
              "dateOfBirth": "2020-01-01"
            });
        });

      it("should call apiClient with the expected params to create Doctor", async () => {
        jest.spyOn(apiClient, "post").mockResolvedValue({});

        await UserService.signUp(UserRoles.DOCTOR, formValues);
        expect(apiClient.post).toHaveBeenCalledWith("/doctors",
          {
            "authId": "auth-id",
            "email": "hello@gmail.com",
            "firstName": "firstName",
            "lastName": "lastName",
            "mobileNumber": "+6591234321",
            "dateOfBirth": "2020-01-01",
            "clinicId": 1
          });
      });
    });

    describe("error scenarios", () => {
      describe("when AuthService register errors", () => {
        it("should show the errorNotification", async () => {
          jest.spyOn(AuthService, "register").mockRejectedValue(new Error("test"));
          const spy = jest.spyOn(GenericError, "showError");
          await expect(UserService.signUp(UserRoles.PATIENT, formValues))
            .rejects
            .toThrowError(new Error("test"));

          expect(spy).toHaveBeenCalled();
        });
      });

      describe("when apiClient errors", () => {
        beforeEach(() => {
          jest.spyOn(AuthService, "register").mockResolvedValue({ user: { uid: "auth-id" } } as UserCredential);
          jest.spyOn(apiClient, "post").mockRejectedValue(new Error("test"));
        });
        it("should call AuthService deletes", async () => {
          const spy = jest.spyOn(AuthService, "delete").mockResolvedValue(undefined);

          await expect(UserService.signUp(UserRoles.PATIENT, formValues))
            .rejects
            .toThrowError(Error);
          expect(spy).toHaveBeenCalled();
        });

        describe("when AuthService deletes errors", () => {
          it("should show the error notification", async () => {
            const spy = jest.spyOn(GenericError, "showError");
            jest.spyOn(AuthService, "delete").mockRejectedValue(new Error("error deleting"));
            await expect(UserService.signUp(UserRoles.PATIENT, formValues))
              .rejects
              .toThrowError(new Error("error deleting"));

            expect(spy).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
