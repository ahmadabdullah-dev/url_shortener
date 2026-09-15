import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useCreateUrlShortCodeAsync } from "../../lib/hooks/useUrl";
import type { CreateUrlDto } from "../../lib/types/url";
import { useState } from "react";

export default function CreateUrlShortCodeForm() {
  const createUrlAsync = useCreateUrlShortCodeAsync();
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUrlDto>();

  const onSubmit = (creds: CreateUrlDto) => {
    createUrlAsync.mutate(creds);
    setCopied(false);
  };

  const handleCopy = () => {
    if (createUrlAsync.data) {
      navigator.clipboard.writeText(createUrlAsync.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 4 }, border: "1px solid", borderColor: "divider" }}
    >
      {/* Heading */}
      <Stack direction="row"  spacing={1.5} sx={{ mb: 3 ,alignItems:"center"}}>
        <LinkIcon sx={{ color: "text.secondary", transform: "rotate(-45deg)" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.08em" }}>
          Create Short URL
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          <TextField
            label="Long URL"
            fullWidth
            placeholder="https://example.com/very/long/path"
            {...register("LongUrl", { required: "URL is required" })}
            error={!!errors.LongUrl}
            helperText={errors.LongUrl?.message}
            disabled={createUrlAsync.isPending}
          />

          <TextField
            label="Custom Code (optional)"
            fullWidth
            placeholder="e.g. my-link"
            {...register("CustomShortCode")}
            disabled={createUrlAsync.isPending}
          />

          <Controller
            name="ExpiresAt"
            control={control}
            render={({ field, fieldState }) => (
              <DateTimePicker
                label="Expiry Date & Time (optional)"
                value={field.value ? dayjs(field.value as string) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : "")
                }
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    disabled: createUrlAsync.isPending,
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={createUrlAsync.isPending}
          >
            {createUrlAsync.isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Shorten URL"
            )}
          </Button>

          {createUrlAsync.error && (
            <Alert severity="error" variant="outlined">
              {createUrlAsync.error.message}
            </Alert>
          )}

          {createUrlAsync.isSuccess && createUrlAsync.data && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                px: 2,
                py: 1.5,
                border: "1px solid",
                borderColor: "success.main",
                bgcolor: "rgba(0,210,106,0.05)",
              }}
            >
              <Chip
                label="Short URL ready"
                color="success"
                size="small"
                sx={{ flexShrink: 0 }}
              />
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "success.main",
                  fontWeight: 600,
                  mx: 1,
                }}
              >
                {createUrlAsync.data}
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                <IconButton size="small" onClick={handleCopy} color="success">
                  {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
