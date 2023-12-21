import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import MemesAddresses from "./Memes.jsx";

const transformForUnifiedTimeline = (rawData) => {
  const transformedData = rawData.reduce((acc, curr) => {
    curr.prices.forEach((price) => {
      const existingData = acc.find((data) => data.date === price.date);

      if (existingData) {
        existingData[curr.contract_address] = price.price;
      } else {
        const newData = {
          date: price.date,
          [curr.contract_address]: price.price,
        };
        acc.push(newData);
      }
    });

    return acc;
  }, []);

  return transformedData;
};

const Prices = ({ contractAddresses }) => {
  const [pricesData, setPricesData] = useState([]);
  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chainName = "fantom-mainnet";
        const quoteCurrency = "USD";
        const apiKey = import.meta.env.VITE_API_KEY;
        // Use the addresses from MemesAddresses array
        const validAddresses =
          Array.isArray(MemesAddresses) && MemesAddresses.length > 0
            ? MemesAddresses
            : [];

        if (validAddresses.length === 0) {
          console.error("No addresses provided in MemesAddresses");
          return;
        }

        // Calculate start and end timestamps for the desired date range
        const startDate = new Date("2023-01-01").toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const endDate = new Date("2023-12-01").toISOString().split("T")[0]; // Format: YYYY-MM-DD

        const apiUrl = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainName}/${quoteCurrency}/${validAddresses.join(
          ","
        )}/?key=${apiKey}&from=${startDate}&to=${endDate}`;

        const response = await fetch(apiUrl);
        const responseData = await response.json();

        if (responseData.error || !Array.isArray(responseData.data)) {
          console.error("Error in API response:", responseData.error_message);
          return; // Stop further execution if there's an error in the response
        }

        const formattedPrices = transformForUnifiedTimeline(responseData.data);

        setPricesData(formattedPrices);
        setTokenData(responseData.data);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, []);

  const formatTokenPrice = (price) => {
    const priceBN = BigInt(parseFloat(price * 10 ** 18).toFixed(0)); // Convert the number to BigInt
    const decimals = BigInt(10 ** 18); // Define the decimals as a BigInt
    const priceNumber = Number(priceBN / decimals); // Convert to a Number after dividing by the decimals

    return `$${priceNumber.toFixed(2)}`; // Displaying 2 decimal places with a dollar sign
  };

  return (
    <>
      <div
        style={{
          marginTop: "80px",
          justifyContent: "center",
          display: "flex",
          gap: "20px",
        }}
      >
        <div>
          <h2>Token Details</h2>
          <ul>
            {tokenData.map((token, index) => (
              <li key={index}>
                <img src={token.logo_url} alt={token.contract_ticker_symbol} />
                <p>Name: {token.contract_name}</p>
                <p>Symbol: {token.contract_ticker_symbol}</p>
                <p>Address: {token.contract_address}</p>
                {token.prices &&
                token.prices.length > 0 &&
                token.prices[0].price !== null ? (
                  <p>Price: {token.prices[0].pretty_price}</p>
                ) : (
                  <p>Price: Not available</p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Current Prices</h2>
          {pricesData.length > 0 && ( // Check if pricesData has data before rendering the chart
            <LineChart
              width={1000}
              height={400}
              data={pricesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatTokenPrice(value)} />
              <Tooltip formatter={(value) => formatTokenPrice(value)} />
              <Legend />
              {Object.keys(pricesData[0] || {})
                .filter((key) => key !== "date")
                .map((address, index) => {
                  const matchingToken = tokenData.find(
                    (token) => token.contract_address === address
                  );

                  return (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={address}
                      name={
                        matchingToken ? matchingToken.contract_name : address
                      } // Use contract_name if available, otherwise use address
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(
                        16
                      )}`}
                      strokeWidth={2}
                      dot={false}
                    />
                  );
                })}
            </LineChart>
          )}
        </div>
      </div>
    </>
  );
};

export default Prices;
