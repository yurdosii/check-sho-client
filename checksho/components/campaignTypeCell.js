import Chip from '@material-ui/core/Chip';
import React from 'react';

const colors = {
    "EMAIL": "rgb(130, 143, 155)",
    "TELEGRAM": "#26a6e7"
}


function CampaignTypeCell(props) {
    let label = props.type.toLowerCase();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    const style = {
        backgroundColor: colors[props.type],
        color: "#fff",
        marginRight: "0.1   rem"
    }

    return (
        <Chip label={label} style={style} />
    )

}

export default CampaignTypeCell;