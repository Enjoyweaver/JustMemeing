import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
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

        const startDate = new Date("2023-01-01").toISOString().split("T")[0];
        const endDate = new Date().toISOString().split("T")[0];

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
    const priceNumber = parseFloat(price * 10 ** 18); // Convert the number to a float
    return `$${(priceNumber / 10 ** 18).toFixed(10)}`; // Displaying up to 10 decimal places with a dollar sign
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
          <h2>Current Prices</h2>
          {pricesData.length > 0 && (
            <LineChart
              width={1400}
              height={600}
              data={pricesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--header-color)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--description-color)", fontSize: ".9em" }}
              />
              <YAxis
                type="number"
                allowDataOverflow={true}
                tick={{ fill: "var(--header-color)", fontSize: ".9em" }}
                tickFormatter={(value) => {
                  if (value < 0.01) {
                    return `$${parseFloat(value).toFixed(12)}`;
                  } else {
                    return `$${parseFloat(value).toFixed(2)}`;
                  }
                }}
              />
              <Tooltip
                formatter={(value) => {
                  if (value < 0.01) {
                    return `$${parseFloat(value).toFixed(12)}`;
                  } else {
                    return `$${parseFloat(value).toFixed(2)}`;
                  }
                }}
              />
              <Legend
                align="center"
                verticalAlign="top"
                layout="horizontal"
                iconType="diamond"
                iconSize={20}
                height={46}
              />
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
                      }
                      stroke={`#${Math.floor(Math.random() * 16777215).toString(
                        16
                      )}`}
                      strokeWidth={3.2}
                      dot={false}
                    />
                  );
                })}
              <Brush dataKey="date" height={30} stroke="#8884d8" />
              <ReferenceLine x="05/01/2023" stroke="red" label="Test Date" />
            </LineChart>
          )}
        </div>
      </div>
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
    </>
  );
};

export default Prices;
