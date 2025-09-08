"use client";
import ButtonCustom from "@/components/common/Button/Button";
import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";

import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApiStore } from "@/lib/api/apiStore";
import GlobalTextarea from "../../textarea/GlobalTextarea";

interface AddNewModalProps {
  getall: () => void;
  onCloseModal: () => void;
}

export default function AddNewEntry({
  getall,
  onCloseModal,
}: AddNewModalProps) {
  const { callApi, createDepartment }: any = useApiStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) =>
      callApi(createDepartment, {
        requestType: "createDepartment",
        name: data.Name,
        description: data.Description,
        status: data.Status,
      }),
    onSuccess: () => {
      toast.success("Department created successfully!");
      if (getall) getall();
      if (onCloseModal) onCloseModal();
      reset();
    },
    onError: (error) =>
      toast.error("Failed to create department: " + error.message),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  // Status options for FormSelect
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type="text"
            label="Department Name"
            {...register("Name", { required: "Department Name is required" })}
          />
          {errors.Name && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.Name.message as string}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <GlobalInput
            type="text"
            label="Description"
            {...register("Description", {
              required: "Description is required",
            })}
          />
          {errors.Description && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.Description.message as string}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="Status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <FormSelect
                label="Status"
                name="Status"
                defaultText="Select Status"
                className="modal-select"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={statusOptions}
              />
            )}
          />
          {errors.Status && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.Status.message as string}
            </Typography>
          )}
        </Grid>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000060",
              fontSize: "19px",
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: "27.077px", // 142.509%
              width: "230px",
            }}
          >
            Assigned Users
          </Typography>
          <Typography
            variant="body1"
            color="initial"
            sx={{
              color: "#00000060",
              fontSize: "18px",
              fontStyle: "italic",
              fontWeight: 300,
              lineHeight: "27.077px", // 150.426%
            }}
          >
            Users are assigned to departments via the User Mangement screen
          </Typography>
        </Box>
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
