import * as yup from "yup";

export const registerSchema = yup
  .object({
    email: yup
      .string()
      .email("Format email tidak valid")
      .required("Email harus diisi"),
    first_name: yup
      .string()
      .required("Nama depan harus diisi")
      .min(2, "Nama depan minimal 2 karakter"),
    last_name: yup
      .string()
      .required("Nama belakang harus diisi")
      .min(2, "Nama belakang minimal 2 karakter"),
    password: yup
      .string()
      .required("Password harus diisi")
      .min(8, "Password minimal 8 karakter"),
    confirmPassword: yup
      .string()
      .required("Konfirmasi password harus diisi")
      .oneOf([yup.ref("password")], "Password tidak cocok"),
  })
  .required();

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Format email tidak valid")
      .required("Email harus diisi"),
    password: yup
      .string()
      .required("Password harus diisi")
      .min(8, "Password minimal 8 karakter"),
  })
  .required();
