
import SignInPage from './pages/SignInPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signin' element={<SignInPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
