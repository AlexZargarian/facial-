import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';
import validation from "./LoginValidation";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform front-end validation
    const newErrors = validation(values);
    setErrors(newErrors);

    // Proceed if there are no validation errors
    if (!newErrors.email && !newErrors.password) {
      axios.post('http://localhost:8081/login', values)
        .then(res => {
          if (res.status === 200) {
            // Navigate to classes page, passing email via state
            navigate('/classes', { state: { email: values.email } });
          } else {
            alert("Login failed: " + res.statusText);
          }
        })
        .catch(error => {
          // Handle error response from server
          alert("Login error: " + (error.response ? error.response.data.message : "Unknown error"));
        });
    } else {
      // Log the validation errors
      console.log("Validation errors:", newErrors);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Log-in</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Enter email'
              name='email'
              onChange={handleInput}
              value={values.email}
              className='form-control rounded-0'
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter password'
              name='password'
              onChange={handleInput}
              value={values.password}
              className='form-control rounded-0'
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>Log in</button>
          <p className='text-center mt-2'>Terms and conditions</p>
          <Link to='/signup' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
