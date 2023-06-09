import React, { createContext, useReducer } from 'react';

import './App.css';
import Navbar from './Components/Navbar';
import Content from './Components/Content';
import Services from './Components/Services';
import Footer from './Components/Footer';
import Team from './Components/Team';
import Login from './Pages/Login';
import Logout from './Components/Logout';
import Otp from './Components/Otp';
import Edit from './Pages/Edit';
import Registration from './Components/Registration';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import {Routes,Route, useParams} from 'react-router-dom';
import { initialState, reducer} from "./reducer/UseReducer";


import Dashboard from './Components/Dashboard';

export const UserContext = createContext();
const Routing = () =>{
  
  const {id}=useParams();
  

  return (
    <>
    <div>
      <Navbar/>
      
      <Routes>
        <Route exact path='/' element={ <Content />}> </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/team' element={<Dashboard />}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/registration' element={<Registration />}></Route>
        <Route path='/edit/:id' element={<Edit />}></Route>
        <Route path='/otp' element={<Otp />}></Route>
       
      </Routes>
      <Services />
      <Team />
      <Footer />
    </div>
    </>
  );
}
const App=()=> {
  
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <>
    <UserContext.Provider value={{state, dispatch}}>
    {/* <Navbar /> */}
    <Routing />
      
      </UserContext.Provider>
    </>
  );
}

export default App;
