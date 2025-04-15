import { Clinic } from "../types/clinic";
import React, { ReactElement, useState } from "react";
import { CloseCircleFilled, EnvironmentFilled } from "@ant-design/icons";
import { Popover } from "antd";
import { Link } from "react-router-dom";

interface ClinicMapMarkerProps {
  lat: number,
  lng: number,
  clinic: Clinic
}

interface InfoWindowState {
  showHoverInfoWindow: boolean
  showClickInfoWindow: boolean
}

const clinicInfoWindowContent = (clinic: Clinic): ReactElement => {
  return (
    <>
      <div>{clinic.address}</div>
      <div>Singapore {clinic.postalCode}</div>
    </>
  );
};

export const ClinicMapMarker = (props: ClinicMapMarkerProps): ReactElement => {
  const { clinic } = props;
  const [ infoWindowState, setInfoWindowState ] = useState<InfoWindowState>(
    { showClickInfoWindow: false,
      showHoverInfoWindow: false }
  );

  const handleHoverChange = (visible: boolean): void => {
    setInfoWindowState({ showClickInfoWindow: false, showHoverInfoWindow: visible });
  };

  const handleClickChange = (visible: boolean): void => {
    setInfoWindowState({ showClickInfoWindow: visible, showHoverInfoWindow: false });
  };

  const hideAll = (): void => {
    setInfoWindowState({ showClickInfoWindow: false, showHoverInfoWindow: false });
  };

  return (
    <Popover
      content={clinicInfoWindowContent(clinic)}
      title={<Link to={`/clinics/${clinic.id}`}>{clinic.name}</Link>}
      trigger="hover"
      onVisibleChange={handleHoverChange}
      visible={infoWindowState.showHoverInfoWindow}>
      <Popover
        content={clinicInfoWindowContent(clinic)}
        title={<>
          <Link to={`/clinics/${clinic.id}`}>{clinic.name}</Link>
          <CloseCircleFilled
            style={{ margin: 10, pointerEvents: "all" }}
            onClick={hideAll} />
        </>}
        trigger="click"
        visible={infoWindowState.showClickInfoWindow}
        onVisibleChange={handleClickChange}
      >
        <EnvironmentFilled
          key={clinic.id}
          style={{ fontSize: 30 }}
          aria-label="clinic-map-marker"
        />
      </Popover>
    </Popover>
  );
};
