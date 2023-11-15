// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const baseUrl = 'wss://stream.binancefuture.com';
// const endpoint = '/ws/btcusdt@kline_1m';
// const API_KEY = '9b14471ff948eb2fd4caef78b563cd6c089a3620cf3cae6bd19d15879562c29c';

// const BinanceTestWebsocket = () => {
//   const [klineData, setKlineData] = useState([]);

//   useEffect(() => {
//     connectWebSocket();
//   }, []);

//   const connectWebSocket = async () => {
//     const ws = new WebSocket(`${baseUrl}${endpoint}`);

//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log(data);
//       setKlineData(data);
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     ws.onclose = (event) => {
//       console.log('WebSocket connection closed:', event.code, event.reason);
//     };
//   };

//   // fetchKlineData('BTCUSDT', '1m'); // Remove HTTP request

//   return (
//     <div>
//       {klineData.map((kline) => (
//         <div key={kline.openTime}>
//           <p>Open: {kline.open}</p>
//           <p>High: {kline.high}</p>
//           <p>Low: {kline.low}</p>
//           <p>Close: {kline.close}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BinanceTestWebsocket;



import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BinanceTestWebsocket = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [klineData, setKlineData] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: `${symbol} Price`,
        data: [],
        fill: false,
        borderColor: 'rgb(43,0,205,1)',
        lineTension: 0.2,
      },
    ],
  });

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol.toLowerCase()}@kline_1m`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      updateChartData(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [symbol]);

  const updateChartData = (data) => {
    setCoinData(data)
    const newLabel = new Date(data.k.t).toLocaleTimeString();
    const newData = data.k.c;
    setCoinData(data)
    setChartData((prevData) => ({
      labels: [...prevData.labels, newLabel].slice(-20),
      datasets: [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, newData].slice(-20),
        },
      ],
    }));

    setKlineData((prevData) => [...prevData, data]);
  };

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleGoButtonClick = () => {
    // Manually close the existing WebSocket connection
    setKlineData([]);
    setChartData({
      labels: [],
      datasets: [
        {
          label: `${symbol} Price`,
          data: [],
          fill: false,
          borderColor: 'rgb(43,0,205,1)',
          lineTension: 0.2,
        },
      ],
    });
  };

  return (
    <div className="col-8">
      <div>
        <label>Select Symbol:</label>
        <select value={symbol} onChange={handleSymbolChange}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleGoButtonClick}>Go</button>
      </div>
      {/* {coinData.k &&  console.log(coinData.k.c)} */}
      <h5 className="text-center text-primary">{symbol} Price: {coinData.k &&  coinData.k.c}</h5>
      <Line
        className="w-100"
        data={chartData}
        options={{
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
              },
            },
            y: {
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BinanceTestWebsocket;
