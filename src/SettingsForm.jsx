import React from 'react'

const SettingsForm = () => {
  return (
<div className="col-4">
    <form>
      <div className="form-group">
        <label htmlFor="baseCoin">Base Coin</label>
        <input type="text" className="form-control" id="baseCoin" placeholder="Enter base coin" />
      </div>

      <div className="form-group">
        <label htmlFor="quoteCoin">Quote Coin</label>
        <input type="text" className="form-control" id="quoteCoin" placeholder="Enter quote coin" />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount of Money to Put in the Bot</label>
        <input type="number" className="form-control" id="amount" placeholder="Enter amount" />
      </div>

      <div className="form-group">
        <label htmlFor="upperGridLimit">Upper Grid Limit</label>
        <input type="number" className="form-control" id="upperGridLimit" placeholder="Enter upper grid limit" />
      </div>

      <div className="form-group">
        <label htmlFor="lowerGridLimit">Lower Grid Limit</label>
        <input type="number" className="form-control" id="lowerGridLimit" placeholder="Enter lower grid limit" />
      </div>

      <div className="form-group">
        <label htmlFor="gridDensity">Grid Density</label>
        <input type="number" className="form-control" id="gridDensity" placeholder="Enter grid density" />
      </div>

      <div className="form-group">
        <label htmlFor="gridSlope">Grid Slope</label>
        <select className="form-control" id="gridSlope">
          <option value="bearish">Bearish</option>
          <option value="bullish">Bullish</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary submit-button">Activate Bot</button>
    </form>
  </div>
    )
}

export default SettingsForm