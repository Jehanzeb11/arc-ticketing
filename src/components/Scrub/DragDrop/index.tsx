"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Link,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Close"; // close "x" icon
import infoicon from "@/assets/scruber/icons/info-icon.png";
import Image from "next/image";
import Upload from "@/assets/scruber/icons/upload.png";
export default function FileUploader({ handleFileUpload }: any) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFileName(acceptedFiles[0].name);
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {/* Drop Zone */}
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: "#2BBBAC",
          borderRadius: 2,
          p: 4,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          bgcolor: "#FAFAFA",
        }}
      >
        <input {...getInputProps()} />
        <Stack direction="row" spacing={2} alignItems="center">
          <CloudUploadIcon sx={{ fontSize: 40, color: "#2BBBAC" }} />
          <Box>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ color: "#183C58" }}
            >
              Drag & drop your file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your file for batch processing
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          sx={{
            borderRadius: "20px",
            px: 3,
            color: "white",
            backgroundColor: "#2BBBAC",
            boxShadow: "none",
            textTransform: "capitalize",
          }}
        >
          Choose File
        </Button>
      </Paper>

      {/* File Info */}
      <Stack
        direction="row"
        spacing={fileName ? 3 : 0}
        alignItems="center"
        sx={{ mt: 2, width: "100%" }}
      >
        <Typography
          variant="body2"
          color="#183C58"
          sx={{
            background: "#FAFAFA",
            borderRadius: "12px",
            fontSize: "12px",
          }}
        >
          {fileName && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: "900px",
                p: 1.2,
                position: "relative",
              }}
            >
              <Typography variant="body2" sx={{ p: 0, fontSize: "12px" }}>
                <strong>Selected File: </strong> {fileName}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setFileName(null)}
                sx={{
                  position: "absolute",
                  top: -7,
                  right: -7,
                  color: "white",
                  background: "#E33629",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                }}
              >
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Box>
          )}
        </Typography>
        <Link
          component="button"
          underline="hover"
          color="#183C58"
          sx={{
            p: 1,
            background: "#FAFAFA",
            borderRadius: "10px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Image src={infoicon} width={16} height={16} alt="info-icon" /> File
          Instruction!
        </Link>
      </Stack>
    </Box>
  );
}
