import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const colors = [
  "#F44336",
  "#673AB7",
  "#03A9F4",
  "#4CAF50",
  "#FFEB3B",
  "#FF5722",
];

const Prices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quoteCurrency] = useState("usd");
  const [contractName, setContractName] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);

      const publicKey = "0xf2EcDc4559d62E20b1a7F5FFF5C353f0CD3331C4";
      const chainId = 250;
      const apiKey = import.meta.env.VITE_API_KEY;

      const tokenPriceURL = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainId}/${quoteCurrency}/${publicKey}/?from=2023-05-05&to=2023-12-15`;
      try {
        const response = await fetch(tokenPriceURL, {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(apiKey + ":")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (Array.isArray(responseData.data) && responseData.data.length > 0) {
          const contractDetails = responseData.data[0];
          if (contractDetails && contractDetails.contract_name) {
            setContractName(contractDetails.contract_name);
          } else {
            console.error("Contract name not found in API response");
          }
        } else {
          console.error("Invalid API response format or no data available");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching token prices:", error);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container mt-20">
      <div className="paragraph-container mt-10">
        <div className="chart-container mb-40">
          <h2>Contract Name: {contractName}</h2>
          <LineChart
            width={1200}
            height={500}
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--header-color)" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: "var(--description-color)", fontSize: ".9em" }}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "var(--header-color)", fontSize: "1.2em" }}
            />
            <Tooltip
              formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
            />
            <Legend tick={{ fontSize: "1.6em" }} />
            {Object.keys(data[0] || {}).map((item, i) => {
              return (
                <Line
                  key={i}
                  dataKey={item}
                  stroke={colors[i]}
                  dot={false} // Remove dots marking each data point
                  strokeWidth={3.2} // Set the line thickness
                />
              );
            })}
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Prices;

const transformForRecharts = (rawData) => {
  const transformedData = rawData.reduce((acc, curr) => {
    if (curr.holdings && curr.holdings.length > 0) {
      // Check if holdings exist and have elements
      const singleTokenTimeSeries = curr.holdings.map((holdingsItem) => {
        // Formatting the date string just a little...
        const dateStr = holdingsItem.timestamp.slice(0, 10);
        const date = new Date(dateStr);
        const options = {
          day: "numeric",
          month: "short",
          year: "numeric",
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return {
          timestamp: formattedDate,
          [curr.contract_ticker_symbol]: holdingsItem.close.quote,
        };
      });

      const newArr = singleTokenTimeSeries.map((item, i) =>
        Object.assign(item, acc[i])
      );
      return newArr;
    } else {
      return acc; // If holdings is undefined or empty, return the accumulator as is
    }
  }, []);

  return transformedData;
};
