import { apiClient } from "../clients/api-client";
import { GenericErrorWrapper } from "../utils/error-handlers";

interface SendVerificationTokenRequest {
  mobileNumber: string
}

export interface VerifyMobilePhone {
  to: string
  channel: string
  status: string
  valid: boolean
}

interface CheckVerificationTokenRequest {
  mobileNumber: string
  token: string
}

class MobileService {
  @GenericErrorWrapper()
  public static async sendVerificationToken(mobileNumber: string): Promise<VerifyMobilePhone> {
    const result = (await apiClient.post<VerifyMobilePhone, SendVerificationTokenRequest>(
      "/mobile/send-verification-token", { mobileNumber }
    ));
    return result.data;
  }

  @GenericErrorWrapper()
  public static async checkVerificationToken(mobileNumber: string,
    token: string): Promise<VerifyMobilePhone> {
    const result = (await apiClient.post<VerifyMobilePhone, CheckVerificationTokenRequest>(
      "/mobile/verify-token", { mobileNumber, token }
    ));
    return result.data;
  }
}

export default MobileService;
