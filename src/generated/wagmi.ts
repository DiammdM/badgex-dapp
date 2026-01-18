import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BadgeNFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const badgeNftAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'manager', internalType: 'address', type: 'address' },
      {
        name: '_config',
        internalType: 'struct MintConfig',
        type: 'tuple',
        components: [
          { name: 'reserved', internalType: 'uint256', type: 'uint256' },
          { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPerWallet', internalType: 'uint256', type: 'uint256' },
          { name: 'payoutReceiver', internalType: 'address', type: 'address' },
          { name: 'issuer', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MINT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'fingerprintToTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'getMintedCountByAddress',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPayoutReceiver',
    outputs: [
      { name: 'receiver', internalType: 'address payable', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'issuer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxPerWallet',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenURI_', internalType: 'string', type: 'string' },
      { name: 'fingerprint', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mintBadge',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'mintedBy',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'payoutReceiver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'price',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reserved',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'extension', internalType: 'address', type: 'address' }],
    name: 'setExtensionTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_issuer', internalType: 'address', type: 'address' }],
    name: 'setIssuser',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_receiver', internalType: 'address', type: 'address' }],
    name: 'setPayoutReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_price', internalType: 'uint256', type: 'uint256' }],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maxPerWallet', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateMaxPerWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'uriExtension',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuthorityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'fingerprint',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'tokenURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'BadgeMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_fromTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_toTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BatchMetadataUpdate',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxPerWallet',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxPerWalletUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PriceSetSucceed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetPayoutReceiverSucceed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'balance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WithdrawSucceed',
  },
  {
    type: 'error',
    inputs: [{ name: 'authority', internalType: 'address', type: 'address' }],
    name: 'AccessManagedInvalidAuthority',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'AccessManagedRequiredDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'AccessManagedUnauthorized',
  },
  {
    type: 'error',
    inputs: [
      { name: 'fingerprint', internalType: 'bytes32', type: 'bytes32' },
      { name: 'existingTokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BadgeAlreadyMinted',
  },
  { type: 'error', inputs: [], name: 'BeyondPerWallectMaxTokens' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  { type: 'error', inputs: [], name: 'EmptyTokenURI' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'InsufficientFee' },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'NotAllowedReduceMaxPerWallet' },
  { type: 'error', inputs: [], name: 'NotEnoughTokens' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Marketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const marketplaceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'manager', internalType: 'address', type: 'address' },
      { name: '_feeRecipient', internalType: 'address', type: 'address' },
      { name: '_feeBps', internalType: 'uint96', type: 'uint96' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'allowedNFT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeBps',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'list',
    outputs: [{ name: 'listingId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'listingIdOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'listings',
    outputs: [
      { name: 'seller', internalType: 'address', type: 'address' },
      { name: 'nft', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
      { name: 'active', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextListingId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nft', internalType: 'address', type: 'address' },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAllowedNFT',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'bps', internalType: 'uint96', type: 'uint96' },
    ],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuthorityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Canceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'bps', internalType: 'uint96', type: 'uint96', indexed: false },
    ],
    name: 'FeeUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'nft', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Listed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'listingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'platformFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Purchased',
  },
  {
    type: 'error',
    inputs: [{ name: 'authority', internalType: 'address', type: 'address' }],
    name: 'AccessManagedInvalidAuthority',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'AccessManagedRequiredDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'AccessManagedUnauthorized',
  },
  { type: 'error', inputs: [], name: 'AlreadyListed' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'InactiveListing' },
  { type: 'error', inputs: [], name: 'IncorrectValue' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'InvalidFeeRecipient' },
  { type: 'error', inputs: [], name: 'NotAllowedNFT' },
  { type: 'error', inputs: [], name: 'NotApproved' },
  { type: 'error', inputs: [], name: 'NotOwner' },
  { type: 'error', inputs: [], name: 'NotSeller' },
  { type: 'error', inputs: [], name: 'PriceZero' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__
 */
export const useReadBadgeNft = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"MINT_TYPEHASH"`
 */
export const useReadBadgeNftMintTypehash = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'MINT_TYPEHASH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"authority"`
 */
export const useReadBadgeNftAuthority = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadBadgeNftBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadBadgeNftEip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"fingerprintToTokenId"`
 */
export const useReadBadgeNftFingerprintToTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'fingerprintToTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadBadgeNftGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"getMintedCountByAddress"`
 */
export const useReadBadgeNftGetMintedCountByAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'getMintedCountByAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"getPayoutReceiver"`
 */
export const useReadBadgeNftGetPayoutReceiver =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'getPayoutReceiver',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadBadgeNftIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadBadgeNftIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"issuer"`
 */
export const useReadBadgeNftIssuer = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'issuer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"maxPerWallet"`
 */
export const useReadBadgeNftMaxPerWallet = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'maxPerWallet',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"maxSupply"`
 */
export const useReadBadgeNftMaxSupply = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'maxSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"mintedBy"`
 */
export const useReadBadgeNftMintedBy = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'mintedBy',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"name"`
 */
export const useReadBadgeNftName = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadBadgeNftOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"paused"`
 */
export const useReadBadgeNftPaused = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"payoutReceiver"`
 */
export const useReadBadgeNftPayoutReceiver =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'payoutReceiver',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"price"`
 */
export const useReadBadgeNftPrice = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'price',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"reserved"`
 */
export const useReadBadgeNftReserved = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'reserved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadBadgeNftSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: badgeNftAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadBadgeNftSymbol = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadBadgeNftTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"uriExtension"`
 */
export const useReadBadgeNftUriExtension = /*#__PURE__*/ createUseReadContract({
  abi: badgeNftAbi,
  functionName: 'uriExtension',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__
 */
export const useWriteBadgeNft = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteBadgeNftApprove = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"mintBadge"`
 */
export const useWriteBadgeNftMintBadge = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'mintBadge',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteBadgeNftPause = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteBadgeNftSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteBadgeNftSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteBadgeNftSetAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setExtensionTokenURI"`
 */
export const useWriteBadgeNftSetExtensionTokenUri =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'setExtensionTokenURI',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setIssuser"`
 */
export const useWriteBadgeNftSetIssuser = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'setIssuser',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setPayoutReceiver"`
 */
export const useWriteBadgeNftSetPayoutReceiver =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'setPayoutReceiver',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setPrice"`
 */
export const useWriteBadgeNftSetPrice = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'setPrice',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteBadgeNftTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteBadgeNftUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"updateMaxPerWallet"`
 */
export const useWriteBadgeNftUpdateMaxPerWallet =
  /*#__PURE__*/ createUseWriteContract({
    abi: badgeNftAbi,
    functionName: 'updateMaxPerWallet',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteBadgeNftWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: badgeNftAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__
 */
export const useSimulateBadgeNft = /*#__PURE__*/ createUseSimulateContract({
  abi: badgeNftAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateBadgeNftApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"mintBadge"`
 */
export const useSimulateBadgeNftMintBadge =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'mintBadge',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateBadgeNftPause = /*#__PURE__*/ createUseSimulateContract(
  { abi: badgeNftAbi, functionName: 'pause' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateBadgeNftSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateBadgeNftSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateBadgeNftSetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setExtensionTokenURI"`
 */
export const useSimulateBadgeNftSetExtensionTokenUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setExtensionTokenURI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setIssuser"`
 */
export const useSimulateBadgeNftSetIssuser =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setIssuser',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setPayoutReceiver"`
 */
export const useSimulateBadgeNftSetPayoutReceiver =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setPayoutReceiver',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"setPrice"`
 */
export const useSimulateBadgeNftSetPrice =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'setPrice',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateBadgeNftTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateBadgeNftUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"updateMaxPerWallet"`
 */
export const useSimulateBadgeNftUpdateMaxPerWallet =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'updateMaxPerWallet',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link badgeNftAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateBadgeNftWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: badgeNftAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__
 */
export const useWatchBadgeNftEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: badgeNftAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchBadgeNftApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchBadgeNftApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchBadgeNftAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"BadgeMinted"`
 */
export const useWatchBadgeNftBadgeMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'BadgeMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"BatchMetadataUpdate"`
 */
export const useWatchBadgeNftBatchMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'BatchMetadataUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchBadgeNftEip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"MaxPerWalletUpdated"`
 */
export const useWatchBadgeNftMaxPerWalletUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'MaxPerWalletUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchBadgeNftMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'MetadataUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchBadgeNftPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"PriceSetSucceed"`
 */
export const useWatchBadgeNftPriceSetSucceedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'PriceSetSucceed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"SetPayoutReceiverSucceed"`
 */
export const useWatchBadgeNftSetPayoutReceiverSucceedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'SetPayoutReceiverSucceed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchBadgeNftTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchBadgeNftUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link badgeNftAbi}__ and `eventName` set to `"WithdrawSucceed"`
 */
export const useWatchBadgeNftWithdrawSucceedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: badgeNftAbi,
    eventName: 'WithdrawSucceed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__
 */
export const useReadMarketplace = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"allowedNFT"`
 */
export const useReadMarketplaceAllowedNft = /*#__PURE__*/ createUseReadContract(
  { abi: marketplaceAbi, functionName: 'allowedNFT' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"authority"`
 */
export const useReadMarketplaceAuthority = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"feeBps"`
 */
export const useReadMarketplaceFeeBps = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
  functionName: 'feeBps',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"feeRecipient"`
 */
export const useReadMarketplaceFeeRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    functionName: 'feeRecipient',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadMarketplaceIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"listingIdOf"`
 */
export const useReadMarketplaceListingIdOf =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    functionName: 'listingIdOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"listings"`
 */
export const useReadMarketplaceListings = /*#__PURE__*/ createUseReadContract({
  abi: marketplaceAbi,
  functionName: 'listings',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"nextListingId"`
 */
export const useReadMarketplaceNextListingId =
  /*#__PURE__*/ createUseReadContract({
    abi: marketplaceAbi,
    functionName: 'nextListingId',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__
 */
export const useWriteMarketplace = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"buy"`
 */
export const useWriteMarketplaceBuy = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  functionName: 'buy',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteMarketplaceCancel = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"list"`
 */
export const useWriteMarketplaceList = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  functionName: 'list',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setAllowedNFT"`
 */
export const useWriteMarketplaceSetAllowedNft =
  /*#__PURE__*/ createUseWriteContract({
    abi: marketplaceAbi,
    functionName: 'setAllowedNFT',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteMarketplaceSetAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: marketplaceAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setFee"`
 */
export const useWriteMarketplaceSetFee = /*#__PURE__*/ createUseWriteContract({
  abi: marketplaceAbi,
  functionName: 'setFee',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__
 */
export const useSimulateMarketplace = /*#__PURE__*/ createUseSimulateContract({
  abi: marketplaceAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"buy"`
 */
export const useSimulateMarketplaceBuy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'buy',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateMarketplaceCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"list"`
 */
export const useSimulateMarketplaceList =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'list',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setAllowedNFT"`
 */
export const useSimulateMarketplaceSetAllowedNft =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'setAllowedNFT',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateMarketplaceSetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link marketplaceAbi}__ and `functionName` set to `"setFee"`
 */
export const useSimulateMarketplaceSetFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: marketplaceAbi,
    functionName: 'setFee',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__
 */
export const useWatchMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: marketplaceAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchMarketplaceAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Canceled"`
 */
export const useWatchMarketplaceCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    eventName: 'Canceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"FeeUpdated"`
 */
export const useWatchMarketplaceFeeUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    eventName: 'FeeUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Listed"`
 */
export const useWatchMarketplaceListedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    eventName: 'Listed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link marketplaceAbi}__ and `eventName` set to `"Purchased"`
 */
export const useWatchMarketplacePurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: marketplaceAbi,
    eventName: 'Purchased',
  })
