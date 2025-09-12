"use client";

// React and form imports
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

// Material-UI imports
import { Box, Typography, Button, Chip, Grid } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Component imports
import FormSelect from "@/components/common/Select";
import GlobalInput from "@/components/common/Input/GlobalInput";
import GlobalTextarea from "@/components/common/textarea/GlobalTextarea";
import MyButton from "@/components/common/Button/Button";

// Asset imports
import replyIcon from "@/assets/icons/unibox/ticket/viewpage/reply.svg";

// Store and Query imports
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const CreateTicket = ({ closeModal, getall }) => {
  const {
    callApi,
    createUniboxTicket,
    updateUniboxTicket,
    departmentUser,
    fetchDepartments,
    fetchUsers,
  }: any = useApiStore();

  const generateTicketId = () => {
    return "TK-" + uuidv4().replace(/-/g, "").slice(-12).toUpperCase();
    // 👉 change to numeric only if you prefer
  };

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      TicketId: generateTicketId(),
      Department: "",
      Name: "",
      Assignedto: "",
      Title: "",
      message: "",
      Priority: "Low",
      Status: "Open",
      Type: "Support",
    },
  });

  // Fetch departments and users
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
  });

  const selectedDepartment = watch("Department");

  const { data: users } = useQuery({
    queryKey: ["users", selectedDepartment],
    queryFn: () =>
      callApi(departmentUser, {
        requestType: "getAllUsersByDepartment",
        departmentId: selectedDepartment,
      }),
    enabled: !!selectedDepartment,
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      // Get existing tickets first
      // const existingTickets = await callApi(fetchUniboxTickets);
      // const ticketDataArray = existingTickets[0]?.ticket_data || [];

      // // Add new ticket to the array
      // const updatedTicketData = [...ticketDataArray, ticketData];

      // Update the first ticket object with new ticket_data
      return callApi(createUniboxTicket, {
        requestType: "createTicket",
        subject: ticketData.Title,
        details: ticketData.Details,
        status: ticketData.Status,
        priority: ticketData.Priority,
        department_id: ticketData.Department,
        customer_name: ticketData.Name,
        type: ticketData.Type,
        assignee: ticketData.Assignee,
        ticket_reference: ticketData.ticketId,
      });
    },
    onSuccess: () => {
      toast.success("Ticket created successfully!");
      queryClient.invalidateQueries({ queryKey: ["uniboxTickets"] });
      closeModal();
      getall();
    },
    onError: (error) => {
      toast.error("Failed to create ticket: " + error.message);
    },
  });

  const onSubmit = (data: any) => {
    const ticketData = {
      ticketId: data.TicketId,
      Name: data.Name,
      Title: data.Title,
      Details: data.message,
      Status: data.Status,
      Priority: data.Priority,
      Type: data.Type,
      Department: data.Department,
      Assignee: data.Assignedto,
      Created: new Date().toLocaleDateString(),
      LastReply: new Date().toLocaleDateString(),
      archived: false,
    };
    createTicketMutation.mutate(ticketData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            disabled
            label="Ticket ID – Auto Gen"
            {...register("TicketId", { required: "Ticket Id is required" })}
            sx={{ width: "100%" }}
          />
          {errors.TicketId && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.TicketId.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            label="Requester Name"
            {...register("Name", { required: "Name is required" })}
            sx={{ width: "100%" }}
          />
          {errors.Name && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Name.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            label="Title"
            {...register("Title", { required: "Title is required" })}
            sx={{ width: "100%" }}
          />
          {errors.Title && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Title.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ xs: 6 }}>
          <GlobalTextarea
            label="Details"
            rows={1}
            cols={30}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.message.message as any}
            </p>
          )}
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label="Department"
            className="modal-select"
            name="Department"
            value={watch("Department") || ""}
            onChange={(e) => register("Department").onChange(e)}
            options={[
              { label: "Select Department", value: "" },
              ...(departments?.map((dept: any) => ({
                label: dept.name,
                value: dept.id,
              })) || []),
            ]}
            {...register("Department", { required: "Department is required" })}
          />
          {errors.Department && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Department.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label="Status"
            className="modal-select"
            name="Status"
            value={watch("Status") || ""}
            onChange={(e) => register("Status").onChange(e)}
            options={[
              { label: "Select Status", value: "" },
              { label: "Open", value: "Open" },
              { label: "In-progress", value: "In-progress" },
              { label: "Resolved", value: "Resolved" },
              { label: "Closed", value: "Closed" },
            ]}
            {...register("Status", { required: "Status is required" })}
          />
          {errors.Status && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Status.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <FormSelect
            label="Priority"
            name="Priority"
            className="modal-select"
            value={watch("Priority") || ""}
            onChange={(e) => register("Priority").onChange(e)}
            options={[
              { label: "Select Priority", value: "" },
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
              { label: "Urgent", value: "Urgent" },
            ]}
            {...register("Priority", { required: "Priority is required" })}
          />
          {errors.Priority && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Priority.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <FormSelect
            label="Type"
            name="Type"
            className="modal-select"
            value={watch("Type") || ""}
            onChange={(e) => register("Type").onChange(e)}
            options={[
              { label: "Select Type", value: "" },
              { label: "Support", value: "Support" },
              { label: "Feature", value: "Feature" },
              { label: "Bug", value: "Bug" },
              { label: "Question", value: "Question" },
            ]}
            {...register("Type", {
              required: "Type is required",
            })}
          />
          {errors.Type && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Type.message as any}
            </p>
          )}
        </Grid>
        <Grid size={{ lg: 6, xs: 12 }}>
          <FormSelect
            label="Assigned to"
            name="Assignedto"
            className="modal-select"
            value={watch("Assignedto") || ""}
            onChange={(e) => register("Assignedto").onChange(e)}
            options={[
              { label: "Select Assignee", value: "" },
              ...(users?.map((user: any) => ({
                label: user.full_name,
                value: user.user_id,
              })) || []),
            ]}
            {...register("Assignedto", {
              required: "Assigned to is required",
            })}
          />
          {errors.Assignedto && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.Assignedto.message as any}
            </p>
          )}
        </Grid>

        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "start", mt: 2, gap: "10px" }}
        >
          <MyButton onClick={closeModal} text="Cancel" btntrasnparent />
          <MyButton
            disabled={isSubmitting}
            text="Create Ticket"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateTicket;
