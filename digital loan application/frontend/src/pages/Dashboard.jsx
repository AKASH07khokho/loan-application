import React, {useState, useEffect} from 'react'
import api from '../api/apiClient'

export default function Dashboard(){
  const [msg, setMsg] = useState('')
  useEffect(()=>{ setMsg('Your loan application process is complete..') },[])
  return (<div style={{padding:20}}>
    <h3>Dashboard</h3>
    <div>{msg}</div>
  </div>)
}
