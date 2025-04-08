import { render, screen } from "@testing-library/react";
import React from "react";
import ClinicsMap from "../../src/components/ClinicsMap";

describe("ClinicMap", () => {
  const clinics = [ {
    id: 1,
    name: "Clinic name",
    address: "Clinic address",
    lat: 1.01,
    long: 100,
    postalCode: "012345",
    email: "email@email.com",
    phoneNumber: "0123456"
  } ];

  beforeAll(() => {
    render(<ClinicsMap clinics={clinics}/>);
  });

  it("should render map with markers", () => {
    expect(screen.getByRole("img", {
      name: /clinic-map-marker/i
    })).toBeInTheDocument();
  });
});
