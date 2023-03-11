export class KycWebhook {
  kycWebhook(request: any) {
    console.log(`Request received with body ${request.body}!`);
    if (!request.body.name) {
      throw Error("Missing parameter name");
    }

    const name = request.body.name;

    return {
      body: {
        name,
      },
      headers: { testHeader: "testHeaderValue" },
      statusCode: "201",
      statusDescription: "Ok",
    };
  }
}
