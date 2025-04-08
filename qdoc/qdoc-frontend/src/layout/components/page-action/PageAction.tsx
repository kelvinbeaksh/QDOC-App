import React from "react";
import { Button } from "antd";

type Props = {
  icon: string;
  onClick: () => void;
  type?: "primary" | "dashed" | "text" | "link" | "ghost" | "default";
};

const PageAction = ({ onClick, icon, type }: Props): React.ReactElement => (
  <Button className='page-action' type={type} size='large' shape='circle' onClick={onClick}>
    <span className={`icofont ${icon}`} style={{ fontSize: 40 }} />
  </Button>
);

export default PageAction;
