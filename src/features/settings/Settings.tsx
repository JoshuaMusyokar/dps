// src/features/settings/components/SettingsPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setApiBaseUrl,
  toggleDeveloperMode,
} from "../../store/slices/settings-slice";
import { Tabs } from "../../components/ui/Tabs";
import { ProfileSettings } from "./ProfileSettings";
import { PaymentSettings } from "./PaymentSettings";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SettingSecurity";
import { DeveloperSettings } from "./DeveloperSettings";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const isDeveloperMode = useSelector(
    (state: RootState) => state.settings.developerMode
  );

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "payment", label: "Payment Methods" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    ...(isDeveloperMode ? [{ id: "developer", label: "Developer" }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "payment":
        return <PaymentSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "developer":
        return <DeveloperSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for larger screens */}
        <div className="hidden md:block w-full md:w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            orientation="vertical"
          />
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden w-full">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            orientation="horizontal"
          />
        </div>

        {/* Content area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
