"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Grid, Button, Tooltip, Alert } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@/assets/icons/new-delete.png";
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import addnewEntry from "@/assets/icons/modal/add-dept.svg";
import editnewEntry from "@/assets/icons/modal/add-dept.svg";
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
import { imageUrl } from "@/lib/constants/variables";
import AddNewEntryEmailConf from "@/components/common/Form/smtp-configuration/AddNewEntry";
import EditEmailConf from "@/components/common/Form/smtp-configuration/EditEmailConf";

const SMTP = () => {
  const queryClient = useQueryClient();
  const { callApi, fetchDepartments, deleteSmtp, updateUser, getAllSMTP }: any =
    useApiStore();
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [editNewModalOpen, setEditNewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: smtps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllSMTP"],
    queryFn: () =>
      callApi(getAllSMTP, { requestType: "getAllSmtps", type: "SMTP" }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = [
    { key: "host", title: "SMTP Host", filterable: false },
    { key: "port", title: "SMTP Port", filterable: false },
    { key: "ssl", title: "TLS/SSL", filterable: false },
    { key: "dept", title: "Department", filterable: false },
    { key: "status", title: "Status", filterable: false },
  ];

  // Process data to include switch component in status column
  const data = useMemo(
    () =>
      smtps?.map((user) => ({
        id: user.id,
        host: user.host || "--",
        port: String(user.port) || "--",
        ssl: user.secure || "--",
        dept: user.dept || "--",
        status: (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography
              sx={{
                color: user.secure === "SSL" ? "#3286BD" : "#000",
                fontSize: "15px",
                lineHeight: "20px",
                padding: "4px 12px",
                background: user.secure === "SSL" ? "#3286BD15" : "#24242415",
                borderRadius: "100px",
              }}
            >
              {user.secure}
            </Typography>
            <IOSSwitch
              checked={user.secure === "SSL"}
              onChange={(e) => handleSwitchChange(e, user.user_id)}
            />
          </Box>
        ),
      })) || [],
    [smtps]
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
        if (row && row.id) {
          const user = smtps.find((u) => u.id === row.id);
          if (user) {
            setSelectedId(row.id);
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
        console.log(row);
        if (row && row.id) {
          setSelectedId(row.id);
          setDeleteModal(true);
        } else {
          toast.error("Cannot delete: User data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Delete User",
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: (id) => callApi(deleteSmtp, { requestType: `deleteSmtp`, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSMTP"] });
      toast.success("SMTP deleted successfully.");
      setDeleteModal(false);
      setSelectedId(null);
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
        row.host.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (filterValues.role && filterValues.role !== "AllRole") {
      result = result.filter((row) => row.port === filterValues.role);
    }

    // Apply department filter
    if (
      filterValues.department &&
      filterValues.department !== "AllDepartment"
    ) {
      result = result.filter((row) => row.dept === filterValues.department);
    }

    // Apply status filter
    if (filterValues.status && filterValues.status !== "AllStatus") {
      result = result.filter((row) => {
        // For status filtering, we need to match against the original user data
        // Find the original user to get the actual status value
        const originalUser = smtps.find((user) => user.id === row.id);
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

  // if (error) {
  //   return <Alert severity="error">Error: {error.message}</Alert>;
  // }

  useEffect(() => {
    if (smtps && data && data.length > 0) {
      applyFilters();
    } else {
      // If no smtps or data, set filteredData to empty array
      setFilteredData([]);
    }
  }, [
    smtps,
    data,
    searchQuery,
    filterValues.role,
    filterValues.department,
    filterValues.status,
  ]);

  return (
    <Box>
      <DashboardHeader title="Email Management" />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
      >
        <Typography variant="h5" className="header-title">
          SMTP Configurations Table
        </Typography>
        <CustomButton
          customClass="btn-add"
          text="Add New SMTP"
          onClick={() => setAddNewModalOpen(true)}
          libIcon={<AddCircleIcon sx={{ fontSize: "30px" }} />}
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
          isLoading={false}
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
        modalTitle="Add SMTP"
        modalText="Update the SMTP"
        iconSrc={addnewEntry}
      >
        <AddNewEntryEmailConf
          getall={() =>
            queryClient.invalidateQueries({ queryKey: ["getAllSMTP"] })
          }
          onCloseModal={() => setAddNewModalOpen(false)}
        />
      </MyModal>

      <MyModal
        open={editNewModalOpen}
        setOpen={setEditNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Edit SMTP"
        modalText="Update the SMTP "
        iconSrc={editnewEntry}
      >
        <EditEmailConf
          userData={selectedUser}
          getall={() =>
            queryClient.invalidateQueries({ queryKey: ["getAllSMTP"] })
          }
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

export default SMTP;
