import { keccak256, toUtf8Bytes } from "ethers";
import { MetaAttribute } from "@/types/badge";

const BADGE_ATTR = [
  "Level",
  "Category",
  "Theme",
  "Shape",
  "Border",
  "Icon",
  "Text",
];

export function buildFingerprint(attributes: MetaAttribute[]): string {
  let payload = "";
  BADGE_ATTR.map((item, index) => {
    const attr = attributes.find((a) => a.trait_type === item);
    payload += `${item}:${attr?.value}`;
    payload += index < BADGE_ATTR.length - 1 ? "|" : "";
  });
  console.log("payload:", payload);
  return keccak256(toUtf8Bytes(payload));
}

function main() {
  const attributes: MetaAttribute[] = [
    {
      trait_type: "Level",
      value: 3,
    },
    {
      trait_type: "Category",
      value: "Builder",
    },
    {
      trait_type: "Theme",
      value: "Seafoam Mint",
    },
    {
      trait_type: "Shape",
      value: "Hexagon",
    },
    {
      trait_type: "Border",
      value: "Thin",
    },
    {
      trait_type: "Icon",
      value: "Leaf",
    },
    {
      trait_type: "Text",
      value: "qqq",
    },
  ];

  console.log("attributes:", attributes);
  console.log("fingerprint:", buildFingerprint(attributes));
}

main();
