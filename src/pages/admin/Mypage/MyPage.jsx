import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminMyPageMain from './AdminMyPageMain.jsx';
import AdminProfileEditView from './AdminProfileEditView.jsx';

const AdminMyPage = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminMyPageMain />} />
      <Route path="profile" element={<AdminProfileEditView />} />
    </Routes>
  );
};

export default AdminMyPage;
