import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TestAPI = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const { user } = useAuth();

  const testPublicAPI = async () => {
    try {
      const res = await api.get('/public');
      setResponse(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error testing public API');
    }
  };

  const testPrivateAPI = async () => {
    try {
      const res = await api.get('/private');
      setResponse(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error testing private API');
    }
  };

  const testAdminAPI = async () => {
    try {
      const res = await api.get('/admin-only');
      setResponse(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error testing admin API');
    }
  };

  return (
    <div>
      <h2>API Test</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <div className="mb-3">
        <button onClick={testPublicAPI} className="btn btn-primary mr-2">Test Public API</button>
        <button onClick={testPrivateAPI} className="btn btn-primary mr-2">Test Private API</button>
        {user?.role === 'admin' && (
          <button onClick={testAdminAPI} className="btn btn-primary">Test Admin API</button>
        )}
      </div>
      {response && (
        <div>
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;