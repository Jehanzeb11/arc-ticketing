"use client";

// React and Material-UI imports
import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Button, Tooltip, Alert } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// Asset imports
import DeleteIcon from "@/assets/icons/new-delete.png";
import addnewEntry from "@/assets/icons/all-users/newUserModalIcon.svg";
import editnewEntry from "@/assets/icons/all-users/editUserModalIcon.svg";
import editIcon from "@/assets/icons/table/edit.svg";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon2.svg";
import deleteModalDeleteIcon from "@/assets/icons/users/delete-icon-2.png";

// Component imports
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import CustomButton from "@/components/common/Button/Button";
import Search from "@/components/common/search";
import TableSelectFilterMainNew from "@/components/common/Select/TableSelectFilterMainNew";
import Image from "next/image";
import resetIcon from "@/assets/icons/unibox/ticket/hugeicons_filter-reset.svg";
import IOSSwitch from "@/components/common/switch";
import DashboardHeader from "../../DashboardHeader";
import AddNewEntry from "@/components/common/Form/roles-permission/AddNewEntry";
import EditAllUsersEntry from "@/components/common/Form/roles-permission/EditphoneEntry";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";

const RolesAndPermission = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { callApi, fetchRoles, deleteRole, updateRole }: any = useApiStore();
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [editNewModalOpen, setEditNewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const canCreateRole = usePermission("Create Role");
  const canStattusUpdate = usePermission("Deactivate/Activate Role");
  const canEditRole = usePermission("Edit Role");
  const canDeleteRole = usePermission("Delete Role");
  const canAssignRole = usePermission("Assign Permissions to Role");

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      callApi(fetchRoles, {
        requestType: "getAllRoles",
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = [
    { key: "roleName", title: "Role Name", filterable: false },
    { key: "description", title: "Description", filterable: false },
    {
      key: "assignedPermissions",
      title: "Assigned Permissions",
      filterable: false,
    },
    { key: "status", title: "Status", filterable: false },
  ];

  // Handle permission removal
  const handleCancelPermission = async (e, roleId) => {
    const permission = e.currentTarget.getAttribute("data-permission");
    const role = roles.find((r) => r.role_id === roleId); // Make sure to use role_id here if roles use that key

    try {
      if (role) {
        // Parse permissions if it's a string
        const permissionsArray =
          typeof role.permissions === "string"
            ? JSON.parse(role.permissions)
            : role.permissions;

        // Filter out the permission to be removed
        const updatedPermissions = permissionsArray.filter(
          (p) => p !== permission
        );

        await callApi(updateRole, {
          requestType: "updateRole",
          role_id: roleId,
          permissions: updatedPermissions,
        });

        queryClient.invalidateQueries({ queryKey: ["roles"] });
        toast.success("Permission removed successfully");
      }
    } catch (error) {
      toast.error("Failed to remove permission");
    }
  };

  // Handle status switch change
  const handleSwitchChange = async (e, roleId) => {
    const newStatus = e.target.checked ? "Active" : "Inactive";
    try {
      await callApi(updateRole, {
        requestType: "updateRole",
        role_id: roleId,
        status: newStatus,
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  // Render permissions with close buttons
  const renderPermissions = (permissions, roleId) => {
    if (!permissions || permissions.length === 0) {
      return <Typography>No Permission</Typography>;
    }

    return (
      <Box
        sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
        className="assignedPermissions-button"
      >
        {permissions.map((permission, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: "4px",
              background: "#D9D9D950",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography>{permission}</Typography>
            {canAssignRole && (
              <Button
                data-permission={permission}
                onClick={(e) => handleCancelPermission(e, roleId)}
                sx={{ minWidth: "auto", padding: 0 }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </Button>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  // Process data to include switch component in status column
  const data = useMemo(
    () =>
      roles?.map((role) => ({
        id: role.role_id,
        role_id: role.role_id,
        roleName: role.role_name || "--",
        description: role.description || "--",
        assignedPermissions: renderPermissions(
          JSON.parse(role.permissions),
          role.role_id
        ),
        status: (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography
              sx={{
                color: role.status === "Active" ? "#3286BD" : "#000",
                fontSize: "15px",
                lineHeight: "20px",
                padding: "4px 12px",
                background:
                  role.status === "Active" ? "#3286BD15" : "#24242415",
                borderRadius: "100px",
              }}
            >
              {role.status}
            </Typography>
            {canStattusUpdate && (
              <IOSSwitch
                checked={role.status === "Active"}
                onChange={(e) => handleSwitchChange(e, role.role_id)}
              />
            )}
          </Box>
        ),
      })) || [],
    [roles]
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({
    status: "AllStatus",
    permissions: "AllPermissions",
  });
  const [filteredData, setFilteredData] = useState(data);

  const statusOptions = [
    { value: "AllStatus", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const permissionOptions = [
    { value: "AllPermissions", label: "All Permissions" },
    { value: "View Reports", label: "View Reports" },
    { value: "Manage Users", label: "Manage Users" },
    { value: "System Settings", label: "System Settings" },
    { value: "Delete Records", label: "Delete Records" },
    { value: "Create Tickets", label: "Create Tickets" },
    { value: "Assign Roles", label: "Assign Roles" },
  ];

  const filters = [
    {
      name: "status",
      value: filterValues.status,
      className: "status-filter",
      filterOptions: statusOptions,
    },
    {
      name: "permissions",
      value: filterValues.permissions,
      className: "permissions-filter",
      filterOptions: permissionOptions,
    },
  ];

  const actions = [
    canEditRole && {
      icon: editIcon,
      onClick: (row) => {
        router.push(
          `/ticketing-system/roles-permission/update-permissions?id=${row.id}`
        );
      },
      className: "action-icon",
      tooltip: "Edit Role",
    },
    canDeleteRole && {
      icon: DeleteIcon,
      onClick: (row) => {
        if (row && row.id) {
          setSelectedId(row.id);
          const role = roles.find((r) => r.id === row.id);
          const name = role?.roleName || "Role";
          setSelectedName(name);
          setDeleteModal(true);
        } else {
          toast.error("Cannot delete: Role data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Delete Role",
    },
  ].filter(Boolean); // Filter out any falsey actions

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      callApi(deleteRole, {
        requestType: "deleteRole",
        role_id: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully.");
      setDeleteModal(false);
      setSelectedId(null);
      setSelectedName("");
    },
    onError: (error) => {
      toast.error("Failed to delete role: " + error.message);
    },
  });

  const applyFilters = () => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter((row) =>
        row.roleName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterValues.status && filterValues.status !== "AllStatus") {
      result = result.filter((row) => {
        const originalRole = roles.find((role) => role.id === row.id);
        return originalRole?.status === filterValues.status;
      });
    }

    if (
      filterValues.permissions &&
      filterValues.permissions !== "AllPermissions"
    ) {
      result = result.filter((row) => {
        const originalRole = roles.find((role) => role.id === row.id);
        return originalRole?.permissions?.includes(filterValues.permissions);
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
    // Filters are applied automatically through useEffect
  };

  const handleResetFilter = () => {
    setFilterValues({
      status: "AllStatus",
      permissions: "AllPermissions",
    });
    setSearchQuery("");
  };

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  useEffect(() => {
    if (roles && data && data.length > 0) {
      applyFilters();
    } else {
      setFilteredData([]);
    }
  }, [roles, data, searchQuery, filterValues.status, filterValues.permissions]);

  return (
    <Box>
      <DashboardHeader title="User Management" />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
      >
        <Typography variant="h5" className="header-title">
          Roles & Permissions
        </Typography>
        {canCreateRole && (
          <CustomButton
            customClass="btn-add"
            text="Add New Role"
            onClick={() =>
              router.push(
                "/ticketing-system/roles-permission/create-permissions"
              )
            }
            libIcon={<AddCircleIcon sx={{ fontSize: "30px" }} />}
          />
        )}
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
            placeholder="Search by role name"
          />
        </Grid>
        {filters.map((filter, index) => (
          <Grid size={{ lg: 2.5, xs: 12 }} key={index}>
            <TableSelectFilterMainNew
              value={filter.value || ""}
              name={filter.name}
              options={filter.filterOptions}
              popperClassName={filter.className}
              defaultText={filter.filterOptions[0].label}
              className="table-dropdown-select"
              onChange={handleFilterChange}
              sx={{ border: "1px solid #DBDBDB", borderRadius: "30px" }}
            />
          </Grid>
        ))}
        <Grid size={{ lg: 3, xs: 12 }}>
          <Box sx={{ display: "flex", gap: "10px" }} className="ticket-button">
            <CustomButton
              text="Apply Filter"
              customClass={"btn-outlined"}
              onClick={handleApplyFilter}
            />
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

      {/* <MyModal
        open={addNewModalOpen}
        setOpen={setAddNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Add New Role"
        modalText="Enter the details for the new role."
        iconSrc={addnewEntry}
      >
        <AddNewEntry
          getall={() => queryClient.invalidateQueries({ queryKey: ["roles"] })}
          onCloseModal={() => setAddNewModalOpen(false)}
        />
      </MyModal> */}

      <MyModal
        open={editNewModalOpen}
        setOpen={setEditNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Edit Role"
        modalText="Update the details for the role."
        iconSrc={editnewEntry}
      >
        <EditAllUsersEntry
          AllUsersData={selectedRole}
          getall={() => queryClient.invalidateQueries({ queryKey: ["roles"] })}
          onCloseModal={() => {
            setEditNewModalOpen(false);
            setSelectedRole(null);
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
              setSelectedRole(null);
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

export default RolesAndPermission;
