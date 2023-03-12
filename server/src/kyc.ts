import { BackendAccount } from "./backendAccount";
import { walletPassword } from "./constants";
export class KycWebhook {
  kycWebhook(request: any) {
    const key = request.body.key;
    const password = walletPassword;
    const backend = new BackendAccount();
    if (password) {
      backend.checkKycKey(key, password);
    }
    return {
      statusCode: "200",
      statusDescription: "Ok",
    };
  }
}
