import { render, screen } from "@testing-library/react";
import React from "react";
import { HashRouter } from "react-router-dom";
import Sider from "../../../src/layout/sider/Sider";
import { UserRoles } from "../../../src/clients/auth-client";

describe("Sider", () => {
  // describe("when the user is a patient", () => {
  //   const patient = { isAuthenticated: true, role: UserRoles.PATIENT };
  //   it("should list all the expected link", () => {
  //     render(
  //       <HashRouter>
  //         <Sider user={patient}/>
  //       </HashRouter>
  //     );
  //     expect(screen.getByRole("link", { name: "Find My GP" })).toBeInTheDocument();
  //     expect(screen.getByRole("link", { name: "Clinics" })).toBeInTheDocument();
  //     expect(screen.getByRole("link", { name: "Next Available GP" })).toBeInTheDocument();
  //   });
  // });

  // describe("when there is no user", () => {
  //   it("should list all the expected link", () => {
  //     render(
  //       <HashRouter>
  //         <Sider user={undefined}/>
  //       </HashRouter>
  //     );
  //     expect(screen.getByRole("link", { name: "Find My GP" })).toBeInTheDocument();
  //     expect(screen.getByRole("link", { name: "Clinics" })).toBeInTheDocument();
  //     expect(screen.getByRole("link", { name: "Next Available GP" })).toBeInTheDocument();
  //   });
  // });
  describe("when the user is a clinic staff or doctor", () => {
    const doctor = {
      email: "doc@gmail.com",
      role: UserRoles.DOCTOR,
      clinicId: 1,
      doctorId: 1
    };
    it("should list all the expected link", async () => {
      render(
        <HashRouter>
          <Sider user={doctor}/>
        </HashRouter>
      );
      expect(screen.getByRole("link", { name: "My Clinic" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Clinic Tickets" })).toBeInTheDocument();
    });
  });
});
