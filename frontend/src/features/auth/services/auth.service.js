import {
  apiClient,
} from "@/lib/apiClient";

export const authService = {

  // ✅ REGISTER
  register:
    (payload) =>
      apiClient.post(
        "/auth/register",
        payload
      ),

  // ✅ LOGIN
  login:
    (payload) =>
      apiClient.post(
        "/auth/login",
        payload
      ),

  // ✅ VERIFY EMAIL OTP
  verifyEmail:
    (payload) =>
      apiClient.post(
        "/auth/verify-email",
        payload
      ),

  // ✅ LOGIN OTP
  loginOtp:
    (payload) =>
      apiClient.post(
        "/auth/login-otp",
        payload
      ),

  // ✅ VERIFY LOGIN OTP
  verifyLoginOtp:
    (payload) =>
      apiClient.post(
        "/auth/verify-login-otp",
        payload
      ),

  // ✅ CURRENT USER
  me:
    () =>
      apiClient.get(
        "/auth/me"
      ),

  // ✅ REFRESH TOKEN
  refresh:
    () =>
      apiClient.post(
        "/auth/refresh"
      ),

  // ✅ LOGOUT
  logout:
    () =>
      apiClient.post(
        "/auth/logout"
      ),

  sendOtp:
    (payload) =>
      apiClient.post(
        "/auth/resend-otp",
        payload
      ),

      // ✅ FORGOT PASSWORD
forgotPassword:
  (payload) =>
    apiClient.post(
      "/auth/forgot-password",
      payload
    ),

verifyResetOtp:
  (payload) =>
    apiClient.post(
      "/auth/verify-reset-otp",
      payload
    ),

resetPassword:
  (payload) =>
    apiClient.post(
      "/auth/reset-password",
      payload
    ),

};