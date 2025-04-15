/* eslint-disable react/display-name */
import React, { useContext } from "react";
import { fetchUserContextFromLocalStorage, UserContext, UserContextProvider } from "../../src/contexts/user-context";
import { renderHook } from "@testing-library/react-hooks";
import { Auth } from "../../src/services/auth-service";
import { authClient, UserRoles } from "../../src/clients/auth-client";
import LocalStorageService from "../../src/services/local-storage-service";

describe("UserContext", () => {
  const mockAuth = {
    onAuthStateChanged: jest.fn()
  } as unknown as Auth;

  beforeEach(() => {
    jest.spyOn(authClient, "authInstance", "get").mockReturnValue(mockAuth);
  });

  it("should call AuthService to get user info", () => {
    const spy = jest.spyOn(mockAuth, "onAuthStateChanged");
    renderHook(() => useContext(UserContext), {
      wrapper: ({ children }) =>
        <UserContextProvider>
          {children}
        </UserContextProvider>
    });
    expect(spy).toBeCalled();
  });

  it("should call AuthService to get userPermission", () => {
    const spy = jest.spyOn(mockAuth, "onAuthStateChanged");
    renderHook(() => useContext(UserContext), {
      wrapper: ({ children }) =>
        <UserContextProvider>
          {children}
        </UserContextProvider>
    });
    expect(spy).toBeCalled();
  });

  describe("fetchUserContextFromLocalStorage", () => {
    describe("when there is no user cached", () => {
      it("should return the expected user context", () => {
        jest.spyOn(LocalStorageService, "getValue").mockReturnValue(null);
        expect(fetchUserContextFromLocalStorage()).toMatchObject((
          {
            user: {
              email: "",
              role: null,
              clinicId: null,
              authId: null
            },
            isAuthenticated: false
          }
        ));
      });
    });

    describe("when there is user cached", () => {
      it("should return the expected user context", () => {
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce("true");
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce("email@gmail.com");
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce(UserRoles[UserRoles.DOCTOR]);
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce("1");
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce("authId");
        jest.spyOn(LocalStorageService, "getValue").mockReturnValueOnce("2");
        expect(fetchUserContextFromLocalStorage()).toMatchObject((
          {
            user: {
              email: "email@gmail.com",
              role: UserRoles.DOCTOR,
              clinicId: 1,
              authId: "authId",
              doctorId: 2
            },
            isAuthenticated: true
          }
        ));
      });
    });
  });
});
