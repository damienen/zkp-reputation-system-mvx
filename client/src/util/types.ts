export type Space = {
  space_id: string;
  name: string;
};

export type Campaign = {
  spaceId: string;
  nonce: number;
  name: string;
  claimAmount: number;
  maxSupply: number;
  mintedSupply: number;
  startTimestamp: Date;
  endTimestamp: Date;
  creationDate: Date;
  requireWhitelist: boolean;
  automated: boolean;
};

export type ClaimCampaign = {
  spaceId: string;
  nonce: number;
}
