import React from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';

const MuiTest = () => {
  return (
    <div>
      <ButtonUsage />
      <ThreeDRotation />

      <hr />

      <Badge badgeContent={4} color="primary">
      </Badge>
    </div>
  );
};

function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export default MuiTest;
