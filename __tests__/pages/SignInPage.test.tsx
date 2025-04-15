import React from "react";
import { MemoryRouter } from "react-router";
import SignInPage from "../../src/pages/SignInPage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthService from "../../src/services/auth-service";
import firebase from "firebase";

describe("SignInPage", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SignInPage/>
      </MemoryRouter>
    );
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should have a link to sign up page", () => {
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("should have a link to forgot password", () => {
    expect(screen.getByRole("link", { name: /forgot password/i })).toBeInTheDocument();
  });

  it("should have the necessary fields to sign in", () => {
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
  });

  describe("when the form is filled", () => {
    let emailInput: HTMLElement;
    let passwordInput: HTMLElement;
    let loginBtn: HTMLElement;
    let authServiceSignInSpy;
    const mockUserCredential = {} as firebase.auth.UserCredential;

    beforeEach(() => {
      emailInput = screen.getByRole("textbox", { name: /email/i });
      passwordInput = screen.getByLabelText("password");
      loginBtn = screen.getByRole("button", { name: /login/i });
      userEvent.type(emailInput, "123@gmail.com");
      userEvent.type(passwordInput, "password");
    });

    it("should call AuthService signInWithEmailAndPassword when login is clicked", async () => {
      authServiceSignInSpy = jest.spyOn(AuthService, "signInWithEmailAndPassword")
        .mockResolvedValue(mockUserCredential);
      userEvent.click(loginBtn);
      await waitFor(() => {
        expect(authServiceSignInSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
