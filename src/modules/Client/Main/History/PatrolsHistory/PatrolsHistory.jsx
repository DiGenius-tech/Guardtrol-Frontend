import React from "react";
import Patrols from "../../Dashboard/Patrols/Patrols";
import { Card } from "flowbite-react";

const PatrolsHistory = () => {
  return (
    <>
      {/* patrols-history-app works! */}
      <div className="hidden sm:block">
        <Card>
          <Patrols />
        </Card>
      </div>
      <div className="sm:hidden rounded-lg bg-white p-2">
        <Patrols />
      </div>
    </>
  );
};

export default PatrolsHistory;
