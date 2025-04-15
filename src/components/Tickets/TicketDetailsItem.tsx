import React, { ReactElement } from "react";

const TicketDetailsItem = ({ children }): ReactElement => (
  <li className='d-flex align-items-center py-2 nowrap'>
    <span
      className={"mr-1 px-1 icofont-check-circled"}
      style={{ color: "#8f8f90", fontSize: "1.4rem", lineHeight: "30px" }}
    />
    <span className='ml-1'>{children}</span>
  </li>
);

export default TicketDetailsItem;
