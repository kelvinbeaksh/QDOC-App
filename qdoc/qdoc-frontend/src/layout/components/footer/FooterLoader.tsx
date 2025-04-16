import React, { ReactElement } from "react";

const FooterLoader = (): ReactElement => (
  <div className='footer-skeleton'>
    <div className='row align-items-center'>
      <div className='col-12 col-md-6 d-none d-md-block'>
        <ul className='page-breadcrumbs'>
          <li className='item bg-1 animated-bg' />
          <li className='item bg animated-bg' />
        </ul>
      </div>

      <div className='col-12 col-md-6'>
        <div className='info justify-content-center justify-content-md-end'>
          <div className='version bg animated-bg' />
          <div className='settings animated-bg' />
        </div>
      </div>
    </div>
  </div>
);

export default FooterLoader;
