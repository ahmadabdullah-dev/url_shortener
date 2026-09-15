import { useState } from "react";
import { useGetUrlByShortCodeAsync } from "../../lib/hooks/useUrl";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Shared } from "../../lib/shared";

export default function ReadUrlByShortCodeForm() {
  const [shortCode, setShortCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");

  const getUrl = useGetUrlByShortCodeAsync(searchedCode);

  const handleSearch = () => {
    if (shortCode.trim()) setSearchedCode(shortCode.trim());
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 4 }, border: "1px solid", borderColor: "divider" }}
    >
      {/* Heading */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <SearchIcon sx={{ color: "text.secondary" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.08em" }}>
          Lookup Short URL
        </Typography>
      </Box>

      {/* Search bar */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          label="Short code"
          placeholder="e.g. my-link"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!shortCode.trim() || getUrl.isFetching}
          sx={{ minWidth: 100, height: 40 }}
        >
          {getUrl.isFetching ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Search"
          )}
        </Button>
      </Box>

      {/* Error */}
      {getUrl.isError && (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
          {getUrl.error.message}
        </Alert>
      )}

      {/* Result card */}
      {getUrl.data && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent sx={{ pb: "16px !important" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Original URL */}
              <Box sx={{ bgcolor: "action.hover", px: 2, py: 1.5 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  Original URL
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    component="a"
                    href={getUrl.data.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      flex: 1,
                      wordBreak: "break-all",
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {getUrl.data.longUrl}
                  </Typography>
                  <OpenInNewIcon
                    sx={{ fontSize: 14, color: "text.secondary", flexShrink: 0, mt: 0.25 }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Meta row */}
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}
                  >
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {Shared.formatDate(getUrl.data.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}
                  >
                    Expires
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {Shared.formatDate(getUrl.data.expiresAt)}
                  </Typography>
                </Box>
                {getUrl.data.isActive !== undefined && (
                  <Box sx={{ display: "flex", alignItems: "flex-end", pb: 0.25 }}>
                    <Chip
                      label={getUrl.data.isActive ? "Active" : "Inactive"}
                      color={getUrl.data.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
}
