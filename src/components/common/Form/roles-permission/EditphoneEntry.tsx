"use client";
import { Box, Grid, Typography, Button } from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonCustom from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useApiStore } from "@/lib/api/apiStore";
import GlobalCheckBoxInput from "../../Input/GlobalCheckBoxInput";
import CloseIcon from "@mui/icons-material/Close";

interface EditAllUsersEntryProps {
  getall: (data: any) => void;
  onCloseModal: () => void;
  AllUsersData?: any;
}

export default function EditAllUsersEntry({
  getall,
  onCloseModal,
  AllUsersData,
}: EditAllUsersEntryProps) {
  const { callApi, updateRole } = useApiStore();

  console.log(AllUsersData, "AllUsersData");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      roleName: AllUsersData?.role_name || "",
      description: AllUsersData?.description || "",
      permissions: JSON.parse(AllUsersData?.permissions) || [],
      status: AllUsersData?.status || "Active",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const updatedRoleData = {
        ...AllUsersData,
        roleName: data.roleName,
        description: data.description,
        permissions: data.permissions,
        status: data.status,
      };
      return callApi(updateRole, AllUsersData?.id, updatedRoleData);
    },
    onSuccess: (response, data) => {
      toast.success("Role updated successfully!");
      getall(data);
      onCloseModal();
      reset();
    },
    onError: (error) => toast.error(`Failed to update role: ${error.message}`),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  // Options for status
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Options for permissions
  const permissionOptions = [
    { label: "View Reports", value: "View Reports" },
    { label: "Manage Users", value: "Manage Users" },
    { label: "System Settings", value: "System Settings" },
    { label: "Delete Records", value: "Delete Records" },
    { label: "Create Tickets", value: "Create Tickets" },
    { label: "Assign Roles", value: "Assign Roles" },
    { label: "Manage Team", value: "Manage Team" },
    { label: "Update Tickets", value: "Update Tickets" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
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
        <Grid size={{ xs: 12 }}>
          <GlobalInput
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
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <FormSelect
                label="Status"
                name="status"
                defaultText="Select Status"
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
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", alignItems: "start", gap: "30px" }}
        >
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000060",
              lineHeight: "26px", // 162.5%
            }}
          >
            Permissions
          </Typography>
          {/* <Box>
            {JSON.parse(AllUsersData?.permissions)?.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  gap: "5px",
                  flexWrap: "wrap",
                  mb: "10px",
                }}
                className="assignedPermissions-button"
              >
                {AllUsersData.permissions.map((perm: string, index: number) => (
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
                    <Typography>{perm}</Typography>
                    <Button
                      size="small"
                      disabled // Disable removal in modal
                    >
                      <CloseIcon />
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No Permission</Typography>
            )}
            <Controller
              name="permissions"
              control={control}
              rules={{
                validate: (value: string[]) =>
                  value.length > 0 ||
                  "At least one permission must be selected",
              }}
              render={({ field: { onChange, value } }) => (
                <GlobalCheckBoxInput
                  name="permissions"
                  options={permissionOptions}
                  control={control}
                  isMultiSelect={true}
                  value={value || []}
                  onChange={onChange}
                />
              )}
            />
            {errors.permissions && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: -1, ml: 1 }}
              >
                {errors.permissions.message}
              </Typography>
            )}
          </Box> */}
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: "15px", mt: "35px" }}>
        <ButtonCustom
          text="Cancel"
          btntrasnparent={true}
          onClick={onCloseModal}
        />
        <ButtonCustom
          text={isSubmitting ? "Saving..." : "Save"}
          type="submit"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  );
}
