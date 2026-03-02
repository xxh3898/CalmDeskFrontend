import React, { useState, useEffect } from "react";
import * as S from "./Dashboard.styles.js";
import useDashboardData from "./hooks/useDashboardData.js";
import { teamApi } from "../../../api/teamApi.js";

import DashboardBanner from "./components/DashboardBanner.jsx";
import DashboardStats from "./components/DashboardStats.jsx";
import DashboardChart from "./components/DashboardChart.jsx";
import StressTopList from "./components/StressTopList.jsx";
import MemberDetailModal from "../TeamManagement/components/MemberDetailModal.jsx";

const AdminDashboard = () => {
  const { realtimeData, yesterdayData, loading, error } = useDashboardData();
  const [selectedMember, setSelectedMember] = useState(null);


  if (loading) {
    return (
      <S.Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "400px",
            color: "#94a3b8",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          데이터를 불러오는 중...
        </div>
      </S.Container>
    );
  }

  if (error) {
    return (
      <S.Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "400px",
            color: "#f43f5e",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          데이터를 불러올 수 없습니다: {error}
        </div>
      </S.Container>
    );
  }

  const handleSelectMember = async (member) => {
    try {
      const fullData = await teamApi.getMemberDetail(member.memberId);

      const adaptedMember = {
        id: fullData.memberId,
        name: fullData.name,
        avatar: '👤',
        dept: fullData.departmentName,
        stress: fullData.stress,
        role: fullData.rankName || "-",
        phone: fullData.phone || "-",
        email: fullData.email || "-",
        joinDate: fullData.joinDate || "-",
        status: fullData.attendanceStatus || "-",
        metrics: {
          cooldowns: fullData.cooldownCount || 0,
          leave: fullData.remainingLeave || "-",
          alerts: 0,
        },
      };
      setSelectedMember(adaptedMember);
    } catch (err) {
      console.error("팀원 상세 정보 로드 실패:", err);
      // fallback if fetch fails
      const adaptedMember = {
        id: member.memberId,
        name: member.memberName,
        dept: member.departmentName,
        stress: member.stressPercentage,
        role: "-",
        phone: "-",
        email: "-",
        joinDate: "-",
        status: "-",
        metrics: {
          cooldowns: 0,
          leave: "-",
          alerts: 0,
        },
      };
      setSelectedMember(adaptedMember);
    }
  };

  return (
    <S.Container>
      <DashboardBanner companyStats={realtimeData.companyStats} />
      <DashboardStats
        companyStats={realtimeData.companyStats}
        yesterdayStats={yesterdayData?.companyStats}
      />
      <S.MainGrid>
        <DashboardChart
          departmentStats={realtimeData.departmentStats}
          yesterdayDeptStats={yesterdayData?.departmentStats}
        />
        <StressTopList
          highRiskMembers={realtimeData.highRiskMembers}
          departmentStats={realtimeData.departmentStats}
          onSelectMember={handleSelectMember}
        />
      </S.MainGrid>
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </S.Container>
  );
};

export default AdminDashboard;
