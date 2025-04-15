import React, { ReactElement } from "react";
import { Button, Card, Col } from "antd";
import { Clinic } from "../types/clinic";
import { Queue } from "../types/queue";
import { User, useUserContext } from "../contexts/user-context";
import ClinicDetails from "./ClinicDetails";
import { UserRoles } from "../clients/auth-client";
import { Link } from "react-router-dom";

type ClinicDetailsCardProps = {
  clinic: Clinic
  queue: Queue
};

const ClinicDetailsCard = ({ clinic, queue }: ClinicDetailsCardProps): ReactElement => {
  const { user } = useUserContext();

  const isAbleToManageQueue = (user: User): boolean => {
    return [ UserRoles.ADMIN, UserRoles.CLINIC_STAFF, UserRoles.DOCTOR ].includes(user.role);
  };

  const isPatient = (user: User): boolean => {
    return UserRoles.PATIENT === user.role;
  };

  if (!clinic) {
    return (
      <Card
        className='white-bg'
        size='default'>
        No Clinic Found
      </Card>);
  }
  return (<Col xs={18} sm={18} lg={18} xl={18} key={clinic.id}>
    <Card
      key={clinic.id}
      className='white-bg'
      style={{ width: "100%" }}
    >
      <div>
        <img
          width='400' src={"/content/department-1.jpg"}
          height='400' alt='clinic-img' />
      </div>

      <div>
        <h4>{clinic.name}</h4>
        <p>{clinic.address}</p>
        <p>Singapore {clinic.postalCode}</p>
      </div>

      {isPatient(user) && <ClinicDetails queue={queue} user={user} />}
      {isAbleToManageQueue(user) &&
        <Link to={`/clinics/${clinic.id}/queues`}>
          <Button type='primary' style={{ marginTop: 15 }}> Manage Queue </Button>
        </Link>
      }
    </Card>
  </Col>
  );
};

export default ClinicDetailsCard;
