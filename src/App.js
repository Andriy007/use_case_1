import { useState, useEffect, useCallback } from "react";
import './App.css';
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState({});
  const getCountries = useCallback(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(({ data }) => {
        setCountries(data)
      })
      .catch((error) => console.log(error))
  }, [])
  useEffect(() => {
    getCountries();
  }, [])
  const filterByName = () => {
    filter.name && setCountries(countries.filter((item) => item.name.common.toLowerCase().includes(filter.name?.trim().toLowerCase())))
  }
  const filterByPopulation = () => filter.population
    && setCountries(countries.filter((item) => item.population < parseInt(filter.population, 10)))

  const handleChange = (e, key) => {
    setFilter({
      ...filter,
      [key]: e.target.value,
    })
  }

  const handleSubmit = () => {
    filterByName();
    filterByPopulation();
  }

  return (
    <div className="App">
      <div className="form">
        <label>
          Filter by name:
          <input type="text" name="name" value={filter.name} onChange={(e) => handleChange(e, 'name')} />
        </label>
        <label>
          Filter by population:
          <input type="text" pattern="[0-9]*" name="population" onChange={(e) => handleChange(e, 'population')}/>
        </label>
        <label>
          Sort:
          <input type="text" name="sort" onChange={(e) => handleChange(e, 'sort')}/>
        </label>
        <label>
          Pagination:
          <input type="text" name="Pagination" />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <table className="table">
        <thead>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Population</th>
        </tr>
        </thead>
        <tbody>
        {countries.map(item => (
          <tr>
            <td>{item.name?.common} </td>
            <td>{item.population} </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;



