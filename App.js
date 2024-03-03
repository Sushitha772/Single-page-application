import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, sortBy, search]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/get-data`, {
        params: { page, sortBy, search },
      });
      setData(response.data);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="center-content">
        <h1>Customer Data</h1>
      </div>
      <div>
        <label>Search:</label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div>
        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
      </div>
      
      {loading && <div className="center-content">Loading...</div>}
      {error && <div className="center-content">{error}</div>}
      
      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer) => (
            <tr key={customer.sno}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{customer.date}</td>
              <td>{customer.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="center-content">
        <button disabled={page === 1} onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}>Previous Page</button>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>Next Page</button>
      </div>
    </div>
  );
}

export default App;
