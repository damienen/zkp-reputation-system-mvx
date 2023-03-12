import { Address } from "@multiversx/sdk-core/out";
import { BackendAccount } from "./backendAccount";
import { walletPassword } from "./constants";
import { Contract } from "./reputationQuery";
export class KycWebhook {
  async kycWebhook(request: any) {
    if (request.http.method === "POST") {
      const key = request.body.key;
      const password = walletPassword;
      const backend = new BackendAccount();
      const reputationQuery = new Contract();
      let message = "";
      if (password && request.body.status === "approved") {
        message = await backend.checkKycKey(key, password);
        const receiver = await reputationQuery.getKycNotification(key);
        if (receiver.data instanceof Address) {
          await backend.sendxPortalNotification(receiver.data, password);
        }
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
