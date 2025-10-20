import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login, reset } from "../../features/auth/authSlice";
import { loginSchema } from "../../utils/validation";
import Button from "../../components/common/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isError) {
      setErrorMessage("password yang anda masukan salah");
    }

    if (isSuccess || token) {
      navigate("/home");
    }

    dispatch(reset());
  }, [token, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    setErrorMessage("");
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <img
                src="/Logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-semibold">SIMS PPOB</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-8">
            Masuk atau buat akun untuk memulai
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="masukan email anda"
                  className={`w-full px-4 py-3 pl-10 border rounded-md outline-none transition ${
                    errors.email || errorMessage
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="masukan password anda"
                  className={`w-full px-4 py-3 pl-10 pr-12 border rounded-md outline-none transition ${
                    errors.password || errorMessage
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-6">
              {isLoading ? "Loading..." : "Masuk"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            belum punya akun? registrasi{" "}
            <Link to="/register" className="text-primary font-semibold">
              di sini
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mt-8 lg:mt-52 xl:mt-60">
            <div className="px-3 py-1 bg-red-50 rounded-md flex items-center justify-between">
              <p className="text-sm text-red-600">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Illustration */}
      <div className="w-1/2 h-screen bg-pink-50 flex items-center justify-center overflow-hidden">
        <img
          src="/IllustrasiLogin.png"
          alt="Ilustrasi Login"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default Login;
