import React, { ReactNode } from "react";
import "./Public.scss";
import Logo from "../components/logo/Logo";
import QdocLogoSvg from "../../assets/img/qdoc-logo.svg";
import { Link } from "react-router-dom";

type Props = { children: ReactNode; bgImg?: string; transparent?: boolean };

const PublicLayout = ({ children, bgImg, transparent = false }: Props): React.ReactElement => (
  <div className='public-layout' style={{ backgroundImage: `url(${bgImg})` }}>
    <div className={`content-box ${transparent ? "transparent" : null}`}>
      <div className='content-header'>
        <Link to='/'>
          <Logo src={QdocLogoSvg} width="100%"/>
        </Link>
      </div>
      <div className='content-body'>{children}</div>
    </div>
  </div>
);

export default PublicLayout;
