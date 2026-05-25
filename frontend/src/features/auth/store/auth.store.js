import { create }
from "zustand";

import { persist }
from "zustand/middleware";

import {
  authService,
} from "@/features/auth/services/auth.service";

export const useAuthStore =
  create(

    persist(

      (set) => ({

        user: null,

        accessToken: null,

        refreshToken: null,

        loading: false,

        hydrated: false,

        // ✅ INITIALIZE SESSION
       initialize:
  async () => {

    try {

      const {
        accessToken,
        refreshToken,
      } =
        useAuthStore.getState();

      // ✅ NO SESSION
      if (
        !accessToken &&
        !refreshToken
      ) {

        return set({

          hydrated: true,
        });
      }

      // ✅ TRY USER FETCH
      const response =
        await authService.me();

      const data =
        response.data ||
        response;

      set({

        user:
          data.user || data,

        hydrated:
          true,
      });

    } catch (err) {

      console.error(
        "Initialize failed:",
        err
      );

      set({

        user: null,

        accessToken: null,

        refreshToken: null,

        hydrated: true,
      });

      localStorage.removeItem(
        "beatflow-auth"
      );
    }
  },

        // ✅ LOGIN
        login:
          async (payload) => {

            set({
              loading: true,
            });

            try {

              const response =
                await authService.login(
                  payload
                );

              const data =
                response.data ||
                response;

              set({

                user:
                  data.user,

                accessToken:
                  data.accessToken,

                refreshToken:
                  data.refreshToken,

                loading:
                  false,
              });

              return data;

            } catch (err) {

              set({
                loading: false,
              });

              throw err;
            }
          },

        // ✅ SEND OTP
        sendOtp:
          async (payload) => {

            return await authService
              .sendOtp(payload);
          },

        // ✅ REGISTER
        register:
          async (payload) => {

            return await authService
              .register(payload);
          },

        // ✅ VERIFY EMAIL
        verifyEmail:
          async (payload) => {

            return await authService
              .verifyEmail(payload);
          },

        // ✅ LOGIN OTP
        loginOtp:
          async (payload) => {

            return await authService
              .loginOtp(payload);
          },

        // ✅ VERIFY LOGIN OTP
        verifyLoginOtp:
          async (payload) => {

            set({
              loading: true,
            });

            try {

              const response =
                await authService
                  .verifyLoginOtp(
                    payload
                  );

              const data =
                response.data ||
                response;

              // ✅ SAVE SESSION
              set({

                user:
                  data.user,

                accessToken:
                  data.accessToken,

                refreshToken:
                  data.refreshToken,

                loading:
                  false,
              });

              return data;

            } catch (err) {

              set({
                loading: false,
              });

              throw err;
            }
          },

        // ✅ REFRESH SESSION
        refreshSession:
          async () => {

            const response =
              await authService
                .refresh();

            const data =
              response.data ||
              response;

            set({

              accessToken:
                data.accessToken,

              refreshToken:
                data.refreshToken,
            });

            return data;
          },

        // ✅ LOGOUT
        logout:
          async () => {
            try {
              await authService
                .logout();

            } catch (err) {
              console.error(
                "Logout failed:",
                err
              );
            }

            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              hydrated: true,
            });

           localStorage.removeItem(
              "beatflow-auth"
            );
          },

         forgotPassword:
          async (payload) => {

            return await authService
              .forgotPassword(payload);
          },

        verifyResetOtp:
          async (payload) => {

            return await authService
              .verifyResetOtp(payload);
          },

        resetPassword:
          async (payload) => {

            return await authService
              .resetPassword(payload);
          }, 
      }),

      {
        name:
          "beatflow-auth",
      }
    )
  );