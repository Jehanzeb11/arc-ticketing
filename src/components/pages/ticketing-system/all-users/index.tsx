"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Grid, Button, Tooltip, Alert } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@/assets/icons/deleteicon-agents.svg";
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import addnewEntry from "@/assets/icons/all-users/newUserModalIcon.svg";
import editnewEntry from "@/assets/icons/all-users/editUserModalIcon.svg";
import editIcon from "@/assets/icons/table/edit.svg";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon2.svg";
import deleteModalDeleteIcon from "@/assets/icons/users/delete-icon-2.png";
import CustomButton from "@/components/common/Button/Button";
import Search from "@/components/common/search";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import Image from "next/image";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import IOSSwitch from "@/components/common/switch";
import DashboardHeader from "../../DashboardHeader";
import AddNewEntry from "@/components/common/Form/all-users/AddNewEntry";
import EditAllUsersEntry from "@/components/common/Form/all-users/EditUser";
import AssigneeIcon from "@/assets/icons/unibox/ticket/unibox-ticket-assignee-img.svg";
import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import EditUser from "@/components/common/Form/all-users/EditUser";
import AddNewEntryAssignmentModule from "@/components/common/Form/modules/AddNew";

const AllUsers = () => {
  const queryClient = useQueryClient();
  const { callApi, fetchUsers, deleteUser, updateUser }: any = useApiStore();
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [editNewModalOpen, setEditNewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => callApi(fetchUsers, { requestType: "getAllUsers" }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = [
    { key: "profile", title: "Profile", filterable: false },
    { key: "fullName", title: "Full Name", filterable: false },
    { key: "email", title: "Email", filterable: false },
    { key: "role", title: "Role", filterable: false },
    { key: "phone", title: "Phone", filterable: false },
    { key: "status", title: "Status", filterable: false },
  ];

  // Process data to include switch component in status column
  const data = useMemo(
    () =>
      users?.map((user) => ({
        user_id: user.user_id,
        profile: (
          <Box
            sx={{
              width: "49px",
              height: "49px",
              borderRadius: "39.355px",
              border: "1px solid #E3E3E3",
              backgroundColor: "#D9D9D9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={
                user.picture
                  ? "http://192.168.10.40:5050/uploads/profile/" + user.picture
                  : AssigneeIcon
              }
              alt="Assignee"
              width={45}
              height={45}
              unoptimized
            />
          </Box>
        ),
        fullName: user.full_name || "--",
        email: user.email || "--",
        role: user.role || "--",
        department: user.phone || "--",
        status: (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography
              sx={{
                color: user.status === "Active" ? "#3286BD" : "#000",
                fontSize: "15px",
                lineHeight: "20px",
                padding: "4px 12px",
                background:
                  user.status === "Active" ? "#3286BD15" : "#24242415",
                borderRadius: "100px",
              }}
            >
              {user.status}
            </Typography>
            <IOSSwitch
              checked={user.status === "Active"}
              onChange={(e) => handleSwitchChange(e, user.user_id)}
            />
          </Box>
        ),
      })) || [],
    [users]
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({
    role: "AllRole",
    department: "AllDepartment",
    status: "AllStatus",
  });
  const [filteredData, setFilteredData] = useState(data);

  // Get unique filter options
  const getUniqueOptions = (data, key, defaultLabel) => {
    const uniqueValues = Array.from(
      new Set(data?.map((item) => item[key] || ""))
    ).filter(Boolean);
    return [
      { value: `All${defaultLabel}`, label: `All ${defaultLabel}` },
      ...uniqueValues.map((val) => ({ value: val, label: val })),
    ];
  };

  const roleOptions = [
    { value: "AllRole", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "Manager", label: "Manager" },
    { value: "Agent", label: "Agent" },
  ];

  const departmentOptions = [
    { value: "AllDepartment", label: "All Departments" },
    { value: "IT", label: "IT" },
    { value: "Sales", label: "Sales" },
    { value: "Support", label: "Support" },
    { value: "Marketing", label: "Marketing" },
    { value: "HR", label: "HR" },
  ];

  const statusOptions = [
    { value: "AllStatus", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const filters = [
    {
      name: "role",
      value: filterValues.role,
      className: "role-filter",
      filterOptions: roleOptions,
    },
    {
      name: "status",
      value: filterValues.status,
      className: "status-filter",
      filterOptions: statusOptions,
    },
    {
      name: "department",
      value: filterValues.department,
      className: "department-filter",
      filterOptions: departmentOptions,
    },
  ];

  // Handle switch change for user status
  const handleSwitchChange = async (e, id) => {
    const newStatus = e.target.checked ? "Active" : "Inactive";

    try {
      const formData = new FormData();
      formData.append("requestType", `updateUser&user_id=${id}`);
      formData.append("status", newStatus);

      await callApi(updateUser, formData, true);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully!");
    } catch (error) {
      toast.error("Failed to update user status: " + error.message);
    }
  };

  const actions = [
    {
      icon: editIcon,
      onClick: (row) => {
        if (row && row.user_id) {
          const user = users.find((u) => u.user_id === row.user_id);
          if (user) {
            setSelectedId(row.user_id);
            setSelectedUser(user);
            setEditNewModalOpen(true);
          } else {
            toast.error("User data not found");
          }
        } else {
          toast.error("Invalid row or missing id");
        }
      },
      className: "action-icon",
      tooltip: "Edit User",
    },
    {
      icon: DeleteIcon,
      onClick: (row) => {
        if (row && row.user_id) {
          setSelectedId(row.user_id);
          const user = users.find((u) => u.user_id === row.user_id);
          const name = user?.full_name || user?.email || "User";
          setSelectedName(name);
          setDeleteModal(true);
        } else {
          toast.error("Cannot delete: User data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Delete User",
    },
    {
      icon: DeleteIcon,
      onClick: (row) => {
        if (row && row.user_id) {
          setSelectedId(row.user_id);
          const user = users.find((u) => u.user_id === row.user_id);
          const name = user?.full_name || user?.email || "User";
          setSelectedName(name);
          setAssignModal(true);

          if (user) {
            setSelectedUser(user);
          }
        } else {
          toast.error("Cannot delete: User data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Assign Module",
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      callApi(deleteUser, { requestType: `deleteUser&user_id=${id}` }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
      setDeleteModal(false);
      setSelectedId(null);
      setSelectedName("");
    },
    onError: (error) => {
      toast.error("Failed to delete user: " + error.message);
    },
  });

  const applyFilters = () => {
    let result = [...data]; // Create a copy of the data array

    // Apply search filter
    if (searchQuery) {
      result = result.filter((row) =>
        row.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (filterValues.role && filterValues.role !== "AllRole") {
      result = result.filter((row) => row.role === filterValues.role);
    }

    // Apply department filter
    if (
      filterValues.department &&
      filterValues.department !== "AllDepartment"
    ) {
      result = result.filter(
        (row) => row.department === filterValues.department
      );
    }

    // Apply status filter
    if (filterValues.status && filterValues.status !== "AllStatus") {
      result = result.filter((row) => {
        // For status filtering, we need to match against the original user data
        // Find the original user to get the actual status value
        const originalUser = users.find((user) => user.id === row.id);
        return originalUser?.user_status === filterValues.status;
      });
    }

    setFilteredData(result);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value?.toString() || "");
  };

  const handleApplyFilter = () => {
    // The filters are now applied automatically through the useEffect
    // This function is kept for the button click handler
  };

  const handleResetFilter = () => {
    setFilterValues({
      role: "AllRole",
      department: "AllDepartment",
      status: "AllStatus",
    });
    setSearchQuery("");
    // The filters will be applied automatically through the useEffect
  };

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  useEffect(() => {
    if (users && data && data.length > 0) {
      applyFilters();
    } else {
      // If no users or data, set filteredData to empty array
      setFilteredData([]);
    }
  }, [
    users,
    data,
    searchQuery,
    filterValues.role,
    filterValues.department,
    filterValues.status,
  ]);

  return (
    <Box>
      <DashboardHeader title="Users Management" />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
      >
        <Typography variant="h5" className="header-title">
          All Users
        </Typography>
        <CustomButton
          text="Add New"
          onClick={() => setAddNewModalOpen(true)}
          libIcon={<AddCircleIcon />}
        />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          mb: "20px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Grid size={{ lg: 4, xs: 12 }}>
          <Search
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            placeholder="Search by full name"
          />
        </Grid>
        {filters.map((filter, index) => (
          <Grid size={{ lg: 1.5, xs: 12 }} key={index}>
            <TableSelectFilterMainNew
              value={filter.value || ""}
              name={filter.name}
              options={filter.filterOptions}
              popperClassName={filter.className}
              defaultText={filter.filterOptions[0].label}
              className="table-dropdown-select"
              onChange={handleFilterChange}
            />
          </Grid>
        ))}
        <Grid size={{ lg: 3, xs: 12 }}>
          <Box sx={{ display: "flex", gap: "10px" }} className="ticket-button">
            <CustomButton text="Apply Filter" onClick={handleApplyFilter} />
            <Tooltip title="Reset Filter" arrow>
              <Button className="reset-button" onClick={handleResetFilter}>
                <Image src={resetIcon} alt="reset-icon" />
                Reset Filter
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <div className="table-parent">
        <ReusableTable
          columns={columns}
          data={filteredData}
          actions={actions}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={false}
          enableRowSelection={false}
          pageSize={5}
          isLoading={isLoading}
        />
      </div>

      <MyModal
        open={assignModal}
        setOpen={setAssignModal}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Add New User"
        modalText="Enter the details for the new user."
        iconSrc={addnewEntry}
      >
        <AddNewEntryAssignmentModule
          userData={selectedUser}
          getall={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
          onCloseModal={() => {
            setAddNewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </MyModal>
      <MyModal
        open={addNewModalOpen}
        setOpen={setAddNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Add New User"
        modalText="Enter the details for the new user."
        iconSrc={addnewEntry}
      >
        <AddNewEntry
          getall={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
          onCloseModal={() => setAddNewModalOpen(false)}
        />
      </MyModal>

      <MyModal
        open={editNewModalOpen}
        setOpen={setEditNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Edit User"
        modalText="Update the details for the user."
        iconSrc={editnewEntry}
      >
        <EditUser
          userData={selectedUser}
          getall={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
          onCloseModal={() => {
            setEditNewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      </MyModal>

      <MyModal
        open={deleteModal}
        setOpen={setDeleteModal}
        customStyle="archive-modal"
      >
        <Box sx={{ display: "flex", gap: "15px", alignItems: "center", mb: 2 }}>
          <Image src={DeleteModalIcon} alt="delete-modal-icon" width={50} />
          <Typography variant="h6">Confirm Deletion</Typography>
        </Box>
        <Typography mb={2}>
          Are you sure you want to permanently delete {selectedName}? This
          action cannot be undone.
        </Typography>
        <Box sx={{ display: "flex", gap: "15px" }} className="ticket-button">
          <CustomButton
            type="button"
            text="Cancel"
            style={{ padding: "10px 36px", width: "unset" }}
            btntrasnparent={true}
            onClick={() => {
              setDeleteModal(false);
              setSelectedId(null);
              setSelectedName("");
              setSelectedUser(null);
            }}
          />
          <CustomButton
            btnDelete={true}
            text="Delete"
            icon={deleteModalDeleteIcon}
            style={{ padding: "10px 36px", width: "unset" }}
            onClick={() => {
              if (selectedId) {
                deleteMutation.mutate(selectedId);
              }
            }}
          />
        </Box>
      </MyModal>
    </Box>
  );
};

export default AllUsers;
