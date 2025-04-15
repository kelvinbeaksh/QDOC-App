import { apiKey } from "../pages/maps/apiKey";
import React, { ReactElement, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Clinic } from "../types/clinic";
import { ClinicMapMarker } from "./ClinicMapMarker";
import { Alert, message, notification } from "antd";
import { MessageType } from "antd/lib/message";

interface ClinicsMapProps {
  clinics: Clinic[]
}

interface Coord {
  lat: number
  lng: number
}

const renderMarker = (clinic: Clinic): ReactElement => {
  return <ClinicMapMarker
    key={clinic.id}
    lat={clinic.lat}
    lng={clinic.long}
    clinic={clinic}
  />;
};

const showSuccessLocationNotification = ():MessageType =>
  message.success("Successfully set your current location on the map", 1);

const showErrorLocationNotification = ():MessageType =>
  message.error("Failed to set your current location on the map. Defaulting to central", 1);

const ClinicsMap = (props :ClinicsMapProps) :ReactElement => {
  const [ coord, setCoord ] = useState<Coord>({ lat: 1.30328, lng: 103.847049 });

  const errorSettingUserLocation = (err: any):void => {
    showErrorLocationNotification();
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  const setUserLocation = (pos: any):void => {
    setCoord({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
  };

  const getUserLocation = async (): Promise<void> => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setUserLocation, errorSettingUserLocation, { enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0 });
      showSuccessLocationNotification();
    } else {
      showErrorLocationNotification();
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const { clinics } = props;
  return (
    <>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        center={coord}
        defaultZoom={15}
      >
        {clinics.map((clinic) => renderMarker(clinic))}
      </GoogleMapReact>
    </>
  );
};

export default ClinicsMap;
