export type Space = {
  space_id: string;
  name: string;
};

export type Campaign = {
  space_id: string;
  nonce: number;
  name: string;
  claim_amount: number;
  max_supply: number;
  minted_supply: number;
  start: Date;
  end: Date;
  created_date: Date;
  require_whitelist: boolean;
  automated: boolean;
};
