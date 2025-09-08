import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import { useFormik } from 'formik';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = 'Email requerido';
      if (!values.password) errors.password = 'Contraseña requerida';
      return errors;
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/api/login', values, {
          withCredentials: true,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));

        if (response.data.usuario.role === 'admin') {
          navigate('/admin');
        } else if (response.data.usuario.role === 'agent' || response.data.usuario.role === 'support') {
          navigate('/soporte');
        } else {
          navigate('/usuario');
        }

      } catch (err) {
        if (err.response?.status === 401) {
          setError('Credenciales incorrectas');
        } else {
          setError('Error en el servidor');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#e9f1fd' }}>
      <div className="bg-white p-4 shadow rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-3">
          <img src="/logo.png" alt="Logo" width="120" className="mb-2" />
          <h4 className="fw-bold">Iniciar sesión</h4>
        </div>

        <form onSubmit={formik.handleSubmit} className="row g-3">
          <div className="col-12">
            <input
              type="text"
              name="email"
              placeholder="Usuario o correo"
              className={classNames('form-control rounded-pill px-3 py-2', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          <div className="col-12">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={classNames('form-control rounded-pill px-3 py-2', {
                'is-invalid': formik.touched.password && formik.errors.password,
              })}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          {error && (
            <div className="col-12 text-danger text-center small">{error}</div>
          )}

          <div className="col-12">
            <button
              type="submit"
              className="btn w-100 rounded-pill py-2"
              style={{ backgroundColor: '#6c47ff', color: 'white' }}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;