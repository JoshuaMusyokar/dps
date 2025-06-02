import React, { useState, useMemo, JSX, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Building,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

// Import types
import type {
  BusinessOnboarding,
  OnboardingStatus,
  OnboardingStep,
  OnboardingFilters,
} from "../../types";
import { useGetOnboardingListQuery } from "../../store/apis/public-api";

const BusinessOnboardingList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<
    OnboardingStatus | "all"
  >("all");
  const [selectedStep, setSelectedStep] = useState<OnboardingStep | "all">(
    "all"
  );
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [onBoardingList, setOnBoardingList] = useState<
    BusinessOnboarding[] | []
  >([]);
  const { data: onBoardingListData, isLoading } = useGetOnboardingListQuery();
  useEffect(() => {
    if (onBoardingListData && onBoardingListData.details) {
      setOnBoardingList(onBoardingListData.details);
    }
  }, [onBoardingListData]);

  // Toggle theme
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Filter and search logic
  const filteredData = useMemo((): BusinessOnboarding[] => {
    return onBoardingList.filter((item) => {
      const matchesSearch =
        item.business_details.registered_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.business_details.trading_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.registration_id.includes(searchTerm);

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      const matchesStep =
        selectedStep === "all" || item.step_completed === selectedStep;

      return matchesSearch && matchesStatus && matchesStep;
    });
  }, [onBoardingList, searchTerm, selectedStatus, selectedStep]);

  const getStatusColor = (status: OnboardingStatus): string => {
    switch (status) {
      case "completed":
        return "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300";
      case "pending":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300";
      case "rejected":
        return "bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: OnboardingStatus): JSX.Element => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStepProgress = (step: OnboardingStep): number => {
    const steps: OnboardingStep[] = [
      "business_details",
      "owner_details",
      "bank_details",
      "verification",
    ];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "dark bg-gray-900"
          : "bg-gradient-to-br from-primary-50 via-white to-accent-50"
      }`}
    >
      {/* Header */}
      <div className="glass backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Business Onboarding
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredData.length} applications
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg glass-dark hover:glass-heavy transition-all duration-200"
              >
                {isDarkMode ? "🌙" : "☀️"}
              </button>

              <button className="btn-primary flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-glow transition-all duration-300">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="glass rounded-2xl p-6 mb-8 border backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, trading name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 glass rounded-xl hover:glass-heavy transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value as OnboardingStatus | "all"
                      )
                    }
                    className="w-full p-3 glass rounded-xl border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Completion Step
                  </label>
                  <select
                    value={selectedStep}
                    onChange={(e) =>
                      setSelectedStep(e.target.value as OnboardingStep | "all")
                    }
                    className="w-full p-3 glass rounded-xl border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Steps</option>
                    <option value="business_details">Business Details</option>
                    <option value="owner_details">Owner Details</option>
                    <option value="bank_details">Bank Details</option>
                    <option value="verification">Verification</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border backdrop-blur-xl">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.registration_id}
                className="glass rounded-2xl border backdrop-blur-xl hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.business_details.registered_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {item.registration_id}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.business_details.trading_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.business_details.city}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusIcon(item.status)}
                            <span className="capitalize">{item.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Progress
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(getStepProgress(item.step_completed))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${getStepProgress(item.step_completed)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() =>
                          setExpandedCard(
                            expandedCard === item.registration_id
                              ? null
                              : item.registration_id
                          )
                        }
                        className="p-2 glass rounded-lg hover:glass-heavy transition-all duration-200 text-gray-600 dark:text-gray-400"
                      >
                        <ChevronRight
                          className={`w-5 h-5 transition-transform duration-200 ${
                            expandedCard === item.registration_id
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </button>
                      <button className="p-2 glass rounded-lg hover:glass-heavy transition-all duration-200 text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCard === item.registration_id && (
                  <div className="border-t border-white/10 p-6 animate-fade-in-down">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Business Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                          <Building className="w-5 h-5 text-primary-600" />
                          <span>Business Information</span>
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">
                              Business Type
                            </label>
                            <p className="text-gray-900 dark:text-white capitalize">
                              {item.business_details.business_type}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">
                              Industry
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {item.business_details.industry_sector}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">
                              Address
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {item.business_details.physical_address},{" "}
                              {item.business_details.city}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Owner Details */}
                      {item.owners_details && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                            <User className="w-5 h-5 text-primary-600" />
                            <span>Owners ({item.owners_details.length})</span>
                          </h4>
                          <div className="space-y-4">
                            {item.owners_details.map((owner, index) => (
                              <div
                                key={`${owner.email}-${index}`}
                                className="p-4 glass rounded-xl"
                              >
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                                      {owner.first_name[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {owner.first_name} {owner.last_name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {owner.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Phone className="w-4 h-4" />
                                    <span>{owner.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{owner.address}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bank Details */}
                      {item.bank_details && (
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                            <span>Banking Information</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm text-gray-500 dark:text-gray-400">
                                Bank Name
                              </label>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {item.bank_details.bank_name}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 dark:text-gray-400">
                                Account Number
                              </label>
                              <p className="text-gray-900 dark:text-white font-mono">
                                {item.bank_details.account_number}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 dark:text-gray-400">
                                Branch Code
                              </label>
                              <p className="text-gray-900 dark:text-white font-mono">
                                {item.bank_details.branch_code}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>View Documents</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Details</span>
                      </button>
                      <button className="btn-primary flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-glow transition-all duration-300">
                        <span>Take Action</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredData.length > 0 && (
          <div className="text-center mt-8">
            <button className="flex items-center space-x-2 mx-auto px-6 py-3 glass rounded-xl hover:glass-heavy transition-all duration-200 text-gray-700 dark:text-gray-300">
              <RefreshCw className="w-5 h-5" />
              <span>Load More</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOnboardingList;
