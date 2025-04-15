import React from "react";

import { Button } from "antd";
import { HomeFilled } from "@ant-design/icons/lib";

import BaseErrorPage from "./BaseErrorPage";

const UnAuthorizedErrorPage = (): React.ReactElement => (
  <BaseErrorPage
    subTitle={
      <h6 className='text-md text-center'>Unauthorized</h6>
    }
    msg='Unauthorized'
    bg={`${window.origin}/content/500-page.jpg`}
    action={
      <Button
        type='primary'
        style={{ width: "auto" }}
        icon={<HomeFilled className='ml-0 mr-2' style={{ fontSize: "1em" }} />}
      >
        Back to home
      </Button>
    }
    title={
      <h1 style={{ fontSize: "6rem" }} className='text-color-300 text-center mb-2'>
        <i className='icofont-exclamation-tringle  color-error mr-2' style={{ opacity: 0.5 }} />
        Unauthorized
      </h1>
    }
  />
);

export default UnAuthorizedErrorPage;
