import { useEffect, useState } from 'react'
import axios from 'axios'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  const [message, setMessage] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [editingId, setEditingId] = useState(null)

  const [aiProjectId, setAiProjectId] = useState('')
  const [aiTasks, setAiTasks] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  // =========================
  // FETCH PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/projects',
        { headers }
      )

      setProjects(response.data)

      if (response.data.length > 0 && !projectId) {
        setProjectId(String(response.data[0].project_id))
      }

      if (response.data.length > 0 && !aiProjectId) {
        setAiProjectId(String(response.data[0].project_id))
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to load projects'
      )
    }
  }

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/tasks',
        { headers }
      )

      setTasks(response.data)
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to load tasks'
      )
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchTasks()
  }, [])

  // =========================
  // CLEAR FORM
  // =========================

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setStatus('todo')
    setPriority('medium')
    setDueDate('')
    setEditingId(null)
  }

  // =========================
  // CREATE / UPDATE TASK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!projectId) {
      setMessage('Please create a project first')
      return
    }

    try {
      const data = {
        title,
        description,
        status,
        priority,
        due_date: dueDate
          ? dueDate.substring(0, 10)
          : null,
        project_id: projectId,
      }

      if (editingId) {
        const response = await axios.put(
          `http://localhost:5000/api/tasks/${editingId}`,
          data,
          { headers }
        )

        setMessage(
          response.data.message ||
            'Task updated successfully'
        )
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/tasks',
          data,
          { headers }
        )

        setMessage(
          response.data.message ||
            'Task created successfully'
        )
      }

      clearForm()
      await fetchTasks()
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to save task'
      )
    }
  }

  // =========================
  // EDIT TASK
  // =========================

  const startEdit = (task) => {
    console.log('EDIT CLICKED:', task)

    setEditingId(task.task_id)
    setTitle(task.title || '')
    setDescription(task.description || '')
    setProjectId(String(task.project_id || ''))
    setStatus(task.status || 'todo')
    setPriority(task.priority || 'medium')

    setDueDate(
      task.due_date
        ? String(task.due_date).substring(0, 10)
        : ''
    )

    setMessage('Editing task...')

    setTimeout(() => {
      const form = document.getElementById('task-form')

      if (form) {
        form.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 50)
  }

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`,
        { headers }
      )

      setMessage(
        response.data.message ||
          'Task deleted successfully'
      )

      await fetchTasks()
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to delete task'
      )
    }
  }

  // =========================
  // AI TASK GENERATION
  // =========================

  const generateAITasks = async () => {
    if (!aiProjectId) {
      setAiMessage('Please select a project first')
      return
    }

    const selectedProject = projects.find(
      (project) =>
        String(project.project_id) ===
        String(aiProjectId)
    )

    if (!selectedProject) {
      setAiMessage('Project not found')
      return
    }

    setAiLoading(true)
    setAiMessage('')
    setAiTasks([])

    try {
      const response = await axios.post(
        'http://localhost:5000/api/ai/generate-tasks',
        {
          project_name: selectedProject.project_name,
          project_description:
            selectedProject.description || '',
        },
        { headers }
      )

      setAiTasks(response.data.tasks || [])
    } catch (error) {
      setAiMessage(
        error.response?.data?.message ||
          'Failed to generate suggestions'
      )
    } finally {
      setAiLoading(false)
    }
  }

  // =========================
  // ADD AI TASK
  // =========================

  const addAITask = async (aiTask) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title: aiTask.title,
          description: aiTask.description,
          status: 'todo',
          priority: aiTask.priority || 'medium',
          due_date: null,
          project_id: aiProjectId,
        },
        { headers }
      )

      setMessage(
        response.data.message ||
          'Task added successfully'
      )

      setAiTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task !== aiTask
        )
      )

      await fetchTasks()
    } catch (error) {
      setAiMessage(
        error.response?.data?.message ||
          'Failed to add task'
      )
    }
  }

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      (task.title || '')
        .toLowerCase()
        .includes(searchText) ||
      (task.description || '')
        .toLowerCase()
        .includes(searchText)

    const matchesStatus =
      !statusFilter ||
      task.status === statusFilter

    const matchesPriority =
      !priorityFilter ||
      task.priority === priorityFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    )
  })

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (taskStatus) => {
    if (taskStatus === 'done') {
      return {
        background: '#dcfce7',
        color: '#166534',
      }
    }

    if (taskStatus === 'in-progress') {
      return {
        background: '#f0e7ff',
        color: '#6d28d9',
      }
    }

    return {
      background: '#f1f5f9',
      color: '#475569',
    }
  }

  // =========================
  // PRIORITY STYLE
  // =========================

  const getPriorityStyle = (taskPriority) => {
    if (taskPriority === 'high') {
      return {
        background: '#fee2e2',
        color: '#b91c1c',
      }
    }

    if (taskPriority === 'medium') {
      return {
        background: '#fef3c7',
        color: '#92400e',
      }
    }

    return {
      background: '#dcfce7',
      color: '#166534',
    }
  }

  // =========================
  // COMMON STYLES
  // =========================

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff',

    // IMPORTANT:
    // Makes typed text visible
    color: '#3b2768',
  }

  const labelStyle = {
    display: 'block',
    color: '#334155',
    fontWeight: 'bold',
    marginBottom: '7px',
    fontSize: '14px',
  }

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e9ddff',
    borderRadius: '14px',
    padding: '25px',
    boxShadow:
      '0 4px 12px rgba(37, 99, 235, 0.06)',
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        marginLeft: '185px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '35px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >

        {/* HEADER */}

        <div style={{ marginBottom: '30px' }}>
          <p
            style={{
              color: '#7c3aed',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Productivity
          </p>

          <h1
            style={{
              color: '#3b2768',
              fontSize: '32px',
              margin: '0 0 10px',
            }}
          >
            Task Management
          </h1>

          <p
            style={{
              color: '#64748b',
              margin: 0,
            }}
          >
            Create, organize and track your project
            tasks.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              background: '#f0e7ff',
              color: '#6d28d9',
              border: '1px solid #e9ddff',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: '600',
            }}
          >
            {message}
          </div>
        )}

        {/* AI SECTION */}

        <div
          style={{
            background: '#8b5cf6',
            color: 'white',
            borderRadius: '14px',
            padding: '28px',
            marginBottom: '30px',
            boxShadow:
              '0 6px 18px rgba(37, 99, 235, 0.2)',
          }}
        >
          <h2
            style={{
              margin: '0 0 8px',
            }}
          >
            ✦ Smart Task Suggestions
          </h2>

          <p
            style={{
              marginTop: 0,
              opacity: 0.9,
            }}
          >
            Get practical task suggestions for
            your project.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <select
              value={aiProjectId}
              onChange={(e) =>
                setAiProjectId(e.target.value)
              }
              style={{
                padding: '11px',
                borderRadius: '8px',
                border: 'none',
                minWidth: '230px',
                fontSize: '14px',
                color: '#3b2768',
                background: '#ffffff',
              }}
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project.project_id}
                  value={project.project_id}
                >
                  {project.project_name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={generateAITasks}
              disabled={aiLoading}
              style={{
                background: '#ffffff',
                color: '#7c3aed',
                border: 'none',
                padding: '11px 18px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {aiLoading
                ? 'Generating...'
                : 'Generate Suggestions'}
            </button>
          </div>

          {aiMessage && (
            <p
              style={{
                color: '#dbeafe',
              }}
            >
              {aiMessage}
            </p>
          )}

          {/* AI RESULTS */}

          {aiTasks.length > 0 && (
            <div style={{ marginTop: '25px' }}>
              <h3>Suggested Tasks</h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '15px',
                }}
              >
                {aiTasks.map((aiTask, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#ffffff',
                      color: '#3b2768',
                      padding: '18px',
                      borderRadius: '10px',
                    }}
                  >
                    <h4
                      style={{
                        marginTop: 0,
                      }}
                    >
                      {aiTask.title}
                    </h4>

                    <p
                      style={{
                        color: '#64748b',
                        lineHeight: '1.5',
                      }}
                    >
                      {aiTask.description}
                    </p>

                    <span
                      style={{
                        background: '#f0e7ff',
                        color: '#7c3aed',
                        padding: '5px 9px',
                        borderRadius: '15px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {aiTask.priority}
                    </span>

                    <br />
                    <br />

                    <button
                      type="button"
                      onClick={() =>
                        addAITask(aiTask)
                      }
                      style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        padding: '9px 14px',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      + Add Task
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CREATE / EDIT FORM */}

        <div
          id="task-form"
          style={{
            ...cardStyle,
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              color: '#3b2768',
              marginTop: 0,
            }}
          >
            {editingId
              ? 'Edit Task'
              : 'Create New Task'}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* FIRST ROW */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '18px',
              }}
            >

              {/* TITLE */}

              <div>
                <label style={labelStyle}>
                  Task Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter task title"
                  required
                  style={inputStyle}
                />
              </div>

              {/* PROJECT */}

              <div>
                <label style={labelStyle}>
                  Project
                </label>

                <select
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(e.target.value)
                  }
                  required
                  style={inputStyle}
                >
                  <option value="">
                    Select Project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.project_id}
                      value={project.project_id}
                    >
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label style={labelStyle}>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="todo">
                    To Do
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="done">
                    Done
                  </option>
                </select>
              </div>

              {/* PRIORITY */}

              <div>
                <label style={labelStyle}>
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>
              </div>

              {/* DUE DATE */}

              <div>
                <label style={labelStyle}>
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div
              style={{
                marginTop: '18px',
              }}
            >
              <label style={labelStyle}>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the task"
                rows="4"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* BUTTONS */}

            <div
              style={{
                marginTop: '20px',
              }}
            >
              <button
                type="submit"
                style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '11px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {editingId
                  ? 'Update Task'
                  : '+ Create Task'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  style={{
                    marginLeft: '10px',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: 'none',
                    padding: '11px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SEARCH & FILTER */}

        <div
          style={{
            ...cardStyle,
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              color: '#3b2768',
              marginTop: 0,
            }}
          >
            Search & Filter
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tasks..."
              style={inputStyle}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={inputStyle}
            >
              <option value="">
                All Status
              </option>

              <option value="todo">
                To Do
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="done">
                Done
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              style={inputStyle}
            >
              <option value="">
                All Priority
              </option>

              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>
        </div>

        {/* TASK LIST */}

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <h2
              style={{
                color: '#3b2768',
                margin: 0,
              }}
            >
              Your Tasks
            </h2>

            <span
              style={{
                background: '#f0e7ff',
                color: '#6d28d9',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              {filteredTasks.length} tasks
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div style={cardStyle}>
              <p
                style={{
                  color: '#64748b',
                  margin: 0,
                }}
              >
                No tasks found.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredTasks.map((task) => (
                <div
                  key={task.task_id}
                  style={cardStyle}
                >

                  {/* TASK TITLE + STATUS */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'flex-start',
                      gap: '10px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#3b2768',
                        margin:
                          '0 0 12px',
                      }}
                    >
                      {task.title}
                    </h3>

                    <span
                      style={{
                        ...getStatusStyle(
                          task.status
                        ),
                        padding:
                          '5px 9px',
                        borderRadius:
                          '20px',
                        fontSize:
                          '11px',
                        fontWeight:
                          'bold',
                        whiteSpace:
                          'nowrap',
                      }}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  <p
                    style={{
                      color: '#64748b',
                      lineHeight: '1.5',
                    }}
                  >
                    {task.description ||
                      'No description provided.'}
                  </p>

                  {/* DETAILS */}

                  <div
                    style={{
                      marginTop: '18px',
                      paddingTop: '15px',
                      borderTop:
                        '1px solid #eef2f7',
                    }}
                  >
                    <p
                      style={{
                        color: '#64748b',
                      }}
                    >
                      <strong>
                        Project:
                      </strong>{' '}
                      {task.project_name ||
                        'Unknown'}
                    </p>

                    <p
                      style={{
                        color: '#64748b',
                      }}
                    >
                      <strong>
                        Due:
                      </strong>{' '}
                      {task.due_date ||
                        'No due date'}
                    </p>

                    <span
                      style={{
                        ...getPriorityStyle(
                          task.priority
                        ),
                        padding:
                          '5px 10px',
                        borderRadius:
                          '20px',
                        fontSize:
                          '11px',
                        fontWeight:
                          'bold',
                      }}
                    >
                      {task.priority ||
                        'medium'}{' '}
                      priority
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        startEdit(task)
                      }}
                      style={{
                        background:
                          '#eff6ff',
                        color:
                          '#2563eb',
                        border:
                          '1px solid #bfdbfe',
                        padding:
                          '8px 14px',
                        borderRadius:
                          '7px',
                        cursor:
                          'pointer',
                        fontWeight:
                          'bold',
                        position:
                          'relative',
                        zIndex: 10,
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(
                          task.task_id
                        )
                      }}
                      style={{
                        marginLeft:
                          '8px',
                        background:
                          '#fff1f2',
                        color:
                          '#dc2626',
                        border:
                          '1px solid #fecdd3',
                        padding:
                          '8px 14px',
                        borderRadius:
                          '7px',
                        cursor:
                          'pointer',
                        fontWeight:
                          'bold',
                        position:
                          'relative',
                        zIndex: 10,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks