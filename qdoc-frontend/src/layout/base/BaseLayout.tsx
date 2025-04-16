import React, { ReactNode, useState } from "react";
import className from "../../utils/class-names";

import "./BaseLayout.scss";

type Props = {
  nav: ReactNode;
  sideNav?: ReactNode;
  topNav?: ReactNode;
  children: ReactNode;
  orientation: "vertical" | "horizontal";
  sidebarOpened: boolean,
  boxed: boolean
};

const BaseLayout = ({ nav, topNav, sideNav, orientation, children, sidebarOpened, boxed }: Props):
React.ReactElement => {
  const [ scrolled, setScrolled ] = useState(false);

  const handleScroll = (event): void => {
    setScrolled(event.target.scrollTop > 0);
  };

  const mainContentClasses = className({
    "main-content": true,
    loaded: true,
    fulfilled: true
  });

  const mainContentWrapClasses = className({
    "main-content-wrap": true
  });

  const contentOverlay = (
    <div
      className={className({
        "content-overlay": true,
        show: sidebarOpened
      })}
    />
  );

  return (
    <div className={`layout ${orientation}`}>
      <div className={`app-container ${boxed && "boxed"} ${scrolled && "scrolled"}`}>
        {nav}

        {topNav}

        {sideNav}

        <main onScroll={handleScroll} className={mainContentClasses}>
          <div className='app-loader'>
            <i className='icofont-spinner-alt-4 rotate' />
          </div>

          <div className={mainContentWrapClasses}>
            {children}
          </div>
        </main>

        {contentOverlay}
      </div>
    </div>
  );
};

export default BaseLayout;
