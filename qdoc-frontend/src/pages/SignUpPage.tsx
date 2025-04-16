import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PublicLayout from "../layout/public/Public";
import { passwordRegex } from "../utils/form-utils";
import { showSuccessNotification } from "../utils/notification-utils";
import { UserRoles } from "../clients/auth-client";
import UserService from "../services/user-service";
import ClinicService from "../services/clinic-service";
import { Clinic } from "../types/clinic";
import MobileService from "../services/mobile-service";
import moment from "moment";

export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  mobileInternationalCode: string;
  dateOfBirth: string;
  email: string,
  password: string
  passwordConfirmation: string
  clinicId?: string
}

interface SignUpPageProps {
  role: UserRoles
}

interface GetOTPButtonProps {
  disabled: boolean,
  content: string
}

const { Option } = Select;

const { Item } = Form;

const layout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 24 }
};

const tnC = (): React.ReactElement => {
  return (<span>
    I agree to the <Link to='/'> Terms and Conditions </Link>
  </span>);
};

enum ValidateStatus {
  NONE = "",
  SUCCESS = "success",
  VALIDATING = "validating",
  ERROR = "error"
}

const phoneNumberPrefixSelector = (
  <Form.Item name='mobileInternationalCode' noStyle>
    <Select style={{ width: 80 }}>
      <Option value='+65'>+65</Option>
    </Select>
  </Form.Item>
);

const SignUpPage = (props: SignUpPageProps): React.ReactElement => {
  const history = useHistory();
  const [ form ] = Form.useForm<SignUpFormValues>();
  const [ allClinics, setAllClinics ] = useState<Clinic[]>([]);
  const [ showVerifyMobileNumber, setShowVerifyMobileNumber ] = useState<Boolean>(false);
  const [ otpValidateStatus, setOtpValidateStatus ] = useState<ValidateStatus>(ValidateStatus.NONE);
  const [ otpButton, setOtpButton ] = useState<GetOTPButtonProps>({ disabled: false, content: "Get OTP" });

  useEffect(() => {
    const fetchAllClinics = async (): Promise<void> => {
      try {
        const clinics = await ClinicService.getAllClinics();
        setAllClinics(clinics);
      } catch (e) {
        console.error(e);
      }
    };
    if (props.role === UserRoles.DOCTOR) {
      fetchAllClinics();
    }
  }, [ props.role ]);

  const signUp = async (formValues: SignUpFormValues): Promise<void> => {
    try {
      const dateOfBirth = moment(formValues.dateOfBirth).format("YYYY-MM-DD");
      await UserService.signUp(props.role, { ...formValues, dateOfBirth });
      showSuccessNotification({ message: "Successfully created account.", description: "Welcome to QDOC!" });
      history.push("/");
    } catch (error) {
      console.error(`UserService.signup threw error for role ${props.role}: ${error.message}`);
    }
  };

  const sendVerificationCode = async (mobileInternationalCode: string, mobileNumber: string): Promise<void> => {
    try {
      setOtpButton({ disabled: true, content: "Try again in 60s" });
      await MobileService.sendVerificationToken(`${mobileInternationalCode}${mobileNumber}`);
    } catch (e) {
      console.error(`MobileService.sendVerificationToken threw error for ${e.message}`);
    }
    setTimeout(() => setOtpButton({ disabled: false, content: "Get OTP" }), 60000);
  };

  const checkVerificationCode = async (mobileInternationalCode: string,
    mobileNumber: string, otp: string): Promise<void> => {
    setOtpValidateStatus(ValidateStatus.VALIDATING);
    try {
      const result = await MobileService.checkVerificationToken(`${mobileInternationalCode}${mobileNumber}`, otp);
      if (result.valid) {
        setOtpValidateStatus(ValidateStatus.SUCCESS);
        return;
      }
      setOtpValidateStatus(ValidateStatus.ERROR);
    } catch (e) {
      setOtpValidateStatus(ValidateStatus.ERROR);
      console.error(`MobileService.checkVerificationToken threw error for ${e.message}`);
    }
  };

  const generateSelectionForClinics = (allClinics: Clinic[]): React.ReactElement[] => {
    return allClinics.map(clinic => {
      return (
        <Select.Option key={clinic.id} value={clinic.id}>{clinic.name}</Select.Option>
      );
    });
  };

  return (
    <PublicLayout bgImg={`${window.origin}/content/register-page.jpg`}>
      <h4 className='mt-0 mb-1'>Sign up</h4>
      <p className='text-color-200'>Create your Account</p>

      <Form form={form} labelAlign='left' {...layout}
        layout='vertical'
        className='mb-5'
        requiredMark={false}
        onFinish={signUp}
        initialValues={{ mobileInternationalCode: "+65" }}
      >
        <Item
          label='Name'
          style={{ marginBottom: 0 }}
        >
          <Item
            name='firstName'
            rules={[
              { required: true, message: "Please input your first name" },
              { pattern: /^[A-Z ]+$/i, message: "First name should only have alphabetical characters" }
            ]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            hasFeedback
          >
            <Input aria-label='firstName' placeholder='First name' />
          </Item>

          <Item
            name='lastName'
            rules={[
              { required: true, message: "Please input your last name" },
              { pattern: /^[A-Z ]+$/i, message: "Last name should only have alphabetical characters" }
            ]}
            style={{ display: "inline-block", width: "calc(50% - 8px)", marginLeft: "8px" }}
            hasFeedback
          >
            <Input aria-label='lastName' placeholder='Last name' />
          </Item>

        </Item>
        <Input.Group compact={true}>
          <Item
            name='mobileNumber'
            label='Mobile Number'
            rules={[
              { required: true, message: "Please input your mobile number!" },
              { pattern: /^([89])\d{7}$/g, message: "The mobile number is invalid" }
            ]}
            hasFeedback
            style={{ width: "60%", display: "inline-block" }}
          >
            <Input aria-label='mobileNumber'
              addonBefore={phoneNumberPrefixSelector}
            />
          </Item>

          <Item
            label=' '
            style={{ width: "30%", display: "inline-block", marginLeft: "5%" }}
            shouldUpdate={(prevValues, currentValues) => {
              return prevValues.mobileNumber !== currentValues.mobileNumber;
            }}
          >
            {({ isFieldTouched, getFieldValue, validateFields }) => {
              isFieldTouched("mobileNumber") && validateFields([ "mobileNumber" ])
                .then(() => setShowVerifyMobileNumber(true))
                .catch(() => {
                  setShowVerifyMobileNumber(false);
                  setOtpValidateStatus(ValidateStatus.NONE);
                });
              if (showVerifyMobileNumber) {
                return <Button
                  disabled={otpButton.disabled}
                  style={{ width: "100%", display: "inline-block" }}
                  onClick={() => sendVerificationCode(getFieldValue("mobileInternationalCode"),
                    getFieldValue("mobileNumber"))}
                >{otpButton.content}</Button>;
              }
              return <></>;
            }}

          </Item>
        </Input.Group>

        {showVerifyMobileNumber &&
        <Input.Group compact>
          <Item name='otpInput' label=''
            style={{ display: "inline-block", width: "60%" }}
            validateStatus={otpValidateStatus}
            hasFeedback
            validateTrigger='onSubmit'
            rules={[ {
              validator: () => {
                if (otpValidateStatus === ValidateStatus.SUCCESS) {
                  return Promise.resolve();
                }
                setOtpValidateStatus(ValidateStatus.ERROR);
                return Promise.reject(new Error("Please verify the OTP"));
              }
            }
            ]}
          >
            <Input placeholder='OTP' aria-label='otp' maxLength={6}/>
          </Item>
          <Button onClick={
            () => checkVerificationCode(form.getFieldValue("mobileInternationalCode"),
              form.getFieldValue("mobileNumber"), form.getFieldValue("otpInput"))}
          style={{ display: "inline-block", width: "30%", marginLeft: "5%" }}>
            Verify OTP
          </Button>
        </Input.Group>
        }

        <Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: "Please input the email" },
            { type: "email", message: "The input is not a valid email address" }
          ]}
          style={{ marginTop: 0 }}
          hasFeedback
        >
          <Input aria-label='email' type='mail' />
        </Item>

        <Item name='password'
          rules={
            [
              { required: true, message: "Please input the password" },
              { min: 8, message: "Please input password of minimum 8 characters" },
              { max: 64, message: "Please input password of maximum 64 characters" },
              {
                pattern: passwordRegex,
                message: "Include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
              }
            ]
          }
          label='Password'
          hasFeedback
        >
          <Input.Password
            aria-label='password'
            type='password'
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Item>

        <Item name='password-confirmation'
          rules={
            [
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                }
              })
            ]
          }
          label='Password Confirmation'
          dependencies={[ "password" ]}
          hasFeedback
        >
          <Input.Password
            aria-label='password-confirmation'
            type='password'
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Item>

        {props.role === UserRoles.DOCTOR && allClinics.length > 0 &&
        <Item name='clinicId' label='Clinic'
          rules={
            [
              { required: true, message: "Please select the clinic" }
            ]
          }
        >
          <Select>
            {generateSelectionForClinics(allClinics)}
          </Select>
        </Item>}

        <Item name='dateOfBirth' label='Date of Birth' aria-label='dateOfBirth'
          rules={[ { required: true, message: "Please input your DOB" } ]}>
          <DatePicker showToday={false} format="YYYY-MM-DD"/>
        </Item>

        <Item name='terms-and-conditions'
          label={tnC()}
          labelCol={{ span: 20 }}
          rules={[ () => ({
            validator(_, value) {
              if (value === true) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Please agree to the terms and conditions"));
            }
          }) ]}
          valuePropName='checked'
          hasFeedback
        >
          <Switch aria-label='terms-and-conditions' />
        </Item>

        <Button
          type='primary'
          htmlType='submit'
          icon={<span className='icofont icofont-plus mr-2' style={{ fontSize: "1.2rem" }} />}
        >
          Register
        </Button>
      </Form>

      <p>
        Have an account? <Link to='sign-in'>Sign in!</Link>
      </p>
    </PublicLayout>
  );
};

export default SignUpPage;
