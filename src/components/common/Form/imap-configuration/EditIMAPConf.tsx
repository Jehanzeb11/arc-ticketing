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
import GlobalPasswordInput from "../../Input/GlobalPasswordInput";
import IOSSwitch from "../../switch";

export default function EditIMAPConf({ getall, onCloseModal, userData }: any) {
  const { callApi, updateSmtp, fetchRoles, fetchDepartments }: any =
    useApiStore();

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      host: userData?.host || "",
      port: userData?.port?.toString() || "",
      status: userData?.secure || "",
      dept: userData?.department_ids || "",
      email: userData?.username || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return callApi(
        updateSmtp,
        {
          requestType: "updateSMTP",
          host: data.host,
          port: data.port,
          username: data.email,
          dept: data.dept,
          secure: data.status ? "SSL" : "TLS",
          type: "IMAP",
          user_id: userData?.user_id,
          id: userData?.id,
        },
        true
      );
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
  console.log(userData, " - > userData");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            placeholder="Type Here"
            label="SMTP Host"
            {...register("host", { required: "SMTP Host is required" })}
          />
          {errors.host && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.host.message as string}
            </Typography>
          )}
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="number"
            label="SMTP Port"
            {...register("port", {
              required: "SMTP Port is required",
            })}
          />
          {errors.port && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.port.message as string}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 6 }}>
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
              {errors.email.message as string}
            </Typography>
          )}
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 6 }}>
          <Controller
            name="dept"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
              <FormSelect
                label="Department"
                name="dept"
                defaultText="Select Department"
                className="modal-select"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={departments?.map((department: any) => ({
                  label: department.name,
                  value: department.id,
                }))}
              />
            )}
          />
          {errors.dept && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.dept.message as string}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IOSSwitch
                  checked={field.value === "SSL"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "SSL" : "TSL")
                  }
                />

                <Typography
                  sx={{
                    color: "#000000b8",
                    fontSize: "15px",
                    lineHeight: "20px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                  }}
                >
                  TLS/SSL
                </Typography>
              </Box>
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: "15px", mt: "35px" }}>
        <ButtonCustom
          text="Cancel"
          btntrasnparent={true}
          onClick={onCloseModal}
        />
        <ButtonCustom
          text={isSubmitting ? "Updating..." : "Update Imap"}
          type="submit"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  );
}
