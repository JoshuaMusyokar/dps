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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />

          <Route path="/checkout" element={<PaymentPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/business-registration"
            element={<BusinessRegistrationPage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/2fa"
            element={<TwoFactorSetup onComplete={() => {}} userId="joshu" />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/api" element={<ApiKeysIntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/rbac" element={<RBACPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* <Route path="/kyc" element={<KYCForm />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
