const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      })
    }

    const [existingUser] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: result.insertId,
        name,
        email
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Registration failed'
    })
  }
}

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const [users] = await db.query(
      'SELECT user_id, name, email, password FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const user = users[0]

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Login failed'
    })
  }
}

module.exports = {
  register,
  login
}