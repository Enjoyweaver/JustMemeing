import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MemesAddresses from "./Memes.jsx";

const TokenHolders = () => {
  const [holderCounts, setHolderCounts] = useState([]);

  useEffect(() => {
    const fetchHolderCounts = async () => {
      try {
        const web3 = new Web3("https://rpc.ftm.tools/");

        const counts = await Promise.all(
          MemesAddresses.map(async (contractAddress) => {
            const transferEventSignature = web3.utils.sha3(
              "Transfer(address,address,uint256)"
            );

            // Get the latest block number
            const latestBlock = await web3.eth.getBlockNumber();

            // Fetch logs within a specific block range (e.g., last 10000 blocks)
            const transferEvents = await web3.eth.getPastLogs({
              fromBlock: latestBlock - 2000, // Adjust this number as needed
              toBlock: latestBlock,
              address: contractAddress,
              topics: [transferEventSignature],
            });

            // Approximate number of unique addresses involved in transfers
            const uniqueAddresses = new Set();
            transferEvents.forEach((event) => {
              uniqueAddresses.add(event.topics[1]); // indexed parameter (from)
              uniqueAddresses.add(event.topics[2]); // indexed parameter (to)
            });

            const holderCount = uniqueAddresses.size;
            return { address: contractAddress, holders: holderCount };
          })
        );

        setHolderCounts(counts);
      } catch (error) {
        console.error("Error fetching token holders:", error);
      }
    };

    fetchHolderCounts();
  }, []);

  return (
    <div
      style={{
        marginTop: "80px",
        justifyContent: "center",
        display: "flex",
        gap: "20px",
      }}
    >
      <h2>Token Holder Counts</h2>
      <ul>
        {holderCounts.map((token, index) => (
          <li key={index}>
            <p>Contract Address: {token.address}</p>
            <p>Token Holders: {token.holders}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenHolders;
