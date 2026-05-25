import axios from "axios";

import { env }
from "@/config/env";

import {
  queryClient,
} from "@/lib/queryClient";

import {
  useAuthStore,
} from "@/features/auth/store/auth.store";

// ✅ REFRESH LOCK
let isRefreshing =
  false;

// ✅ FAILED REQUEST QUEUE
let failedQueue =
  [];

// ✅ PROCESS QUEUED REQUESTS
const processQueue = (
  error,
  token = null
) => {

  failedQueue.forEach(
    (promise) => {

      if (error) {

        promise.reject(
          error
        );

      } else {

        promise.resolve(
          token
        );
      }
    }
  );

  failedQueue = [];
};

// ✅ AXIOS INSTANCE
export const apiClient =
  axios.create({

    baseURL:
      env.API_URL,

    timeout:
      20000,

    withCredentials:
      true,

    headers: {

      "Content-Type":
        "application/json",
    },
  });

// ✅ REQUEST INTERCEPTOR
apiClient.interceptors.request.use(

  (config) => {

    const token =
      useAuthStore
        .getState()
        .accessToken;

    // ✅ ATTACH TOKEN
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // ✅ TRACE REQUEST ID
    config.headers[
      "x-request-id"
    ] =
      globalThis.crypto
        ?.randomUUID?.() ||

      Date.now()
        .toString();

    return config;
  },

  (error) =>
    Promise.reject(
      error
    )
);

// ✅ RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(

  // ✅ SUCCESS
  (response) =>
    response.data,

  // ✅ ERROR
  async (error) => {

    const originalRequest =
      error.config;

    const status =
      error?.response?.status;

    const store =
      useAuthStore
        .getState();

    // ✅ AUTH ROUTES THAT SHOULD NEVER TRIGGER REFRESH
const isAuthRoute =

  originalRequest?.url?.includes(
    "/auth/login"
  ) ||

  originalRequest?.url?.includes(
    "/auth/register"
  ) ||

  originalRequest?.url?.includes(
    "/auth/verify-email"
  ) ||

  originalRequest?.url?.includes(
    "/auth/login-otp"
  ) ||

  originalRequest?.url?.includes(
    "/auth/verify-login-otp"
  ) ||

  originalRequest?.url?.includes(
    "/auth/resend-otp"
  ) ||

  originalRequest?.url?.includes(
    "/auth/refresh"
  );

// ✅ TOKEN EXPIRED
if (

  status === 401 &&

  !originalRequest._retry &&

  store.refreshToken &&

  !isAuthRoute
) {

      // ✅ ALREADY REFRESHING
      if (isRefreshing) {

        return new Promise(

          (
            resolve,
            reject
          ) => {

            failedQueue.push({

              resolve,

              reject,
            });
          }

        ).then(
          (token) => {

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return apiClient(
              originalRequest
            );
          }
        );
      }

      // ✅ START REFRESH
      originalRequest._retry =
        true;

      isRefreshing =
        true;

      try {

        // ✅ REFRESH SESSION
        const refreshed =
          await store
            .refreshSession();

        // ✅ RELEASE QUEUE
        processQueue(

          null,

          refreshed.accessToken
        );

        // ✅ RETRY ORIGINAL REQUEST
        originalRequest.headers.Authorization =
          `Bearer ${refreshed.accessToken}`;

        return apiClient(
          originalRequest
        );

      } catch (err) {

        // ✅ FAIL ALL QUEUED REQUESTS
        processQueue(
          err
        );

        // ✅ LOGOUT USER
        await store
          .logout();

        // ✅ CLEAR REACT QUERY CACHE
        queryClient.clear();

        // ✅ CLEAN REDIRECT
        window.location.replace(
          "/login"
        );

        return Promise.reject(
          err
        );

      } finally {

        isRefreshing =
          false;
      }
    }

    // ✅ STANDARDIZED ERROR RESPONSE
    return Promise.reject(

      error?.response?.data || {

        success:
          false,

        message:
          "Something went wrong",
      }
    );
  }
);