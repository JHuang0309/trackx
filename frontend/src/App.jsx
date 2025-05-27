import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {

  return (
    <BrowserRouter>
    	<main className='font-default'>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>    	      
    </BrowserRouter>
  );
}

export default App;