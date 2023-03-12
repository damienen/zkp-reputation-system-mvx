export class KycWebhook {
  kycWebhook(request: any) {
    const key = request.body.key;

    return {
      statusCode: "200",
      statusDescription: "Ok",
    };
  }
}
