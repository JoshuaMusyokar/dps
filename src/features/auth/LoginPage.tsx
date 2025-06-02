import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/apis/public-api";
import { useAppDispatch } from "../../hooks";
import { setCredentials } from "../../store/slices/auth-slice";
import FlashMessages from "../ntf/FlashMessages";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const organizationId = "9a637bd7ad444a7d8902f50e77fed73f";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({
        organization_id: organizationId,
        email_address: email,
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          token: response.token_details.access_token,
          issuedAt: response.token_details.issued_at,
          expiryAt: response.token_details.expires_at,
          user: response.user_details,
          permissions: response.permissions,
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <FlashMessages />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Waves */}
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-64 opacity-20"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#wave1)"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;50,0;0,0"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <svg
            className="absolute bottom-0 left-0 w-full h-48 opacity-30"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#wave2)"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,192C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-30,0;0,0"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/3 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">DPS</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              {showTwoFactor
                ? "Verify Your Identity"
                : "Continue your payment journey"}
            </p>
            <p className="text-sm text-gray-400">
              {showTwoFactor
                ? "Enter the verification code sent to your email"
                : "Secure payments made simple and elegant"}
            </p>
          </div>

          {/* Login Form Card */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 py-8 px-6 sm:px-10 relative overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full"></div>

              <div className="relative z-10">
                {error && (
                  <div className="bg-red-500/20 backdrop-blur border border-red-500/30 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {!showTwoFactor ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-200 mb-2"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                              placeholder="Enter your email"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-200 mb-2"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                              placeholder="Enter your password"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded bg-white/10 backdrop-blur"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-200"
                          >
                            Remember me
                          </label>
                        </div>

                        <div className="text-sm">
                          <a
                            href="#"
                            className="font-medium text-purple-300 hover:text-purple-200 transition-colors duration-200"
                          >
                            Forgot password?
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label
                        htmlFor="twoFactorCode"
                        className="block text-sm font-medium text-gray-200 mb-2"
                      >
                        Verification Code
                      </label>
                      <div className="relative">
                        <input
                          id="twoFactorCode"
                          name="twoFactorCode"
                          type="text"
                          autoComplete="one-time-code"
                          required
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          className="block w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/15 text-center text-lg tracking-widest"
                          placeholder="• • • • • •"
                          maxLength={6}
                        />
                      </div>
                      <p className="mt-3 text-sm text-gray-300 text-center">
                        Check your email for the verification code
                      </p>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-xl transform transition-all duration-200 hover:scale-105 ${
                        isLoginLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        {isLoginLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <svg
                            className="h-5 w-5 text-purple-300 group-hover:text-purple-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                        )}
                      </span>
                      {isLoginLoading
                        ? "Signing In..."
                        : showTwoFactor
                        ? "Verify & Continue"
                        : "Sign In"}
                    </button>
                  </div>
                </form>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white/5 backdrop-blur text-gray-300 rounded-full">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-2xl shadow-sm bg-white/10 backdrop-blur text-sm font-medium text-gray-200 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                      <span className="ml-2">Google</span>
                    </button>

                    <button className="w-full inline-flex justify-center py-3 px-4 border border-white/20 rounded-2xl shadow-sm bg-white/10 backdrop-blur text-sm font-medium text-gray-200 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      <span className="ml-2">Apple</span>
                    </button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-300">
                    New to DPS?{" "}
                    <a
                      href="/register"
                      className="font-medium text-purple-300 hover:text-purple-200 transition-colors duration-200"
                    >
                      Create your account →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Trusted by thousands of businesses worldwide for secure payments
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
