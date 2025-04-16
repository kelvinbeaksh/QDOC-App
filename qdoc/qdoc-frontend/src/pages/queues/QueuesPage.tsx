/* eslint-disable no-console */
import { Button, Divider, Row, Space } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QueuesTable from "../../layout/components/queuesTable/QueuesTable";
import QueueService from "../../services/queue-service";
import { Queue, QueueStatus, QueueTable } from "../../types/queue";
import CreateQueueForm, { CreateQueueFormValues } from "../../components/Queues/CreateQueueForm";
import Title from "antd/lib/typography/Title";
import ClinicService from "../../services/clinic-service";
import { Clinic } from "../../types/clinic";

interface QueuesPageProps {
  clinicIdProps?: number
}

const QueuesPage = ({ clinicIdProps }: QueuesPageProps): ReactElement => {
  const { clinicId } = useParams() as any;
  const fetchClinicId = clinicId || clinicIdProps;
  const [ refreshData, setRefreshData ] = useState<boolean>(false);
  const [ queues, setQueues ] = useState<Queue[]>([]);
  const [ clinic, setClinic ] = useState<Clinic | null>();

  const getClinic = async (): Promise<void> => {
    try {
      const clinicData = await ClinicService.getClinicById(fetchClinicId);
      setClinic(clinicData);
    } catch (e) {
      console.error("getClinic threw error");
    }
  };

  const getQueues = async (): Promise<void> => {
    try {
      const queuesData = await QueueService.getQueuesForClinic(fetchClinicId);
      setQueues(queuesData);
    } catch (e) {
      console.error("getQueues threw error");
    }
  };

  useEffect(() => {
    getClinic();
    getQueues();
  }, [ refreshData ]);

  const createQueue = async (values: CreateQueueFormValues): Promise<void> => {
    setRefreshData(false);
    try {
      await QueueService.createQueueForClinic(fetchClinicId, values.doctorId);
    } catch (error) {
      console.error("addQueue threw error");
    }
    setRefreshData(true);
  };

  // const updateQueue = async (queueId: number, status: QueueStatus): Promise<void> => {
  //   try {
  //     setRefreshData(false);
  //     await QueueService.update(queueId, { clinicId: fetchClinicId, status });
  //     setRefreshData(true);
  //   } catch (error) {
  //     console.error(`updateQueue threw error for queue id ${queueId} and clinicId: ${fetchClinicId}`, error);
  //   }
  // };

  // const startQueue = async (queue: QueueTable): Promise<void> => updateQueue(queue.id, QueueStatus.ACTIVE);

  // const pauseQueue = async (queue: QueueTable): Promise<void> => updateQueue(queue.id, QueueStatus.INACTIVE);

  // const closeQueue = async (queue: QueueTable): Promise<void> => updateQueue(queue.id, QueueStatus.CLOSED);

  // const queuesActions = (queue: QueueTable): ReactElement => (
  //   <div className='buttons-list nowrap'>
  //     <Button data-testid='update-active-queue-button'
  //       onClick={() => startQueue(queue)} shape='circle' type='text'>
  //       <span className='icofont icofont-ui-play' />
  //     </Button>
  //     <Button data-testid='update-pause-queue-button'
  //       onClick={() => pauseQueue(queue)} shape='circle' type='text'>
  //       <span className='icofont icofont-ui-pause' />
  //     </Button>
  //     <Button data-testid='update-close-queue-button'
  //       onClick={() => closeQueue(queue)} shape='circle' type='text'>
  //       <span className='icofont icofont-ui-close' />
  //     </Button>
  //   </div>
  // );

  return (
    <>
      <Row justify='center'>
        <Space direction='vertical'>

          {clinic ?
            <Title level={3}>{clinic.name} Queues</Title> :
            <Title level={3}>Clinic Queues</Title>
          }

          <Divider />

          <CreateQueueForm createQueue={createQueue} clinicId={fetchClinicId} />

          {/* <QueuesTable data={queues} actions={queuesActions} clinicId={fetchClinicId} /> */}
          <QueuesTable data={queues} clinicId={fetchClinicId} />
        </Space>
      </Row>
    </>
  );
};

export default QueuesPage;
