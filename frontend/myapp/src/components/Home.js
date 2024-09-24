import React from 'react'
import Profile from './Profile'
import TodoList from './TodoList'

function Home() {
  return (
    <div className='home-card'>
        <Profile />
        <TodoList />
    </div>
  )
}

export default Home
