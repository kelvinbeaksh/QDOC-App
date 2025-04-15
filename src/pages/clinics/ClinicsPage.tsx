import {
  Table, Tag, Typography, Row, Space, Col, Image, Card, Avatar
} from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import QueueCountLogo from "../../assets/img/queue-count-logo.svg";
import LocationPinLogo from "../../assets/img/location-pin.svg";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Clinic } from "../../types/clinic";
import ClinicService from "../../services/clinic-service";
import Title from "antd/lib/typography/Title";
import "./ClinicsPage.scss";

interface ClinicTableRow {
  id: number,
  name: string,
  doctorOnDuty?: string,
  address: string,
  activeClinicQueue?: boolean,
  patientsInQueue?: number
}

const ClinicsPage = (): ReactElement => {
  const { url } = useRouteMatch();
  const [ clinicTableRows, setClinicTableRows ] = useState<ClinicTableRow[]>([]);
  const history = useHistory();

  const fetchAllClinics = async (): Promise<void> => {
    try {
      const clinics = await ClinicService.getAllClinics();
      if (clinics.length > 0) {
        const rows: ClinicTableRow[] = [];
        clinics.forEach((clinic: Clinic) => {
          rows.push({
            id: clinic.id,
            name: clinic.name,
            address: clinic.address,
            doctorOnDuty: (clinic.queues.length > 0) &&
              `Dr ${clinic.queues[0].doctor.lastName} ${clinic.queues[0].doctor.firstName}`,
            activeClinicQueue: (clinic.queues.length > 0),
            patientsInQueue: (clinic.queues.length > 0) && clinic.queues[0].pendingTicketIdsOrder.length
          });
        });
        setClinicTableRows(rows);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAllClinics();
  }, []);

  const columns = [
    // {
    //   title: "No",
    //   dataIndex: "id",
    //   key: "id"
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "No of patients in Queue",
      dataIndex: "patientsInQueue",
      key: "patientsInQueue",
      render: patientsInQueue => {
        if (patientsInQueue || patientsInQueue === 0) {
          return <><img src={QueueCountLogo}/><Typography.Text>{patientsInQueue}</Typography.Text></>;
        }
        return <Tag color="warning" >No Active Queue</Tag>;
      }
    },
    {
      title: "Distance to Location",
      dataIndex: "distance",
      key: "distance",
      render: () => { return <><img src={LocationPinLogo}/></>; }
    },
    {
      title: "Active Clinic Queue",
      dataIndex: "activeClinicQueue",
      render: activeClinicQueue => {
        if (activeClinicQueue) {
          return <Tag color="success" >Active</Tag>;
        }
        return <Tag color="warning" >No Active Queue</Tag>;
      }
    },
    {
      title: "Doctor on duty",
      dataIndex: "doctorOnDuty",
      key: "doctorOnDuty",
      render: doctorOnDuty => {
        if (doctorOnDuty) {
          return <Typography.Text>{doctorOnDuty}</Typography.Text>;
        }
        return <Tag color="warning" >No Doctor On Duty</Tag>;
      }
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address"
    }
  ];

  return (
    <Space direction="vertical" className="main-div">
      <Row>
        <Col>
          <Title level={3} style={{ paddingLeft: "10px" }}>All Clinics</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div>
            <Table onRow={(record) => {
              return {
                onClick: () => { history.push(`${url}/${record.id}`); }
              };
            }} rowClassName="clinic-table-row"
            dataSource={clinicTableRows}
            columns={columns}
            pagination={{ hideOnSinglePage: true }}/>
          </div>
        </Col>
      </Row>
    </Space>
  );
};

export default ClinicsPage;
