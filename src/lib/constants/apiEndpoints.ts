export const API_ENDPOINTS = {
  // Users
  USERS: (type) => `/users/multi-purpose?requestType=${type}`,
  USER_BY_ID: (id) => `/users/multi-purpose?requestType=${id}`,
  PROFILE: "/profile",
  LOGIN: "/auth/login",
  VERIFY_2FA: "/auth/verify-2fa",

  USER_MODULES: (type) => `/usermodules/multi-purpose${type}`,

  // tickets
  TICKETS: `/ticket/multi-purpose`,
  SMTP: `/smtp/multi-purpose`,

  // Unibox tickets
  UNIBOX_TICKETS: "/unibox_tickets",
  UNIBOX_TICKET_BY_ID: (id) => `/unibox_tickets/${id}`,

  // departments
  DEPARTMENTS: `/departments/multi-purpose`,
  DEPARTMENT_BY_ID: (id) => `/departments/multi-purpose/${id}`,

  // roles
  ROLES: "/roles/multi-purpose",
  ROLE_BY_ID: (id) => `/roles/multi-purpose/${id}`,

  // admin profile
  ADMIN_PROFILE: "auth/me",

  // company profile
  COMPANY_PROFILE: "/company_profile",
  COMPANY_PROFILE_BY_ID: (id) => `/company_profile/${id}`, // Add this if needed
};
