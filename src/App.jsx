import { useState } from 'react'
import { Route, Routes } from 'react-router-dom' 
import './App.css'
import TestAPI from './components/TestAPI'
import { Items } from './components/item'
import { ItemDetail } from './components/itemDetail'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes> 
      <Route path='/test_api' element={<TestAPI/>}/> 
      <Route path='/items' element={<Items />} />
      <Route path='/items/:id' element={<ItemDetail />} />
 
    </Routes> 
  )
}

export default App
