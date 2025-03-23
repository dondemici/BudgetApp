import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TransactionPage from './page/TransactionPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TransactionPage />
    </>
  )
}

export default App
