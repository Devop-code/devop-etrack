'use client'

import React, { useEffect } from 'react';
import {test} from '../actions'
const page = () => {
    useEffect(()=>{
   test()
    },[])
  return (
    <div>
      
    </div>
  );
}

export default page;
