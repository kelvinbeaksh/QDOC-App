import React, { ReactElement } from "react";
import { Table, Typography, Menu, Dropdown } from "antd";
import { TicketStatus, TicketType } from "../../types/ticket";
import TicketTypeTag from "./TicketTypeTag";
import TicketStatusTag from "./TicketStatusTag";
import { formatDate } from "../../helpers/date-helpers";
import moment from "moment/moment";
import { ColumnProps } from "antd/es/table";
import PatientProfileButton from "./PatientProfileButton";
import "./AppointmentsTable.scss";

export interface AppointmentTableRow {
  key: number;
  ticketDisplayNumber: number;
  // queueId: number;
  patientName: string;
  ticketType: TicketType;
  declaration: boolean;
  alert: boolean;
  patientId: number;
  ticketStatus: TicketStatus;
  // patientDateOfBirth: string;
  // ticketCreatedAt: string;
}

const menu = (
  <Menu>
    <Menu.Item>Skip Patient</Menu.Item>
    <Menu.Item>Follow Up Again</Menu.Item>
  </Menu>
);

const columns: ColumnProps<AppointmentTableRow>[] = [
  {
    title: "Ticket Number",
    dataIndex: "ticketDisplayNumber",
    sorter: (x, y) => x.ticketDisplayNumber - y.ticketDisplayNumber,
    width: "1%"
  },
  // {
  //   title: "Queue Id",
  //   dataIndex: "queueId"
  // },
  {
    title: "Patient Name",
    dataIndex: "patientName"
  },
  {
    title: "Ticket Type",
    dataIndex: "ticketType",
    filters: [
      {
        text: TicketType.TELEMED,
        value: TicketType.TELEMED
      },
      {
        text: TicketType.PHYSICAL,
        value: TicketType.PHYSICAL
      }
    ],
    onFilter: (value, record) => record.ticketType === value,
    render: (ticketType) => <TicketTypeTag ticketType={ticketType} />,
    width: "1%",
    align: "left"
  },
  {
    title: "Declaration",
    dataIndex: "declaration",
    render: (declaration) => <>{declaration ? <>Declared</> : <>Not Declared</>}</>,
    align: "right",
    width: "10%"
  },
  {
    title: "Alert",
    dataIndex: "alert",
    render: (alert) => <>{alert ? <>Alert</> : <>Not Alert</>}</>,
    align: "right",
    width: 1
  },
  {
    title: "Patient Profile",
    dataIndex: "patientId",
    render: (patientId) => <PatientProfileButton patientId={patientId} />,
    align: "right",
    width: 1
  },
  {
    title: "Ticket Status",
    dataIndex: "ticketStatus",
    filters: [
      {
        text: TicketStatus.CLOSED,
        value: TicketStatus.CLOSED
      },
      {
        text: TicketStatus.WAITING,
        value: TicketStatus.WAITING
      },
      {
        text: TicketStatus.SERVING,
        value: TicketStatus.SERVING
      }
    ],
    onFilter: (value, record) => record.ticketStatus === value,
    render: (ticketStatus) => <TicketStatusTag ticketStatus={ticketStatus} />,
    align: "right",
    width: 1
  },
  {
    title: "Apoointment Action",
    dataIndex: "key",
    render: (key) => (
      <Dropdown overlay={menu} placement='bottomLeft' trigger={["click"]}>
        <span className='icofont-navigation-menu' />
      </Dropdown>
    ),
    align: "right",
    width: 1
  }
  // {
  //   title: "Patient DOB",
  //   dataIndex: "patientDateOfBirth",
  //   sorter: (a, b): number => {
  //     const first = moment(a.patientDateOfBirth);
  //     const second = moment(b.patientDateOfBirth);
  //     if (first.isSame(second)) {
  //       return 0;
  //     }
  //     if (first.isAfter(second)) {
  //       return 1;
  //     }
  //     return -1;
  //   }
  // },
  // {
  //   title: "Joined Queue At",
  //   defaultSortOrder: "descend",
  //   dataIndex: "ticketCreatedAt",
  //   sorter: (a, b): number => {
  //     const first = moment(a.ticketCreatedAt);
  //     const second = moment(b.ticketCreatedAt);
  //     if (first.isSame(second)) {
  //       return 0;
  //     }
  //     if (first.isAfter(second)) {
  //       return 1;
  //     }
  //     return -1;
  //   },
  //   render: (ticketCreatedAt) => <Typography.Text>{formatDate(ticketCreatedAt)}</Typography.Text>
  // }
];

const AppointmentsTable = (props: { data: AppointmentTableRow[] }): ReactElement => {
  return (
    <Table
      className='appointment-table'
      // rowClassName={(record, index) =>
      //   record.ticketStatus === TicketStatus.SERVING
      //     ? "currentAppointmentTableRow"
      //     : "appointmentTableRow"
      // }
      showHeader={false}
      columns={columns}
      dataSource={props.data}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};

export default AppointmentsTable;
