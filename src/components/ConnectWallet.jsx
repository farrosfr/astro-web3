import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Connect wallet handler
  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask. 🦊");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);

      const bal = await provider.getBalance(address);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error(err);
    }
  }

  // Auto reconnect if MetaMask is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(async (acc) => {
        if (acc.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const bal = await provider.getBalance(acc[0]);
          setAccount(acc[0]);
          setBalance(ethers.formatEther(bal));
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-white">Connect to Web3</h2>

      {account ? (
        <div className="text-center">
          <p className="font-semibold text-green-400">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <p className="text-gray-300">💰 Balance: {balance} ETH</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
