import { create } from "zustand";
import {
  getlive,
  postlive,
  patchlive,
  dellive,
  getlocal,
  postlocal,
  patchlocal,
  dellocal,
  postbackend,
} from "./apiClient";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  fetchUniboxTickets,
  fetchUniboxTicketById,
  createUniboxTicket,
  updateUniboxTicket,
  deleteUniboxTicket,
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateProfile,
  fetchProfile,
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  fetchAdminProfile,
  fetchCompanyProfile,
  updateCompanyProfile,
} from "./apiCalls";

export const useApiStore = create((set) => ({
  api: {
    getlive,
    postlive,
    patchlive,
    dellive,
    getlocal,
    postlocal,
    patchlocal,
    dellocal,
    postbackend,
  },
  // users
  fetchUsers,
  fetchUserById,
  fetchProfile,
  createUser,
  updateUser,

  deleteUser,
  loginUser,

  // Unibox tickets
  fetchUniboxTickets,
  fetchUniboxTicketById,
  createUniboxTicket,
  updateUniboxTicket,
  deleteUniboxTicket,

  // departments
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,

  // roles
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,

  // admin proile
  fetchAdminProfile,

  // company profile
  fetchCompanyProfile,
  updateCompanyProfile, // Add this
  // State for API calls
  loading: false,
  error: null,

  callApi: async (fn, ...args) => {
    set({ loading: true, error: null });
    try {
      const result = await fn(...args);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));
