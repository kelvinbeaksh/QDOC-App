import React from "react";

import { Button, Form, Input, Switch } from "antd";
import { LoginOutlined } from "@ant-design/icons/lib";
import { UserRoles } from "../clients/auth-client";
import PublicLayout from "../layout/public/Public";
import { Link, useHistory } from "react-router-dom";
import AuthService from "../services/auth-service";

interface SignInFormValues {
  email: string,
  password: string
}

const { Item } = Form;

const SignInPage = () :React.ReactElement => {
  const history = useHistory();
  const [ form ] = Form.useForm();

  const login = async (formValues: SignInFormValues): Promise<void> => {
    try {
      await AuthService.signInWithEmailAndPassword(formValues.email, formValues.password);
      // const permission = await AuthService.getUserPermissions();
      // if (permission.role === UserRoles.PATIENT) {
      //   history.push("/clinics");
      // } else {
      //   history.push("/");
      // }
      history.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PublicLayout bgImg={`${window.origin}/content/login-page.jpg`}>
      <h4 className='mt-0 mb-1'>Login form</h4>

      <p className='text-color-200'>Login to access your Account</p>

      <Form form={form} layout='vertical' className='mb-4'
        onFinish={login}
      >
        <Item name='email' rules={[
          { required: true, message: <></> },
          { type: "email", message: "The input is not a valid email address" }
        ]}>
          <Input aria-label='email' placeholder='Email' type='mail'/>
        </Item>
        <Item name='password' rules={[ { required: true, message: <></> } ]}>
          <Input aria-label='password' placeholder='Password' type='password' />
        </Item>

        <div className='d-flex align-items-center mb-4'>
          <Switch defaultChecked /> <span className='ml-2'>Remember me</span>
        </div>

        <Button
          block={false}
          type='primary'
          htmlType='submit'
          icon={<LoginOutlined style={{ fontSize: "1.3rem" }} />}
        >
          Login
        </Button>
      </Form>
      <br />
      <p className='mb-1'>
        <Link to="/">
          Forgot password?
        </Link>
      </p>

      <p>
        Don't have an account? <Link to='sign-up'>Sign up!</Link>
      </p>
    </PublicLayout>
  );
};

export default SignInPage;
