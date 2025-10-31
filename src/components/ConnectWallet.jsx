import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // Connect wallet handler
  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask belum terpasang brody 🦊");

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

  // Auto reconnect kalau MetaMask udah connect
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
    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-100 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold">🔥 Astro + Web3</h2>

      {account ? (
        <div className="text-center">
          <p className="font-semibold text-green-700">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <p>💰 Balance: {balance} ETH</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
