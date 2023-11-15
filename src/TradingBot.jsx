import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Chart.register(...registerables);

const TradingBot = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [coinData, setCoinData] = useState({});
  const [latestData, setLatestData] = useState({
    labels: [],
    datasets: [
      {
        label: `${symbol} Price Charts`,
        data: [],
        fill: false,
        lineTension: 0.2,
      },
    ],
  });

  const [initialPaperMoney, setInitialPaperMoney] = useState({
    BTC: 50,
    ETH: 50,
    BNB: 50,
  });

  const [currentBalance, setCurrentBalance] = useState({ ...initialPaperMoney });
  const [centralPaperMoney, setCentralPaperMoney] = useState(1000); // Initial central paper money in USD
  const [isBotActive, setIsBotActive] = useState(false);
  const [profitLoss, setProfitLoss] = useState(0);

  const [strategyParams, setStrategyParams] = useState({
    shortTermSMA: 5,
    longTermSMA: 7,
  })

  const calculateSMA = (data, period) => {
    console.log('called calc sma');
    console.log('DATA:', data);

    // Convert the entire data array to numbers
    data = data.map(Number);

    if (!Array.isArray(data)) {
      console.log('Data is not an array');
      return null;
    } else if (!data.every(Number.isFinite)) {
      console.log('Not all elements are finite numbers');
      return null;
    } else if (data.length < period) {
      console.log('Data length is less than the specified period');
      return null;
    }

    console.log('still in calc sma');
    const slicedData = data.slice(-period);
    console.log('SLICED DATA:', slicedData);
    const sum = slicedData.reduce((acc, val) => acc + val, 0);
    console.log('SUM:', sum);
    console.log('SUM/PERIOD:', sum / period);

    return sum / period;
  };


  const resetChartData = () => {
    setLatestData({
      labels: [],
      datasets: [
        {
          label: `${symbol} Price Charts`,
          data: [],
          fill: false,
          borderColor: 'rgb(43,0,205,1)',
          lineTension: 0.2,
        },
      ],
    });
  };

  useEffect(() => {
    resetChartData(); // Reset chart data when the symbol changes
    setIsBotActive(false)
  }, [symbol]);

  const checkTradingSignals = (data) => {
    setLatestData((prevData) => {
      const newLabel = new Date(data.k.t).toLocaleTimeString();
      const newData = data.k.c;

      const updatedData = {
        labels: [...prevData.labels, newLabel].slice(-20),
        datasets: [
          {
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, newData].slice(-20),
          },
        ],
      };

      const shortTermSMA = calculateSMA(updatedData.datasets[0].data, strategyParams.shortTermSMA);
      const longTermSMA = calculateSMA(updatedData.datasets[0].data, strategyParams.longTermSMA);

      if (shortTermSMA !== null && longTermSMA !== null) {
        if (shortTermSMA > longTermSMA) {
          // Generate buy signal
          handleBuySignal(newData);
        } else if (shortTermSMA < longTermSMA) {
          // Generate sell signal
          handleSellSignal(newData);
        }
      }

      return updatedData; // Return the updated state
    });
  };


  // const handleBuySignal = (price) => {
  //   const amountToBuy = 0.05; // Adjust the amount based on your preference
  //   setCurrentBalance((prevBalance) => ({
  //     ...prevBalance,
  //     BTC: prevBalance.BTC - amountToBuy,
  //   }));
  //   setProfitLoss(-amountToBuy); // Negative value indicates a loss (buying)

  //   toast(`Buy Signal: Purchase at ${price}`, { type: toast.TYPE.SUCCESS });
  // };



  // const updateChartData = (data) => {
  //   setCoinData(data);
  //   const newLabel = new Date(data.k.t).toLocaleTimeString();
  //   const newData = data.k.c;

  //   setLatestData((prevData) => {
  //     const newLabels = [...prevData.labels, newLabel].slice(-20);
  //     const newDatasetData = [...prevData.datasets[0].data, newData].slice(-20);

  //     const updatedDataset = {
  //       ...prevData.datasets[0],
  //       data: newDatasetData,
  //     };

  //     return {
  //       labels: newLabels,
  //       datasets: [updatedDataset],
  //     };
  //   });


  //   const currentPrice = newData;
  //   const currentBalanceCopy = { ...currentBalance };

  //   const shortTermSMA = calculateSMA([...latestData.datasets[0].data, newData], strategyParams.shortTermSMA);
  //   const longTermSMA = calculateSMA([...latestData.datasets[0].data, newData], strategyParams.longTermSMA);

  //   if (shortTermSMA !== null && longTermSMA !== null) {
  //     if (shortTermSMA > longTermSMA) {
  //       // Generate buy signal
  //       handleBuySignal(currentPrice, currentBalanceCopy);
  //     } else if (shortTermSMA < longTermSMA) {
  //       // Generate sell signal
  //       handleSellSignal(currentPrice, currentBalanceCopy);
  //     }
  //   }
  // };


  // const handleSellSignal = (price, currentBalanceCopy) => {
  //   if (currentBalanceCopy && currentBalanceCopy.BTC) {
  //     const amountToSell = 0.05; // Adjust the amount based on your preference
  //     currentBalanceCopy.BTC += amountToSell;
  //     setProfitLoss(amountToSell); // Positive value indicates a profit (selling)
  //     setCurrentBalance(currentBalanceCopy);

  //     toast(`Sell Signal: Sell at ${price}`, { type: toast.TYPE.WARNING });
  //   } else {
  //     console.error('currentBalanceCopy or currentBalanceCopy.BTC is undefined');
  //   }
  // };

  const handleBuySignal = (price) => {
    const amountToBuy = 0.05; // Adjust the amount based on your preference

    // Deduct the amount in USD from central paper money
    setCentralPaperMoney((prevPaperMoney) => prevPaperMoney - amountToBuy);

    setCurrentBalance((prevBalance) => ({
      ...prevBalance,
      BTC: prevBalance.BTC + amountToBuy, // Add the bought amount to BTC balance
    }));
    setProfitLoss(-amountToBuy); // Negative value indicates a loss (buying)

    toast(`Buy Signal: Purchase at ${price}`, { type: toast.TYPE.SUCCESS });
  };

  const handleSellSignal = (price) => {
    const amountToSell = 0.05; // Adjust the amount based on your preference

    // Add the amount in USD to central paper money
    setCentralPaperMoney((prevPaperMoney) => prevPaperMoney + amountToSell);

    setCurrentBalance((prevBalance) => ({
      ...prevBalance,
      BTC: prevBalance.BTC - amountToSell, // Deduct the sold amount from BTC balance
    }));
    setProfitLoss(amountToSell); // Positive value indicates a profit (selling)

    toast(`Sell Signal: Sell at ${price}`, { type: toast.TYPE.WARNING });
  };



  useEffect(() => {
    if (profitLoss !== 0) {
      const message = profitLoss > 0 ? `Profit: ${profitLoss}` : `Loss: ${-profitLoss}`;
      toast(message, { type: profitLoss > 0 ? toast.TYPE.SUCCESS : toast.TYPE.ERROR });
    }
  }, [profitLoss]);

  useEffect(() => {
    if (isBotActive) {
      const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol.toLowerCase()}@kline_1m`);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        setLatestData((prevData) => ({
          labels: [...prevData.labels],
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data],
            },
          ],
        }));

        checkTradingSignals(data);
        updateChartData(data);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
      };

      // Clean up WebSocket connection on component unmount or when the bot is deactivated
      return () => {
        ws.close();
      };
    }
  }, [symbol, isBotActive, strategyParams]);

  const handleSymbolChange = (event) => {

    setSymbol(event.target.value);

  };

  const handleStartBot = () => {
    setIsBotActive(true);
  };

  const handleStopBot = () => {
    setIsBotActive(false);
  };

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setStrategyParams((prevParams) => ({ ...prevParams, [name]: parseInt(value, 10) }));
  };

  return (
    <div className="row">
      <div className="col-4">
        <ul className="list-group ">
        <li className="fs-5 fw-bold list-group-item bg-light text-center text-success">Current Balance:</li>
          <li className="list-group-item">BTC: {currentBalance.BTC}</li>
          <li className="list-group-item">ETH: {currentBalance.ETH}</li>
          <li className="list-group-item">BNB: {currentBalance.BNB}</li>
        </ul>
        <p className="mt-3">Central Paper Money: ${centralPaperMoney}</p>

        <div className='my-2 bg-light p-2 rounded-2' >
          <label className='form-label' >Select Symbol:</label>
          <select className='form-select' aria-label=".form-select" value={symbol} onChange={handleSymbolChange}>
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="DASHUSDT">DASH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="LTCUSDT">LTC/USDT</option>
            <option value="XRPUSDT">XRP/USDT</option>
            <option value="ADAUSDT">ADA/USDT</option>
          </select>
        </div>
        <div className='my-2 bg-light p-2 rounded-2' >
          <label className='form-label'>Short-term SMA Period:</label>
          <input
            className='form-control'
            type="number"
            name="shortTermSMA"
            value={strategyParams.shortTermSMA}
            onChange={handleConfigChange}
          />
        </div>
        <div className='my-2 bg-light p-2 rounded-2' >
          <label className='form-label'>Long-term SMA Period:</label>
          <input
            className='form-control'
            type="number"
            name="longTermSMA"
            value={strategyParams.longTermSMA}
            onChange={handleConfigChange}
          />
        </div>
        <div className="py-3">
          <button className='btn btn-inline btn-outline-primary m-2' onClick={handleStartBot} disabled={isBotActive} >
            Start Bot
          </button>
          <button className='btn btn-inline btn-outline-primary m-2' onClick={handleStopBot} disabled={!isBotActive} >
            Stop Bot
          </button>
        </div>
      </div>
      <div className="col-8">
        <h5 className="text-center text-primary">{symbol} Price: {coinData.k && coinData.k.c}</h5>

        <Line
          className="w-100"
          data={latestData}
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
      <ToastContainer />
    </div>
  );
};

export default TradingBot;
