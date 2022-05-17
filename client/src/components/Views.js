import React from 'react'; 
import {Route, Routes} from 'react-router-dom'; 
import Login from './auth/Login';
import Signup from './auth/Signup';
import PrivateRoutes from './PrivateRoutes';

const Views = () => {
  return (
      <Routes>
          <Route exact path='/' element={<Login/>} />
          <Route exact path='/register' element={<Signup/>} />
          <Route element={<PrivateRoutes/>}>
            <Route path='/home' element={<h1>Hello this is the homepage</h1>} />
          </Route>
          <Route path="*" element={<Login/>} />
      </Routes>
  )
}

export default Views; 