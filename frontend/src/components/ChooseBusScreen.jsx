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
    Box,
} from "@mui/material";

export default function ChooseBusScreen({
    open,
    setOpen,
    lineDesc,
    lineDescReversed,
    onSelect,
}) {
    const handleBusSelection = (busId) => {
        setOpen(false); // Close the dialog
        onSelect(busId); // Pass the selected bus ID to the parent component
    };

    var firstBusDescription = lineDesc ? lineDesc.description : "";
    var secondBusDescription = lineDescReversed
        ? lineDescReversed.description
        : "";

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
                        <Typography sx={{ textAlign: "center", mb: "0.5rem" }}>
                            Bussi 1: {firstBusDescription}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "20px", mb: "2rem" }}
                            onClick={() => handleBusSelection(lineDesc.id)}
                        >
                            Valitse
                        </Button>

                        <Typography sx={{ textAlign: "center", mb: "0.5rem" }}>
                            Bussi 2: {secondBusDescription}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "20px" }}
                            onClick={() =>
                                handleBusSelection(lineDescReversed.id)
                            }
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
