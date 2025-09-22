import {
  getlive,
  postlive,
  patchlive,
  dellive,
  getlocal,
  postlocal,
  patchlocal,
  dellocal,
  getbackend,
  postbackend,
  putbackend,
  patchbackend,
  delbackend,
} from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

//users

export const fetchUsers = (data) => {
  console.log("fetchUsers got:", data);
  return postbackend(API_ENDPOINTS.USERS(data?.requestType), data);
};

export const fetchUserById = (data) =>
  postbackend(`${API_ENDPOINTS.USER_BY_ID(data.id)}`, data);
export const fetchProfile = () => postbackend(`${API_ENDPOINTS.PROFILE}`);

export const createGuest = (data) =>
  postbackend(`${API_ENDPOINTS.GUEST}`, data); // API_ENDPOINTS.USERS(data);

export const createUser = (data) =>
  postbackend(`${API_ENDPOINTS.USERS(data?.get("requestType"))}`, data);
export const updateUser = (data) =>
  postbackend(`${API_ENDPOINTS.USERS(data?.get("requestType"))}`, data);

export const departmentUser = (data) =>
  postbackend(`${API_ENDPOINTS.USERS(data?.requestType)}`, data);
export const updateProfile = (data) =>
  postbackend(API_ENDPOINTS.USERS(data?.requestType), data);

// USER_MODULES
export const createModules = (data) =>
  postbackend(`${API_ENDPOINTS.USER_MODULES(data?.requestType)}`, data);
export const getUserModules = (data) =>
  postbackend(`${API_ENDPOINTS.USER_MODULES(data?.requestType)}`, data);

export const updateUserModule = (data) =>
  postbackend(`${API_ENDPOINTS.USER_MODULES(data?.requestType)}`, data);

// export const fetchUsers = () => getlocal(API_ENDPOINTS.USERS);
// export const fetchUserById = (id) => getlocal(API_ENDPOINTS.USER_BY_ID(id));
// export const fetchProfile = () => getlocal(API_ENDPOINTS.PROFILE);
// export const createUser = (data) => postlocal(API_ENDPOINTS.USERS, data);
// export const updateUser = (id, data) =>
//   patchlocal(API_ENDPOINTS.USER_BY_ID(id), data);
// export const updateProfile = (data) => patchlocal(API_ENDPOINTS.PROFILE, data);
export const deleteUser = (data) =>
  postbackend(API_ENDPOINTS.USERS(data?.requestType), data);

export const getAllSMTP = (data) =>
  postbackend(`${API_ENDPOINTS.SMTP}?requestType=getAllSmtps`, data);
export const createSMTP = (data) =>
  postbackend(`${API_ENDPOINTS.SMTP}?requestType=createSmtp`, data);
export const updateSmtp = (data) =>
  postbackend(`${API_ENDPOINTS.SMTP}?requestType=updateSmtp`, data);
export const deleteSmtp = (data) =>
  postbackend(`${API_ENDPOINTS.SMTP}?requestType=deleteSmtp`, data);

// NOTIFICATIONS
export const fetchNotifications = (data) =>
  postbackend(`${API_ENDPOINTS.NOTIFICATIONS}`, data);
// unibox_tickets
export const fetchSingleTicket = (data) =>
  postbackend(API_ENDPOINTS.TICKETS, data);
export const fetchUniboxTicketById = (id) =>
  getlocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id));
export const createUniboxTicket = (data) =>
  postbackend(API_ENDPOINTS.TICKETS, data);
export const updateUniboxTicket = (data) =>
  postbackend(API_ENDPOINTS.TICKETS, data);

export const replyUniboxTicket = (data) =>
  postbackend(`${API_ENDPOINTS.TICKETS}?requestType=ticketReply`, data);

export const getAllTickets = (data) => postbackend(API_ENDPOINTS.TICKETS, data);
export const loginUser = (data) => postbackend(API_ENDPOINTS.LOGIN, data);
export const myData = () => getbackend(API_ENDPOINTS.ME);

export const deleteUniboxTicket = (id) =>
  dellocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id));
export const fetchArchivedTickets = () =>
  getlocal(API_ENDPOINTS.UNIBOX_TICKETS + "?archived=true");
export const archiveTicket = (id, data) =>
  patchlocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id), {
    ...data,
    archived: true,
  });
export const unarchiveTicket = (id, data) =>
  patchlocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id), {
    ...data,
    archived: false,
  });

// departments
export const fetchDepartments = (data) =>
  postbackend(API_ENDPOINTS.DEPARTMENTS, data);
export const createDepartment = (data) =>
  postbackend(API_ENDPOINTS.DEPARTMENTS, data);
export const updateDepartment = (data) =>
  postbackend(API_ENDPOINTS.DEPARTMENTS, data);
export const deleteDepartment = (data) =>
  postbackend(API_ENDPOINTS.DEPARTMENTS, data);

// scrub

export const searchSingleNumber = (data) =>
  postbackend(`${API_ENDPOINTS.SCRUB}?requestType=processJob`, data);
export const searchBulkNumber = (data) =>
  postbackend(`${API_ENDPOINTS.SCRUB}?requestType=createJob`, data);
export const jobHistory = (data) =>
  postbackend(`${API_ENDPOINTS.SCRUB}?requestType=jobHistory`, data);
export const scrubHistory = (data) =>
  postbackend(`${API_ENDPOINTS.SCRUB}?requestType=scrubHistory`, data);

// roles
export const fetchRoles = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const fetchRoleById = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const createRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const updateRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const deleteRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);

//  admin profile
export const fetchAdminProfile = () => getbackend(API_ENDPOINTS.ADMIN_PROFILE);

// company profile
export const fetchCompanyProfile = () =>
  getlocal(API_ENDPOINTS.COMPANY_PROFILE);

export const updateCompanyProfile = (id, data) =>
  patchlocal(`${API_ENDPOINTS.COMPANY_PROFILE}/${id}`, data);
