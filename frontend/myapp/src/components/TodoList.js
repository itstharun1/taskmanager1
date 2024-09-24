import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './all.css'


function TodoList() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('pending');

        const token = localStorage.getItem('token');
    if(!token){
        window.location.href = '/';
    }



    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: token }
            });
            setTodos(response.data);
        };
        fetchTodos();
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/todos', { title, status }, {
                headers: { Authorization: token }
            });
            setTitle('');
            setStatus('pending');
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: token }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('There was an error adding the todo!', error);
        }
    };

    const handleUpdateTodo = async (id,title, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/todos/${id}`, { title:title,status: newStatus }, {
                headers: { Authorization: token }
            });
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: token }
            });
            setTodos(response.data);

        } catch (error) {
            console.error('There was an error updating the todo!', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`, {
                headers: { Authorization: token }
            });
            const response = await axios.get('http://localhost:5000/api/todos', {
                headers: { Authorization: token }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('There was an error deleting the todo!', error);
        }
    };

    const handleEdit=(name,id)=>{
        setTitle(name);
        handleDeleteTodo(id)

    }

    return (
        <div >

            
            <div className='todo-card'>
                <h2>Todo List</h2>
            <form  onSubmit={handleAddTodo}>
  
                <div className='todo-card3'>
                <input className='inpEle' type="text" placeholder="Add Task" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <div>
                <select className='btn1' value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="completed">Completed</option>
                </select>
                </div>
                <button className='btn' type="submit">Add Todo</button>
                </div>
            </form>

            <div className='todo-card3'>
            <ul className='card1'>
                {todos.map(todo => (
                    <li className='card2' key={todo.id}>
                        <p className={todo.status}>{todo.title}</p>
                        <div>
                        <button className='btn3' onClick={() => handleUpdateTodo(todo.id,todo.title, 'done')}>Done</button>
                        <button className='btn3' onClick={()=>handleEdit(todo.title,todo.id)}>Edit</button>
                        <button className='btn3' onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            </div>


            </div>
            
            
        </div>
    );
}

export default TodoList;
