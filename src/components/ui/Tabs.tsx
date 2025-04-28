import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  orientation: "horizontal" | "vertical";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  orientation,
}) => {
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-left px-4 py-3 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-3 px-4 font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
