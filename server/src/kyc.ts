import { BackendAccount } from "./backendAccount";
import { walletPassword } from "./constants";
export class KycWebhook {
  kycWebhook(request: any) {
    if (request.type === "POST") {
      const key = request.body.key;
      const password = walletPassword;
      const backend = new BackendAccount();
      if (password && request.body.status === "approved") {
        backend.checkKycKey(key, password);
      }
      return {
        statusCode: "200",
        statusDescription: "Ok",
      };
    } else {
      return {
        statusCode: "405",
        statusDescription: "Method Not Allowed",
      };
    }
  }
}
