import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AirDrop from "./AirDrop";

// Ensure to install default wallets and styles:
// npm install @solana/wallet-adapter-wallets
// npm install @solana/wallet-adapter-react-ui
import "@solana/wallet-adapter-react-ui/styles.css";

function Solana_Adapter() {
  return (
    <div className="flex flex-col items-end justify-center min-h-screen bg-gray-100 p-8">
      <ConnectionProvider endpoint="https://solana-devnet.g.alchemy.com/v2/cHoM2bnzBlP2k9MAYnYPtBDAzaEjJqnK">
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="flex m-8 space-x-2 mb-8">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <AirDrop />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default Solana_Adapter;
