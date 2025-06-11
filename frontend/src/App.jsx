import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Clock from './pages/Clock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clock" element={<Clock />} />
      </Routes>
    </Router>
  );
}

export default App;
