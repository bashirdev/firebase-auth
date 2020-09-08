import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig)
function App() {
  const [user,setUser] =useState({
    isSignIn:false,
    name:'',
    email:'',
    photo:''
  })
  const provider = new firebase.auth.GoogleAuthProvider()
  const handleSignin=()=>{
 firebase.auth().signInWithPopup(provider)
 .then(res => {
   const {displayName, photoURL,email} =res.user;
   const signedInUser={
     isSignIn: true,
     name:displayName,
     email:email,
     photo:photoURL
    
   }
   setUser(signedInUser)
 }).catch(err => {
   console.log(err);
   console.log(err.message);
 })
  }

  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res =>{
        const signedOutuser={
          isSignIn:false,
          name:'',
          email:'',
          photo:''
        }
        setUser(signedOutuser)
    }).catch(err=>{
      console.log(err);
    })
  }
  const handleChange =(event)=>{
    console.log(event.target.name)
     console.log(event.target.value)
  }
  const handleSubmit=()=>{
    
  }
  return (
    <div className="App">
  { user.isSignIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignin}>Sign in</button>} 
    {
      user.isSignIn && <div> 
      <p>Welcome, {user.name}</p>
      <p>your email {user.email}</p>
      <img src={user.photo} alt='' />
      </div>
    }

    <h1>Our own athuentication </h1>
   <form onSubmit={handleSubmit}>
   <input onChange={handleChange} type='text' name="email"  placeholder="Your email here" required />
    <br/>
    <input onChange={handleChange} type="password" name='password' id='' placeholder="Your password here" required/>
    <br/>
    <input type="submit" value="Submit"/>
   </form>
    </div>
  );
}

export default App;
