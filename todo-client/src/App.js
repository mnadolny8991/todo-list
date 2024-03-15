import './App.css';
import Header from './Header';
import List from './List';
import LoginForm from './LoginForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  return (
    <div className='app' style={{ marginTop: '2rem' }}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/tasks' element={ <List token={ token }/> } />
          <Route path='/login' element={ <LoginForm setToken={setToken} /> } />
        </Routes>
      </BrowserRouter>
      { token }
    </div>
  );
}

export default App;
