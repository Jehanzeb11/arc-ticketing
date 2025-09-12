"use client";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonCustom from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useApiStore } from "@/lib/api/apiStore";
import GlobalCheckBoxInput from "../../Input/GlobalCheckBoxInput";
import { fetchRoleById, fetchRoles } from "@/lib/api/apiCalls";

// interface AddNewModalProps {
//   getall: (data: any) => void
//   onCloseModal: () => void
// }

export default function AddNewEntryEdit() {
  // {
  // getall,
  // onCloseModal,
  // }: AddNewModalProps
  const { callApi, createRole } = useApiStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      roleName: "",
      description: "",
      permissions: [] as string[],
      status: "Active",
    },
  });

  const id = new URLSearchParams(window.location.search).get("id");

  const {
    data: roles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["single_role"],
    queryFn: () =>
      callApi(fetchRoleById, {
        requestType: "getRoleById",
        role_id: id,
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const roleData = {
        requestType: "updateRole",
        role_id: id,
        role_name: data.roleName,
        description: data.description,
        permissions: data.permissions,
        status: data.status,
      };
      return callApi(createRole, roleData);
    },
    onSuccess: (response, data) => {
      toast.success("Role Updated successfully!");
      // getall(data)
      // onCloseModal()
      refetch();
      reset({
        roleName: data.roleName,
        description: data.description,
        permissions: data.permissions,
        status: data.status,
      });
    },
    onError: (error) => toast.error(`Failed to create role: ${error.message}`),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  // Options for status
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Options for permissions
  const permissionOptions = [
    {
      heading: "Authentication & Profile Module",
      data: [
        { label: "Manage Own Profile ", value: "Manage Own Profile " },
        { label: "Reset Own Password", value: "Reset Own Password" },
        { label: "View Company Profile ", value: "View Company Profile " },
        { label: "Edit Company Profile", value: "Edit Company Profile" },
      ],
    },
    {
      heading: "Ticket Management Module",
      data: [
        { label: "View Tickets ", value: "View Tickets " },
        { label: "Search & Filter Tickets", value: "Search & Filter Tickets" },
        { label: "Create Ticket", value: "Create Ticket" },
        { label: "Reply to Ticket", value: "Reply to Ticket" },
        { label: "Add Internal Notes", value: "Add Internal Notes" },
        { label: "Edit Ticket Fields", value: "Edit Ticket Fields" },
        { label: "Assign/Reassign Tickets", value: "Assign/Reassign Tickets" },
        { label: "Archive Tickets", value: "Archive Tickets" },
        { label: "Delete Tickets", value: "Delete Tickets" },
      ],
    },
    {
      heading: "User Management Module",
      data: [
        { label: "View Users", value: "View Users" },
        { label: "Search & Filter Users", value: "Search & Filter Users" },
        { label: "Add User", value: "Add User" },
        { label: "Edit User", value: "Edit User" },
        {
          label: "Deactivate/Activate User",
          value: "Deactivate/Activate User",
        },
        { label: "Delete User", value: "Delete User" },
      ],
    },
    {
      heading: "Roles & Permissions Module",
      data: [
        { label: "View Roles", value: "View Roles" },
        { label: "Create Role", value: "Create Role" },
        { label: "Edit Role", value: "Edit Role" },
        {
          label: "Assign Permissions to Role",
          value: "Assign Permissions to Role",
        },
        {
          label: "Deactivate/Activate Role",
          value: "Deactivate/Activate Role",
        },
        { label: "Delete Role", value: "Delete Role" },
      ],
    },
    {
      heading: "Departments Management Module",
      data: [
        { label: "View Departments", value: "View Departments" },
        { label: "Add Department", value: "Add Department" },
        { label: "Edit Department", value: "Edit Department" },
        { label: "Delete Department", value: "Delete Department" },
      ],
    },
    {
      heading: "Analytics & Reports Module",
      data: [
        {
          label: "View Analytics Dashboard",
          value: "View Analytics Dashboard",
        },
        { label: "Filter Analytics", value: "Filter Analytics" },
        { label: "Export Reports", value: "Export Reports" },
        {
          label: "View Agent Performance Metrics",
          value: "View Agent Performance Metrics",
        },
      ],
    },
    {
      heading: "Notifications & Automation Module",
      data: [
        {
          label: "Receive Notifications",
          value: "Receive Notifications",
        },
        {
          label: "Configure Notification Preferences",
          value: "Configure Notification Preferences",
        },
        {
          label: "Manage Email-to-Ticket Rules",
          value: "Manage Email-to-Ticket Rules",
        },
      ],
    },
    {
      heading: "System Configurations (Admin Only)",
      data: [
        {
          label: "Manage Organization Settings",
          value: "Manage Organization Settings",
        },
        {
          label: "Enable/Disable Modules",
          value: "Enable/Disable Modules",
        },
        {
          label: "Access Audit Logs",
          value: "Access Audit Logs",
        },
      ],
    },
  ];

  useEffect(() => {
    if (roles) {
      let permissionsParsed = [];

      try {
        permissionsParsed =
          typeof roles.permissions === "string"
            ? JSON.parse(roles.permissions)
            : roles.permissions || [];
      } catch (error) {
        permissionsParsed = [];
        console.error("Failed to parse permissions", error);
      }

      reset({
        roleName: roles.role_name || "",
        description: roles.description || "",
        permissions: permissionsParsed,
        status: roles.status || "Active",
      });
    }
  }, [roles]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            label="Role Name"
            {...register("roleName", { required: "Role Name is required" })}
          />
          {errors.roleName && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.roleName.message}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <FormSelect
                label="Status"
                name="status"
                defaultText="Select Status"
                className="modal-select"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={statusOptions}
              />
            )}
          />
          {errors.status && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.status.message}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <GlobalInput
            multiline
            type="text"
            label="Description"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.description.message}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" className="header-title">
            Permissions List for Admin Interface
          </Typography>
          <Controller
            name="permissions"
            control={control}
            rules={{
              validate: (value: string[]) =>
                value.length > 0 || "At least one permission must be selected",
            }}
            render={({ field }) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 8, mt: 3 }}>
                {permissionOptions.map(({ heading, data }) => (
                  <Box
                    key={heading}
                    sx={{
                      mb: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {heading}
                      <Box
                        sx={{
                          mt: 1.5,
                          background:
                            "linear-gradient(90deg, #32ABB1 0%, #3286BD 100%)",
                          height: "5px",
                          borderRadius: "5px",
                        }}
                      ></Box>
                    </Typography>
                    <GlobalCheckBoxInput
                      name="permissions"
                      control={control}
                      options={data}
                      isMultiSelect={true}
                    />
                  </Box>
                ))}
              </Box>
            )}
          />

          {errors.permissions && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.permissions.message}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: "15px", mt: "35px" }}>
        <ButtonCustom
          text="Cancel"
          btntrasnparent={true}
          // onClick={onCloseModal}
        />
        <ButtonCustom
          text={isSubmitting ? "Updateing..." : "Update Role"}
          type="submit"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  );
}
