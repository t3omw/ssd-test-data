import React, { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast'; 
import './App.css';

const API_URL = "http://localhost:8000/logs";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      toast.error("Failed to load records.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savePromise = fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    toast.promise(savePromise, {
      loading: 'Saving log...',
      success: () => {
        setFormData({ ...formData, serial_number: '' });
        fetchLogs();
        return 'Log saved successfully!';
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test record?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        toast.success("Record deleted");
        fetchLogs();
      } catch (error) {
        toast.error("Error deleting record");
      }
    }
  };

  const handleExport = () => {
    window.location.href = `${API_URL}/export`;
    toast.success("Downloading CSV...");
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || log.test_status === statusFilter;
    const matchesController = controllerFilter === "All" || log.controller === controllerFilter;
    return matchesSearch && matchesStatus && matchesController;
  });

  return (
    <div className="container">
      <Toaster position="top-right" />
      
      <header className="header">
        <div className="logo">SSD Test | <span className="sub-logo">Data Center</span></div>
        <div className="header-actions">
           <button className="export-btn" onClick={handleExport}>Download CSV</button>
           <button className="refresh-btn" onClick={fetchLogs} disabled={loading}>
             <RefreshCw className={loading ? "spin" : ""} size={16} /> 
             {loading ? " Loading..." : " Refresh"}
           </button>
        </div>
      </header>

      <main className="dashboard">
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

            <div className="form-group">
              <label>Firmware Version</label>
              <input 
                type="text" 
                value={formData.firmware}
                onChange={e => setFormData({...formData, firmware: e.target.value})}
                placeholder="e.g. 1.0.A"
                required 
              />
            </div>

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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Save Record"}
            </button>
          </form>
        </section>

        <section className="table-card">
          <div className="table-header">
            <h2>Database Records ({filteredLogs.length})</h2>
              <div className="filter-controls">
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Search Serial..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              
              {/* Restored Wrapper for Controller Filter */}
              <div className="select-wrapper filter-width">
                <select className="filter-select" value={controllerFilter} onChange={(e) => setControllerFilter(e.target.value)}>
                  <option value="All">All Controllers</option>
                  <option value="PS5026-E26">PS5026-E26</option>
                  <option value="PS5021-E21">PS5021-E21</option>
                  <option value="PS5018-E18">PS5018-E18</option>
                  <option value="PS5013-E13">PS5013-E13</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>

              {/* Restored Wrapper for Status Filter */}
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
            {loading && logs.length === 0 ? (
              <div className="loader">Initializing database connection...</div>
            ) : (
              <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Serial Number</th>
                  <th>Controller</th>
                  <th>Firmware</th> {/* Add this header */}
                  <th>Temp</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString('en-MY')}</td>
                    <td className="bold">{log.serial_number}</td>
                    <td>{log.controller}</td>
                    <td>{log.firmware}</td> {/* Add this data cell */}
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
            )}
            {!loading && filteredLogs.length === 0 && (
              <div className="loader">No records match your filters.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;