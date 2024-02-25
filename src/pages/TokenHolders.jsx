import React, { useState, useEffect } from "react";
import MemesAddresses from "./Memes.jsx";

const TokenHolders = () => {
  const [holderCounts, setHolderCounts] = useState([]);

  useEffect(() => {
    const fetchHolderCounts = async () => {
      try {
        const counts = await Promise.all(
          MemesAddresses.map(async (contractAddress) => {
            // Simulated data for testing purposes
            const simulatedTransferEvents = [
              { topics: ["", "address1", "address2"] },
              { topics: ["", "address3", "address4"] },
              { topics: ["", "address5", "address6"] },
            ];

            // Approximate number of unique addresses involved in transfers
            const uniqueAddresses = new Set();
            simulatedTransferEvents.forEach((event) => {
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
