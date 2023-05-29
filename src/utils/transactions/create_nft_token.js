/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createNFTTokenSchema = {
  $id: "lisk/nft/create",
  type: "object",
  required: ["minPurchaseMargin", "initValue", "name","category","imageUrl"],
  properties: {
    minPurchaseMargin: {
      dataType: "uint32",
      fieldNumber: 1,
    },
    initValue: {
      dataType: "uint64",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
    description: {
      dataType: "string",
      fieldNumber: 4,
    },
    category: {
      dataType: "uint32",
      fieldNumber: 5,
    },
    imageUrl: {
      dataType: "string",
      fieldNumber: 6,
    },
    x: {
      dataType: "string",
      fieldNumber: 7,
    },
    y: {
      dataType: "string",
      fieldNumber: 8,
    },
    threeDUrl: {
      dataType: "string",
      fieldNumber: 9,
    },
    area: {
      dataType: "string",
      fieldNumber: 10,
    },
    landmark: {
      dataType: "string",
      fieldNumber: 11,
    },
    type: {
      dataType: "string",
      fieldNumber: 12,
    },
    bodypart: {
      dataType: "string",
      fieldNumber: 13,
    },
    gender: {
      dataType: "string",
      fieldNumber: 14,
    },
    serialNo: {
      dataType: "string",
      fieldNumber: 15,
    },
  },
};
export const createNFTToken = async ({
  name,
  description,
  initValue,
  minPurchaseMargin,
  passphrase,
  category,
  imageUrl,
  fee,
  x,
  y,
  threeDUrl,
  area,
  landmark,
  type,
  bodypart,
  gender,
  serialNo,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");
  console.log("Value for nft creation CATEGORY"+ parseInt(category)+ " : "+ imageUrl);

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const { id, ...rest } = transactions.signTransaction(
    createNFTTokenSchema,
    {
      moduleID: 1024,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        description,
        initValue: BigInt(transactions.convertLSKToBeddows(initValue)),
        minPurchaseMargin: parseInt(minPurchaseMargin),
        category: parseInt(category),
        imageUrl,
        x,
        y,
        threeDUrl,
        area,
        landmark,
        type,
        bodypart,
        gender,
        serialNo,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest),
    minFee: calcMinTxFee(createNFTTokenSchema, minFeePerByte, rest),
  };
};
