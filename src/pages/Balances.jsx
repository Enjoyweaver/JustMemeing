import { useState, useEffect } from "react";
import { Table, ConfigProvider } from "antd";
import { getDataFromCovalentAPI } from "../utils/api";

const TokenBalances = ({
  chainId, // Receive chainId as a prop
  nft = true,
  noNFTFetch = true,
  quoteCurrency = "USD",
}) => {
  const [data, setData] = useState([]); // Use setData instead of getData
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [publicKey] = useState("0xD156382c8B7CF309865c7ACAc5Caea323f8C30A4");

  useEffect(() => {
    if (publicKey) {
      fetchData();
    }
  }, [publicKey, chainId, nft, noNFTFetch, quoteCurrency]);

  const handleImgError = (e) => {
    e.target.src = defaultLogo;
  };

  const fetchData = () => {
    setError(false);
    setIsLoading(true);
    const URL = `https://api.covalenthq.com/v1/${chainId}/address/${publicKey}/balances_v2/?quote-currency=${quoteCurrency}&format=JSON&nft=${nft}&no-nft-fetch=${noNFTFetch}`;
    getDataFromCovalentAPI(URL)
      .then((response) => {
        setIsLoading(false);
        setData(response.data.items); // Update state with received data
      })
      .catch((e) => setError(true));
  };

  const columns = [
    {
      title: "",
      dataIndex: "logo_url",
      key: "logo_url",
      render: (text) => (
        <img
          src={text}
          onError={handleImgError}
          style={{ width: "40px", height: "40px" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "contract_name",
      key: "contract_name",
    },
    {
      title: "Symbol",
      dataIndex: "contract_ticker_symbol",
      key: "contract_ticker_symbol",
    },
    {
      title: "Amount",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (_, item) =>
        Number.isInteger(item.balance / 10 ** item.contract_decimals)
          ? item.balance / 10 ** item.contract_decimals
          : (item.balance / 10 ** item.contract_decimals).toFixed(4),
    },
    {
      title: "Value",
      dataIndex: "pretty_quote",
      key: "pretty_quote",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "cryptocurrency",
          value: "cryptocurrency",
        },
        {
          text: "stablecoin",
          value: "stablecoin",
        },
        {
          text: "nft",
          value: "nft",
        },
        {
          text: "dust",
          value: "dust",
        },
      ],
      onFilter: (value, item) => item.type.startsWith(value),
    },
    {
      title: "Contract Address",
      dataIndex: "contract_address",
      key: "contract_address",
    },
  ];

  if (error) {
    return <p> Unable to fetch data</p>;
  } else if (isLoading) {
    return <Table loading={true} />;
  } else if (!isLoading && data) {
    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: "rgba(185, 189, 192, 0.25)",
              headerBg: "var(--header-color)",
              rowHoverBg: "var(--effect-1)",
              lineHeight: "1",
              headerColor: "#f0f8ff",
              colorText: "var(--description-color)",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="contract_address"
          style={{ width: "65%" }}
        />
      </ConfigProvider>
    );
  }
};

export default TokenBalances;
