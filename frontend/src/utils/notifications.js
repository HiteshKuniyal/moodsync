// Notification utilities for Mood Sync

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const scheduleWeeklyReminder = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Check if it's Sunday at 22:00 IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    
    const day = istTime.getDay();
    const hour = istTime.getHours();
    
    // If it's Sunday (0) and between 22:00-23:00 IST
    if (day === 0 && hour === 22) {
      new Notification('Mood Sync Reminder', {
        body: 'Time for your weekly lifestyle assessment! 🌟',
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'weekly-reminder'
      });
    }
  }
};

export const showInstantNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/logo192.png',
      badge: '/logo192.png'
    });
  }
};

// Check every hour if it's time for reminder
export const startReminderService = () => {
  // Request permission on first load
  requestNotificationPermission();
  
  // Check every hour
  setInterval(() => {
    scheduleWeeklyReminder();
  }, 60 * 60 * 1000); // Every hour
  
  // Also check immediately
  scheduleWeeklyReminder();
};
