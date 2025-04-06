import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First step of authentication - email and password
      if (!showTwoFactor) {
        // Simulate API call to authenticate
        const response = await fakeAuthApi(email, password);

        if (response.requiresTwoFactor) {
          setShowTwoFactor(true);
          // In a real app, this would trigger sending a 2FA code to the user
        } else {
          // Direct login if 2FA not required
          //   handleSuccessfulLogin(response.token);
        }
      } else {
        // Second step - 2FA verification
        const response = await fakeTwoFactorVerify(email, twoFactorCode);
        handleSuccessfulLogin(response.token);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (token: string) => {
    // Store the token
    localStorage.setItem("authToken", token);
    // Redirect to dashboard
    navigate("/dashboard");
  };

  // Mock API functions
  const fakeAuthApi = async (email: string, password: string) => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "test@example.com" && password === "password") {
      return { requiresTwoFactor: true };
    }
    throw new Error("Invalid credentials");
  };

  const fakeTwoFactorVerify = async (email: string, code: string) => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (code === "123456") {
      return { token: "fake-jwt-token" };
    }
    throw new Error("Invalid verification code");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showTwoFactor ? "Verify Your Identity" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!showTwoFactor ? (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label
                  htmlFor="twoFactorCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter the 6-digit code"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  We sent a verification code to your email address
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : showTwoFactor
                  ? "Verify"
                  : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Apple</span>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.2,0.5C15.6,0.5,15,0.7,14.4,1c-0.6,0.3-1.1,0.6-1.4,1l0,0c-0.6-0.7-1.4-1.1-2.1-1.4C10.1,0.3,9.3,0.1,8.5,0.1C7.3,0.1,6.2,0.5,5.1,1.4C4,2.2,3,3.3,2.4,4.5C1.1,7,0.6,9.5,0.9,11.9c0.2,2.4,1.2,4.6,2.9,6.5c0.8,0.9,1.9,1.8,3.1,2.5s2.6,1.2,3.9,1.5C12.3,22.8,13.9,22.8,15.4,22.5c1.5-0.3,2.8-0.9,3.7-1.8c0.6-0.6,1.1-1.4,1.4-2.3c0.3-0.9,0.3-1.8,0.1-2.8c-0.2-0.8-0.7-1.5-1.4-2.1c-0.7-0.6-1.6-1-2.5-1.2c-0.4-0.1-0.7-0.1-1.1-0.1c-0.4,0-0.7,0.1-1.1,0.2c-0.7,0.2-1.3,0.7-1.7,1.2c-0.2,0.2-0.3,0.5-0.3,0.8c0,0.3,0.1,0.5,0.2,0.8c0.2,0.5,0.5,0.9,1,1.2c0.4,0.3,0.9,0.5,1.5,0.5c0.4,0,0.8-0.1,1.2-0.3c0.4-0.2,0.7-0.5,1-0.9l0,0c0.1,0.4,0.3,0.7,0.6,1c0.3,0.3,0.7,0.5,1.1,0.5c0.8,0.1,1.6-0.2,2.2-0.7c0.6-0.5,1.1-1.2,1.4-2.1c0.3-0.8,0.3-1.7,0.2-2.5c-0.1-0.8-0.4-1.6-0.8-2.3l0,0c-0.1-0.2-0.3-0.4-0.5-0.6c-0.2-0.2-0.4-0.4-0.7-0.5c-0.5-0.3-1.1-0.5-1.7-0.5c-0.6,0-1.2,0.2-1.7,0.5c-0.5,0.3-1,0.7-1.3,1.2c-0.1,0.2-0.2,0.4-0.3,0.5c-0.1,0.2-0.1,0.4-0.1,0.6c0,0.4,0.1,0.7,0.3,1c0.2,0.3,0.5,0.6,0.9,0.8c0.4,0.2,0.8,0.3,1.2,0.3c0.4,0,0.9-0.1,1.3-0.3c0.4-0.2,0.8-0.5,1.1-0.9l0,0c0.1,0.2,0.2,0.4,0.3,0.6c0.2,0.4,0.5,0.7,0.8,0.9c0.3,0.2,0.7,0.4,1.1,0.4c0.7,0,1.4-0.3,1.9-0.9c0.5-0.6,0.9-1.3,1.1-2.1c0.2-0.8,0.2-1.6,0-2.4c-0.1-0.8-0.5-1.5-1-2.1l0,0c-0.3-0.3-0.6-0.6-1-0.8s-0.8-0.3-1.2-0.3c-0.8,0-1.5,0.3-2.1,0.8c-0.6,0.5-1,1.2-1.2,2c-0.1,0.4-0.1,0.8-0.1,1.2c0,0.4,0.1,0.8,0.3,1.1c0.3,0.7,0.9,1.2,1.6,1.5c0.3,0.1,0.7,0.2,1.1,0.2c0.4,0,0.7-0.1,1.1-0.2c0.7-0.3,1.3-0.8,1.7-1.4c0.2-0.3,0.3-0.6,0.4-1s0.1-0.7,0-1.1c-0.1-0.7-0.4-1.3-0.9-1.8c-0.5-0.5-1.1-0.8-1.8-0.9l0,0c0.3-0.1,0.5-0.2,0.8-0.4c0.3-0.2,0.5-0.5,0.7-0.8c0.4-0.6,0.5-1.4,0.5-2.1c0-0.8-0.3-1.5-0.7-2.1c-0.9-1.2-2.3-1.8-3.7-1.8L16.2,0.5L16.2,0.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
