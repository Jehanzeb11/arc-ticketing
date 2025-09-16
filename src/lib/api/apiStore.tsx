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
  replyUniboxTicket,
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
  createSMTP,
  getAllSMTP,
  updateSmtp,
  deleteSmtp,
  myData,
  createGuest,
  fetchNotifications,
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
  myData,
  // modules

  createGuest,

  createModules,
  getUserModules,
  updateUserModule,
  // Unibox tickets
  fetchSingleTicket,
  fetchUniboxTicketById,
  createUniboxTicket,
  updateUniboxTicket,
  deleteUniboxTicket,
  replyUniboxTicket,

  createSMTP,
  getAllSMTP,
  updateSmtp,
  deleteSmtp,
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
  fetchNotifications,
  // State for API calls
  loading: false,
  error: null,

  emailToVerify: null,
  setEmailToVerify: (email: string) => {
    set({ emailToVerify: email });
  },

  profile: null, // store user profile globally
  setProfile: (profile: any) => {
    let normalizedProfile = { ...profile };
    try {
      // Normalize permissions to always be an array
      if (typeof profile?.data?.role?.permissions === "string") {
        normalizedProfile.role = {
          ...profile.role,
          permissions: JSON.parse(profile.data.role.permissions),
        };
      }
    } catch (err) {
      console.error("Failed to parse permissions:", err);
      normalizedProfile.role = {
        ...profile.role,
        permissions: [],
      };
    }

    set({ profile: normalizedProfile });
  },
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
