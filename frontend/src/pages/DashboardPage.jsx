import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const api = import.meta.env.VITE_API_URL;

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${api}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUsername(response.data.name);
                setLoading(false);
            })
            .catch(error => {
                setUsername('Unknown User');
                setLoading(false);
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Welcome, {username}!</h1>
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </div>
            <p>This is your dashboard.</p>
        </div>
    );
};

export default DashboardPage;