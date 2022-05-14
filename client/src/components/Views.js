import React from 'react'; 
import {Route, Routes} from 'react-router-dom'; 
import Login from './Auth/Login';
import Signup from './Auth/Signup';

const Views = () => {
  return (
      <Routes>
          <Route exact path='/' element={<Login/>} />
          <Route exact path='/register' element={<Signup/>} />
          <Route path="*" element={<Login/>} />
      </Routes>
  )
}

export default Views; 