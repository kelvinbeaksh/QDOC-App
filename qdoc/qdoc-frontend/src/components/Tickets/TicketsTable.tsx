import React, { ReactElement, useState, useEffect } from "react";
import { Table, Typography, Menu, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { TicketStatus, TicketType } from "../../types/ticket";
import TicketTypeTag from "./TicketTypeTag";
import TicketStatusTag from "./TicketStatusTag";
import { formatDate } from "../../helpers/date-helpers";
import moment from "moment/moment";
import { ColumnProps } from "antd/es/table";
import PatientProfileButton from "./PatientProfileButton";
import "./AppointmentsTable.scss";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import "./TicketsTable.scss";

export interface TicketTableRow {
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

// const menu = (
//   <Menu>
//     <Menu.Item>Skip Patient</Menu.Item>
//     <Menu.Item>Follow Up Again</Menu.Item>
//   </Menu>
// );

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: "grab", color: "#999" }} />);

const columns: ColumnProps<TicketTableRow>[] = [
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
    title: "Sort",
    dataIndex: "sort",
    width: 30,
    className: "drag-visible",
    render: () => <DragHandle/>
  }
  // {
  //   title: "Appointment Action",
  //   dataIndex: "key",
  //   render: (key) => (
  //     <Dropdown overlay={menu} placement='bottomLeft' trigger={["click"]}>
  //       <span className='icofont-navigation-menu' />
  //     </Dropdown>
  //   ),
  //   align: "right",
  //   width: 1
  // }
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

const SortableItem = SortableElement(props => <tr {...props} />);
const SortableBody = SortableContainer(props => <tbody {...props} />);

const TicketsTable = (props: { data: TicketTableRow[] }): ReactElement => {
  const [dataRow, setDataRow] = useState(props.data);

  useEffect(() => {
    setDataRow(props.data);
  }, [props.data]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const dataSource = dataRow;
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([].concat(dataSource), oldIndex, newIndex).filter(
        el => !!el
      );
      const idData = newData.map(row => row.key);
      setDataRow(newData);
    }
  };

  const DraggableContainer = props => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const dataSource = dataRow;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.key === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Table
      rowKey="key"
      className='appointment-table'
      showHeader={false}
      columns={columns}
      dataSource={dataRow}
      pagination={{ hideOnSinglePage: true }}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow
        }
      }}
    />
  );
};

export default TicketsTable;

// import React, { ReactElement } from "react";
// import { Table, Typography } from "antd";
// import { TicketStatus, TicketType } from "../../types/ticket";
// import TicketTypeTag from "./TicketTypeTag";
// import TicketStatusTag from "./TicketStatusTag";
// import { formatDate } from "../../helpers/date-helpers";
// import moment from "moment/moment";
// import { ColumnProps } from "antd/es/table";

// export interface TicketTableRow {
//   key: number;
//   ticketDisplayNumber: number;
//   queueId: number;
//   patientName: string;
//   ticketStatus: TicketStatus;
//   ticketType: TicketType;
//   patientDateOfBirth: string;
//   ticketCreatedAt: string;
// }

// const columns: ColumnProps<TicketTableRow>[] = [
//   {
//     title: "Ticket Display Number",
//     dataIndex: "ticketDisplayNumber",
//     sorter: (x, y) => x.ticketDisplayNumber - y.ticketDisplayNumber
//   },
//   {
//     title: "Queue Id",
//     dataIndex: "queueId"
//   },
//   {
//     title: "Patient Name",
//     dataIndex: "patientName"
//   },
//   {
//     title: "Ticket Status",
//     dataIndex: "ticketStatus",
//     filters: [
//       {
//         text: TicketStatus.CLOSED,
//         value: TicketStatus.CLOSED
//       },
//       {
//         text: TicketStatus.WAITING,
//         value: TicketStatus.WAITING
//       },
//       {
//         text: TicketStatus.SERVING,
//         value: TicketStatus.SERVING
//       }
//     ],
//     onFilter: (value, record) => record.ticketStatus === value,
//     render: (ticketStatus) => <TicketStatusTag ticketStatus={ticketStatus} />
//   },
//   {
//     title: "Ticket Type",
//     dataIndex: "ticketType",
//     filters: [
//       {
//         text: TicketType.TELEMED,
//         value: TicketType.TELEMED
//       },
//       {
//         text: TicketType.PHYSICAL,
//         value: TicketType.PHYSICAL
//       }
//     ],
//     onFilter: (value, record) => record.ticketType === value,
//     render: (ticketType) => <TicketTypeTag ticketType={ticketType} />
//   },
//   {
//     title: "Patient DOB",
//     dataIndex: "patientDateOfBirth",
//     sorter: (a, b): number => {
//       const first = moment(a.patientDateOfBirth);
//       const second = moment(b.patientDateOfBirth);
//       if (first.isSame(second)) {
//         return 0;
//       }
//       if (first.isAfter(second)) {
//         return 1;
//       }
//       return -1;
//     }
//   },
//   {
//     title: "Joined Queue At",
//     defaultSortOrder: "descend",
//     dataIndex: "ticketCreatedAt",
//     sorter: (a, b): number => {
//       const first = moment(a.ticketCreatedAt);
//       const second = moment(b.ticketCreatedAt);
//       if (first.isSame(second)) {
//         return 0;
//       }
//       if (first.isAfter(second)) {
//         return 1;
//       }
//       return -1;
//     },
//     render: (ticketCreatedAt) => <Typography.Text>{formatDate(ticketCreatedAt)}</Typography.Text>
//   }
// ];

// const TicketsTable = (props: { data: TicketTableRow[] }): ReactElement => {
//   return (
//     <Table columns={columns} dataSource={props.data} pagination={{ hideOnSinglePage: true }} />
//   );
// };

// export default TicketsTable;
