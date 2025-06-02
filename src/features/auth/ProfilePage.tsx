import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Settings,
  Edit3,
  Camera,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";

// Mock data - in real app, this would come from Redux store
const mockUserData = {
  id: "usr_12345",
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@company.com",
  phone: "+254 712 345 678",
  jobTitle: "Senior Financial Analyst",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  location: "Nairobi, Kenya",
  joinDate: "2023-01-15",
  lastLogin: "2024-06-01T10:30:00Z",
  isVerified: true,
  status: "active",
  organizations: [
    {
      id: "org_001",
      name: "TechCorp Solutions Ltd",
      role: "Financial Analyst",
      permissions: ["view_reports", "create_transactions", "manage_users"],
      joinDate: "2023-01-15",
      status: "active",
      isPrimary: true,
    },
    {
      id: "org_002",
      name: "StartupHub Kenya",
      role: "Consultant",
      permissions: ["view_reports"],
      joinDate: "2023-06-10",
      status: "active",
      isPrimary: false,
    },
  ],
  stats: {
    totalTransactions: 1247,
    totalAmount: 2450000,
    successRate: 98.7,
    activeProjects: 12,
  },
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(mockUserData);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In real app: dispatch update action
    console.log("Profile updated:", userData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  interface RoleColors {
    [role: string]: string;
  }

  const getRoleColor = (role: string): string => {
    const colors: RoleColors = {
      "Financial Analyst":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      Consultant:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      Admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    };
    return (
      colors[role] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="glass dark:glass-dark rounded-3xl p-8 shadow-soft-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 p-1 shadow-glow">
                <img
                  src={userData.avatar}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-glow">
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {userData.firstName} {userData.lastName}
                    </h1>
                    {userData.isVerified && (
                      <CheckCircle className="text-green-500" size={24} />
                    )}
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                    {userData.jobTitle}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <MapPin size={16} />
                    <span>{userData.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-glow flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="glass-dark dark:glass-heavy p-4 rounded-xl text-center">
                  <CreditCard className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.totalTransactions.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Transactions
                  </div>
                </div>

                <div className="glass-dark dark:glass-heavy p-4 rounded-xl text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(userData.stats.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Volume
                  </div>
                </div>

                <div className="glass-dark dark:glass-heavy p-4 rounded-xl text-center">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.successRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>

                <div className="glass-dark dark:glass-heavy p-4 rounded-xl text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.stats.activeProjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Projects
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass dark:glass-dark rounded-2xl p-2 shadow-soft">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "organizations", label: "Organizations", icon: Building2 },
              { id: "security", label: "Security", icon: Shield },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-glow"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <User className="text-primary-600" size={20} />
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                          {userData.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                          {userData.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                      <Mail className="text-gray-400" size={18} />
                      <span className="text-gray-900 dark:text-white">
                        {userData.email}
                      </span>
                      <CheckCircle
                        className="text-green-500 ml-auto"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                        <Phone className="text-gray-400" size={18} />
                        <span className="text-gray-900 dark:text-white">
                          {showSensitiveInfo ? userData.phone : "****-***-678"}
                        </span>
                        <button
                          onClick={() =>
                            setShowSensitiveInfo(!showSensitiveInfo)
                          }
                          className="text-primary-600 hover:text-primary-700 ml-auto"
                        >
                          {showSensitiveInfo ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.jobTitle}
                        onChange={(e) =>
                          setUserData({ ...userData, jobTitle: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        {userData.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-6">
                <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="text-primary-600" size={20} />
                    Account Status
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={18} />
                        <span className="font-medium text-green-800 dark:text-green-300">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Member Since
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(userData.joinDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Last Login
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(userData.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-300">
                      <Settings size={18} />
                      Account Settings
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300">
                      <Shield size={18} />
                      Security Settings
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300">
                      <CreditCard size={18} />
                      Payment Methods
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Organizations Tab */}
          {activeTab === "organizations" && (
            <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building2 className="text-primary-600" size={20} />
                Associated Organizations
              </h3>

              <div className="space-y-4">
                {userData.organizations.map((org) => (
                  <div
                    key={org.id}
                    className="glass-dark dark:glass-heavy rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {org.name}
                          </h4>
                          {org.isPrimary && (
                            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 rounded-lg">
                              Primary
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${getRoleColor(
                              org.role
                            )}`}
                          >
                            {org.role}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            Joined {formatDate(org.joinDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield size={14} />
                            {org.permissions.length} permissions
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {org.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                            >
                              {permission.replace("_", " ")}
                            </span>
                          ))}
                          {org.permissions.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                              +{org.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300">
                          View Details
                        </button>
                        {!org.isPrimary && (
                          <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300">
                            Leave
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Shield className="text-primary-600" size={20} />
                  Security Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-300">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Enabled via SMS
                      </div>
                    </div>
                    <CheckCircle className="text-green-600" size={20} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                    <div>
                      <div className="font-medium text-yellow-800 dark:text-yellow-300">
                        Password
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        Last changed 30 days ago
                      </div>
                    </div>
                    <AlertCircle className="text-yellow-600" size={20} />
                  </div>

                  <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-glow">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Clock className="text-primary-600" size={20} />
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      action: "Login",
                      time: "2 hours ago",
                      location: "Nairobi, Kenya",
                    },
                    {
                      action: "Profile updated",
                      time: "1 day ago",
                      location: "Nairobi, Kenya",
                    },
                    {
                      action: "Password changed",
                      time: "30 days ago",
                      location: "Nairobi, Kenya",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.location}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="glass dark:glass-dark rounded-2xl p-6 shadow-soft-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="text-primary-600" size={20} />
                Account Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Email notifications", enabled: true },
                      { label: "SMS notifications", enabled: false },
                      { label: "Push notifications", enabled: true },
                      { label: "Marketing emails", enabled: false },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                      >
                        <span className="text-gray-900 dark:text-white">
                          {setting.label}
                        </span>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.enabled
                              ? "bg-primary-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Privacy
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Profile visibility", enabled: true },
                      { label: "Activity status", enabled: false },
                      { label: "Data sharing", enabled: false },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                      >
                        <span className="text-gray-900 dark:text-white">
                          {setting.label}
                        </span>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            setting.enabled
                              ? "bg-primary-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              setting.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
