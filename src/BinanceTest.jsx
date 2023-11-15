// const API_KEY = '9b14471ff948eb2fd4caef78b563cd6c089a3620cf3cae6bd19d15879562c29c'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'wss://stream.binancefuture.com';
const endpoint = '/fapi/v1/klines';
const API_KEY = '9b14471ff948eb2fd4caef78b563cd6c089a3620cf3cae6bd19d15879562c29c';

const KlineDataComponent = () => {
  const [klineData, setKlineData] = useState([]);

  useEffect(() => {
    fetchKlineData('BTCUSDT', '1m'); // Fetch data for BTCUSDT with 1-minute interval
  }, []);

  async function fetchKlineData(symbol, interval) {
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        params: {
          symbol,
          interval,
          limit: 100,
        },
        headers: {
          'X-MBX-APIKEY': API_KEY,
        },
      });
      const data = response.data;
      console.log(data);
      setKlineData(data);
    } catch (error) {
      console.error('Error fetching Kline data:', error);
    }
  }

  // fetchKlineData('BTCUSDT', '1m'); // Pass symbol and interval parameters

  return (
    <div>
      {klineData.map((kline) => (
        <div key={kline.openTime}>
          <p>Open: {kline.open}</p>
          <p>High: {kline.high}</p>
          <p>Low: {kline.low}</p>
          <p>Close: {kline.close}</p>
        </div>
      ))}
    </div>
  );
};

export default KlineDataComponent;
