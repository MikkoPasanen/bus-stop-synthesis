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
                >Info</DialogTitle>
                <DialogContent>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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