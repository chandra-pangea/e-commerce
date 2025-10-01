import React from 'react';
import { login as apiLogin } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Chrome } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginAction } = useAuth();

  const initialValues = { email: '', password: '' };
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any,
  ) => {
    try {
      const res = await apiLogin(values.email, values.password);
      localStorage.setItem('token', res.token);
      loginAction(values.email, values.password);
      toast.success('Login successful!');
      navigate('/');
    } catch {
      setFieldError('email', 'Invalid credentials');
      toast.error('Login failed!');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-[10%] p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 mb-2" />
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-3 p-2 border rounded"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 mb-2" />
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
                  disabled={isSubmitting}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="w-full bg-red-500 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
                  onClick={() => alert('Google Auth (dummy)')}
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-4 flex justify-end">
          <button className="text-blue-600" onClick={() => navigate('/register')}>
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
