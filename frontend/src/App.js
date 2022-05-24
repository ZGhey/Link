import React, {useCallback, useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.css";
import Header from './views/header/header';
import List from './views/list/list';
import Question from './views/question/question';
import Detail from './views/detail/detail';
function App(){
  return (
    <BrowserRouter>
      <div>
        <Header/>          
        <Routes>
          <Route path='/list' element={<List/>} />
          <Route path='/question' element={<Question/>} />
          <Route path='/detail/:id' element={<Detail/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App;
