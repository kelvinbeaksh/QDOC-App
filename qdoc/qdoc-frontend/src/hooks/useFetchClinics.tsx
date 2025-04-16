/* eslint-disable no-console */
import { useEffect, useState } from "react";
import { Clinic } from "../types/clinic";
import ClinicService from "../services/clinic-service";

const useFetchClinics = (): Clinic[] => {
  const [ allClinics, setClinics ] = useState<Clinic []>([]);

  useEffect(() => {
    let fetchedClinics: Clinic[] = [];

    const fetchClinics = async (): Promise<void> => {
      try {
        fetchedClinics = await ClinicService.getAllClinics();
        if (fetchedClinics.length > 0) {
          setClinics(fetchedClinics);
        }
      } catch (e) {
        console.error(`Error while fetching clinics: ${e.message}`);
      }
    };

    fetchClinics();
  }, []);

  return allClinics;
};

export default useFetchClinics;
