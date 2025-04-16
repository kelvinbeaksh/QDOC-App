import React, { ReactElement } from "react";
import { Dropdown, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import { DownOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { getUserId, User, useUserContext } from "../../../contexts/user-context";
import AuthService from "../../../services/auth-service";
import { UserRoles } from "../../../clients/auth-client";
import Avatar from "antd/lib/avatar/avatar";

const userAccountLink = (user: User): string => {
  const userAccountLinkMap = {
    [UserRoles.DOCTOR]: "/doctors",
    [UserRoles.PATIENT]: "/patients",
    [UserRoles.ADMIN]: "/admins",
    [UserRoles.CLINIC_STAFF]: "/clinic-staffs"
  };
  return `${userAccountLinkMap[user.role]}/${getUserId(user)}`;
};

const getDropdownMenu = (isAuthenticated: boolean, user: User, logOutHandler: () => {}): ReactElement => {
  if (isAuthenticated && user.role) {
    return (<Menu>
      <Menu.Item>
        <Link to={`${userAccountLink(user)}`}><UserOutlined />Account</Link>
      </Menu.Item>
      <Menu.Item onClick={logOutHandler}>
        <LogoutOutlined />Log Out
      </Menu.Item>
    </Menu>);
  }
  return (<Menu>
    <Menu.Item>
      <Link to='/sign-in'><LoginOutlined />Sign In</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to='/sign-up'><UserOutlined />Sign Up</Link>
    </Menu.Item>
  </Menu>);
};

const AccountDropdown = (): ReactElement => {
  const history = useHistory();
  const { isAuthenticated, user } = useUserContext();

  const logOutClickHandler = async (): Promise<void> => {
    try {
      await AuthService.signOut();
      history.push("/");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (<Dropdown overlay={getDropdownMenu(isAuthenticated, user, logOutClickHandler)}>
    <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
      <Avatar size='large' className='header-avatar' icon={<UserOutlined />} />
      <DownOutlined />
    </a>
  </Dropdown>);
};

export default AccountDropdown;
