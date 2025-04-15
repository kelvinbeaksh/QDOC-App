import { Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import ClinicsPage from "../pages/clinics/ClinicsPage";
import ProtectedRoute from "../components/ProtectedRoutes";
import ClinicDetailsPage from "../pages/clinics/ClinicDetailsPage";
import ClinicTicketsPage from "../pages/clinic-tickets/ClinicTicketsPage";
import ClinicAppointmentsPage from "../pages/clinic-appointments/ClinicAppointmentsPage";
import QueueDetails from "../pages/queues/QueueDetailsPage";
import QueuesPage from "../pages/queues/QueuesPage";
import TicketDetailsPage from "../pages/tickets/TicketDetailsPage";
import DoctorPage from "../pages/accounts/doctors/DoctorPage";
import { UserRoles } from "../clients/auth-client";
import PatientPage from "../pages/accounts/patients/PatientPage";
import React from "react";
import { User } from "../contexts/user-context";

const mainRoutes = (user: User, isAuthenticated: boolean) => {
  return [
    <Route key='home' path='/' exact render={() => <HomePage user={user} />} />,

    <ProtectedRoute
      key='clinics'
      path='/clinics'
      exact
      component={ClinicsPage}
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/clinics/:clinicId'
      exact
      component={ClinicDetailsPage}
      key='clinic-details'
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/clinics/:clinicId/tickets'
      exact
      component={ClinicTicketsPage}
      key='clinic-tickets'
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/clinics/:clinicId/appointments'
      exact
      component={ClinicAppointmentsPage}
      key='clinic-appointments'
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/clinics/:clinicId/queues/:queueId'
      exact
      component={QueueDetails}
      key='clinic-queue-details'
      isAuthenticated={isAuthenticated}
      userRole={user.role}
      user={user}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      key='clinic-queues'
      component={QueuesPage}
      userRole={user.role}
      user={user}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
      path='/clinics/:clinicId/queues'
      exact
    />,

    <ProtectedRoute
      path='/tickets/:ticketId'
      exact
      component={TicketDetailsPage}
      key='ticket-details'
      isAuthenticated={isAuthenticated}
      userRole={user.role}
      user={user}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/doctors/:doctorId'
      exact
      component={DoctorPage}
      key='doctor-account'
      userRole={user.role}
      user={user}
      requiredRoles={[UserRoles.DOCTOR]}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />,

    <ProtectedRoute
      path='/patients/:patientId'
      exact
      component={PatientPage}
      key='patient-account'
      userRole={user.role}
      user={user}
      requiredRoles={[UserRoles.PATIENT, UserRoles.DOCTOR]}
      isAuthenticated={isAuthenticated}
      redirectToIfNotAuthenticated='/sign-in'
    />
  ];
};

export default mainRoutes;
