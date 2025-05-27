import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';

function App() {

  return (
    <BrowserRouter>
    	<main className='font-default'>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </main>    	      
    </BrowserRouter>
  );
}

export default App;