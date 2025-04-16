import React from "react";
import { act, render, screen } from "@testing-library/react";
import App from "../src/App";
import { MemoryRouter } from "react-router";
import { mockAxiosInstance } from "../__mocks__/axios";
import ClinicService from "../src/services/clinic-service";
import { Auth } from "../src/services/auth-service";
import { authClient } from "../src/clients/auth-client";

describe("Application root", () => {
  const mockAuth = {
    onAuthStateChanged: jest.fn()
  } as unknown as Auth;

  beforeEach(() => {
    jest.spyOn(ClinicService, "getAllClinics").mockResolvedValue([]);
    jest.spyOn(authClient, "authInstance", "get").mockReturnValue(mockAuth);
  });

  it("renders without crashing", async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: null });

    await act(async () => {
      await render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });
  });
});
