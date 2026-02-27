import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyPageMain from './MyPageMain.jsx';
import ProfileEditView from './ProfileEditView.jsx';
import CouponWalletView from './CouponWalletView.jsx';
import PointHistoryView from './PointHistoryView.jsx';

const MyPage = () => {
  return (
    <Routes>
      <Route path="/" element={<MyPageMain />} />
      <Route path="profile" element={<ProfileEditView />} />
      <Route path="coupons" element={<CouponWalletView />} />
      <Route path="points" element={<PointHistoryView />} />
    </Routes>
  );
};

export default MyPage;
