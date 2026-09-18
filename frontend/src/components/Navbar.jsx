import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const itemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',

    padding: '10px 12px',
    marginBottom: '4px',

    borderRadius: '8px',

    textDecoration: 'none',

    fontSize: '14px',
    fontWeight: '600',

    background:
      location.pathname === path
        ? '#ffffff'
        : 'transparent',

    color:
      location.pathname === path
        ? '#7c3aed'
        : '#5b21b6',

    transition: '0.2s',
  })

  return (
    <nav
      style={{
        position: 'fixed',

        left: 0,
        top: 0,
        bottom: 0,

        width: '185px',

        background: '#f0e7ff',

        padding: '22px 12px',

        boxSizing: 'border-box',

        display: 'flex',
        flexDirection: 'column',

        borderRight: '1px solid #e2d4ff',

        zIndex: 1000,
      }}
    >

      {/* LOGO */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',

          gap: '9px',

          padding: '0 5px',

          marginBottom: '28px',
        }}
      >

        <div
          style={{
            width: '36px',
            height: '36px',

            background: '#8b5cf6',

            color: '#ffffff',

            borderRadius: '9px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            fontSize: '13px',
            fontWeight: 'bold',

            flexShrink: 0,
          }}
        >
          AI
        </div>

        <div>
          <div
            style={{
              color: '#4c1d95',

              fontSize: '14px',

              fontWeight: '700',

              whiteSpace: 'nowrap',
            }}
          >
            Task Manager
          </div>

          <div
            style={{
              color: '#8b5cf6',

              fontSize: '10px',

              marginTop: '2px',
            }}
          >
            AI Powered
          </div>
        </div>

      </div>

      {/* MENU TITLE */}

      <div
        style={{
          color: '#8b5cf6',

          fontSize: '10px',

          fontWeight: '700',

          textTransform: 'uppercase',

          letterSpacing: '0.7px',

          padding: '0 12px',

          marginBottom: '8px',
        }}
      >
        Menu
      </div>

      {/* DASHBOARD */}

      <Link
        to="/"
        style={itemStyle('/')}
      >
        <span
          style={{
            fontSize: '17px',
            width: '20px',
            textAlign: 'center',
          }}
        >
          ⌂
        </span>

        <span>
          Dashboard
        </span>
      </Link>

      {/* PROJECTS */}

      <Link
        to="/projects"
        style={itemStyle('/projects')}
      >
        <span
          style={{
            fontSize: '15px',
            width: '20px',
            textAlign: 'center',
          }}
        >
          ▣
        </span>

        <span>
          Projects
        </span>
      </Link>

      {/* TASKS */}

      <Link
        to="/tasks"
        style={itemStyle('/tasks')}
      >
        <span
          style={{
            fontSize: '16px',
            width: '20px',
            textAlign: 'center',
          }}
        >
          ✓
        </span>

        <span>
          Tasks
        </span>
      </Link>

      {/* BOTTOM LOGOUT */}

      <div
        style={{
          marginTop: 'auto',
        }}
      >

        <div
          style={{
            height: '1px',

            background: '#e2d4ff',

            marginBottom: '12px',
          }}
        />

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '100%',

            padding: '10px 12px',

            display: 'flex',
            alignItems: 'center',

            gap: '10px',

            background: '#ffffff',

            color: '#7c3aed',

            border: '1px solid #e2d4ff',

            borderRadius: '8px',

            fontSize: '13px',

            fontWeight: '600',

            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              width: '20px',
              textAlign: 'center',
            }}
          >
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </nav>
  )
}

export default Navbar