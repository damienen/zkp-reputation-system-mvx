import { BackendAccount } from "./backendAccount";
import { walletPassword } from "./constants";
export class KycWebhook {
  async kycWebhook(request: any) {
    if (request.http.method === "POST") {
      const key = request.body.key;
      const password = walletPassword;
      const backend = new BackendAccount();
      let message = "";
      if (password && request.body.status === "approved") {
        message = await backend.sendxPortalNotification(key, password);
      }
      return {
        body: {
          message: message,
        },
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
