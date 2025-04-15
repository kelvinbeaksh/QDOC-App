import React, { ReactElement, useEffect, useState } from "react";
import { Avatar, Card, Descriptions, Row, Space } from "antd";
import { useParams, Redirect } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Patient } from "../../../types/patient";
import PatientService from "../../../services/patient-service";
import { User, getUserId } from "../../../contexts/user-context";

const PatientPage = ({ userId }): ReactElement => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

  const getPatient = async (): Promise<void> => {
    try {
      const fetchedPatient = await PatientService.getPatientById(patientId);
      setPatient(fetchedPatient);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    getPatient();
  }, []);

  if (`${userId}` !== patientId) {
    return (<Redirect to="/" />);
  }

  return (
    patient && (
      <Row justify='center'>
        <Card className='with-shadow'>
          <Space direction='vertical'>
            <Avatar size={70} icon={<UserOutlined />} />
            <Descriptions bordered>
              <Descriptions.Item label='First Name' span={3}>
                {patient.firstName}
              </Descriptions.Item>
              <Descriptions.Item label='Last Name' span={3}>
                {patient.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='Email' span={3}>
                {patient.email}
              </Descriptions.Item>
              <Descriptions.Item label='Mobile Number' span={3}>
                {patient.mobileNumber}
              </Descriptions.Item>
              <Descriptions.Item label='Date Of Birth' span={3}>
                {patient.dateOfBirth}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>
      </Row>
    )
  );
};

export default PatientPage;
