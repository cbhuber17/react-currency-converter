import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [converted, setConverted] = useState(0);
  const [currencies, setCurrencies] = useState("");
  const [cur1, setCur1] = useState("");
  const [cur2, setCur2] = useState("");

  // Capture supported currencies
  useEffect(function () {
    async function fetchCurrencies() {
      try {
        // Get available currencies
        const res = await fetch("https://api.frankfurter.app/currencies");

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies.");
        }

        const supportedCurrencies = await res.json();
        setCurrencies(supportedCurrencies);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
        }
      }
    }

    fetchCurrencies();
  }, []);

  // Capture conversion
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchConversion() {
        try {
          //setIsLoading(true)
          //setError("")
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${cur1}&to=${cur2}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error(
              `Something went wrong with fetching currency conversion from ${cur1} to ${cur2} .`
            );
          }

          const data = await res.json();
          setConverted(data.rates[cur2]);

          // setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            // setError(err.message);
          }
        }
      }

      fetchConversion();

      // Cleanup
      return function () {
        controller.abort();
      };
    },
    [amount, cur1, cur2]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <CurrencySelect currencies={currencies} setCur={setCur1} />
      <CurrencySelect currencies={currencies} setCur={setCur2} />
      <p>{converted}</p>
    </div>
  );
}

function CurrencySelect({ currencies, setCur }) {
  return (
    <select onChange={(e) => setCur(e.target.value)}>
      {Object.keys(currencies).map((key) => (
        <option value={key} key={key}>
          {key}
        </option>
      ))}
    </select>
  );
}
