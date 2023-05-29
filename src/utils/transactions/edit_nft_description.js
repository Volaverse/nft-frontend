/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const editNFTDescriptionSchema = {
  $id: "lisk/nft/editDescription",
  type: "object",
  required: ["nftId", "description"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    description: {
      dataType: "string",
      fieldNumber: 2,
    },
  },
};

export const editNFTDescription = async ({
                                        description,
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
    editNFTDescriptionSchema,
    {
      moduleID: 1024,
      assetID: 6,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        description,
        nftId: Buffer.from(nftId, "hex"),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(editNFTDescriptionSchema), rest),
    minFee: calcMinTxFee(editNFTDescriptionSchema, minFeePerByte, rest),
  };
};
