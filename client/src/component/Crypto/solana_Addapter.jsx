import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import AirDrop from "./AirDrop";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./SolanaAdapter.css"; // Import the CSS file
import CoinData from "./CoinData";

function Solana_Adapter() {
  return (
    <div className="solana-background flex flex-col items-end justify-center p-8">
      <ConnectionProvider endpoint="https://solana-devnet.g.alchemy.com/v2/cHoM2bnzBlP2k9MAYnYPtBDAzaEjJqnK">
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="flex m-8 space-x-2 mb-8">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <div className="flex justify-between w-full">
              <div className="w-1/2">
                <CoinData />
              </div>
              <div className="w-1/2 flex justify-end">
                <AirDrop />
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default Solana_Adapter;


