import React from "react";
import HomePage from "../../src/pages/home/HomePage";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ClinicService from "../../src/services/clinic-service";
import { Clinic } from "../../src/types/clinic";
import { HashRouter } from "react-router-dom";

describe("HomePage", () => {
  let spy: jest.SpyInstance;
  const clinic = {
    postalCode: "",
    id: 1,
    name: "clinic-name",
    address: "clinic-address",
    "lat": 12,
    "long": 13
  } as Clinic;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // describe("when there's clinics found", () => {
  //   beforeEach(() => {
  //     spy = jest.spyOn(ClinicService, "getAllClinics").mockResolvedValue([ clinic ]);
  //   });

  it("should render MapComponent", async () => {
    await act(async () => {
      render(
        <HashRouter>
          <HomePage user={undefined}/>
        </HashRouter>
      );
    });
    expect(screen.getByTestId("tele-consult-button")).toBeInTheDocument();
  });

  //   it("should have a button that links to the clinic details page", async () => {
  //     await act(async () => {
  //       render(
  //         <HashRouter>
  //           <HomePage user={undefined}/>
  //         </HashRouter>
  //       );
  //     });
  //     const moreDetailsButton = screen.getByText("Clinic Details");
  //     fireEvent.click(moreDetailsButton);
  //   });
  // });

  // it("should call getClinics to get list of clinics", async () => {
  //   spy = jest.spyOn(ClinicService, "getAllClinics").mockResolvedValue([]);
  //   await act(async () => {
  //     render(
  //       <HomePage user={undefined}/>
  //     );
  //   });
  //   expect(spy).toHaveBeenCalled();
  // });
});
