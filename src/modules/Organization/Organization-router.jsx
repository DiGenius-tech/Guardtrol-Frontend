import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrganizationLayout from './Organization-layout';
import OrganizationRegistration from './pages/OrganizationRegistration';

const OrganizationRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<OrganizationLayout />}>
        <Route path="register" element={<OrganizationRegistration />} />
        {/* Add more organization routes here in the future */}
        {/* <Route path="profile" element={<OrganizationProfile />} /> */}
        {/* <Route path="settings" element={<OrganizationSettings />} /> */}
      </Route>
    </Routes>
  );
};

export default OrganizationRouter;