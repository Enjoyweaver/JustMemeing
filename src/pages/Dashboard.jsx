import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Balances from "./Balances";
import ChainSelector from "./ChainSelector";

const colors = [
  "#F44336",
  "#673AB7",
  "#03A9F4",
  "#4CAF50",
  "#FFEB3B",
  "#FF5722",
  "#607D8B",
];

function Portfolio() {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(250);
  const [publicKey] = useState("0xD156382c8B7CF309865c7ACAc5Caea323f8C30A4");
  const [apiKey, setApiKey] = useState("");
  const [balances, setBalances] = useState([]); // State to hold token balances
  const [selectedChain, setSelectedChain] = useState(); // State to hold selected blockchain
  const [chains, setChains] = useState([]);

  // Function to handle blockchain selection
  const handleChainSelect = (chainId) => {
    setChainId(chainId);
  };

  useEffect(() => {
    setApiKey(import.meta.env.VITE_API_KEY);
    if (publicKey && chainId) {
      setLoading(true);

      const historicPortfolioValueEndpoint = `https://api.covalenthq.com/v1/${chainId}/address/${publicKey}/portfolio_v2/?days=365`;

      // Fetching historic portfolio value
      fetch(historicPortfolioValueEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(apiKey + ":")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const rawData = res.data.items;
          const transformedData = transformForRecharts(rawData);
          const dataKeys = rawData.map((item) => item.contract_ticker_symbol);
          setKeys(dataKeys);
          setData(transformedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching portfolio data:", error);
          setLoading(false);
        });
    }
  }, [publicKey, chainId, apiKey]);

  useEffect(() => {
    const fetchWalletActivity = (publicKey) => {
      const walletActivityEndpoint = `https://api.covalenthq.com/v1/labs/activity/${publicKey}/`;
      fetch(walletActivityEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(apiKey + ":")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data && res.data.items) {
            const excludeTestnet = res.data.items.filter(
              (item) => !item.is_testnet
            );
            setChains(excludeTestnet);
          }
        })
        .catch((error) => {
          console.error("Error fetching wallet activity:", error);
          // Handle errors here as needed
        });
    };

    fetchWalletActivity(publicKey);
  }, [apiKey, publicKey]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container mt-20">
      <div className="paragraph-container mt-10">
        <p
          style={{
            color: "var(--header-color)",
            fontSize: "1.7rem",
            maxWidth: "800px",
            marginBottom: "20px",
          }}
        >
          This is the DAOsigner Dashboard, which is a tool for DAOsigners to
          track their earnings and portfolio value over time, as well as for you
          to see our historical sales.
        </p>
        <br />
      </div>
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        {chains && chains.length > 0 ? (
          <div>
            {console.log("Chains:", chains)}

            <ChainSelector
              chains={chains}
              handleChainSelect={handleChainSelect}
            />
          </div>
        ) : (
          <div>No chains found or loading...</div>
        )}
      </div>
      <br />
      <p
        style={{
          color: "var(--description-color)",
          fontSize: "1.7rem",
          maxWidth: "800px",
          marginBottom: "20px",
        }}
      >
        Current Balance
      </p>
      <Balances chainId={chainId} />
      <br />
      <p
        style={{
          color: "var(--description-color)",
          fontSize: "1.7rem",
          maxWidth: "800px",
          marginBottom: "20px",
        }}
      >
        Historical Value
      </p>
      <div className="chart-container mb-40">
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
          <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
          <Legend tick={{ fontSize: "1.6em" }} />
          {keys.map((item, i) => {
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
  );
}

export default Portfolio;

const transformForRecharts = (rawData) => {
  const transformedData = rawData.reduce((acc, curr) => {
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
  }, []);

  return transformedData;
};
