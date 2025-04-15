import ProtectedRoute from "../../src/components/ProtectedRoutes";
import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { UserRoles } from "../../src/clients/auth-client";

const TestElement = (): ReactElement => {
  return <div>testing</div>;
};

const SignInElement = (): ReactElement => {
  return <div>sign-in</div>;
};

const UnAuthorized = (): ReactElement => {
  return <div>unauthorized</div>;
};

describe("ProtectedRoute", () => {
  const redirectUnAuthenticated = "/sign-in";
  const redirectUnAuthorized = "/sign-in";

  afterEach(() => cleanup());

  it("should redirect to sign in if not authenticated", () => {
    render(
      <MemoryRouter>
        <Route path={redirectUnAuthenticated} component={SignInElement} />
        <ProtectedRoute
          component={TestElement}
          isAuthenticated={false}
          redirectToIfNotAuthenticated={redirectUnAuthenticated}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText("testing")).not.toBeInTheDocument();
    expect(screen.queryByText("sign-in")).toBeInTheDocument();
  });

  it("should render component if authenticated", () => {
    render(
      <MemoryRouter>
        <Route path={redirectUnAuthenticated} component={SignInElement} />
        <ProtectedRoute
          component={TestElement}
          isAuthenticated={true}
          userRole={UserRoles.CLINIC_STAFF}
          user={{ email: "abc@gmail.com", role: UserRoles.CLINIC_STAFF }}
          redirectToIfNotAuthenticated={redirectUnAuthenticated} />
      </MemoryRouter>
    );
    expect(screen.queryByText("testing")).toBeInTheDocument();
    expect(screen.queryByText("sign-in")).not.toBeInTheDocument();
  });

  describe("when there are required roles for the route", () => {
    it("should redirect if not authorized", () => {
      render(
        <MemoryRouter>
          <Route path={redirectUnAuthenticated} component={SignInElement} />
          <Route path={redirectUnAuthenticated} component={UnAuthorized} />
          <ProtectedRoute
            component={TestElement}
            isAuthenticated={true}
            redirectToIfNotAuthenticated={redirectUnAuthenticated}
            redirectToIfNotAuthorized={redirectUnAuthenticated}
            userRole={UserRoles.PATIENT}
            user={{ email: "abc@gmail.com", role: UserRoles.PATIENT }}
            requiredRoles={[ UserRoles.CLINIC_STAFF, UserRoles.DOCTOR ]}
          />
        </MemoryRouter>
      );
      expect(screen.queryByText("testing")).not.toBeInTheDocument();
      expect(screen.queryByText("unauthorized")).toBeInTheDocument();
    });

    it("should render component if it is authorized", () => {
      render(
        <MemoryRouter>
          <Route path={redirectUnAuthenticated} component={SignInElement} />
          <Route path={redirectUnAuthorized} component={UnAuthorized} />
          <ProtectedRoute
            component={TestElement}
            isAuthenticated={true}
            redirectToIfNotAuthenticated={redirectUnAuthenticated}
            userRole={UserRoles.DOCTOR}
            user={{ email: "abc@gmail.com", role: UserRoles.DOCTOR }}
            requiredRoles={[ UserRoles.DOCTOR ]}
          />
        </MemoryRouter>
      );
      expect(screen.queryByText("testing")).toBeInTheDocument();
      expect(screen.queryByText("sign-in")).not.toBeInTheDocument();
    });
  });
});
