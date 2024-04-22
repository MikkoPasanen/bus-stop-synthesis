/* eslint-disable react/prop-types */
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";

import HelpIcon from "@mui/icons-material/Help";

export default function TopAppBar({ setOpen }) {

    return (
        <AppBar position="static">
            <Toolbar>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Pysäkkikuulutukset
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="help"
                        onClick={() => setOpen(true)}
                    >
                        <HelpIcon sx={{ fontSize: "40px" }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
