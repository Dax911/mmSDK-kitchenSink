import { MetaMaskSDK, MetaMaskSDKOptions, SDKProvider } from '@metamask/sdk';
import * as fs from 'fs';

const qrcode = require('qrcode-terminal');

const options: MetaMaskSDKOptions = {
  shouldShimWeb3: false,
  dappMetadata: {
    name: 'Sotheb3s',
    url: 'https://www.github.com/Dax911',
  },
  logging: {
    sdk: false,
  },
  checkInstallationImmediately: false,
  modals: {
    install: ({ link }) => {
      qrcode.generate(link, { small: true }, (qr) => console.log(qr));
      return {};
    },
    otp: () => {
      return {
        mount() {},
        updateOTPValue: (otpValue) => {
          if (otpValue !== '') {
            console.debug(
              `[CUSTOMIZE TEXT] Choose the following value on your metamask mobile wallet: ${otpValue}`,
            );
          }
        },
      };
    },
  },
};

const sdk = new MetaMaskSDK(options);

let bidHistory: Array<any> = [];

const createBid = (fromAddress: string, itemId: number, bidAmount: number) => {
  const msgParams = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Bid: [
        { name: 'from', type: 'Person' },
        { name: 'itemId', type: 'uint256' },
        { name: 'bidAmount', type: 'uint256' },
      ],
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
    },
    primaryType: 'Bid',
    domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: '0xe704',
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    message: {
      from: {
        name: 'Bidder',
        wallet: fromAddress,
      },
      itemId,
      bidAmount,
    },
  };

  return msgParams;
};

const start = async () => {
  console.debug(`start NodeJS example`);

  const accounts = await sdk.connect();
  console.log('connect request accounts', accounts);

  const ethereum = sdk.getProvider();

  ethereum.on('_initialized', async () => {
    const from = accounts?.[0];

    const itemId = 1; // Get this dynamically, perhaps from user input or another source
    const bidAmount = 1000; // Get this dynamically, perhaps from user input

    const msgParams = createBid(from, itemId, bidAmount);
    const signResponse = await ethereum.request({
      method: 'eth_signTypedData_v3',
      params: [from, JSON.stringify(msgParams)],
    });

    console.log('sign response', signResponse);

    bidHistory.push({ from, itemId, bidAmount, signature: signResponse });
    console.log('Bid history', bidHistory);
  });
};

start().catch((err) => {
  console.error(err);
});
