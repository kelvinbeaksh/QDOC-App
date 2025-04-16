import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { DecodedIdToken } from "firebase-admin/auth";

export enum UserRoles {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  CLINIC_STAFF = "CLINIC_STAFF",
  ADMIN = "ADMIN"
}

export interface UserPermissions {
  authId: string
  role: UserRoles
  clinicId?: number
  doctorId?: number
  patientId?: number
  adminId?: number
  clinicStaffId?: number
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    if (!admin.apps.length) {
      const config = JSON.parse(process.env.FIREBASE_CONFIG || '{}');
      const appConfig: admin.AppOptions = {
        projectId: config.projectId,
        credential: admin.credential.applicationDefault()
      };

      this.firebaseAuthAdmin = admin.initializeApp(appConfig).auth();
      
      // Only connect to emulator if explicitly set in environment
      console.log('Using production Firebase Auth');
      
      if (process.env.NODE_ENV === 'local') {
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9098';
      }
    } else {
      this.firebaseAuthAdmin = admin.app().auth();
    }
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
