import React, { ReactElement } from "react";
import { Button, Card, Col, Image, Row } from "antd";
import { Link } from "react-router-dom";
import { FileDoneOutlined } from "@ant-design/icons";

const ClinicSummaryCard = ({ clinic }: { clinic: any }): ReactElement => {
  if (clinic) {
    return <Col xs={24} sm={24} lg={12} xl={8} key={clinic.id}>
      <Card
        key={clinic.id}
        data-testid='clinic-summary'
        className='white-bg'
        size='default'
      >
        <Row>
          <Col xs={12}>
            <Image src='/content/department-1.jpg' />
          </Col>
          <Col xs={12}>
            <div style={{ paddingLeft: 15, paddingRight: 15, marginBottom: 20 }}>
              <div style={{ fontWeight: "bold" }}>{clinic.name}</div>
              <br />
              {clinic.address} <br />
              Singapore {clinic.postalCode} <br />
            </div>
            <div className='button-box pb-2' style={{ margin: 10 }}>
              <Link to={`/clinics/${clinic.id}`}>
                <Button type='primary'>
                  Clinic Details <FileDoneOutlined className='ml-2' />
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </Col>;
  }
  return <Card data-testid='clinic-summary' style={{ margin: 10, backgroundColor: "#F8F8F8", minWidth: "95%" }}>
    <div style={{ paddingLeft: 15, paddingRight: 15, marginBottom: 20 }}>
      No clinics found
    </div>
  </Card>;
};

export default ClinicSummaryCard;
