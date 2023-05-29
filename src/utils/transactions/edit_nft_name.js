/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const editNFTNameSchema = {
  $id: "lisk/nft/editName",
  type: "object",
  required: ["nftId", "name"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    name: {
      dataType: "string",
      fieldNumber: 2,
    },
  },
};

export const editNFTname = async ({
                                         name,
                                         nftId,
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
    editNFTNameSchema,
    {
      moduleID: 1024,
      assetID: 5,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        nftId: Buffer.from(nftId, "hex"),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(editNFTNameSchema), rest),
    minFee: calcMinTxFee(editNFTNameSchema, minFeePerByte, rest),
  };
};
