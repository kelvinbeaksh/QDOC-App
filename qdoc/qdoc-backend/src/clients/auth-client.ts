import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/auth";

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  CLINIC_STAFF = "CLINIC_STAFF",
  ADMIN = "ADMIN",
}

export interface UserPermissions {
  authId: string
  role: Role
  clinicId?: number
  doctorId?: number
  patientId?: number
  adminId?: number
  clinicStaffId?: number
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    this.firebaseAuthAdmin = admin.initializeApp({}).auth();
  }

  public async setPermissions(userPermissions: UserPermissions): Promise<void> {
    const { authId, ...userClaims } = userPermissions;
    await this.firebaseAuthAdmin.setCustomUserClaims(authId, userClaims);
  }

  public async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return getAuth().verifyIdToken(idToken);
  }
}

export const authClient = new AuthClient();
