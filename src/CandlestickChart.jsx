import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const CandlestickChart = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [klineData, setKlineData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'candlestick',
      height: 350,
    },
    xaxis: {
      type: 'datetime', // Set x-axis type to datetime
      labels: {
        formatter: function (val) {
          return new Date(val).toLocaleTimeString();
        },
        datetimeUTC: false,
      },
      tickAmount: 6, // Adjust the number of ticks on the x-axis
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#1b5e20', // green
          downward: '#b71c1c', // red
        },
        wick: {
          useFillColor: false,
        },
        width: 0.7, // Adjust the width of the candlesticks
      },
    },
  });

  const [chartSeries, setChartSeries] = useState({
    data: [],
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
    const newData = {
      x: new Date(data.k.t).getTime(), // Convert to timestamp
      y: [parseFloat(data.k.o), parseFloat(data.k.h), parseFloat(data.k.l), parseFloat(data.k.c)],
    };
  
    setChartSeries((prevSeries) => ({
      data: [...prevSeries.data, newData],
    }));
  
    setKlineData((prevData) => [...prevData, data]);
  };
  

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleGoButtonClick = () => {
    // Manually close the existing WebSocket connection
    setKlineData([]);
    setChartSeries({
      data: [],
    });
  };

  return (
    <div className="col-12"> {/* Updated to a 12-column layout */}
      <div>
        <label>Select Symbol:</label>
        <select value={symbol} onChange={handleSymbolChange}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={handleGoButtonClick}>Go</button>
      </div>

      <div style={{ width: '100%' }}> {/* Added a container with 100% width */}
        <Chart options={chartOptions} series={[chartSeries]} type="candlestick" height={350} style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default CandlestickChart;
