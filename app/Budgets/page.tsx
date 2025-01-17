'use client'

import React, { useEffect } from 'react';
import {test} from '../actions'
const Page = () => {
    useEffect(()=>{
   test()
    },[])
  return (
    <div>
      
    </div>
  );
}

export default Page;
