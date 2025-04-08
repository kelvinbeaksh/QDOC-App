import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { authClient, UserRoles } from "../clients/auth-client";
import AuthService from "../services/auth-service";
import LocalStorageService from "../services/local-storage-service";

export interface User extends UserPermissions {
  email: string
  authId?: string
}

export const getUserId = (user: User): number => {
  if (user.role === UserRoles.DOCTOR) {
    return user.doctorId;
  }
  if (user.role === UserRoles.ADMIN) {
    return user.adminId;
  }
  if (user.role === UserRoles.CLINIC_STAFF) {
    return user.clinicStaffId;
  }
  if (user.role === UserRoles.PATIENT) {
    return user.patientId;
  }
  throw Error(`Failed to get user role for ${user.email}`);
};

export interface UserPermissions {
  role?: UserRoles
  clinicId?: number
  doctorId?: number
  clinicStaffId?: number
  patientId?: number
  adminId?: number
}

export interface UserContextState {
  user: User,
  isAuthenticated: boolean
}

const initialState: UserContextState = {
  user:
    {
      email: "",
      role: null
    },
  isAuthenticated: false
};

export const UserContext = React.createContext<UserContextState>(initialState);

export const useUserContext = (): UserContextState => useContext(UserContext);

const getUserPermissions = async (): Promise<UserPermissions> => {
  try {
    return await AuthService.getUserPermissions();
  } catch (e) {
    console.error(e.message);
    return {};
  }
};

const fetchIdFromLocalStorage = (key: string): number|null => {
  const fetchedId = LocalStorageService.getValue(key);
  if (fetchedId) {
    return Number(fetchedId);
  }
  return null;
};

export const fetchUserContextFromLocalStorage = (): UserContextState => {
  const isAuthenticated = LocalStorageService.getValue("isAuthenticated") === "true";
  const email = LocalStorageService.getValue("email") || "";
  const role = UserRoles[LocalStorageService.getValue("role")] || null;
  const clinicId = fetchIdFromLocalStorage("clinicId");
  const authId = LocalStorageService.getValue("authId");
  const doctorId = fetchIdFromLocalStorage("doctorId");
  const patientId = fetchIdFromLocalStorage("patientId");
  const clinicStaffId = fetchIdFromLocalStorage("clinicStaffId");
  const adminId = fetchIdFromLocalStorage("adminId");
  return {
    user: { email,
      patientId,
      clinicStaffId,
      adminId,
      doctorId,
      role,
      clinicId,
      authId },
    isAuthenticated
  };
};

export const UserContextProvider = ({ children }: PropsWithChildren<any>): React.ReactElement => {
  const [ currentUserContext, setUserContext ] = useState(fetchUserContextFromLocalStorage);
  useEffect(() => {
    authClient.authInstance.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userPermissions = await getUserPermissions();
        const user = { ...userPermissions, email: firebaseUser.email, authId: firebaseUser.uid };
        setUserContext({ user, isAuthenticated: true });
        LocalStorageService.setObject(user);
        LocalStorageService.set("isAuthenticated", "true");
      } else {
        setUserContext(initialState);
        LocalStorageService.clearAll();
      }
    });
  }, []);

  return (
    <UserContext.Provider value={currentUserContext}>
      {children}
    </UserContext.Provider>
  );
};
