/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, Typography, DialogContent, DialogActions, Button } from "@mui/material";

export default function InfoScreen({ open, setOpen }) {

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
            >
                <DialogTitle
                    sx={{ textAlign: "center" }}
                >INFO
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{textAlign: "center"}}>
                        Syötä sen Nyssen bussin linjanumero tekstikenttään, jonka kyydissä olet ja paina "Seuraa linjaa" -nappia.
                        <br />
                        <br />
                        Näytämme ja kuulutamme sinulle, kun bussi on saapumassa seuraavalle pysäkille.
                        <br />
                        <br />
                        Voit lopettaa seurannan painamalla "Lopeta seuranta" -nappia.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                    >
                        Sulje
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}