import React, { useState } from 'react'

export default function InputForm(){
    const [email,setEmail] =useState("")
    const [password,setPassword] = useState()

    const handleOnSubmit =(e)=>{
        e.preventDefault()
    }
    return (
    <>
    <form className ='form'onSubmit={handleOnSubmit}>
        <div className='form-control'>
            <label>Email</label>
            <input type="email" className='input'  onChange={()=>setEmail(e.target.value)}required/>
        </div>
        <div className='form-control'>
            <label>
                Password 
            </label>
            <input type="password" className='input' onChange={()=>setEmail(e.target.value)} required/>
        </div>
        <button type='submit'>Login</button><br></br>
        <p>
            Create new account
        </p>
    </form>
    
    </>
    );
}