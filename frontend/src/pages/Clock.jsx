// Clock.jsx
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Clock() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
    }
  }, [token]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://clock-backend-ul26.onrender.com/api/time/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIsClockedIn(true);
        setMessage(`Clocked in at: ${new Date(data.entry.clockIn).toLocaleTimeString()}`);
      } else {
        setMessage(data.error || 'Clock-in failed');
      }
    } catch (err) {
      setMessage('Error contacting server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://clock-backend-ul26.onrender.com/api/time/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setIsClockedIn(false);
        setMessage(`Clocked out at: ${new Date(data.entry.clockOut).toLocaleTimeString()}`);
      } else {
        setMessage(data.error || 'Clock-out failed');
      }
    } catch (err) {
      setMessage('Error contacting server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
      <div className="bg-secondary p-4 rounded" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="mb-3 text-center">ChronosControl Dashboard</h2>
        <p className="text-center">Status: <strong>{isClockedIn ? 'Clocked In' : 'Not Clocked In'}</strong></p>

        {message && <div className="alert alert-info mt-3">{message}</div>}

        <button
          className={`btn ${isClockedIn ? 'btn-danger' : 'btn-success'} w-100 mt-3`}
          onClick={isClockedIn ? handleClockOut : handleClockIn}
          disabled={loading}
        >
          {loading ? 'Working...' : isClockedIn ? 'Clock Out' : 'Clock In'}
        </button>

        <button
          className="btn btn-secondary w-100 mt-3"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}