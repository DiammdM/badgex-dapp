"server only";

import {
  AbiCoder,
  Wallet,
  concat,
  getAddress,
  keccak256,
  toUtf8Bytes,
} from "ethers";
import { MetaAttribute } from "@/types/badge";

const issuerPrivateKey = process.env.ISSUER_PRIVATE_KEY as string;

const BADGE_ATTR = [
  "Level",
  "Category",
  "Theme",
  "Shape",
  "Border",
  "Icon",
  "Text",
];

const DOMAIN_TYPEHASH = keccak256(
  toUtf8Bytes(
    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
  )
);
const MINT_TYPEHASH = keccak256(
  toUtf8Bytes("mintBadge(address to,bytes32 fingerprint)")
);
const DOMAIN_NAME_HASH = keccak256(toUtf8Bytes("BadgeNFT"));
const DOMAIN_VERSION_HASH = keccak256(toUtf8Bytes("1"));

type MintSignatureParams = {
  to: string;
  fingerprint: string;
  chainId: bigint | number;
  verifyingContract: string;
  issuerPrivateKey: string;
};

export function buildFingerprint(attributes: MetaAttribute[]): string {
  let payload = "";
  BADGE_ATTR.map((item, index) => {
    const attr = attributes.find((a) => a.trait_type === item);
    payload += `${item}:${attr?.value}`;
    payload += index < BADGE_ATTR.length - 1 ? "|" : "";
  });
  return keccak256(toUtf8Bytes(payload));
}

export function buildSignature({
  to,
  fingerprint,
  chainId,
  verifyingContract,
}: MintSignatureParams): string {
  const abiCoder = AbiCoder.defaultAbiCoder();
  // build struct hash
  const structHash = keccak256(
    abiCoder.encode(
      ["bytes32", "address", "bytes32"],
      [MINT_TYPEHASH, getAddress(to), fingerprint]
    )
  );
  // build domainSeparator
  const domainSeparator = keccak256(
    abiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        DOMAIN_TYPEHASH,
        DOMAIN_NAME_HASH,
        DOMAIN_VERSION_HASH,
        chainId,
        getAddress(verifyingContract),
      ]
    )
  );
  // simulate EIP712 _hashTypedDataV4 to compute digest
  const digest = keccak256(
    concat([toUtf8Bytes("\x19\x01"), domainSeparator, structHash])
  );
  // sign the digest
  const wallet = new Wallet(issuerPrivateKey);
  return wallet.signingKey.sign(digest).serialized;
}
