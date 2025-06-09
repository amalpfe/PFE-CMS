import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [role, setRole] = useState<"Admin" | "Doctor">("Admin");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const toggleRole = () => {
    setRole((prev) => (prev === "Admin" ? "Doctor" : "Admin"));
    setMessage("");
  };

  const initialValues = {
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    emailOrUsername: Yup.string()
      .required(`${role === "Admin" ? "Username" : "Email"} is required`)
      .when("role", {
        is: "Doctor",
        then: (schema) => schema.email("Invalid email format"),
      }),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setMessage("");
    setIsLoading(true);

    const url =
      role === "Admin"
        ? "http://localhost:5000/auth/login/admin"
        : "http://localhost:5000/auth/login/doctor";

    const payload =
      role === "Admin"
        ? { username: values.emailOrUsername, password: values.password }
        : { email: values.emailOrUsername, password: values.password };

    try {
      const response = await axios.post(url, payload);
      const { token, role: responseRole } = response.data;

      if (values.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      navigate(
        responseRole === "Admin" ? "/admin/dashboard" : "/doctor/dashboard"
      );
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-purple-600">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-purple-600">
            {role} Login
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="emailOrUsername"
                  className="text-purple-600 text-sm font-medium"
                >
                  {role === "Admin" ? "Username" : "Email"}
                </label>
                <Field
                  name="emailOrUsername"
                  type={role === "Admin" ? "text" : "email"}
                  placeholder={role === "Admin" ? "admin123" : "doctor@email.com"}
                  className="w-full px-4 py-2 border border-purple-600 rounded-lg"
                />
                <ErrorMessage
                  name="emailOrUsername"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="text-purple-600 text-sm font-medium"
                >
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="********"
                  className="w-full px-4 py-2 border border-purple-600 rounded-lg"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="inline-flex items-center">
                  <Field type="checkbox" name="rememberMe" className="mr-2" />
                  <span className="text-sm text-gray-700">Remember Me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {message}
                </p>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-purple-600">
                  {role === "Admin" ? "Doctor" : "Admin"} Login?{" "}
                  <button
                    type="button"
                    onClick={toggleRole}
                    className="underline font-medium"
                  >
                    Click here
                  </button>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
