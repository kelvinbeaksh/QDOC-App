import * as admin from "firebase-admin";
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
      try {
        // Initialize Firebase Admin SDK
        admin.initializeApp({
          projectId: 'local-project'
        });
        this.firebaseAuthAdmin = admin.auth();
        console.log('Firebase Admin SDK initialized successfully');

        // Connect to emulator
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9098';
        console.log('Connecting to Firebase Auth Emulator on localhost:9098');

        // Initialize emulator
        admin.auth().useEmulator('http://localhost:9098');
      } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
        throw new Error('Failed to initialize Firebase Admin SDK');
      }
    } else {
      try {
        this.firebaseAuthAdmin = admin.auth();
        console.log('Using existing Firebase Admin SDK instance');
      } catch (error) {
        console.error('Failed to get existing Firebase Admin SDK instance:', error);
        throw new Error('Failed to get existing Firebase Admin SDK instance');
      }
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
