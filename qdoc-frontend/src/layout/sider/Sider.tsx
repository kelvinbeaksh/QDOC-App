import { Layout, Menu } from "antd";
import React, { ReactElement } from "react";
import "./Sider.scss";
import { Link } from "react-router-dom";
import { hasClinicAccess } from "../../clients/auth-client";

const genericMenu = (): ReactElement => {
  return (
    <Menu mode='vertical' className='sider-menu'>
      <Menu.Item key='1' icon={<span className='icofont-doctor' />}>
        <Link to='/'>Find My GP</Link>
      </Menu.Item>
      <Menu.Item key='2' icon={<span className='icofont-stethoscope-alt' />}>
        <Link to='/clinics'>Clinics</Link>
      </Menu.Item>
      <Menu.Item key='3' icon={<span className='icofont-search-user' />}>
        <Link to='/tickets/29'>Next Available GP</Link>
      </Menu.Item>
    </Menu>
  );
};

const clinicMenu = (clinicId: number): ReactElement => {
  const clinicDetailsPage = `/clinics/${clinicId}`;
  const clinicTicketsPage = `/clinics/${clinicId}/tickets`;
  const clinicAppointmentsPage = `/clinics/${clinicId}/appointments`;
  return (
    <Menu mode='vertical' className='sider-menu'>
      <Menu.Item key='1' icon={<span className='icofont-doctor' />}>
        <Link to={clinicDetailsPage}>My Clinic</Link>
      </Menu.Item>
      <Menu.Item key='2' icon={<span className='icofont-stethoscope-alt' />}>
        <Link to={clinicTicketsPage}>Clinic Tickets</Link>
      </Menu.Item>
      <Menu.Item key='3' icon={<span className='icofont-stethoscope-alt' />}>
        <Link to={clinicAppointmentsPage}>Appointments</Link>
      </Menu.Item>
    </Menu>
  );
};

const Sider = ({ user }): ReactElement => {
  if (hasClinicAccess(user)) {
    return (
      <Layout.Sider
        width={200}
        className='site-layout-background'
        breakpoint='lg'
        collapsedWidth='0'
        zeroWidthTriggerStyle={{ background: "grey", top: 0 }}
      >
        {hasClinicAccess(user) ? clinicMenu(user.clinicId) : genericMenu()}
      </Layout.Sider>
    );
  }
  return (
    <></>
  );
};

export default Sider;
