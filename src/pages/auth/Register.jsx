import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { register as registerUser, reset } from "../../features/auth/authSlice";
import { registerSchema } from "../../utils/validation";
import Button from "../../components/common/Button";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (isError) {
      setErrorMessage(message || "Registrasi gagal, silakan coba lagi");
      setSuccessMessage("");
    }

    if (isSuccess) {
      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setErrorMessage("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    setErrorMessage("");
    setSuccessMessage("");
    const { confirmPassword: _confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
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
            Lengkapi data untuk membuat akun
          </h1>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
              <p className="text-sm text-red-600">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
              <p className="text-sm text-green-600">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="masukan email anda"
                  className={`w-full px-4 py-3 pl-10 border rounded-md outline-none transition ${
                    errors.email
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

            {/* First Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="nama depan"
                  className={`w-full px-4 py-3 pl-10 border rounded-md outline-none transition ${
                    errors.first_name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  {...register("first_name")}
                />
              </div>

              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="nama belakang"
                  className={`w-full px-4 py-3 pl-10 border rounded-md outline-none transition ${
                    errors.last_name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  {...register("last_name")}
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="buat password"
                  className={`w-full px-4 py-3 pl-10 pr-12 border rounded-md outline-none transition ${
                    errors.password
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="konfirmasi password"
                  className={`w-full px-4 py-3 pl-10 pr-12 border rounded-md outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-6">
              {isLoading ? "Loading..." : "Registrasi"}
            </Button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            sudah punya akun? login{" "}
            <Link to="/login" className="text-primary font-semibold">
              di sini
            </Link>
          </p>
        </div>
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

export default Register;
