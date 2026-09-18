import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )

      setMessage('Login successful')

      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Login failed'
      )
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#f4f8ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          border: '1px solid #dbeafe',
          borderRadius: '16px',
          padding: '35px',
          boxShadow:
            '0 8px 25px rgba(37, 99, 235, 0.10)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              width: '55px',
              height: '55px',
              background: '#2563eb',
              color: 'white',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              fontSize: '25px',
              fontWeight: 'bold',
            }}
          >
            AI
          </div>

          <h1
            style={{
              color: '#172554',
              margin: '0 0 8px',
            }}
          >
            Welcome Back
          </h1>

          <p style={{ color: '#64748b', margin: 0 }}>
            Sign in to your AI Task Manager
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: 'block',
              color: '#334155',
              fontWeight: 'bold',
              marginBottom: '7px',
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '15px',
            }}
          />

          <label
            style={{
              display: 'block',
              color: '#334155',
              fontWeight: 'bold',
              marginBottom: '7px',
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '15px',
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '13px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: 'center',
              color: message === 'Login successful'
                ? '#16a34a'
                : '#dc2626',
              fontWeight: 'bold',
              marginTop: '18px',
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            marginTop: '25px',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: '#2563eb',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login