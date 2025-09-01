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
export const createUser = (data) => postbackend(`${API_ENDPOINTS.USERS}`, data);
export const updateUser = (id, data) =>
  postbackend(`${API_ENDPOINTS.USER_BY_ID(id)}`, data);
export const updateProfile = (data) => postbackend(API_ENDPOINTS.PROFILE, data);

// export const fetchUsers = () => getlocal(API_ENDPOINTS.USERS);
// export const fetchUserById = (id) => getlocal(API_ENDPOINTS.USER_BY_ID(id));
// export const fetchProfile = () => getlocal(API_ENDPOINTS.PROFILE);
// export const createUser = (data) => postlocal(API_ENDPOINTS.USERS, data);
// export const updateUser = (id, data) =>
//   patchlocal(API_ENDPOINTS.USER_BY_ID(id), data);
// export const updateProfile = (data) => patchlocal(API_ENDPOINTS.PROFILE, data);
export const deleteUser = (id) => dellocal(API_ENDPOINTS.USER_BY_ID(id));

export const loginUser = (data) => postlocal(API_ENDPOINTS.LOGIN, data);

// unibox_tickets
export const fetchUniboxTickets = () => getlocal(API_ENDPOINTS.UNIBOX_TICKETS);
export const fetchUniboxTicketById = (id) =>
  getlocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id));
export const createUniboxTicket = (data) =>
  postlocal(API_ENDPOINTS.UNIBOX_TICKETS, data);
export const updateUniboxTicket = (id, data) =>
  patchlocal(API_ENDPOINTS.UNIBOX_TICKET_BY_ID(id), data);
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

// roles
export const fetchRoles = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const fetchRoleById = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const createRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const updateRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);
export const deleteRole = (data) => postbackend(API_ENDPOINTS.ROLES, data);

//  admin profile
export const fetchAdminProfile = () => getlocal(API_ENDPOINTS.ADMIN_PROFILE);

// company profile
export const fetchCompanyProfile = () =>
  getlocal(API_ENDPOINTS.COMPANY_PROFILE);

export const updateCompanyProfile = (id, data) =>
  patchlocal(`${API_ENDPOINTS.COMPANY_PROFILE}/${id}`, data);
