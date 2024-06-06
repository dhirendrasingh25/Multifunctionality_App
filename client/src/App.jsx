import { useState } from 'react'
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router ,Routes , Route
} from "react-router-dom";
import { Loader } from './components/Loader';
import SideBar from './Pages/SideBar/SideBar';

const Home= lazy(()=> import("./Pages/Home/Home"));

function App() {
  return (
    <>
      <Router>
      <Suspense fallback={<Loader/>}> 
        <Routes>
          <Route path="/" element={<SideBar> <Home/> </SideBar>} />
        </Routes>
      </Suspense>
      </Router>
    </>
  )
}

export default App
