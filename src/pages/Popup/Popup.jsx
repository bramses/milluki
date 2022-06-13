import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import Calendar from 'react-calendar'
import { useEffect, useState } from 'react';

const Popup = () => {
  const [value, setValue] = useState(new Date());

  const onChange = (value) => {
    setValue(value);
    console.log(value);
  }

  return (
    <div className="App">
      <header className="App-header">
      <Calendar onChange={onChange} value={value} />
      </header>
      
    </div>
  );
};

export default Popup;
