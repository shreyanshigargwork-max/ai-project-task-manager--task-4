import { useEffect, useState } from 'react'
import axios from 'axios'

function Projects() {
  const [projects, setProjects] = useState([])

  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active')

  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    border: '1px solid #e9ddff',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff',
    color: '#3b2768',
  }

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/projects',
        { headers }
      )

      setProjects(response.data)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Failed to load projects'
      )
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const clearForm = () => {
    setProjectName('')
    setDescription('')
    setStatus('active')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!projectName.trim()) {
      setError('Project name is required')
      return
    }

    try {
      const data = {
        project_name: projectName,
        description,
        status,
      }

      if (editingId) {
        const response = await axios.put(
          `http://localhost:5000/api/projects/${editingId}`,
          data,
          { headers }
        )

        setMessage(
          response.data.message || 'Project updated successfully'
        )
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/projects',
          data,
          { headers }
        )

        setMessage(
          response.data.message || 'Project created successfully'
        )
      }

      clearForm()
      fetchProjects()
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Something went wrong'
      )
    }
  }

  const startEdit = (project) => {
    setEditingId(project.project_id)
    setProjectName(project.project_name)
    setDescription(project.description || '')
    setStatus(project.status || 'active')

    setMessage('')
    setError('')

    setTimeout(() => {
      document
        .getElementById('project-form')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      setMessage('')
      setError('')

      const response = await axios.delete(
        `http://localhost:5000/api/projects/${projectId}`,
        { headers }
      )

      setMessage(
        response.data.message || 'Project deleted successfully'
      )

      if (editingId === projectId) {
        clearForm()
      }

      fetchProjects()
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Failed to delete project'
      )
    }
  }

  const handleStatusChange = async (project, newStatus) => {
    try {
      setMessage('')
      setError('')

      await axios.put(
        `http://localhost:5000/api/projects/${project.project_id}`,
        {
          project_name: project.project_name,
          description: project.description || '',
          status: newStatus,
        },
        { headers }
      )

      setMessage('Project status updated successfully')

      fetchProjects()
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
        'Failed to update project status'
      )
    }
  }

  const getStatusStyle = (projectStatus) => {
    if (projectStatus === 'completed') {
      return {
        background: '#ede9fe',
        color: '#6d28d9',
      }
    }

    if (projectStatus === 'on-hold') {
      return {
        background: '#f3e8ff',
        color: '#9333ea',
      }
    }

    return {
      background: '#f0e7ff',
      color: '#7c3aed',
    }
  }

  return (
    <div
      style={{
        marginLeft: '185px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '35px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >

        {/* Header */}
        <div
          style={{
            marginBottom: '30px',
          }}
        >
          <h1
            style={{
              margin: 0,
              color: '#3b2768',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            Projects
          </h1>

          <p
            style={{
              marginTop: '7px',
              marginBottom: 0,
              color: '#64748b',
              fontSize: '14px',
            }}
          >
            Create and manage your projects
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div
            style={{
              background: '#f0e7ff',
              color: '#6d28d9',
              border: '1px solid #e9ddff',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Create / Edit Project */}
        <div
          id="project-form"
          style={{
            background: '#ffffff',
            border: '1px solid #e9ddff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '20px',
              color: '#3b2768',
              fontSize: '18px',
              fontWeight: '700',
            }}
          >
            {editingId ? 'Edit Project' : 'Create New Project'}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Project Name */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#3b2768',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Project Name
              </label>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#3b2768',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows="4"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Status */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  color: '#3b2768',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '11px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#8b5cf6',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {editingId ? 'Update Project' : 'Create Project'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  style={{
                    padding: '11px 20px',
                    border: '1px solid #e9ddff',
                    borderRadius: '8px',
                    background: '#ffffff',
                    color: '#6d28d9',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#3b2768',
                fontSize: '20px',
                fontWeight: '700',
              }}
            >
              Your Projects
            </h2>

            <div
              style={{
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              {projects.length} project
              {projects.length !== 1 ? 's' : ''}
            </div>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e9ddff',
                borderRadius: '12px',
                padding: '45px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  margin: '0 auto 15px',
                  borderRadius: '12px',
                  background: '#f0e7ff',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: '700',
                }}
              >
                +
              </div>

              <h3
                style={{
                  margin: '0 0 7px',
                  color: '#3b2768',
                  fontSize: '16px',
                }}
              >
                No projects yet
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '13px',
                }}
              >
                Create your first project using the form above.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px',
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.project_id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e9ddff',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  {/* Project title */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: '#3b2768',
                        fontSize: '17px',
                        fontWeight: '700',
                      }}
                    >
                      {project.project_name}
                    </h3>

                    <span
                      style={{
                        ...getStatusStyle(project.status),
                        padding: '5px 9px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.status === 'on-hold'
                        ? 'On Hold'
                        : project.status
                          ? project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)
                          : 'Active'}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      margin: '0 0 18px',
                      color: '#64748b',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      minHeight: '42px',
                    }}
                  >
                    {project.description ||
                      'No description provided.'}
                  </p>

                  {/* Status selector */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Change Status
                    </label>

                    <select
                      value={project.status || 'active'}
                      onChange={(e) =>
                        handleStatusChange(
                          project,
                          e.target.value
                        )
                      }
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '9px',
                        border: '1px solid #e9ddff',
                        borderRadius: '7px',
                        background: '#ffffff',
                        color: '#3b2768',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      style={{
                        flex: 1,
                        padding: '9px',
                        border: '1px solid #e9ddff',
                        borderRadius: '7px',
                        background: '#f0e7ff',
                        color: '#6d28d9',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(project.project_id)
                      }
                      style={{
                        flex: 1,
                        padding: '9px',
                        border: '1px solid #fecaca',
                        borderRadius: '7px',
                        background: '#ffffff',
                        color: '#dc2626',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
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

export default Projects