'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '@/components/ClientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ClientNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to user's notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];

        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading notifications:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request_approved':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'request_rejected':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'request_executed':
        return <CheckCircle size={20} className="text-blue-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'request_approved':
        return 'bg-green-50 border-green-200';
      case 'request_rejected':
        return 'bg-red-50 border-red-200';
      case 'request_executed':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading notifications...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600 mt-2">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="relative">
            <Bell size={32} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Bell size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No notifications yet.</p>
              <p className="text-sm text-slate-500 mt-2">You'll see updates about your requests here.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border ${getNotificationColor(notification.type)} p-6 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-slate-700 mt-1">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
