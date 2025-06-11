import { useState, useEffect } from 'react';

export default function Clock() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Redirect if not logged in
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
    <div style={{ padding: '2rem' }}>
        <h2>ChronosControl Dashboard</h2>
        <p>Status: {isClockedIn ? 'Clocked In' : 'Not Clocked In'}</p>

        {message && (
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>
        )}

    <button
        onClick={isClockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        style={{ marginTop: '1rem' }}
    >
    {loading ? 'Working...' : isClockedIn ? 'Clock Out' : 'Clock In'}
</button>

      <br />
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>
        Log Out
      </button>
    </div>
  );
}
