import React, { useState } from 'react';
import axios from 'axios';
import './all.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //if token was present then redirect to todos
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/todos'
        }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/todos';
            console.log('loged in')
        } catch (error) {
            alert("please enter valid details")
            console.error('There was an error logging in!', error);
        }
    };

    const changePage=()=>{
        window.location.href = '/signup'
    }


    return (
        <div className='bg-card'>
            <div className='bg-card2'>
            <form className='bg-card3' onSubmit={handleSubmit}>
            <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <p>Dont have an account Please <span onClick={changePage} className='new'>SignUp</span></p>
            </form>
            </div>
        </div>
    );
}

export default Login;
