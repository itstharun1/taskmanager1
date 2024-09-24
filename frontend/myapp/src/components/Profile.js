import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './all.css'

function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [updatedata,setUpdatedata]=useState(true);


   useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: token }
            });
            setName(response.data.name);
            setEmail(response.data.email);
        };
        fetchProfile();
    }, []);

    const updatedata1=()=>{
        setUpdatedata(!updatedata)
        console.log(updatedata)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // check where all inputs are filled or not else make a alert
        if (name === '' || email === '' || password === '') {
            alert('Please fill all the fields');
            }
            else{
                try {
                    await axios.put('http://localhost:5000/api/profile', { name, email, password }, {
                        headers: { Authorization: token }
                    });
                    alert('Profile updated successfully');
                    setUpdatedata(!updatedata)
                } catch (error) {
                    alert("Please enter correct email")
                    console.error('There was an error updating the profile!', error);
                }
            }

        
    };

    const logoutBtn=()=>{
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <div>
            {
                updatedata?<div>
                <div className='profile'>
                <div className='bg-card3'>
                <img className='img' src='https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG-Free-Download.png' alt='profile'/>
                <h2>Name:{name}</h2>
                <h2>Email:{email}</h2>
                <button onClick={updatedata1} className='btn'>Edit Profile</button>
                <button className='btn' onClick={logoutBtn}>Logout</button>
                </div>
                 </div>
                </div>
                :
                <div className='profile'>
            
            <form className='bg-card3' onSubmit={handleSubmit}>
            <img className='img' src='https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG-Free-Download.png' alt='profile'/>
                <input className='p1' type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className='p1' type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className='p1' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className='btn' type="submit">Update Profile</button>
                
            </form>
        </div>
            }
        </div>
    );
}

export default Profile;
