import React, { useState } from 'react';
import axios from 'axios';
import './all.css'


function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/todos'
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
            console.log("registered")
        } catch (error) {
            alert("email already exits or enter valid details")
            console.error('There was an error registering!', error);
        }
    };
    const changePage=()=>{
        window.location.href = '/'
    }

    return (
        <div className='bg-card'>
            <div className='bg-card2'>
            <form className='bg-card3' onSubmit={handleSubmit}>
            <h2>Signup</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Signup</button>
                <p>Have an account Please <span onClick={changePage} className='new'>Login</span></p>
            </form>
            </div>
        </div>
    );
}

export default Signup;
