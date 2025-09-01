"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Button, Tooltip, Alert } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@/assets/icons/deleteicon-agents.svg";
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import addnewEntry from "@/assets/icons/modal/contacts/addnewEntry.svg";
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
import AddNewEntry from "@/components/common/Form/department-old/AddNew";
import EditDepartmentEntry from "@/components/common/Form/department-old/EditDepartment";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";

const DepartmentPage = () => {
  const queryClient = useQueryClient();
  const { callApi, fetchDepartments, deleteDepartment, updateDepartment } =
    useApiStore();
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [editNewModalOpen, setEditNewModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = [
    { key: "name", title: "Department Name", filterable: false },
    { key: "description", title: "Description", filterable: false },
    { key: "assignedUsers", title: "Assigned Users", filterable: false },
    { key: "status", title: "Status", filterable: false },
  ];

  // Handle status switch change
  const handleSwitchChange = async (e, departmentId) => {
    const newStatus = e.target.checked ? "Active" : "Inactive";
    try {
      await callApi(updateDepartment, {
        requestType: "updateDepartment",
        id: departmentId,
        status: newStatus,
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department status updated successfully!");
    } catch (error) {
      toast.error("Failed to update department status: " + error.message);
    }
  };

  // Process data to include switch component in status column
  const data = useMemo(
    () =>
      departments?.map((dept) => ({
        id: dept.id,
        name: dept.name || "--",
        description: dept.description || "--",
        assignedUsers: dept.assignedUsers || "0",
        status: (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography
              sx={{
                color: dept.status === "Active" ? "#3286BD" : "#000",
                fontSize: "15px",
                lineHeight: "20px",
                padding: "4px 12px",
                background:
                  dept.status === "Active" ? "#3286BD15" : "#24242415",
                borderRadius: "100px",
              }}
            >
              {dept.status || "Active"}
            </Typography>
            <IOSSwitch
              checked={(dept.status || "Active") === "Active"}
              onChange={(e) => handleSwitchChange(e, dept.id)}
            />
          </Box>
        ),
      })) || [],
    [departments]
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({
    status: "AllStatus",
    assignedUsers: "AllAssignedUsers",
  });
  const [filteredData, setFilteredData] = useState(data);

  const statusOptions = [
    { value: "AllStatus", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const assignedUsersOptions = [
    { value: "AllAssignedUsers", label: "All Assigned Users" },
    { value: "0", label: "0 Users" },
    { value: "1", label: "1 User" },
    { value: "2+", label: "2+ Users" },
  ];

  const filters = [
    {
      name: "status",
      value: filterValues.status,
      className: "status-filter",
      filterOptions: statusOptions,
    },
    {
      name: "assignedUsers",
      value: filterValues.assignedUsers,
      className: "assigned-users-filter",
      filterOptions: assignedUsersOptions,
    },
  ];

  const actions = [
    {
      icon: editIcon,
      onClick: (row) => {
        if (row && row.id) {
          const dept = departments.find((d) => d.id === row.id);
          if (dept) {
            setSelectedId(row.id);
            setSelectedDepartment(dept);
            setEditNewModalOpen(true);
          } else {
            toast.error("Department data not found");
          }
        } else {
          toast.error("Invalid row or missing id");
        }
      },
      className: "action-icon",
      tooltip: "Edit Department",
    },
    {
      icon: DeleteIcon,
      onClick: (row) => {
        if (row && row.id) {
          setSelectedId(row.id);
          const dept = departments.find((d) => d.id === row.id);
          const name = dept?.name || "Department";
          setSelectedName(name);
          setDeleteModal(true);
        } else {
          toast.error("Cannot delete: Department data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Delete Department",
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      // @ts-ignore
      console.log(id);
      return callApi(deleteDepartment, {
        requestType: "deleteDepartment",
        id: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully.");
      setDeleteModal(false);
      setSelectedId(null);
      setSelectedName("");
    },
    onError: (error) => {
      toast.error("Failed to delete department: " + error.message);
    },
  });

  const applyFilters = () => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter((row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterValues.status && filterValues.status !== "AllStatus") {
      result = result.filter((row) => {
        const originalDept = departments.find((dept) => dept.id === row.id);
        return (originalDept?.status || "Active") === filterValues.status;
      });
    }

    if (
      filterValues.assignedUsers &&
      filterValues.assignedUsers !== "AllAssignedUsers"
    ) {
      result = result.filter((row) => {
        const originalDept = departments.find((dept) => dept.id === row.id);
        const userCount = parseInt(originalDept?.assignedUsers || "0");
        if (filterValues.assignedUsers === "2+") {
          return userCount >= 2;
        }
        return originalDept?.assignedUsers === filterValues.assignedUsers;
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
      assignedUsers: "AllAssignedUsers",
    });
    setSearchQuery("");
  };

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  useEffect(() => {
    if (departments && data && data.length > 0) {
      applyFilters();
    } else {
      setFilteredData([]);
    }
  }, [
    departments,
    data,
    searchQuery,
    filterValues.status,
    filterValues.assignedUsers,
  ]);

  return (
    <Box>
      <DashboardHeader title="Departments Management" />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", my: "16px" }}
      >
        <Typography variant="h5" className="header-title">
          Department Overview
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
            placeholder="Search by department name"
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
        open={addNewModalOpen}
        setOpen={setAddNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Add New Department"
        modalText="Enter the details for the new department."
        iconSrc={addnewEntry}
      >
        <AddNewEntry
          getall={() =>
            queryClient.invalidateQueries({ queryKey: ["departments"] })
          }
          onCloseModal={() => setAddNewModalOpen(false)}
        />
      </MyModal>

      <MyModal
        open={editNewModalOpen}
        setOpen={setEditNewModalOpen}
        customStyle="add-new-extension-modal"
        modalHeader="true"
        modalTitle="Edit Department"
        modalText="Update the details for the department."
        iconSrc={editIcon}
      >
        <EditDepartmentEntry
          contactData={selectedDepartment}
          getall={() =>
            queryClient.invalidateQueries({ queryKey: ["departments"] })
          }
          onCloseModal={() => {
            setEditNewModalOpen(false);
            setSelectedDepartment(null);
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
          Are you sure you want to permanently delete {selectedName}? All
          associated users will be unassigned. This action cannot be undone.
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
              setSelectedDepartment(null);
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

export default DepartmentPage;
