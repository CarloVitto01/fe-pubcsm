import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import PersonList from './components/PersonList';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import './App.css'; // Aggiungi un file CSS per gli stili dei bottoni

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <h1>Pub CSM</h1>
                <nav>
                    <NavigationButtons />
                </nav>
                <Routes>
                    <Route path="/" element={<PersonList />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<OrderList />} />
                </Routes>
            </div>
        </Router>
    );
};

const NavigationButtons: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="nav-buttons">
            <button onClick={() => navigate('/')}>Clienti</button>
            <button onClick={() => navigate('/products')}>Prodotti</button>
            <button onClick={() => navigate('/orders')}>Ordini</button>
        </div>
    );
};

export default App;
