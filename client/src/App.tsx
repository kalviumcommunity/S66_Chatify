
import SignInPage from './pages/SignInPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signin' element={<SignInPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
