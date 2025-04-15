import React, { ReactElement } from "react";
import { Layout } from "antd";
import "./MainLayout.scss";

const MainLayout = ({ header, sider, children }): ReactElement => {
  return <Layout>
    {header}
    <Layout>
      {sider}
      <Layout>
        <Layout.Content className="site-layout-background layout-content">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  </Layout>;
};

export default MainLayout;
