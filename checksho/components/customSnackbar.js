// Left this in case issues nextjs with notistack

import MuiAlert from '@material-ui/lab/Alert';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props) {
    return (
        <MuiAlert
            elevation={6}
            variant="filled"
            {...props}
        />
    );
}

export default function CustomSnackbar(props) {
    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={props.open}
                autoHideDuration={2000}
                onClose={props.handleClose}
            >
                <Alert onClose={props.handleClose} severity="success">
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}


// const [snackbarOpen, setSnackbarOpen] = useState(false);
// const [snackbarMessage, setSnackbarMessage] = useState("");
// const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//         return;
//     }

//     setSnackbarOpen(false);
// }

// <CustomSnackbar open={snackbarOpen}
//     message={snackbarMessage}
//     handleClose={handleSnackbarClose}
// />

// On submit -> call 
// setSnackbarMessage("User saved");
// setSnackbarOpen(open);
