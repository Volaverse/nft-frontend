/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const sellNFTSchema = {
  $id: "lisk/nft/sell",
  type: "object",
  required: ["nftId", "minPurchaseMargin"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    minPurchaseMargin: {
      dataType: "uint32",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
  },
};

export const sellNFT = async ({
                                         name,
                                         nftId,
                                         minPurchaseMargin,
                                         passphrase,
                                         fee,
                                         networkIdentifier,
                                         minFeePerByte,
                                       }) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase);

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address.toString("hex"));

  const { id, ...rest } = transactions.signTransaction(
    sellNFTSchema,
    {
      moduleID: 1024,
      assetID: 3,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        nftId: Buffer.from(nftId, "hex"),
        minPurchaseMargin: parseInt(minPurchaseMargin),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(sellNFTSchema), rest),
    minFee: calcMinTxFee(sellNFTSchema, minFeePerByte, rest),
  };
};
