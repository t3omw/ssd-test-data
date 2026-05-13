import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react'; 
import './App.css';

const API_URL = "http://localhost:8000/logs";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // NEW: State for extra filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [controllerFilter, setControllerFilter] = useState("All");

  const [formData, setFormData] = useState({
    serial_number: '',
    controller: 'PS5026-E26',
    firmware: '1.0.A',
    test_status: 'Pass',
    temperature: 35
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // This catches the Pydantic validation errors from the backend
        const errorData = await response.json();
        const errorMessage = errorData.detail[0].msg || "Validation Error";
        alert(`Invalid Input: ${errorMessage}`);
        return;
      }

      setFormData({ ...formData, serial_number: '' });
      fetchLogs();
    } catch (error) {
      alert("Connection error: Is the backend running?");
    }
  };

  // NEW: Delete function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test record?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchLogs();
      } catch (error) {
        alert("Error deleting record");
      }
    }
  };

  // UPDATED: Multi-criteria filtering logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || log.test_status === statusFilter;
    const matchesController = controllerFilter === "All" || log.controller === controllerFilter;
    return matchesSearch && matchesStatus && matchesController;
  });

  return (
    <div className="container">
      <header className="header">
        <div className="logo">SSD Test | <span className="sub-logo">SSD Data Consolidation</span></div>
        <button className="refresh-btn" onClick={fetchLogs}>↻ Refresh</button>
      </header>

      <main className="dashboard">
        {/* INPUT SECTION */}
        <section className="form-card">
          <h2>Log Test Result</h2>
          <form onSubmit={handleSubmit} className="input-form">
            <div className="form-group">
              <label>SSD Serial Number</label>
              <input 
                type="text" 
                value={formData.serial_number}
                onChange={e => setFormData({...formData, serial_number: e.target.value})}
                placeholder="e.g. AB-C22-2026"
                required 
              />
            </div>

            {/* 1. Controller Model Select Wrapper */}
            <div className="form-group">
              <label>Controller Model</label>
              <div className="select-wrapper">
                <select value={formData.controller} onChange={e => setFormData({...formData, controller: e.target.value})}>
                  <option value="PS5026-E26">PS5026-E26 (Gen5)</option>
                  <option value="PS5021-E21">PS5021-E21 (Gen4 High Perf)</option>
                  <option value="PS5018-E18">PS5018-E18 (Gen4)</option>
                  <option value="PS5013-E13">PS5013-E13 (Gen3)</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Temp (°C)</label>
                <input type="number" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} />
              </div>
              {/* 2. Status Select Wrapper */}
              <div className="form-group">
                <label>Status</label>
                <div className="select-wrapper">
                  <select value={formData.test_status} onChange={e => setFormData({...formData, test_status: e.target.value})}>
                    <option value="Pass">Pass</option>
                    <option value="Warning">Warning</option>
                    <option value="Fail">Fail</option>
                  </select>
                  <ChevronDown className="select-icon" size={16} />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">Save</button>
          </form>
        </section>

        {/* VIEW SECTION */}
        <section className="table-card">
          <div className="table-header">
            <h2>Database Records</h2>
            {/* 3. Filter Controls (In the Table Header) */}
            <div className="filter-controls">
              <input type="text" className="search-bar" placeholder="Search Serial Number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              
              <div className="select-wrapper filter-width">
                <select className="filter-select" value={controllerFilter} onChange={(e) => setControllerFilter(e.target.value)}>
                  <option value="All">All Controllers</option>
                  <option value="PS5026-E26">PS5026-E26 </option>
                  <option value="PS5021-E21">PS5021-E21 </option>
                  <option value="PS5018-E18">PS5018-E18 </option>
                  <option value="PS5013-E13">PS5013-E13 </option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>

              <div className="select-wrapper filter-width">
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Pass">Pass</option>
                  <option value="Warning">Warning</option>
                  <option value="Fail">Fail</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>
            </div>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Serial Number</th>
                  <th>Controller</th>
                  <th>Temp</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="bold">{log.serial_number}</td>
                    <td>{log.controller}</td>
                    <td>{log.temperature}°C</td>
                    <td>
                      <span className={`badge ${log.test_status.toLowerCase()}`}>
                        {log.test_status}
                      </span>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(log.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;