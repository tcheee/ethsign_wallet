import { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: 'Infura ID',
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'My Awesome App', // Required
      infuraId: 'Infura ID',
      rpc: '', // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
};

function App() {
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState('');
  const [content, setContent] = useState('');

  const handleClick = async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    setSigner(signer);
    setAddress(await signer.getAddress());
  };

  const handleSign = async () => {
    console.log(signer);
    console.log(await signer.getAddress());
    console.log(content);
    const contentEncoded = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'string', 'uint256'],
      ['0x', 50, 'test', 0]
    );
    console.log(contentEncoded);
    const dataHashBin = ethers.utils.arrayify(contentEncoded);
    const hash = await signer.signMessage(dataHashBin);
    console.log(hash);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h5> Test on Signature and wallet </h5>
        {address ? (
          <div>
            <h6> Connected with {address} </h6>
            <input onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleSign}>Sign it</button>
          </div>
        ) : (
          <button onClick={handleClick}> Connect </button>
        )}
      </div>
    </div>
  );
}

export default App;
