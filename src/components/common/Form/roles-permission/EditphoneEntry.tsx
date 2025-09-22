"use client";

import { Box, Grid, Typography } from "@mui/material";
import React, { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonCustom from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useApiStore } from "@/lib/api/apiStore";
import { useRouter } from "next/navigation";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
    onSuccess: (response) => {
      toast.success("Role updated successfully!");
      router.push("/ticketing-system/roles-permission");
      // OR use window.location.href as fallback
      // window.location.href = "/ticketing-system/roles-permission";
    },
    onError: (error) => toast.error(`Failed to update role: ${error.message}`),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <GlobalInput
            type="text"
            label="Role Name"
            {...register("roleName", { required: "Role Name is required" })}
          />
          {errors.roleName && (
            <Typography variant="caption" color="error">
              {errors.roleName.message}
            </Typography>
          )}
        </Grid>

        <Grid size={12}>
          <GlobalInput
            type="text"
            label="Description"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <Typography variant="caption" color="error">
              {errors.description.message}
            </Typography>
          )}
        </Grid>

        <Grid size={12}>
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
            <Typography variant="caption" color="error">
              {errors.status.message}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: "15px", mt: "35px" }}>
        <ButtonCustom
          text="Cancel"
          btntrasnparent={true}
          onClick={() => router.push("/ticketing-system/roles-permission")}
        />
        <ButtonCustom
          text={isSubmitting ? "Saving..." : "Save Role"}
          type="submit"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  );
}
