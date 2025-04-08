import firebase from "firebase";
import { GenericErrorWrapper } from "../utils/error-handlers";
import { authClient, UserRoles } from "../clients/auth-client";
import TechnicalError from "../errors/technical-error";
import { UserPermissions } from "../contexts/user-context";

export type Auth = firebase.auth.Auth;

export interface UserCredential {
  user: firebase.User
}

class AuthService {
  public static async register(email: string, password: string): Promise<UserCredential> {
    return authClient.register(email, password);
  }

  public static async delete(user: firebase.User): Promise<void> {
    return authClient.delete(user);
  }

  @GenericErrorWrapper()
  public static async signOut(): Promise<void> {
    return authClient.signOut();
  }

  @GenericErrorWrapper()
  public static async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return authClient.signInWithEmailAndPassword(email, password);
  }

  public static async getUserPermissions(): Promise<UserPermissions> {
    try {
      const userPermissions = await authClient.getUserPermissions();
      return this.verifiedUserPermissions(userPermissions);
    } catch (e) {
      throw new TechnicalError(e.message);
    }
  }

  private static verifiedUserPermissions(userPermissions: UserPermissions): UserPermissions {
    switch (userPermissions.role) {
      case UserRoles.ADMIN:
        return { role: UserRoles.ADMIN, adminId: userPermissions.adminId };
      case UserRoles.CLINIC_STAFF:
        return { role: UserRoles.CLINIC_STAFF,
          clinicStaffId: userPermissions.clinicStaffId,
          clinicId: userPermissions.clinicId };
      case UserRoles.DOCTOR:
        return { role: UserRoles.DOCTOR, doctorId: userPermissions.doctorId, clinicId: userPermissions.clinicId };
      case UserRoles.PATIENT:
        return { role: UserRoles.PATIENT, patientId: userPermissions.patientId };
      default:
        console.error(`No UserRole found in customClaims: ${JSON.stringify(userPermissions)}`);
        return {};
    }
  }
}

export default AuthService;
