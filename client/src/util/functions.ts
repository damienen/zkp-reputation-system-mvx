export const buildNftId = (collectionId: string, nonce: number) => {
  let hexnonce = nonce?.toString(16);
  if (hexnonce?.length % 2 !== 0) {
    hexnonce = "0" + hexnonce;
  }
  return collectionId + "-" + hexnonce;
};