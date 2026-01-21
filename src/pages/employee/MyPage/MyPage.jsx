import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyPageMain from './MyPageMain';
import ProfileEditView from './ProfileEditView';
import CouponWalletView from './CouponWalletView';
import PointHistoryView from './PointHistoryView';
import NotificationCenterView from './NotificationCenterView';

const MyPage = () => {
  return (
    <Routes>
      <Route path="/" element={<MyPageMain />} />
      <Route path="profile" element={<ProfileEditView />} />
      <Route path="coupons" element={<CouponWalletView />} />
      <Route path="points" element={<PointHistoryView />} />
      <Route path="notifications" element={<NotificationCenterView />} />
    </Routes>
  );
};

export default MyPage;
