import { Box, Container, Divider, Grid } from "@mui/material";
import CreateUrlShortCodeForm from "../../features/url/CreateUrlShortCodeForm";
import ReadUrlByShortCodeForm from "../../features/url/ReadUrlByShortCodeForm";
import CurrentUserUrls from "../../features/url/CurrentUserUrls";

export default function Dashboard() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid sx={{alignItems: "flex-start"}} container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CreateUrlShortCodeForm />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadUrlByShortCodeForm />
        </Grid>
      </Grid>

      <Divider sx={{ my: { xs: 4, md: 6 } }} />

      <Box>
        <CurrentUserUrls />
      </Box>
    </Container>
  );
}
