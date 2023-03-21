# Zero-Knowledge KYC using MultiversX NFTs

[![deployed with: genezio](https://img.shields.io/badge/deployed_with-genezio-6742c1.svg?labelColor=62C353&style=flat-square)](https://github.com/genez-io/genezio)

This project represents a Zero-Knowledge design for the usual KYC workflow. Its frontend and backend are hosted using [genezio](https://github.com/Genez-io/genezio) and the smart contract is on [MultiversX](https://docs.multiversx.com/developers/overview). The KYC provider that was used is [Passbase](https://passbase.com/).

The project has the following workflow:

- reputation giver
  - creates a space (an sft collection)
  - adds campaigns
  - can choose to distribute a campaign via KYC
- reputation collector
  - can go to a space
  - can choose a campaign
  - can verify via KYC
  - can claim NFT once KYC is verified

This makes it so a user can complete a KYC once and receive a special NFT that shows everyone on the blockchain they completed the KYC without giving the other blockchain users access to their data.

You can interact with a deployed [demo](https://durin-mellon-elrond.app.genez.io./) here.

## Technical details

The project is deployed using [genezio](https://github.com/Genez-io/genezio) for both backend and frontend.

The CI/CD is automated using a Github Action in `.github/workflows/deploy.yaml.`
For more details on how to use this action, check out the official [documentation](https://github.com/Genez-io/genezio-github-action/blob/main/README.md).

The SC is deployed using the interaction snippets created in the contract/snippets folder.

## How to run the project

You can run the backend by going into the server folder and using the command:

```
genezio local
```

You can run the frontend by going into the client folder and using the command:

```
npm start
```

Note: Make sure to set your Wallet Connect V2 and Passbase keys in the .env file.

```
REACT_APP_WALLETCONNECTV2_KEY =
REACT_APP_PASSBASE_KEY =
```
