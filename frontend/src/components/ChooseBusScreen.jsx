/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Box
} from "@mui/material";

export default function ChooseBusScreen({ open, setOpen }) {
    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
                <DialogTitle sx={{ textAlign: "center" }}>
                    VALITSE BUSSI
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: "center", mb: "0.5rem" }}>
                        Havaitsimme useampia saman linjan busseja lähistöltä.
                        <br />
                        Valitse se bussi, jota haluat seurata.
                    </Typography>

                    <Divider
                        sx={{ borderBottom: "2px solid black", mb: "1rem" }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ textAlign: "center", mb: "0.5rem"}}>
                            Bussi 1: Suunta-suunta-suunta-suunta
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "20px", mb: "2rem" }}
                        >
                            Valitse
                        </Button>

                        <Typography sx={{ textAlign: "center", mb: "0.5rem"}}>
                            Bussi 2: Suunta-suunta-suunta-suunta
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "20px" }}
                        >
                            Valitse
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Sulje</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
