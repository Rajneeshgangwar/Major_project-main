import React, { useState, useContext } from "react";
import { UserContext} from "../App";
import {Link, useNavigate} from 'react-router-dom';
import LoginWithGoogle from "../Components/LoginWithGoogle";
import Swal from "sweetalert2";

function Login() {

  const {state, dispatch} = useContext(UserContext);


  const history = useNavigate();

  const [email, setEmailid] = useState('');
  const [password, setPassword] = useState('');


const loginUser = async(e) => {
  e.preventDefault();
  //const { name, email, password, cpassword } = user;

  const res = await fetch("/login", {
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
    email, password
    })
  });

  const data = await res.json();

  if(res.status === 400 || !data){
    Swal.fire({  
      title: "Invalid Credentials",
      icon: "warning",
      confirmButtonText: "OK", 
      timer: 2000
    });
    // window.alert("Invalid Credentials");
    console.log("Invalid Credentials");
  }
  else{
    dispatch({type: "USER", payload:true})
    Swal.fire({  
      title: "Login Successful",
      icon: "success",
      confirmButtonText: "OK", 
      timer: 2000
    });
   
    console.log("Successfull");

    history ("/team");

  }
}
  return (
    <div>
      
      <LoginWithGoogle />
        <div className="container">
          <div className="row justify-content-center">
              <div className="col-sm-8 col-sm-offset-2 text">
                  <h1><strong>Login</strong></h1>
               </div>
          </div>
          <div className="row justify-content-center">
              <div className="col-sm-8 col-sm-offset-2 form-box">
                  <div className="form-top">
                    <div className="form-top-left">
                        <h3>Blood Bank Login : Portal</h3>
                    <p>Enter your username and password to login on:</p>
                    </div>
                    
                  </div>  
              <div className="form-bottom">
                   <form onSubmit={loginUser} method="POST">
                   <div className="form-group row">
                   <label className="p-0">email</label>
                   <input type="email" className="form-control" placeholder="Enter Username"
                    name="email"
                   value={email}
                   onChange={(e) => setEmailid(e.target.value)}/>
                   </div>

                   <div className="form-group row">
                   <label className="p-0">Password</label>
                   <input type="password" className="form-control" placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                   </div>
                   <center>
                   <button tabindex="4" type="submit" className="btn btn-default">Login</button></center>
              <p  className="forgot-password text-right">Don't have an account?<Link to="/registration"><u>Register </u></Link> </p>
                  
         </form>
        </div>
        </div>
        </div>
      </div>
      {/* // ) : (
      //   <Registration />
      // )} */}
    </div>
  );
}

export default Login;