import { useEffect, useState } from 'react'
import axios from 'axios'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [projectsResponse, tasksResponse] =
        await Promise.all([
          axios.get(
            'http://localhost:5000/api/projects',
            { headers }
          ),

          axios.get(
            'http://localhost:5000/api/tasks',
            { headers }
          ),
        ])

      setProjects(projectsResponse.data)
      setTasks(tasksResponse.data)
    } catch (error) {
      console.error(
        'Dashboard Error:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // =========================
  // STATISTICS
  // =========================

  const totalProjects = projects.length

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === 'done'
  ).length

  const pendingTasks = tasks.filter(
    (task) => task.status !== 'done'
  ).length

  const progress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0

  // =========================
  // PROJECT PROGRESS
  // =========================

  const getProjectTasks = (projectId) => {
    return tasks.filter(
      (task) =>
        String(task.project_id) ===
        String(projectId)
    )
  }

  const getProjectProgress = (projectId) => {
    const projectTasks =
      getProjectTasks(projectId)

    if (projectTasks.length === 0) {
      return 0
    }

    const completed =
      projectTasks.filter(
        (task) => task.status === 'done'
      ).length

    return Math.round(
      (completed / projectTasks.length) * 100
    )
  }

  // =========================
  // RECENT TASKS
  // =========================

  const recentTasks = [...tasks]
    .sort((a, b) => {
      const dateA = a.created_at
        ? new Date(a.created_at)
        : 0

      const dateB = b.created_at
        ? new Date(b.created_at)
        : 0

      return dateB - dateA
    })
    .slice(0, 5)

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    if (status === 'done') {
      return {
        background: '#ede9fe',
        color: '#6d28d9',
      }
    }

    if (status === 'in-progress') {
      return {
        background: '#f3e8ff',
        color: '#7e22ce',
      }
    }

    return {
      background: '#f5f3ff',
      color: '#6b21a8',
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          marginLeft: '185px',
          minHeight: '100vh',
          background: '#ffffff',
          padding: '35px',
          boxSizing: 'border-box',
          color: '#5b21b6',
          fontFamily:
            'Arial, sans-serif',
        }}
      >
        Loading dashboard...
      </div>
    )
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div
      style={{
        marginLeft: '185px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '35px',
        boxSizing: 'border-box',
        fontFamily:
          'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            marginBottom: '30px',
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              color: '#8b5cf6',
              fontSize: '13px',
              fontWeight: '700',
              textTransform:
                'uppercase',
              letterSpacing: '1px',
            }}
          >
            Overview
          </p>

          <h1
            style={{
              margin: '0 0 8px',
              color: '#3b2768',
              fontSize: '32px',
              fontWeight: '700',
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px',
            }}
          >
            Manage your projects and track
            your productivity.
          </p>
        </div>

        {/* =========================
            STAT CARDS
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            gap: '18px',
            marginBottom: '28px',
          }}
        >

          {/* PROJECTS */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: '#f0e7ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '18px',
                marginBottom: '14px',
              }}
            >
              ▣
            </div>

            <p
              style={{
                margin: '0 0 6px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              Total Projects
            </p>

            <h2
              style={{
                margin: 0,
                color: '#3b2768',
                fontSize: '28px',
              }}
            >
              {totalProjects}
            </h2>
          </div>

          {/* TASKS */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: '#f0e7ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '18px',
                marginBottom: '14px',
              }}
            >
              ✓
            </div>

            <p
              style={{
                margin: '0 0 6px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              Total Tasks
            </p>

            <h2
              style={{
                margin: 0,
                color: '#3b2768',
                fontSize: '28px',
              }}
            >
              {totalTasks}
            </h2>
          </div>

          {/* COMPLETED */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: '#f0e7ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '18px',
                marginBottom: '14px',
              }}
            >
              ✓
            </div>

            <p
              style={{
                margin: '0 0 6px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              Completed
            </p>

            <h2
              style={{
                margin: 0,
                color: '#3b2768',
                fontSize: '28px',
              }}
            >
              {completedTasks}
            </h2>
          </div>

          {/* PENDING */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                background: '#f0e7ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                fontSize: '18px',
                marginBottom: '14px',
              }}
            >
              ◷
            </div>

            <p
              style={{
                margin: '0 0 6px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              Pending
            </p>

            <h2
              style={{
                margin: 0,
                color: '#3b2768',
                fontSize: '28px',
              }}
            >
              {pendingTasks}
            </h2>
          </div>

        </div>

        {/* =========================
            OVERALL PROGRESS
        ========================= */}

        <div
          style={{
            background: '#ffffff',
            border:
              '1px solid #e9ddff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow:
              '0 3px 10px rgba(139, 92, 246, 0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0 0 5px',
                  color: '#3b2768',
                  fontSize: '19px',
                }}
              >
                Overall Progress
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '13px',
                }}
              >
                Completed tasks across all
                projects
              </p>
            </div>

            <strong
              style={{
                color: '#7c3aed',
                fontSize: '22px',
              }}
            >
              {progress}%
            </strong>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              background: '#f0e7ff',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#8b5cf6',
                borderRadius: '10px',
                transition:
                  'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* =========================
            TWO COLUMN SECTION
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.5fr 1fr',
            gap: '22px',
          }}
        >

          {/* PROJECT OVERVIEW */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: '0 0 5px',
                    color: '#3b2768',
                    fontSize: '19px',
                  }}
                >
                  Project Overview
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '13px',
                  }}
                >
                  Track project progress
                </p>
              </div>

              <span
                style={{
                  color: '#8b5cf6',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                {projects.length} Projects
              </span>
            </div>

            {projects.length === 0 ? (
              <p
                style={{
                  color: '#94a3b8',
                }}
              >
                No projects available.
              </p>
            ) : (
              projects.map((project) => {
                const projectProgress =
                  getProjectProgress(
                    project.project_id
                  )

                const projectTasks =
                  getProjectTasks(
                    project.project_id
                  )

                return (
                  <div
                    key={project.project_id}
                    style={{
                      padding:
                        '16px 0',
                      borderBottom:
                        '1px solid #f1ecfa',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        gap: '10px',
                        marginBottom:
                          '9px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin:
                              '0 0 4px',
                            color:
                              '#3b2768',
                            fontSize:
                              '15px',
                          }}
                        >
                          {
                            project.project_name
                          }
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color:
                              '#94a3b8',
                            fontSize:
                              '12px',
                          }}
                        >
                          {
                            projectTasks.length
                          }{' '}
                          tasks
                        </p>
                      </div>

                      <strong
                        style={{
                          color:
                            '#7c3aed',
                          fontSize:
                            '14px',
                        }}
                      >
                        {
                          projectProgress
                        }%
                      </strong>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '7px',
                        background:
                          '#f0e7ff',
                        borderRadius:
                          '10px',
                        overflow:
                          'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${projectProgress}%`,
                          height: '100%',
                          background:
                            '#a78bfa',
                          borderRadius:
                            '10px',
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* RECENT ACTIVITY */}

          <div
            style={{
              background: '#ffffff',
              border:
                '1px solid #e9ddff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow:
                '0 3px 10px rgba(139, 92, 246, 0.06)',
            }}
          >
            <h2
              style={{
                margin: '0 0 5px',
                color: '#3b2768',
                fontSize: '19px',
              }}
            >
              Recent Activity
            </h2>

            <p
              style={{
                margin:
                  '0 0 20px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              Latest tasks
            </p>

            {recentTasks.length === 0 ? (
              <p
                style={{
                  color: '#94a3b8',
                }}
              >
                No recent activity.
              </p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.task_id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding:
                      '12px 0',
                    borderBottom:
                      '1px solid #f1ecfa',
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius:
                        '50%',
                      background:
                        '#f0e7ff',
                      color:
                        '#7c3aed',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      flexShrink: 0,
                      fontSize:
                        '13px',
                      fontWeight:
                        'bold',
                    }}
                  >
                    ✓
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <p
                      style={{
                        margin:
                          '0 0 5px',
                        color:
                          '#3b2768',
                        fontSize:
                          '13px',
                        fontWeight:
                          '600',
                      }}
                    >
                      {task.title}
                    </p>

                    <span
                      style={{
                        ...getStatusStyle(
                          task.status
                        ),
                        padding:
                          '4px 8px',
                        borderRadius:
                          '12px',
                        fontSize:
                          '10px',
                        fontWeight:
                          '600',
                      }}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard