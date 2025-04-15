import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClinicService from "../../services/clinic-service";
import QueueService from "../../services/queue-service";
import { Clinic } from "../../types/clinic";
import { Queue, QueueStatus } from "../../types/queue";
import ClinicDetailsCard from "../../components/ClinicDetailsCard";
import Title from "antd/lib/typography/Title";
import { Divider, Row, Space } from "antd";

const ClinicDetailsPage = (): React.ReactElement => {
  const { clinicId } = useParams();
  const [ clinic, setClinic ] = useState<Clinic>();
  const [ queue, setQueue ] = useState<Queue>();

  const fetchClinicById = async (id: number): Promise<void> => {
    try {
      setClinic(await ClinicService.getClinicById(id));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQueueByClinicIdAndStatus = async (id: number, status: QueueStatus): Promise<void> => {
    try {
      const fetchedQueues = await QueueService.getQueuesByClinicIdAndStatus(id, status);
      setQueue(fetchedQueues[0]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchClinicById(Number(clinicId));
    fetchQueueByClinicIdAndStatus(Number(clinicId), QueueStatus.ACTIVE);
  }, []);

  return (
    <Row justify="center">
      <Space direction="vertical">
        <Title level={3} style={{ paddingLeft: "10px" }}>Clinic Details</Title>
        <Divider/>

        <ClinicDetailsCard
          key={Number(clinicId)}
          clinic={clinic}
          queue={queue}
        />
      </Space>
    </Row>
  );
};

export default ClinicDetailsPage;
