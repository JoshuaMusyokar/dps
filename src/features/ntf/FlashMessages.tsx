import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { RootState } from "../../store";
import { removeFlash } from "../../store/slices/flash-slice";
// Define types for our messages
type MessageType = "success" | "error" | "warning" | "info";

interface FlashMessage {
  id: string;
  message: string;
  type: MessageType;
  duration?: number;
}

const FlashMessages: React.FC = () => {
  const messages = useSelector((state: RootState) => state.flash.messages);
  const dispatch = useDispatch();
  const [exiting, setExiting] = useState<Record<string, boolean>>({});

  // Handle automatic dismissal with timeouts
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    messages.forEach((msg) => {
      if (msg.duration) {
        const timer = setTimeout(() => {
          handleDismiss(msg.id);
        }, msg.duration);
        timers.push(timer);
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [messages, dispatch]);

  // Handle message dismissal with exit animation
  const handleDismiss = (id: string) => {
    setExiting((prev) => ({ ...prev, [id]: true }));

    // After animation completes, remove from Redux
    setTimeout(() => {
      dispatch(removeFlash(id));
      setExiting((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 300); // Match this with animation duration
  };

  // Icon component based on message type
  const getIcon = (type: MessageType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
    }
  };

  // Colors based on message type
  const getColors = (type: MessageType) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  // Icon color based on message type
  const getIconColor = (type: MessageType) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
    }
  };

  if (!messages.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {messages.map((msg: FlashMessage) => (
        <div
          key={msg.id}
          className={`
            ${getColors(msg.type)} 
            ${
              exiting[msg.id]
                ? "opacity-0 translate-x-4"
                : "opacity-100 translate-x-0"
            }
            flex items-start p-4 rounded shadow-md border transition-all duration-300 ease-in-out
          `}
          role="alert"
          aria-live="assertive"
          data-testid={`flash-message-${msg.type}`}
        >
          <div className={`flex-shrink-0 mr-3 ${getIconColor(msg.type)}`}>
            {getIcon(msg.type)}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium">{msg.message}</p>
          </div>
          <button
            onClick={() => handleDismiss(msg.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full"
            aria-label="Close notification"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
