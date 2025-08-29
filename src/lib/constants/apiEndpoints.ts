export const API_ENDPOINTS = {
  // Users
  USERS: "/users",
  USER_BY_ID: (id) => `/users/${id}`,
  PROFILE: "/profile",
  LOGIN: "/auth/login",
  VERIFY_2FA: "/auth/verify-2fa",

  // Unibox tickets
  UNIBOX_TICKETS: "/unibox_tickets",
  UNIBOX_TICKET_BY_ID: (id) => `/unibox_tickets/${id}`,

  // departments
  DEPARTMENTS: "/departments",
  DEPARTMENT_BY_ID: (id) => `/departments/${id}`,

  // roles
  ROLES: "/roles",
  ROLE_BY_ID: (id) => `/roles/${id}`,

  // admin profile
  ADMIN_PROFILE: "/users",

  // company profile
  COMPANY_PROFILE: "/company_profile",
  COMPANY_PROFILE_BY_ID: (id) => `/company_profile/${id}`, // Add this if needed
};
