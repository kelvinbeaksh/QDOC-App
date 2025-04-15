import React, { ReactElement } from "react";
import { AutoComplete, Col, Image, Input, Layout, Row } from "antd";
import QdocLogoSvg from "../../../assets/img/qdoc-logo.svg";
import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";
import { hasClinicAccess } from "../../../clients/auth-client";

const options = [
  { value: "Singapura Clinic 1" },
  { value: "Singapura Clinic 2" },
  { value: "Singapura Clinic 3" }
];

const Header = ({ user }): ReactElement => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const onSelect = (data: String, option: any): void => {
    console.log("onSearch", data);
    console.log(JSON.stringify(option));
  };

  const onSearch = (value: String): void => {
    console.log("onSearch", value);
  };

  return (
    <Layout.Header className='header'>
      <Row className='header-row'>
        <Col span={6}>
          <Link to='/'>
            <Image src={QdocLogoSvg} className='header-logo' preview={false} />
          </Link>
        </Col>

        <Col span={12} style={{ justifyContent: "center" }}>
          {isHomePage && !hasClinicAccess(user) && (
            <AutoComplete
              className='header-autocomplete'
              dropdownMatchSelectWidth={252}
              options={options}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder='Search Clinics'
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              <Input
                className='ant-select-selection-search-input'
                suffix={<span className={"icofont-search-1"} />}
              />
            </AutoComplete>
          )}
        </Col>
        <Col span={6} className='header-account'>
          <AccountDropdown />
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default Header;
