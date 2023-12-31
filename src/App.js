import { useState, useEffect, useCallback } from "react";
import './App.css';
import axios from "axios";
import Pagination from './paginatiom';

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const getCountries = useCallback(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(({ data }) => {
        setCountries(data);
        setRecordsPerPage(data.length);
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    getCountries();
  }, [])

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = countries.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(countries.length / recordsPerPage)
  const filterByName = (item) => filter.name ? item.name?.common.toLowerCase().includes(filter.name?.trim().toLowerCase()) : true
  const filterByPopulation = (item) => filter.population ? item.population < parseInt(filter.population, 10) : true

  const filterMethods = [
    (item => filterByName(item)),
    (item => filterByPopulation(item)),
  ]

  const filteredArray = countries.filter((item) => {
    for (let i = 0; i < filterMethods.length; i++) {
      if (!filterMethods[i](item)) {
        return false
      }
    }
    return true
  })

  const sortFunction = () => {
    if (filter.sort) {
      const sorted = countries.sort((a, b) => {
        const nameA = a.name?.common.toUpperCase();
        const nameB = b.name?.common.toUpperCase();
        if (nameA < nameB) {
          if (filter.sort === 'ascend') {
            return -1
          }
          if (filter.sort === 'descend') {
            return 1
          }
        }
        if (nameA > nameB) {
          if (filter.sort === 'ascend') {
            return 1
          }
          if (filter.sort === 'descend') {
            return -1
          }
        }
        return 0;
      });
      setCountries((prevState => [...prevState, sorted]))
    }
  }
  const pagination = () => {
    if (filter.pagination) {
      setRecordsPerPage(filter.pagination)
    }
  }

  const handleChange = (e, key) => {
    setFilter({
      ...filter,
      [key]: e.target.value === '' ? null: e.target.value,
    })
  }

  const handleSubmit = () => {
    if (!filter.name && !filter.population && !filter.sort && !filter.pagination) {
      getCountries()
    } else {
      setCountries(filteredArray);
      sortFunction();
      pagination();
    }
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
          <input
            type="text"
            pattern="[0-9]*"
            name="population"
            onChange={(e) => handleChange(e, 'population')}
          />
        </label>
        <label>
          Sort:
          <input type="text" name="sort" onChange={(e) => handleChange(e, 'sort')}/>
        </label>
        <label>
          Pagination:
          <input
            type="text"
            pattern="[0-9]*"
            onChange={(e) => handleChange(e, 'pagination')}
            name="pagination"
          />
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
        {currentRecords.map(item => (
          <tr key={item.name?.common}>
            <td>{item.name?.common} </td>
            <td>{item.population} </td>
          </tr>
        ))}
        </tbody>
      </table>
      <Pagination
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;



