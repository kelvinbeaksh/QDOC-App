/* eslint-disable react/display-name */
import { Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import React, { ReactNode } from "react";
import { Link, useHistory } from "react-router-dom";
import { formatDate } from "../../../helpers/date-helpers";
import { Queue, QueueStatus, QueueTable } from "../../../types/queue";
import "./Queues.scss";
import QueueStatusTag from "../../../components/Queues/QueueStatusTag";

type Props = {
  data: Queue[];
  clinicId: number;
  actions?: (appointment: QueueTable) => ReactNode;
};

const QueuesTable = ({ data, clinicId, actions }: Props): React.ReactElement => {
  const history = useHistory();
  const actionColumn: ColumnProps<QueueTable> = {
    key: "actions",
    title: "Actions",
    render: actions
  };

  const columns: ColumnProps<QueueTable>[] = [
    {
      key: "id",
      dataIndex: "id",
      title: "Id",
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      render(id) {
        return <Link to={`/clinics/${clinicId}/queues/${id}`}>{id}</Link>;
      }
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: "Created At",
      render: (date) => <strong>{date ? formatDate(date) : ""}</strong>
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Status",
      defaultSortOrder: "ascend",
      render: (status) => <QueueStatusTag status={status} />
    },
    {
      key: "startedAt",
      dataIndex: "startedAt",
      title: "Started At",
      render: (date) => (
        <Typography.Text>
          {date ? formatDate(date) : ""}
        </Typography.Text>
      )
    },
    {
      key: "closedAt",
      dataIndex: "closedAt",
      title: "Closed At",
      render: (date) => (
        <span className='nowrap' style={{ color: "#a5a5a5" }}>
          {date ? formatDate(date) : ""}
        </span>
      )
    },
    {}
  ];

  // const displayedColumns = actions ? [ ...columns, actionColumn ] : columns;
  const displayedColumns = columns;

  return (
    <Table
      rowKey={(record) => record.id }
      onRow={(record) => {
        return {
          onClick: () => { history.push(`/clinics/${clinicId}/queues/${record.id}`); }
        };
      }}
      dataSource={data}
      rowClassName={(record) => (record.status === QueueStatus.ACTIVE ?
        "activeStatusRow queue-table-row" : "queue-table-row") }
      columns={displayedColumns}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};

export default QueuesTable;
