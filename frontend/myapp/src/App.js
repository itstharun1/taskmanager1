import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
// routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/todos" element={<Home />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
