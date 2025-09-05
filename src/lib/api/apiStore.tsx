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
  fetchSingleTicket,
  fetchUniboxTicketById,
  createUniboxTicket,
  updateUniboxTicket,
  deleteUniboxTicket,
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateProfile,
  departmentUser,
  fetchProfile,
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  fetchAdminProfile,
  fetchCompanyProfile,
  updateCompanyProfile,
  createModules,
  getUserModules,
  updateUserModule,
  getAllTickets,
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
  departmentUser,
  deleteUser,
  loginUser,
  updateProfile,

  // modules

  createModules,
  getUserModules,
  updateUserModule,
  // Unibox tickets
  fetchSingleTicket,
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
  getAllTickets,

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
