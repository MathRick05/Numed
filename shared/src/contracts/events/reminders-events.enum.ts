export enum RemindersExchangeName {
  APPOINTMENT_CREATED = "reminders.appointments.created.exchange",
  APPOINTMENT_UPDATED = "reminders.appointments.updated.exchange",
  APPOINTMENT_DELETED = "reminders.appointments.deleted.exchange",
  REMINDER_CREATED = "reminders.reminders.created.exchange",
  REMINDER_UPDATED = "reminders.reminders.updated.exchange",
  REMINDER_DELETED = "reminders.reminders.deleted.exchange",
}

export enum RemindersRoutingKey {
  APPOINTMENT_CREATED = "appointment.created",
  APPOINTMENT_UPDATED = "appointment.updated",
  APPOINTMENT_DELETED = "appointment.deleted",
  REMINDER_CREATED = "reminder.created",
  REMINDER_UPDATED = "reminder.updated",
  REMINDER_DELETED = "reminder.deleted",
}
