import React from "react";
import Prices from "./Prices"; // Assuming Prices.jsx is in the same directory

const Memes = () => {
  const memeContractAddresses = [
    "0xf2EcDc4559d62E20b1a7F5FFF5C353f0CD3331C4",
    "0x69c744D3444202d35a2783929a0F930f2FBB05ad",
  ];

  return <Prices contractAddresses={memeContractAddresses} />;
};

export default Memes;
