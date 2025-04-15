/* eslint-disable no-console */
import firebase from "firebase/app";
import "firebase/auth";
import Config, { FirebaseConfig } from "../config/config";
import BusinessError from "../errors/business-error";
import TechnicalError from "../errors/technical-error";
import { User, UserPermissions } from "../contexts/user-context";

export enum UserRoles {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  CLINIC_STAFF = "CLINIC_STAFF",
  ADMIN = "ADMIN"
}

export function hasClinicAccess(user: User): Boolean {
  return user && (user.role === UserRoles.DOCTOR || user.role === UserRoles.CLINIC_STAFF);
}

export class AuthClient {
  protected firebaseAuthInstance: firebase.auth.Auth;

  private authBusinessErrors = {
    "auth/invalid-email": true,
    "auth/email-already-in-use": true,
    "auth/weak-password": true,
    "auth/wrong-password": true,
    "auth/user-not-found": true,
    "auth/user-disabled": true
  };

  constructor(firebaseConfig: FirebaseConfig) {
    firebase.initializeApp(firebaseConfig);
    const authInstance = firebase.auth();
    if (Config.isUsingFirebaseEmulator) {
      authInstance.useEmulator(Config.firebaseEmulatorUrl);
    }
    this.firebaseAuthInstance = authInstance;
  }

  public async register(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.firebaseAuthInstance.createUserWithEmailAndPassword(email, password);
    } catch (e) {
      return this.handleFirebaseAuthErrors(e);
    }
  }

  public async delete(user: firebase.User): Promise<void> {
    try {
      await user.delete();
    } catch (e) {
      this.handleFirebaseAuthErrors(e);
    }
  }

  public async signOut(): Promise<void> {
    return this.firebaseAuthInstance.signOut();
  }

  public async getUserPermissions(): Promise<UserPermissions> {
    if (this.firebaseAuthInstance.currentUser) {
      // reload user before fetching claims
      await this.firebaseAuthInstance.currentUser.reload();
      const idTokenResult = await this.firebaseAuthInstance.currentUser.getIdTokenResult(true);
      const { role, clinicId, doctorId, patientId, adminId, clinicStaffId } = idTokenResult.claims;
      return { role, clinicId, doctorId, patientId, adminId, clinicStaffId };
    }
    return {};
  }

  public async signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.firebaseAuthInstance.signInWithEmailAndPassword(email, password);
    } catch (e) {
      return this.handleFirebaseAuthErrors(e);
    }
  }

  public async verifyEmail(): Promise<void> {
    return this.firebaseAuthInstance.currentUser.sendEmailVerification();
  }

  public get authInstance(): firebase.auth.Auth {
    return this.firebaseAuthInstance;
  }

  public async getUserIdToken(): Promise<string> {
    return this.firebaseAuthInstance.currentUser.getIdToken(true);
  }

  private handleFirebaseAuthErrors(e): never {
    if (this.authBusinessErrors[e.code]) {
      throw new BusinessError(e.message, e.code);
    }
    throw new TechnicalError(e.message);
  }
}

export const authClient = new AuthClient(Config.firebaseConfig);
