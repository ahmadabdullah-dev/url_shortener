import { useState } from "react";
import type { PaginationParams } from "../../lib/types/common";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Pagination,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import MouseIcon from "@mui/icons-material/Mouse";

import { useCurrentUserUrls } from "../../lib/hooks/useUrl";
import { Shared } from "../../lib/shared";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Tooltip title={copied ? "Copied!" : "Copy short code"}>
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5 }}>
        {copied ? (
          <CheckIcon fontSize="small" sx={{ color: "success.main" }} />
        ) : (
          <ContentCopyIcon fontSize="small" sx={{ color: "text.secondary" }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default function CurrentUserUrls() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 9,
  });

  const data = useCurrentUserUrls(pagination);

  if (data.isPending) {
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton variant="text" width={160} height={48} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (data.isError) {
    return (
      <Alert severity="error" variant="outlined">
        {data.error.message}
      </Alert>
    );
  }

  if (!data.data) {
    return (
      <Alert severity="info" variant="outlined">
        No URLs found.
      </Alert>
    );
  }

  const list = data.data;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Section heading */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "0.06em" }}>
          My URLs
        </Typography>
        {list.items.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {list.items.length} of {list.totalPages * pagination.pageSize}
          </Typography>
        )}
      </Box>

      {list.items.length === 0 ? (
        <Alert severity="info" variant="outlined">
          No URLs found. Create your first short URL above.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {list.items.map((u) => (
            <Grid key={u.shortCode} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 150ms ease, background-color 150ms ease",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.25)",
                    bgcolor: "rgba(255,255,255,0.02)",
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Short code + copy */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, letterSpacing: "0.06em", fontFamily: "monospace" }}
                    >
                      {u.shortCode}
                    </Typography>
                    <CopyButton text={u.shortCode} />
                  </Box>

                  {/* Long URL — truncated with tooltip */}
                  <Tooltip title={u.longUrl} placement="top" arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "text.secondary", cursor: "default" }}
                    >
                      {u.longUrl}
                    </Typography>
                  </Tooltip>

                  {/* Status chip */}
                  <Box>
                    <Chip
                      label={u.isActive ? "Active" : "Inactive"}
                      color={u.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>

                  {/* Spacer */}
                  <Box sx={{ flex: 1 }} />

                  {/* Footer meta */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Created
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {Shared.formatDate(u.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Expires
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {Shared.formatDate(u.expiresAt)}
                      </Typography>
                    </Box>
                    <Tooltip title="Total clicks">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <MouseIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {u.clickCount}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {list.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={list.totalPages}
            page={list.currentPage}
            onChange={(_, page) => setPagination((p) => ({ ...p, page }))}
          />
        </Box>
      )}
    </Box>
  );
}
