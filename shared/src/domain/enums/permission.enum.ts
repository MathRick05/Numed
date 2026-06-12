export enum Permission {
  USERS_READ = "users:read",
  USERS_WRITE = "users:write",
  USERS_DELETE = "users:delete",

  MEDICINES_READ = "medicines:read",
  MEDICINES_WRITE = "medicines:write",
  MEDICINES_DELETE = "medicines:delete",

  CAREGIVER_DEPENDENTS_READ = "caregiver-dependents:read",
  CAREGIVER_DEPENDENTS_WRITE = "caregiver-dependents:write",
  CAREGIVER_DEPENDENTS_DELETE = "caregiver-dependents:delete",

  APPOINTMENTS_READ = "appointments:read",
  APPOINTMENTS_WRITE = "appointments:write",
  APPOINTMENTS_DELETE = "appointments:delete",

  REMINDERS_READ = "reminders:read",
  REMINDERS_WRITE = "reminders:write",
  REMINDERS_DELETE = "reminders:delete",
}
