import { keccak256, toUtf8Bytes } from "ethers";
import {
  MetaAttribute,
  BADGE_TRAITS,
  BadgePropertyNames,
} from "@src/types/badge";

export function buildFingerprint(attributes: MetaAttribute[]): string {
  let payload = "";
  BADGE_TRAITS.forEach((item, index) => {
    const attr = attributes.find((a) => a.trait_type === item);
    payload += `${item}:${attr?.value}`;
    payload += index < BADGE_TRAITS.length - 1 ? "|" : "";
  });
  console.log("payload:", payload);
  return keccak256(toUtf8Bytes(payload));
}

function main() {
  const attributes: MetaAttribute[] = [
    {
      trait_type: BadgePropertyNames.Level,
      value: 3,
    },
    {
      trait_type: BadgePropertyNames.Category,
      value: "Builder",
    },
    {
      trait_type: BadgePropertyNames.Theme,
      value: "Seafoam Mint",
    },
    {
      trait_type: BadgePropertyNames.Shape,
      value: "Hexagon",
    },
    {
      trait_type: BadgePropertyNames.Border,
      value: "Thin",
    },
    {
      trait_type: BadgePropertyNames.Icon,
      value: "Leaf",
    },
    {
      trait_type: BadgePropertyNames.Text,
      value: "qqq",
    },
  ];

  console.log("attributes:", attributes);
  console.log("fingerprint:", buildFingerprint(attributes));
}

main();
