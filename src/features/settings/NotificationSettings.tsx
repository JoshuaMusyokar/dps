import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { toggleNotification } from "../../store/slices/settings-slice";

export const NotificationSettings: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.settings.notifications
  );

  const handleToggle = (key: keyof typeof notifications) => {
    dispatch(toggleNotification(key));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive notifications via email
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications.email}
              onChange={() => handleToggle("email")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive push notifications in browser
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications.push}
              onChange={() => handleToggle("push")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">SMS Notifications</h3>
            <p className="text-sm text-gray-500">Receive SMS notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications.sms}
              onChange={() => handleToggle("sms")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
