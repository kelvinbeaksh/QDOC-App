import React, { ReactElement, useEffect, useState } from "react";
import { Avatar, Card, Descriptions, Row, Space, Tag } from "antd";
import { useParams, Link } from "react-router-dom";
import DoctorService from "../../../services/doctor-service";
import { Doctor } from "../../../types/doctor";
import { UserOutlined } from "@ant-design/icons";

const OnDutyTag = (props: { onDuty: boolean }): ReactElement => {
  const tagColor = props.onDuty ? "success" : "warning";
  const onDuty = props.onDuty ? "ON DUTY" : "OFF DUTY";
  return <Tag color={tagColor}>{onDuty}</Tag>;
};

const DoctorPage = (): ReactElement => {
  const { doctorId } = useParams();
  const [ doctor, setDoctor ] = useState<Doctor | null>(null);

  const getDoctor = async (): Promise<void> => {
    try {
      const fetchedDoctor = await DoctorService.getDoctorById(doctorId);
      setDoctor(fetchedDoctor);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  return (doctor &&
    <Row justify="center">
      <Card className='with-shadow'>

        <Space direction="vertical">
          <Avatar size={70} icon={<UserOutlined />} />

          <Descriptions bordered>
            <Descriptions.Item label="First Name" span={3}>{doctor.firstName}</Descriptions.Item>
            <Descriptions.Item label="Last Name" span={3}>{doctor.lastName}</Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>{doctor.email}</Descriptions.Item>
            <Descriptions.Item label="Mobile Number" span={3}>{doctor.mobileNumber}</Descriptions.Item>
            <Descriptions.Item label="On Duty" span={3}>
              <OnDutyTag onDuty={doctor.onDuty}/>
            </Descriptions.Item>
            <Descriptions.Item label="Date Of Birth" span={3}>{doctor.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Clinic" >
              <Link to={`/clinics/${doctor.clinicId}`}>Clinic Info</Link></Descriptions.Item>
            <Descriptions.Item label="Queue">
              <Link to={`/clinics/${doctor.clinicId}/queues/${doctor.queueId}`}>Queue Info</Link></Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </Row>
  );
};

export default DoctorPage;
