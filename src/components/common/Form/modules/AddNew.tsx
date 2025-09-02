"use client";
import ButtonCustom from "@/components/common/Button/Button";
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import GlobalInput from "@/components/common/Input/GlobalInput";
import FormSelect from "@/components/common/Select";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApiStore } from "@/lib/api/apiStore";
import GlobalTextarea from "../../textarea/GlobalTextarea";

interface AddNewModalProps {
  getall: () => void;
  onCloseModal: () => void;
  userData: any;
}

export default function AddNewEntryAssignmentModule({
  getall,
  onCloseModal,
  userData,
}: AddNewModalProps) {
  const {
    callApi,
    fetchDepartments,
    createModules,
    getUserModules,
    updateUserModule,
  }: any = useApiStore();

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, { requestType: "getAllDepartments" }),
  });
  const { data: moduleData } = useQuery({
    queryKey: ["moduleData", userData?.user_id],
    queryFn: () =>
      callApi(getUserModules, {
        requestType: `?requestType=getUserModules&user_id=${userData?.user_id}`,
      }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      department: "",
      module: [],
      ftp: "",
    },
  });

  const isEdit = !!(moduleData && moduleData.length > 0);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEdit) {
        // 📝 Update existing modules
        return callApi(updateUserModule, {
          requestType: `?requestType=updateUserModule`,
          user_id: userData.user_id,
          modules: data.modules,
        });
      } else {
        // ➕ Create new modules
        return callApi(createModules, {
          requestType: `?requestType=assignModule`,
          user_id: userData.user_id,
          modules: data.modules,
        });
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? "Modules updated successfully!"
          : "Modules assigned successfully!"
      );
      getall?.();
      onCloseModal?.();
      reset();
    },
    onError: (error: any) => {
      toast.error("Failed: " + error.message);
    },
  });

  // ✅ when moduleData changes, set form values
  useEffect(() => {
    if (moduleData && moduleData.length > 0) {
      const modules = moduleData.map((m: any) => m.module_name);

      const defaults: any = {
        module: modules,
      };

      // if Ticketing exists, set department
      const ticketing = moduleData.find(
        (m: any) => m.module_name === "Ticketing"
      );
      if (ticketing) {
        defaults.department = JSON.parse(ticketing.module_meta).departmentId;
      }

      // if DID exists, set ftp
      const did = moduleData.find((m: any) => m.module_name === "DID");
      if (did) {
        defaults.ftp = JSON.parse(did.module_meta).ftp;
      }

      reset(defaults); // 👈 this updates the form
    }
  }, [moduleData, reset]);

  const moduleMap = React.useMemo(() => {
    if (!moduleData) return {};
    return moduleData.reduce((acc: any, mod: any) => {
      acc[mod.module_name] = mod;
      return acc;
    }, {});
  }, [moduleData]);

  const onSubmit = (data: any) => {
    const payloadModules = selectedModules.map((mod: string) => {
      let meta: any = {};
      if (mod === "Ticketing") {
        meta = { departmentId: data.department };
      } else if (mod === "DID") {
        meta = { ftp: data.ftp };
      }

      return {
        id: moduleMap[mod]?.id || null, // 👈 include id if exists
        module_name: mod,
        module_meta: meta,
      };
    });

    mutation.mutate({
      ...data,
      modules: payloadModules,
    });
  };

  const departmentOptions =
    departments?.map((dept) => ({
      label: dept.name,
      value: dept.id,
    })) || [];

  const moduleTypeOptions = [
    { label: "DID", value: "DID" },
    { label: "Ticketing", value: "Ticketing" },
    { label: "Scrubber", value: "Scrubber" },
  ];

  const selectedModules = watch("module") || [];

  console.log(userData);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Controller
            name="module"
            control={control}
            rules={{ required: "Module is required" }}
            render={({ field }) => (
              <FormSelect
                label="Module"
                name="module"
                defaultText="Select Module"
                multiple
                value={field.value || []}
                onChange={(e) => field.onChange(e.target.value)}
                options={moduleTypeOptions}
              />
            )}
          />
          {errors.module && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.module.message}
            </Typography>
          )}
        </Grid>

        {selectedModules.includes("Ticketing") && (
          <Grid size={12}>
            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <FormSelect
                  label="Department"
                  name="department"
                  defaultText="Select Department"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={departmentOptions}
                />
              )}
            />
            {errors.department && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: -1, ml: 1 }}
              >
                {errors.department.message}
              </Typography>
            )}
          </Grid>
        )}
        {selectedModules.includes("DID") && (
          <Grid size={12}>
            <Controller
              name="ftp"
              control={control}
              rules={{ required: "FTP is required" }}
              render={({ field }) => (
                <FormSelect
                  label="FTP"
                  name="ftp"
                  defaultText="Select FTP"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={[
                    { label: "FTP 1", value: "ftp1" },
                    { label: "FTP 2", value: "ftp2" },
                    { label: "FTP 3", value: "ftp3" },
                  ]}
                />
              )}
            />
            {errors.department && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: -1, ml: 1 }}
              >
                {errors.department.message}
              </Typography>
            )}
          </Grid>
        )}
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
