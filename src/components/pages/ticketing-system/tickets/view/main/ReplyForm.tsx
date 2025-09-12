"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Box, Typography, Button, Chip, Grid } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormSelect from "@/components/common/Select";
import GlobalInput from "@/components/common/Input/GlobalInput";
import GlobalTextarea from "@/components/common/textarea/GlobalTextarea";
import replyIcon from "@/assets/icons/unibox/ticket/viewpage/ticket.svg";
import Image from "next/image";
import MyButton from "@/components/common/Button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import { myData, replyUniboxTicket } from "@/lib/api/apiCalls";
import addUserIcon from "@/assets/icons/unibox/ticket/viewpage/add-user.png";
import toast from "react-hot-toast";

const ReplyForm = ({ ticketId, c_mail, tomails }: any) => {
  const queryClient = useQueryClient();

  const { callApi, fetchDepartments }: any = useApiStore();

  const [ccInput, setCcInput] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ccEmails: [], // array by default
      to_email: "",
      customer_email: "",
      department: "",
      type: "",
      priority: "",
      message: "",
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
  });
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: () => callApi(myData),
  });

  const ccEmails: string[] = watch("ccEmails") || [];

  const addCcEmail = () => {
    if (ccInput.trim()) {
      setValue("ccEmails", [...ccEmails, ccInput.trim()]);
      setCcInput("");
    }
  };

  //  ticket_id,
  //         to_email,
  //         department_id,
  //         type,
  //         priority,
  //         message,
  let emailstosend: any;

  const replyTicketMutation = useMutation({
    mutationFn: (data: any) => {
      if (c_mail == user?.email) {
        emailstosend = tomails;
      } else {
        emailstosend = c_mail;
      }

      const formData = new FormData();

      formData.append("requestType", "ticketReply");
      formData.append("ticket_id", ticketId);
      formData.append("type", data.type);
      formData.append("priority", data.priority);
      formData.append("message", data.message);
      formData.append("cc_emails", data.ccEmails);
      formData.append("department_id", data.department);
      formData.append("to_email", emailstosend);

      return callApi(replyUniboxTicket, {
        requestType: "ticketReply",
        ticket_id: ticketId,
        type: data.type,
        priority: data.priority,
        message: data.message,
        cc_emails: data.ccEmails,
        department_id: data.department,
        to_email: emailstosend,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uniboxTickets"] });
      toast.success("Ticket Replied successfully!");
    },
    onError: (error) => {
      console.error("Failed to update ticket:", error);
    },
  });

  const onSubmit = (data: any) => {
    // console.log("Form submitted:", data);
    replyTicketMutation.mutate(data);
  };

  const departmentOptionst = [
    {
      label: "Select",
      value: "",
    },
    ...((departments || []).map((department: any) => ({
      label: department.name,
      value: department.id,
    })) || []),
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 1,
        mx: "auto",
        p: "25px",
        filter: "drop-shadow(0px 16.88px 59.079px rgba(86, 89, 146, 0.10))",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          fontSize: "25px",
          fontWeight: "600",
          pb: "16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Image src={replyIcon} alt="icon" style={{ marginRight: "10px" }} />
        Reply to {ticketId || "unknown ticket"}
      </Typography>

      <Grid container spacing={2}>
        {/* CC Emails */}
        <Grid size={12}>
          <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
            CC Emails
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
            <GlobalInput
              type="text"
              placeholder="Add CC emails."
              value={ccInput}
              onChange={(e: any) => setCcInput(e.target.value)}
              sx={{ width: "100%" }}
            />
            <Button
              onClick={addCcEmail}
              sx={{
                borderRadius: "10px",
                cursor: "pointer",
                height: "50px",
                mt: 1,
                width: "40px",
                backgroundColor: "#FBFBFB",
                border: "1px solid #00000015",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={addUserIcon}
                alt="icon"
                style={{ marginRight: "10px" }}
              />
            </Button>
          </Box>
          {ccEmails.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {ccEmails.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  onDelete={() => {
                    const newEmails = ccEmails.filter((_, i) => i !== index);
                    setValue("ccEmails", newEmails);
                  }}
                  sx={{
                    color: "var(--pri-color)",
                    backgroundColor: "transparent",
                  }}
                  size="small"
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Department */}
        <Grid size={4}>
          <FormSelect
            label="Department"
            name="department"
            className="modal-select"
            value={watch("department") || ""}
            onChange={(e) => register("department").onChange(e)}
            options={departmentOptionst}
            {...register("department", {
              required: "Department is required",
            })}
          />
          {errors.department && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.department.message as any}
            </p>
          )}
        </Grid>

        {/* Type */}
        <Grid size={4}>
          <FormSelect
            label="Type"
            name="type"
            className="modal-select"
            value={watch("type") || ""}
            onChange={(e) => register("type").onChange(e)}
            options={[
              { label: "Select", value: "" },
              { label: "Support", value: "support" },
              { label: "Feature", value: "feature" },
              { label: "Bug", value: "bug" },
            ]}
            {...register("type", { required: "Type is required" })}
          />
          {errors.type && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.type.message as any}
            </p>
          )}
        </Grid>

        {/* Priority */}
        <Grid size={4}>
          <FormSelect
            label="Priority"
            name="priority"
            className="modal-select"
            value={watch("priority") || ""}
            onChange={(e) => register("priority").onChange(e)}
            options={[
              { label: "Select", value: "" },
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            {...register("priority", { required: "Priority is required" })}
          />
          {errors.priority && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.priority.message as any}
            </p>
          )}
        </Grid>

        {/* Message */}
        <Grid size={12}>
          <GlobalTextarea
            placeholder="Type your message here"
            rows={5}
            cols={30}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <p style={{ color: "#B80505", margin: "0px" }}>
              {errors.message.message as any}
            </p>
          )}
        </Grid>
      </Grid>

      {/* Add Files */}
      <Button
        variant="outlined"
        startIcon={<AttachFileIcon />}
        sx={{
          mt: 2,
          mb: 2,
          color: "#666",
          border: "1px dashed var(--border-color)",
          p: "10px 40px",
          borderRadius: "10px",
          textTransform: "capitalize",
          fontSize: "16px",
        }}
      >
        Add Files
      </Button>

      {/* Action Buttons */}
      <Box
        sx={{ display: "flex", justifyContent: "start", mt: 2, gap: "10px" }}
      >
        <MyButton
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          text="Submit Reply"
        />
        <MyButton
          onClick={() => alert("Cancel clicked")}
          text="Cancel"
          btntrasnparent
        />
        {/* <Button
          variant="outlined"
          onClick={() => alert("Resolve Ticket clicked")}
          sx={{
            borderRadius: "30px",
            border: "1px solid transparent",
            background: "rgba(63, 140, 255, .15)",
            color: "var(--pri-color)",
            textTransform: "capitalize",
            p: "12px 40px",
          }}
        >
          <CheckCircleIcon sx={{ mr: 1, color: "var(--pri-color)" }} /> Resolve
          Ticket
        </Button> */}
      </Box>
    </Box>
  );
};

export default ReplyForm;
