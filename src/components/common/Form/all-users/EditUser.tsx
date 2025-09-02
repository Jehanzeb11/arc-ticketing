"use client";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonCustom from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useApiStore } from "@/lib/api/apiStore";

export default function EditUser({ getall, onCloseModal, userData }: any) {
  const { callApi, updateUser, fetchRoles, fetchDepartments }: any =
    useApiStore();

  // Fetch roles and departments
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => callApi(fetchRoles, { requestType: "getAllRoles" }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: userData?.full_name || "",
      email: userData?.email || "",
      role: userData?.roleId || "",
      status: userData?.status || "",
      picture: userData?.picture || null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      // Add required fields
      formData.append("requestType", `updateUser&user_id=${userData?.user_id}`);
      formData.append("full_name", data.fullName);
      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("status", data.status);

      // If a new picture is selected
      if (data.picture?.[0]) {
        formData.append("picture", data.picture[0]); // file itself
      } else if (userData?.picture) {
        // If no new picture is chosen, keep the old one (optional: depends on backend)
        formData.append("existingPicture", userData.picture);
      }

      return callApi(updateUser, formData, true);
      // 👆 make sure callApi detects multipart/form-data
    },
    onSuccess: () => {
      toast.success("User updated successfully!");
      getall();
      onCloseModal();
      reset();
    },
    onError: (error) => toast.error(`Failed to update user: ${error.message}`),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  // Dynamic options from API
  const roleOptions =
    roles?.map((role) => ({
      label: role.role_name,
      value: role.role_id,
    })) || [];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  console.log(userData, " - > userData");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type="text"
            label="Full Name"
            {...register("fullName", { required: "Full Name is required" })}
          />
          {errors.fullName && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.fullName.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type="email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.email.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <FormSelect
                label="Role"
                name="role"
                defaultText="Select Role"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={roleOptions}
              />
            )}
          />
          {errors.role && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.role.message}
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

        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Profile Picture
          </Typography>

          {userData?.picture ? (
            <Box>
              {/* Show existing picture name */}
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Current: {userData.picture}
              </Typography>

              {/* Option to upload new picture */}
              <GlobalInput type="file" {...register("picture")} />
            </Box>
          ) : (
            <GlobalInput
              type="file"
              label="Select Picture"
              {...register("picture", {
                required: "Profile Picture is required",
              })}
            />
          )}

          {errors.picture && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.picture.message as string}
            </Typography>
          )}
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
