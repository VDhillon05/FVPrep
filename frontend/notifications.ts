import * as Notifications from "expo-notifications";

export async function requestNotificationPermissionIfNeeded(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  return status === "granted";
}

export async function scheduleGameReminder(triggerDate: Date, title: string, body: string) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}
