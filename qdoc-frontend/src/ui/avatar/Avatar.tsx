import React, { ReactElement } from "react";

import Classes from "./Avatar.module.scss";

type Props = {
  img: string;
  size: "sm" | "md" | "lg" | "xl";
};

const Avatar = ({ img, size = "md" }: Props): ReactElement => (
  <div className={`${Classes.avatarBlock} avatar=${size} mr-5`}>
    <img src={img as string} alt={"avatar user"} />
  </div>
);

export default Avatar;
