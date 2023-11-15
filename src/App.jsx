import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import './app.css'
import TradingBot from './TradingBot.jsx';


const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  useEffect(()=> {
    if (!isOnline) {
      console.log('Not Connected, You need internet connection to use this app');
      Swal.fire("Not Connected", "You need internet connection to use this app<br />Connect and click ok ! ", 'error')
      .then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    }
  }, [])
  return ( 
    <div className='container-fluid w-100'>
      <h1 className='text-center fw-bolder text-dark py-3 border-3 border-bottom m-3 border-dark'>Crypto Trading Bot</h1>
      <div className='row'>
        <TradingBot />
      </div>
    </div>
  );
};

export default App;
