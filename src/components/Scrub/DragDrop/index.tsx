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
export default function FileUploader() {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
  }, []);

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
          bgcolor: isDragActive ? "grey.50" : "inherit",
        }}
      >
        <input {...getInputProps()} />
        <Stack direction="row" spacing={2} alignItems="center">
          <CloudUploadIcon sx={{ fontSize: 40, color: "#2BBBAC" }} />
          <Box>
            <Typography variant="body1" fontWeight="medium">
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
        spacing={3}
        alignItems="center"
        sx={{ mt: 2, width: "100%" }}
      >
        <Typography
          variant="body2"
          color="#183C58"
          sx={{
            p: 1,
            background: "#FAFAFA",
            borderRadius: "16px",
            fontSize: "12px",
          }}
        >
          <strong>File Extension:</strong> xls, xlsx, csv
        </Typography>
        <Link
          component="button"
          underline="hover"
          color="#183C58"
          sx={{
            p: 1,
            background: "#FAFAFA",
            borderRadius: "16px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Image src={infoicon} width={14} height={14} alt="info-icon" /> File
          Instruction!
        </Link>
      </Stack>

      {/* Selected File with Remove Option */}
      {fileName && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1, width: "100%", maxWidth: "900px" }}
        >
          <Typography variant="body2" color="text.primary">
            <strong>Selected File:</strong> {fileName}
          </Typography>
          <IconButton
            size="small"
            color="error"
            onClick={() => setFileName(null)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}
