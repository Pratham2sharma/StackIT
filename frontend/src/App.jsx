import { Route } from 'react-router-dom'
import { Router } from "express"



function App() {
 

  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
