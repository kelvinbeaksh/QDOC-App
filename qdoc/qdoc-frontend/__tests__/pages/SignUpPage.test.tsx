import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import firebase from "firebase";
import { when } from "jest-when";
import React from "react";
import { MemoryRouter } from "react-router";
import { apiClient } from "../../src/clients/api-client";
import SignUpPage from "../../src/pages/SignUpPage";
import AuthService from "../../src/services/auth-service";
import { UserRoles } from "../../src/clients/auth-client";
import ClinicService from "../../src/services/clinic-service";
import { Clinic } from "../../src/types/clinic";
import MobileService, { VerifyMobilePhone } from "../../src/services/mobile-service";

describe("Signup page test", () => {
  let emailInput;
  let passwordInput;
  let passwordConfirmationInput;
  let firstNameInput;
  let lastNameInput;
  let mobileNumberInput;
  let getOtpBtn;
  let verifyOtpBtn;
  let otpInput;
  let tnCInput;
  let registerButton;
  const validPassword = "Password@123";
  const validMobileNumber = "91231234";
  const validEmail = "123@gmail.com";
  const validFirstName = "first Name";
  const validLastName = "lastName";

  describe("when the user who signup is a patient", () => {
    beforeEach(async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(console, "warn").mockImplementation(() => {});
      await act(async () => {
        render(
          <MemoryRouter>
            <SignUpPage role={UserRoles.PATIENT} />
          </MemoryRouter>
        );
      });
      emailInput = screen.getByRole("textbox", { name: "email" });
      passwordInput = screen.getByLabelText("password");
      passwordConfirmationInput = screen.getByLabelText("password-confirmation");
      tnCInput = screen.getByRole("switch", { name: "terms-and-conditions" });
      registerButton = screen.getByRole("button", { name: "Register" });
      firstNameInput = screen.getByRole("textbox", { name: "firstName" });
      lastNameInput = screen.getByRole("textbox", { name: "lastName" });
      mobileNumberInput = screen.getByRole("textbox", { name: "mobileNumber" });
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.type(passwordConfirmationInput, validPassword);
      userEvent.type(firstNameInput, validFirstName);
      userEvent.type(lastNameInput, validLastName);
      userEvent.type(mobileNumberInput, validMobileNumber);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("renders the Sign Up title and description", () => {
      const signUpText = screen.getByText("Sign up");
      const signUpDescription = screen.getByText("Create your Account");
      expect(signUpText).toBeInTheDocument();
      expect(signUpDescription).toBeInTheDocument();
    });

    it("should render Link button to navigate to Sign In page", () => {
      expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    });

    it("has the terms and condition set to false on load", () => {
      expect(screen.getByRole("switch", { name: "terms-and-conditions" })).not.toBeChecked();
    });

    it("has the date of birth field", () => {
      expect(screen.getByRole("textbox", { name: /date of birth/i })).toBeInTheDocument();
    });

    describe.skip("when the form is valid", () => {
      beforeEach(() => {
        jest.spyOn(AuthService, "register")
          .mockResolvedValue({ user: { uid: "some-uid" } } as firebase.auth.UserCredential);
        jest.spyOn(MobileService, "checkVerificationToken")
          .mockResolvedValue({ valid: true } as VerifyMobilePhone);
        jest.spyOn(MobileService, "sendVerificationToken")
          .mockResolvedValue({ status: "pending" } as VerifyMobilePhone);
      });

      it("should send a request to AuthService", async () => {
        when(jest.spyOn(apiClient, "post")).calledWith("/patients", expect.anything()).mockResolvedValueOnce({});

        otpInput = screen.getByRole("textbox", { name: "otpInput" });
        getOtpBtn = screen.getByRole("button", { name: /get otp/i });
        verifyOtpBtn = screen.getByRole("button", { name: /verify otp/i });
        userEvent.type(otpInput, "123123");

        userEvent.click(tnCInput);
        userEvent.click(registerButton);
        userEvent.click(verifyOtpBtn);
        await waitFor(() => {
          expect(AuthService.register).toHaveBeenCalledTimes(1);
        });
      });

      it("should send a request to PatientService to allow patient to sign up", async () => {
        when(jest.spyOn(apiClient, "post")).calledWith("/patients", expect.anything()).mockResolvedValueOnce({});

        userEvent.click(tnCInput);
        userEvent.click(registerButton);
        await waitFor(() => {
          expect(apiClient.post).toHaveBeenCalledTimes(1);
          expect(apiClient.post).toHaveBeenCalledWith("/patients",
            { "authId": "some-uid",
              "email": "123@gmail.com",
              "firstName": "first Name",
              "lastName": "lastName",
              "mobileNumber": "91231234" });
        });
      });
    });

    describe("when the form is not valid", () => {
      it("should alert that the password do not match", async () => {
        userEvent.type(passwordConfirmationInput, "123");
        await waitFor(() => {
          expect(
            screen.getByText("The two passwords that you entered do not match!")
          ).toBeInTheDocument();
        });
      });

      it("should alert that the email is not valid", async () => {
        userEvent.type(emailInput, "123");
        await waitFor(() => {
          expect(screen.getByText("The input is not a valid email address")).toBeInTheDocument();
        });
      });

      it("should alert that the password does not requirements", async () => {
        fireEvent.change(passwordInput, { target: { value: "123123123" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "Include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the first name should only have alphabetical characters", async () => {
        fireEvent.change(firstNameInput, { target: { value: "9" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "First name should only have alphabetical characters"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the last name should only have alphabetical characters", async () => {
        fireEvent.change(lastNameInput, { target: { value: "10" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "Last name should only have alphabetical characters"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the mobileNumber is invalid when it has alphabetical chars", async () => {
        fireEvent.change(mobileNumberInput, { target: { value: "asd" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "The mobile number is invalid"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the mobileNumber is invalid when it has country code", async () => {
        fireEvent.change(mobileNumberInput, { target: { value: "+6598989831" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "The mobile number is invalid"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the mobileNumber is invalid when it has more than 8 number", async () => {
        fireEvent.change(mobileNumberInput, { target: { value: "989898310" } });
        await waitFor(() => {
          expect(
            screen.getByText(
              "The mobile number is invalid"
            )
          ).toBeInTheDocument();
        });
      });

      it("should alert that the terms and conditions is not checked", async () => {
        // check
        userEvent.click(tnCInput);
        // uncheck
        userEvent.click(tnCInput);

        await waitFor(() => {
          expect(screen.getByText(/please agree to the terms and conditions/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe("when the user who signup is a doctor", () => {
    beforeEach(async () => {
      jest.spyOn(ClinicService, "getAllClinics").mockResolvedValue([ { id: 1, name: "clinic 1" } as Clinic ]);

      await act(async () => {
        render(
          <MemoryRouter>
            <SignUpPage role={UserRoles.DOCTOR} />
          </MemoryRouter>
        );
      });
      jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    it("should render the clinic selection", () => {
      const clinicSelection = screen.getByRole("combobox", { name: "Clinic" });
      expect(clinicSelection).toBeInTheDocument();
    });
  });
});
