import { useState, useEffect } from "react";
import { useConfirmEmailAsync, useResendEmailConfirmationCodeAsync } from "../../lib/hooks/useAuth";
import { useCurrentUser } from "../../lib/hooks/useUser";
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useForm } from "react-hook-form";

export default function ConfirmEmailForm() {
  const currentUser = useCurrentUser();
  const confirmEmailAsync = useConfirmEmailAsync();
  const resendEmailConfirmationCodeAsync = useResendEmailConfirmationCodeAsync();
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const COOLDOWN_MAX = 30;

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<{ email: string; code: string }>({
    values: { email: currentUser.data?.email ?? "", code: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = (data: { email: string; code: string }) => {
    confirmEmailAsync.mutateAsync(data.code, {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        resetField("code");
      },
    });
  };

  const handleResend = () => {
    resendEmailConfirmationCodeAsync.mutateAsync(undefined, {
      onSuccess: (res) => {
        setResendMessage(res?.message);
        setCooldown(COOLDOWN_MAX);
      },
      onError: () => {
        setResendMessage("Failed to resend code. Please try again.");
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={1} sx={{ mb: 4, alignItems:"center" }}>
            <MarkEmailReadIcon sx={{ fontSize: 40, color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Confirm Your Email
            </Typography>
            {currentUser.data?.email && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                We sent a confirmation code to{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  {currentUser.data.email}
                </Typography>
              </Typography>
            )}
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                label="Confirmation Code"
                fullWidth
                placeholder="Enter the 6-digit code"
                {...register("code", { required: "Code is required" })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={confirmEmailAsync.isPending}
              >
                {confirmEmailAsync.isPending ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Confirm Email"
                )}
              </Button>

              {confirmEmailAsync.error && (
                <Alert severity="error" variant="outlined">
                  {confirmEmailAsync.error.message}
                </Alert>
              )}

              {cooldown > 0 && (
                <Box>
                  <Stack direction="row"  sx={{ mb: 0.75,alignItems:"center", justifyContent:"space-between"  }}>
                    <Typography variant="caption" color="text.secondary">
                      Resend available in
                    </Typography>
                    <Chip
                      label={`${cooldown}s`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontFamily: "monospace" }}
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={((COOLDOWN_MAX - cooldown) / COOLDOWN_MAX) * 100}
                    sx={{ height: 2 }}
                  />
                </Box>
              )}

              <Button
                variant="outlined"
                fullWidth
                disabled={resendEmailConfirmationCodeAsync.isPending || cooldown > 0}
                onClick={handleResend}
              >
                {resendEmailConfirmationCodeAsync.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Resend Confirmation Code"
                )}
              </Button>

              {resendMessage && (
                <Alert
                  severity={resendEmailConfirmationCodeAsync.isError ? "error" : "success"}
                  variant="outlined"
                >
                  {resendMessage}
                </Alert>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}