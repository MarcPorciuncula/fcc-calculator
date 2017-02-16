import React, { Component } from 'react';
import './App.css';

import Calculator from './Calculator';

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <div className="main">
          <Calculator />
        </div>
        <div className="footer">
          <p>Made by Marc Porciuncula <a href="https://github.com/MarcoThePoro/fcc-calculator">(view source on github)</a></p>
        </div>
      </div>
    );
  }
}

export default App;
