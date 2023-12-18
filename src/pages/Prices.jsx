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

const Prices = ({ contractAddresses }) => {
  const [pricesData, setPricesData] = useState([]);
  const [tokenData, setTokenData] = useState([]);

  const transformForRecharts = (rawData) => {
    return rawData.map((token) => ({
      date: token.prices[0].date, // Assuming date is available in the response
      price: token.prices[0].price, // Assuming price is available in the response
      contractName: token.contract_name, // Contract name from the response
      tickerSymbol: token.contract_ticker_symbol,
      contractAddress: token.contract_address, // Contract address from the response
      // Add more fields if needed based on the structure of the response
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chainName = "fantom-mainnet";
        const quoteCurrency = "USD";
        const apiKey = import.meta.env.VITE_API_KEY;

        const validAddresses =
          Array.isArray(contractAddresses) && contractAddresses.length > 0
            ? contractAddresses
            : ["0x321162Cd933E2Be498Cd2267a90534A804051b11"];

        const apiUrl = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainName}/${quoteCurrency}/${validAddresses.join(
          ","
        )}/?key=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (Array.isArray(data.data)) {
          const formattedPrices = transformForRecharts(data.data);
          setPricesData(formattedPrices);
          setTokenData(data.data); // Set token data for displaying token details
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        // Handle errors as needed
      }
    };

    fetchData();
  }, [contractAddresses]);

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
          <LineChart
            width={800}
            height={400}
            data={pricesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              name="Price"
              stroke="#8884d8"
            />
          </LineChart>
        </div>
      </div>
    </>
  );
};

export default Prices;
