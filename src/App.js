import React from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = React.useState('RUB');
  const [toCurrency, setToCurrency] = React.useState('USD');
  const [fromPrice, setFromPrice] = React.useState(0);
  const [toPrice, setToPrice] = React.useState(0);
  const [textErr, setTextErr] = React.useState('');

  const [rates, setRates] = React.useState({});

  React.useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/latest.js')
    .then(res => res.json())
    .then((json) => {
      setRates(json.rates);
    })
    .catch((err) => {
      console.warn(err);
      alert('Ошибка получения данных');
    });
  }, []);

  const pow = Math.pow(10, 6); // округление до 6 знака после запятой

  const onChangeFromPrice = (value) => {
    const price = fromCurrency === 'RUB' ? Math.round(value * pow) / pow : Math.round((value / rates[fromCurrency]) * pow) / pow;
    const result = toCurrency === 'RUB' ? Math.round(price * pow) / pow : Math.round(price * rates[toCurrency] * pow) / pow;
    setToPrice(result);
    setFromPrice(value);
    setTextErr('');

    if (fromCurrency ===  toCurrency) {
      setTextErr('Выберите разные валюты!');
      setToPrice(0);
      setFromPrice(0);
    }
  }

  const onChangeToPrice = (value) => {
    let result = 0;
    if (fromCurrency === 'RUB') {
      result = (1 / rates[toCurrency]) * value;
    } else{
      if (toCurrency === 'RUB') {
        result = (rates[fromCurrency]) * value;
      } else {
        result = (rates[fromCurrency] / rates[toCurrency]) * value;
      }
    }

    setTextErr('');
    setFromPrice(result);
    setToPrice(value);

    if (fromCurrency === toCurrency ) {
      setTextErr('Выберите разные валюты!');
      setFromPrice(0);
      setToPrice(0);
    }
    
    
  }
  
  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency])

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency])

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice} />
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice} />
      <p className='text-error'>{textErr}</p>
    </div>
  );
}

export default App;
