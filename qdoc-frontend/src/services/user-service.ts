import { apiClient } from "../clients/api-client";
import { SignUpFormValues } from "../pages/SignUpPage";
import { GenericErrorWrapper } from "../utils/error-handlers";
import AuthService, { UserCredential } from "./auth-service";
import { UserRoles } from "../clients/auth-client";
import firebase from "firebase";
import { User } from "../contexts/user-context";

const ROLE_API_PATH_MAPPING = {
  [UserRoles.ADMIN]: "/admins",
  [UserRoles.PATIENT]: "/patients",
  [UserRoles.DOCTOR]: "/doctors",
  [UserRoles.CLINIC_STAFF]: "/clinic-staffs"
};

class UserService {
  @GenericErrorWrapper()
  public static async signUp(role: UserRoles, formValues: SignUpFormValues): Promise<void> {
    const userCredentials = await UserService.register(formValues.email, formValues.password);

    if (userCredentials) {
      const { firstName, lastName, email, mobileNumber, mobileInternationalCode, dateOfBirth, clinicId } = formValues;
      let userAttributes = { firstName,
        lastName,
        email,
        mobileNumber: `${mobileInternationalCode}${mobileNumber}`,
        dateOfBirth,
        authId: userCredentials.user.uid } as User;
      if (role === UserRoles.DOCTOR) {
        userAttributes = { ...userAttributes, clinicId: Number(clinicId) };
      }
      await UserService.createUser(role, userAttributes, userCredentials);
    }
  }

  private static async register(email: string, password: string): Promise<UserCredential> {
    try {
      return await AuthService.register(email, password);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error registering user: ${e.message}`);
      throw e;
    }
  }

  private static async createUser(role: UserRoles, userAttributes: User,
    userCredentials: UserCredential): Promise<void> {
    try {
      const path = ROLE_API_PATH_MAPPING[role];
      await apiClient.post(path, userAttributes);
    } catch (error) {
      console.error(`Error creating user with apiClient: ${error.message}`);
      await UserService.deleteUser(userCredentials.user);
      throw error;
    }
  }

  private static async deleteUser(user: firebase.User): Promise<void> {
    try {
      await AuthService.delete(user);
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }
}

export default UserService;
