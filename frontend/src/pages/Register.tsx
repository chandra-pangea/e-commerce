import React from 'react';
import { register as apiRegister, googleLogin } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = { name: '', email: '', mobile: '', password: '' };
  const validationSchema = Yup.object({
    name: Yup.string().required('Required').min(4, 'Minimum 4 characters'),
    email: Yup.string().email('Invalid email').required('Required'),
    mobile: Yup.string().min(10, 'Min 10 digits').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any,
  ) => {
    try {
      const response = await apiRegister(values);
      login(response.user);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error: any) {
      setFieldError('email', error.response?.data?.message || 'Registration failed');
      toast.error('Registration failed!');
    }
    setSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      login(response.user);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error('Google registration failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[10%] p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field
                name="mobile"
                placeholder="Mobile Number"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Registration Failed')}
                theme="outline"
                shape="rectangular"
                width="100%"
              />
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-4 text-center">
        <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate('/login')}>
          Already have an account?
        </button>
      </div>
    </div>
  );
};

export default Register;
