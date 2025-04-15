import React, { ReactElement } from "react";

import { NavLink } from "react-router-dom";

import { IBreadcrumb } from "../../../interfaces/page";

type Props = {
  breadcrumbs: IBreadcrumb[];
  layout: string;
};

const Breadcrumb = ({ route, title, layout }): ReactElement => {
  return (
    <li className='item'>
      {route ? (
        <NavLink className='link' replace to={`/${layout}/${route}`}>
          {title}
        </NavLink>
      ) : (
        <span>{title}</span>
      )}
    </li>
  );
};

const Breadcrumbs = ({ breadcrumbs = [], layout }: Props): ReactElement => {
  const breadcrumbList = breadcrumbs.map(({ title, route }: IBreadcrumb, index) => (
    <React.Fragment key={index}>
      <Breadcrumb title={title} route={route} layout={layout} />
      {index < breadcrumbs.length - 1 && (
        <li>
          <i className='separator icofont icofont-thin-right' />
        </li>
      )}
    </React.Fragment>
  ));

  return <ul className='page-breadcrumbs'>{breadcrumbList}</ul>;
};

export default Breadcrumbs;
