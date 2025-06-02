import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // use BrowserRouter
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { Dashboard } from "./features/Dashboard/Dashboard";
import { PaymentPage } from "./features/payment/PaymentPage";
import KYCForm from "./features/auth/KYCProfileManagement";
import RegisterPage from "./features/auth/RegisterPage";
import LoginPage from "./features/auth/LoginPage";
import TwoFactorSetup from "./features/auth/2FAPage";
import ApiKeysIntegrationsPage from "./features/keys/ApiAndIntegrationPage";
import BusinessRegistrationPage from "./features/MerchantOnBoarding/BusinessRegistrationPage";
import RBACPage from "./features/RBAC/rbacPage";
import CustomerPage from "./features/UserManagement/CustomerPage";
import { Provider } from "react-redux";
import { store } from "./store";
import { NotFoundPage } from "./features/error/NotFound";
import { SettingsPage } from "./features/settings/SettingsPage";
import Unauthorized from "./features/auth/AuthorizationPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import RBACManagementPage from "./features/RBAC/rbac";
import RBACPageNew from "./features/RBAC/RBACPageNew";
import { ThemeProvider } from "./components/layouts/ResponsiveLayout";
import ProfilePage from "./features/auth/ProfilePage";
import OnboardingListPage from "./features/MerchantOnBoarding/OnboardingList";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/business-registration"
              element={<BusinessRegistrationPage />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/2fa"
              element={<TwoFactorSetup onComplete={() => {}} userId="joshu" />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboardings" element={<OnboardingListPage />} />
            <Route path="/api" element={<ApiKeysIntegrationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/rbac-1" element={<RBACPage />} />
            <Route path="/rbac" element={<RBACPageNew />} />

            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredPermission="Manage Users">
                  <CustomerPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
            {/* <Route path="/kyc" element={<KYCForm />} /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
