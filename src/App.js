import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(0);
  const [currencies, setCurrencies] = useState("");
  const [cur1, setCur1] = useState("USD");
  const [cur2, setCur2] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);

  // Capture supported currencies
  useEffect(function () {
    async function fetchCurrencies() {
      try {
        // Get available currencies
        const res = await fetch("https://api.frankfurter.app/currencies");

        if (!res.ok) {
          throw new Error("Something went wrong with fetching currency list.");
        }

        const supportedCurrencies = await res.json();
        setCurrencies(supportedCurrencies);
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchCurrencies();
  }, []); // Capture only once at the beginning on mounting

  // Capture conversion
  useEffect(
    function () {
      if (amount === 0) return setConverted(0);
      if (cur1 === cur2) return setConverted(amount);

      // Allow time for user to input text amount
      const timer = setTimeout(async function fetchConversion() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${cur1}&to=${cur2}`
          );

          const data = await res.json();
          setConverted(data.rates[cur2]);
        } catch (err) {
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    },
    [amount, cur1, cur2]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <CurrencySelect
        cur={cur1}
        currencies={currencies}
        setCur={setCur1}
        isLoading={isLoading}
      />
      <CurrencySelect
        cur={cur2}
        currencies={currencies}
        setCur={setCur2}
        isLoading={isLoading}
      />
      <p>
        {converted.toLocaleString("en-US")} {cur2}
        <br />
        <br />
        Powered by:{" "}
        <a href="https://api.frankfurter.app/" target="_blank" rel="noreferrer">
          https://api.frankfurter.app
        </a>
      </p>
    </div>
  );
}

function CurrencySelect({ cur, currencies, setCur, isLoading }) {
  return (
    <select
      value={cur}
      onChange={(e) => setCur(e.target.value)}
      disabled={isLoading}
    >
      {Object.keys(currencies).map((key) => (
        <option value={key} key={key}>
          {key}
        </option>
      ))}
    </select>
  );
}
