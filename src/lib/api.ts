import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach current Access Token to Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const accessToken =
        localStorage.getItem('dropoflife_access_token') ||
        localStorage.getItem('dropoflife_token');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// State tracking for seamless concurrent token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Catch 401 and auto-refresh Access Token via Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    // If 401 Unauthorized occurs on a non-auth endpoint, attempt token refresh
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('dropoflife_refresh_token');

      if (!refreshToken) {
        // No refresh token available, session is definitely expired
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request until refresh completes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.data?.token;

        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('dropoflife_access_token', newAccessToken);
          localStorage.setItem('dropoflife_token', newAccessToken);
          document.cookie = `dropoflife_token=${newAccessToken}; path=/; max-age=86400; SameSite=Lax`;

          if (newRefreshToken) {
            localStorage.setItem('dropoflife_refresh_token', newRefreshToken);
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        // Clear invalid tokens on terminal refresh failure
        localStorage.removeItem('dropoflife_access_token');
        localStorage.removeItem('dropoflife_token');
        localStorage.removeItem('dropoflife_refresh_token');
        localStorage.removeItem('dropoflife_user');
        document.cookie = 'dropoflife_token=; path=/; max-age=0; SameSite=Lax';

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    const customError: any = new Error(message);
    customError.response = error.response;
    customError.status = status;
    return Promise.reject(customError);
  }
);
