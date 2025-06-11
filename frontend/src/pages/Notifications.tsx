import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string; // matches your DB column
  isRead: boolean;
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const patientId = (() => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
      const parsed = JSON.parse(user);
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!patientId) {
      setError("You must be logged in to view notifications.");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/patient/notifications/${patientId}`
        );
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [patientId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Notifications</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 rounded-lg shadow-md transition bg-white border ${
                notif.isRead ? 'border-gray-200' : 'border-purple-300'
              }`}
            >
              <h3 className="text-lg font-semibold text-purple-700">{notif.title}</h3>
              <p className="text-gray-700">{notif.message}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
