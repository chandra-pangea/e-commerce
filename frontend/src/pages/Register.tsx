import React from 'react';
import { register as apiRegister } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { toast } from 'react-toastify';
import { Chromium } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAction } = useAuth();

  const initialValues = { name: '', email: '', mobile: '', password: '' };
  const validationSchema = Yup.object({
    name: Yup.string().required('Required').min(4, 'Minimum 4 digit'),
    email: Yup.string().email('Invalid email').required('Required'),
    mobile: Yup.string().min(10, 'Min 10 digits').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any,
  ) => {
    try {
      await apiRegister({ ...values });
      registerAction(values.name, values.email, values.password);
      toast.success('Registration successful!');
      navigate('/login');
    } catch {
      setFieldError('email', 'Registration failed');
      toast.error('Registration failed!');
    }
    setSubmitting(false);
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
          <Form>
            <Field name="name" placeholder="Name" className="w-full mb-3 p-2 border rounded" />
            <ErrorMessage name="name" component="div" className="text-red-500 mb-2" />
            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 mb-2" />
            <Field name="mobile" placeholder="Mobile" className="w-full mb-3 p-2 border rounded" />
            <ErrorMessage name="mobile" component="div" className="text-red-500 mb-2" />
            <Field
              name="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 mb-2" />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
              disabled={isSubmitting}
            >
              Register
            </button>
            <button
              type="button"
              className="w-full bg-red-500 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 mt-2"
              onClick={() => alert('Google Auth (dummy)')}
            >
              <Chromium />
              Continue with Google
            </button>
          </Form>
        )}
      </Formik>
      <button className="mt-4 text-blue-600" onClick={() => navigate('/login')}>
        Already have an account?
      </button>
    </div>
  );
};
export default Register;
