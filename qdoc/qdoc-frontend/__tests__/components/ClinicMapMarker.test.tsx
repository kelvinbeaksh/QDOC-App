import React from "react";
import { render, screen } from "@testing-library/react";
import { ClinicMapMarker } from "../../src/components/ClinicMapMarker";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";

describe("ClinicMapMarker", () => {
  const clinic = {
    id: 1,
    name: "clinic name",
    imageUrl: "http://image.url",
    address: "clinic address",
    lat: 1.4,
    long: 100,
    postalCode: "012345",
    email: "email@email.com",
    phoneNumber: "123456789",
    queues: []
  };

  describe("when clicked", () => {
    let marker: HTMLElement;

    beforeEach(() => {
      render(
        <HashRouter>
          <ClinicMapMarker key={clinic.id} lat={clinic.lat} lng={clinic.long} clinic={clinic}/>
        </HashRouter>
      );
      marker = screen.getByRole("img", { name: /clinic-map-marker/ });
      userEvent.click(marker);
    });
    it("should open the clinic infoWindow", () => {
      expect(marker.className).toContain("ant-popover-open");
    });

    describe("when clicked again", () => {
      beforeEach(() => {
        userEvent.click(marker);
      });
      it("should close the clinic infoWindow", () => {
        expect(marker.className).not.toContain("ant-popover-open");
      });
    });

    describe("when clicked on the circle cross", () => {
      beforeEach(() => {
        const closeCircle = screen.getByRole("img", { name: /close-circle/ });
        userEvent.click(closeCircle);
      });
      it("should close the clinic infoWindow", () => {
        expect(marker.className).not.toContain("ant-popover-open");
      });
    });
  });
});
