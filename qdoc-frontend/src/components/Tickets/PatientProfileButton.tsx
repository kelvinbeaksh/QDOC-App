import React, { ReactElement } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface Props {
  patientId: string;
}

const PatientProfileButton = ({ patientId }: Props): ReactElement<Props> => {
  const patientPage = `/patients/${patientId}`;

  return (
    <Link to={patientPage}>
      <Button shape='round'>Patient Profile</Button>
    </Link>
  );
};

export default PatientProfileButton;
