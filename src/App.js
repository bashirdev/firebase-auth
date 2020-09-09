import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig)
function App() {
  const [newUser,setNewuser] =useState(false);
  const [user,setUser] =useState({
    isSignIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
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
          photo:'',
          error:'',
          success:''
        }
        setUser(signedOutuser)
    }).catch(err=>{
      console.log(err);
    })
  }
  const handleBlur =(event)=>{
  
      let isFormValid=true;
     if(event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
      console.log(isFormValid);
     }
     if(event.target.name === 'password'){
       const isPasswordValid=event.target.value.length > 6;
       const isNumberHas=/\d{1}/.test(event.target.value);
    
       isFormValid= isPasswordValid && isNumberHas;
       console.log(isFormValid);
     }
     if(isFormValid){
    
          const newUserInfo = {...user};
          newUserInfo[event.target.name] =event.target.value;
          setUser(newUserInfo);
         }
  }

  const handleSubmit=(e)=>{
    console.log(user.email, user.password);
      if(newUser && user.email && user.password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res=>{
          const newUserInfo={...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
        })
        .catch(error => {
          // Handle Errors here.
          const newUserInfo={...user};
          newUserInfo.error=error.message;
          newUserInfo.success=false;
          setUser(newUserInfo);

        
          // ...
        });
      }
      if(!newUser && user.email && user.password){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res=>{
          const newUserInfo={...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
        })
        .catch(error=> {
          // Handle Errors here.
          const newUserInfo={...user};
          newUserInfo.error=error.message;
          newUserInfo.success=false;
          setUser(newUserInfo);
          // ...
        });
      }
      e.preventDefault();
  }

  const handleCheckBox=()=>{
    console.log('checked');
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
    <input type="checkbox" onChange={()=> setNewuser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New user registration</label>
   <form onSubmit={handleSubmit}>
  {newUser &&   <input type='text' onBlur={handleBlur} name='name'  placeholder='your name'/>}
   <br/>
   <input onBlur={handleBlur} type='text' name="email"  placeholder="Your email here" required />
    <br/>
    <input onBlur={handleBlur} type="password" name='password' id='' placeholder="Your password here" required/>
    <br/>
    <input  type="submit" value="Submit"/>
   </form>
   {user.success && <p style={{color:'green'}}> User {newUser ? 'created' : 'Logedin'} Successfully</p>}
   <p style={{color:'red'}}>{user.error}</p>
    </div>
  );
}

export default App;
