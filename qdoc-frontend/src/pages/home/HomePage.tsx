import React, { ReactElement } from "react";
import { Row, Space, Col, Typography, Image, Card, Avatar } from "antd";
import ClinicSummaryCard from "../../components/ClinicSummaryCard";
import QdocLogoSvg from "../../assets/img/qdoc-logo-white.png";
import ClinicsMap from "../../components/ClinicsMap";
import { Link } from "react-router-dom";
import useFetchClinics from "../../hooks/useFetchClinics";
import { Clinic } from "../../types/clinic";
import { hasClinicAccess } from "../../clients/auth-client";
import QueuesPage from "../queues/QueuesPage";
import "./HomePage.scss";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const clinicMap = (clinics: Clinic[]): ReactElement => {
  return (
    <Space direction='vertical'>
      <Row justify='center' style={{ width: "100%", height: "20%" }}>
        {clinics.map((clinic) =>
          <ClinicSummaryCard key={clinic.id} clinic={clinic} />)
        }
      </Row>
    </Space>
  );
};

const PatientHome = (): ReactElement => {
  return (
    <Space direction="vertical" className="home">
      <Row justify="center" align="middle" className="home__header">
        <Col pull={3} md={10} className="header__welcome">
          <Title className="welcome__message">Welcome to,</Title>
          <Image src={QdocLogoSvg} className='header__logo__white' preview={false} />
        </Col>
        <Col pull={3} md={14} className="header__message">
          <Paragraph className="QDoc__intro">
          QDoc wishes to build a platform that automates the queues from General Practitioners/ Primary Care doctors,
          integrating both physical consultation and teleconsultation into one seamless queue for you.
          </Paragraph>
        </Col>
      </Row>
      <Row justify="center" className="home__question">
        <Col>
          <Title className="question__message" level={3}>How can we help you today?</Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col md={12} className="consult-col">
          <Link to={"/clinics"}>
            <Card
              hoverable
              data-testid='tele-consult-button'
              id="tele-consult-button"
              style={{ width: 300 }}
              title={<Meta
                className="consult-button-title"
                avatar={<Avatar src="/tele-consult-logo.svg" />}
                title="Tele-Consultation"
              />}
            >
            Get in touch with a doctor via a video consultation at the comfort of your own home
            </Card>
          </Link>
        </Col>
        <Col md={12} className="consult-col">
          <Link to={"/clinics"}>
            <Card
              hoverable
              id="in-clinic-button"
              style={{ width: 300 }}
              title={<Meta
                className="consult-button-title"
                avatar={<Avatar src="/in-clinic-logo.svg" />}
                title="In-Clinic Consultation"
              />}
            >
            Get in line with your preferred clinic without physically being there for long waiting hours
            </Card>
          </Link>
        </Col>
      </Row>
    </Space>
  );
};

const HomePage = ({ user }): ReactElement => {
  const clinics = useFetchClinics();

  if (hasClinicAccess(user)) {
    return <QueuesPage clinicIdProps={user.clinicId}/>;
  }
  return <PatientHome/>;
  // return clinicMap(clinics);
};

export default HomePage;
