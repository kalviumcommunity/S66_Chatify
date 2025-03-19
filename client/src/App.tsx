
import SignInPage from './pages/SignInPage'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import ChatInterface from './pages/ChatInterface'
function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/signin' element={<SignInPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/chat' element={<ChatInterface/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
