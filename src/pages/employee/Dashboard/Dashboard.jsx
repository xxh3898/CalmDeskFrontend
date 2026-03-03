import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/useStore.js";
import StressGauge from "../../../components/StressGauge.jsx";
import WeeklyChart from "../../../components/WeeklyChart.jsx";
import apiClient from "../../../api/axios.js";
import { startCoolDown } from "../../../api/dashboardApi.js";
import {
  Play,
  Coffee,
  Calendar,
  Clock,
  Info,
  AlertCircle,
  TrendingDown,
  ChevronRight,
  Smile,
  X,
  Send,
  Heart,
  MessageSquare,
  SmilePlus,
  Pause,
} from "lucide-react";

import * as S from "./Dashboard.styles.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { attendance, setClockIn, setAway, setCoolDown } = useStore();
  const { isClockedIn, isAway, isCoolDown, coolDownStartTime } = attendance;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState("thisWeek"); // 'thisWeek' | 'lastWeek'
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 모달 상태
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [modalType, setModalType] = useState("IN");

  // 입력 상태
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [memo, setMemo] = useState("");

  const emotions = [
    { id: 1, emoji: "😄", label: "최고" },
    { id: 2, emoji: "😊", label: "좋음" },
    { id: 3, emoji: "😐", label: "보통" },
    { id: 4, emoji: "😟", label: "우울" },
    { id: 5, emoji: "😫", label: "힘듦" },
  ];

  const stressFactors = [
    "업무량 과다",
    "까다로운 고객",
    "시스템 장애",
    "동료 관계",
    "개인 사정",
    "컨디션 난조",
    "기타",
  ];

  const fetchDashboardData = async (updateStore = false) => {
    try {
      const response = await apiClient.get("/employee/dashboard");
      setDashboardData(response.data);

      // 백엔드 상태와 스토어 동기화
      const status = response.data.attendanceStats.currentStatus;

      if (!updateStore) return;

      switch (status) {
        case "업무 중":
          setClockIn(true);
          setAway(false);
          setCoolDown(false);
          break;
        case "자리 비움":
          setClockIn(true);
          setAway(true);
          setCoolDown(false);
          break;
        case "쿨다운":
          setClockIn(true);
          setAway(false);
          setCoolDown(true, response.data.attendanceStats.startTime);
          break;
        default: // 업무 준비, 퇴근 완료 등
          setClockIn(false);
          setAway(false);
          setCoolDown(false);
          break;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockButtonClick = () => {
    setModalType(isClockedIn ? "OUT" : "IN");
    // 이전 상태 초기화
    setSelectedEmotion(null);
    setSelectedFactors([]);
    setMemo("");
    setIsEmotionModalOpen(true);
  };

  const toggleFactor = (factor) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  const handleModalSubmit = async () => {
    if (selectedEmotion === null) {
      alert("기분을 선택해 주세요!");
      return;
    }

    try {
      const payload = {
        stressLevel: selectedEmotion,
        stressFactors: selectedFactors,
        memo: memo,
      };

      if (modalType === "START") {
        await startCoolDown(payload);
        setCoolDown(true, Date.now());
        await fetchDashboardData(false);
      } else if (modalType === "END") {
        await apiClient.post("/employee/dashboard/status", {
          status: "WORKING",
        });
        await fetchDashboardData(true);
      } else if (modalType === "IN") {
        await apiClient.post("/employee/dashboard/status/clock-in", payload);
        await fetchDashboardData(true);
        alert("출근 처리가 완료되었습니다.");
      } else if (modalType === "OUT") {
        await apiClient.post("/employee/dashboard/status/clock-out", payload);
        await fetchDashboardData(true);
        alert("퇴근 처리가 완료되었습니다.");
      }

      setIsEmotionModalOpen(false);
    } catch (error) {
      console.error("실패:", error);
      alert("처리에 실패했습니다.");
    }
  };

  const [timeLeft, setTimeLeft] = useState(0);

  const handleCoolDown = () => {
    if (isCoolDown) {
      if (window.confirm("쿨다운을 중단하시겠습니까?")) {
        updateStatus("WORKING");
        setCoolDown(false, null);
        setModalType("END");
        setSelectedEmotion(null);
        setSelectedFactors([]);
        setMemo("");
        setIsEmotionModalOpen(true);
      }
    } else {
      setModalType("START");
      setSelectedEmotion(null);
      setSelectedFactors([]);
      setMemo("");
      setIsEmotionModalOpen(true);
    }
  };

  const updateStatus = async (status) => {
    try {
      await apiClient.post("/employee/dashboard/status", { status });
      await fetchDashboardData(true);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const stopCooldown = () => {
    setTimeLeft(0);
  };

  useEffect(() => {
    let interval;

    if (coolDownStartTime && !isLoading) {
      const checkTimer = () => {
        const now = Date.now();
        const start = new Date(coolDownStartTime).getTime();
        const elapsed = Math.floor((now - start) / 1000);
        const remaining = 5 - elapsed; // 테스트를 위해 30초 설정

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);

          setCoolDown(false, null);

          setModalType("END");
          setSelectedEmotion(null);
          setSelectedFactors([]);
          setMemo("");
          setIsEmotionModalOpen(true);
        } else {
          setTimeLeft(remaining);
        }
      };

      checkTimer();
      interval = setInterval(checkTimer, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [coolDownStartTime, setCoolDown, isLoading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAway = () => {
    if (isAway) {
      updateStatus("WORKING");
    } else {
      updateStatus("AWAY");
    }
  };

  if (isLoading) {
    return <S.Container>Loading...</S.Container>;
  }

  if (!dashboardData) {
    return <S.Container>데이터를 불러올 수 없습니다.</S.Container>;
  }

  return (
    <S.Container>
      {/* Top Greeting & Quick Actions */}
      <S.GreetingSection>
        <S.UserInfo>
          <S.UserAvatar>
            <Smile className="w-8 h-8" />
          </S.UserAvatar>
          <S.GreetingText>
            <h1>안녕하세요, {dashboardData.userProfile.name}님!</h1>
            <p>
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              <span className="mx-1">•</span>
              상태:{" "}
              <S.StatusBadge
                $status={
                  isCoolDown
                    ? "cooldown"
                    : isAway
                      ? "away"
                      : isClockedIn
                        ? "working"
                        : "ready"
                }
              >
                {isCoolDown
                  ? "쿨다운"
                  : isAway
                    ? "자리비움"
                    : isClockedIn
                      ? "업무 중"
                      : dashboardData.attendanceStats.currentStatus ||
                      "업무 준비 중"}
              </S.StatusBadge>
            </p>
          </S.GreetingText>
        </S.UserInfo>

        <S.ActionGroup>
          <S.ActionButton
            onClick={handleClockButtonClick}
            $variant={isClockedIn ? "danger" : "primary"}
            disabled={dashboardData.attendanceStats.currentStatus === "퇴근"}
          >
            {dashboardData.attendanceStats.currentStatus === "퇴근"
              ? "퇴근 완료"
              : isClockedIn
                ? "퇴근하기"
                : "출근하기"}
          </S.ActionButton>

          <S.ActionButton
            onClick={handleAway}
            $variant={isAway ? "away" : "neutral"}
            disabled={!isClockedIn || isCoolDown}
          >
            {isAway ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            자리비움
          </S.ActionButton>

          <S.ActionButton
            onClick={handleCoolDown}
            disabled={!isClockedIn || isAway}
            $variant={isCoolDown ? "orange" : "neutral"}
          >
            <Coffee className="w-4 h-4" />
            <span>
              {isCoolDown ? `쿨다운 ${formatTime(timeLeft)}` : "쿨다운"}
            </span>
          </S.ActionButton>
        </S.ActionGroup>
      </S.GreetingSection>

      {/* Stats Grid */}
      <S.StatsGrid>
        <S.StatCard $align="center">
          <S.StatHeader $mb="1rem">
            <span>최근 7일 스트레스 지수</span>
            <AlertCircle />
          </S.StatHeader>
          <StressGauge percentage={dashboardData.stressStats.score} />
          <S.StatSubtext $tag>{dashboardData.stressStats.status}</S.StatSubtext>
        </S.StatCard>

        <S.StatCard>
          <S.StatHeader>
            <span>이번 달 출근율</span>
            <Calendar />
          </S.StatHeader>
          <S.StatContent>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <div>
                <S.StatValue>
                  {dashboardData.attendanceStats.attendanceRate}%
                </S.StatValue>
                <S.StatSubtext>
                  {dashboardData.attendanceStats.statusMessage}
                </S.StatSubtext>
              </div>
              <div
                style={{ width: "4rem", height: "4rem", position: "relative" }}
              >
                <svg
                  viewBox="0 0 36 36"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: "rotate(-90deg)",
                  }}
                >
                  <path
                    stroke="#f1f5f9"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${dashboardData.attendanceStats.attendanceRate}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatHeader>
            <span>잔여 연차</span>
            <Info />
          </S.StatHeader>
          <S.StatContent>
            <S.StatValue>
              {dashboardData.vacationStats.remainingDays}{" "}
              <S.StatUnit>일</S.StatUnit>
            </S.StatValue>
            <S.ProgressBar>
              <S.ProgressFill
                $width={`${(dashboardData.vacationStats.usedDays /
                  dashboardData.vacationStats.totalDays) *
                  100
                  }%`}
              />
            </S.ProgressBar>
            <S.StatSubtext>
              사용 연차: {dashboardData.vacationStats.usedDays}일 / 총{" "}
              {dashboardData.vacationStats.totalDays}일
            </S.StatSubtext>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard $variant="primary">
          <div style={{ position: "relative", zIndex: 10 }}>
            <S.StatHeader $light>
              <span>포인트</span>
            </S.StatHeader>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "flex-end",
                gap: "0.5rem",
              }}
            >
              <S.StatValue $light>
                {dashboardData.pointStats.amount.toLocaleString()}
              </S.StatValue>
              <span
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.875rem",
                  marginBottom: "0.25rem",
                }}
              >
                P
              </span>
            </div>
            <S.PointButton onClick={() => navigate("/app/pointmall")}>
              포인트 몰 가기 <ChevronRight size={12} />
            </S.PointButton>
          </div>
          <TrendingDown
            style={{
              position: "absolute",
              bottom: "-1rem",
              right: "-1rem",
              width: "8rem",
              height: "8rem",
              opacity: 0.1,
              transform: "rotate(12deg)",
            }}
          />
        </S.StatCard>
      </S.StatsGrid>

      {/* Main Analysis Chart */}
      <S.ChartSection>
        <S.ChartHeader>
          <div>
            <h3>주간 스트레스 분석</h3>
            <p>상담 난이도 및 빈도에 따른 스트레스 추이</p>
          </div>
          <S.ChartToggle>
            <S.ToggleButton
              $active={selectedWeek === "thisWeek"}
              onClick={() => setSelectedWeek("thisWeek")}
            >
              이번 주
            </S.ToggleButton>
            <S.ToggleButton
              $active={selectedWeek === "lastWeek"}
              onClick={() => setSelectedWeek("lastWeek")}
            >
              지난 주
            </S.ToggleButton>
          </S.ChartToggle>
        </S.ChartHeader>
        <S.ChartWrapper>
          <WeeklyChart data={dashboardData.weeklyStressChart[selectedWeek]} />
        </S.ChartWrapper>
      </S.ChartSection>

      {/* Emotion Modal */}
      {isEmotionModalOpen && (
        <S.ModalOverlay>
          <S.Backdrop onClick={() => setIsEmotionModalOpen(false)} />
          <S.ModalContent>
            <S.ModalHeader $type={modalType}>
              <S.CloseRow>
                <S.IconBadge>
                  {modalType === "IN" ? (
                    <SmilePlus size={24} />
                  ) : (
                    <Heart size={24} />
                  )}
                </S.IconBadge>
                <S.CloseButton onClick={() => setIsEmotionModalOpen(false)}>
                  <X size={24} />
                </S.CloseButton>
              </S.CloseRow>
              <S.ModalTitle>
                {modalType === "IN"
                  ? "오늘 하루, 어떻게 시작하시나요?"
                  : "오늘 하루, 어떠셨나요?"}
              </S.ModalTitle>
              <S.ModalSub>
                상담원님의 소중한 마음 상태를 기록해 주세요.
              </S.ModalSub>
            </S.ModalHeader>

            <S.ModalBody>
              {/* Emotion Selection */}
              <div>
                <S.FormLabel>
                  <Smile size={16} className="text-indigo-500" />
                  현재 기분 선택
                </S.FormLabel>
                <S.MoodGrid>
                  {emotions.map((emotion) => (
                    <S.MoodButton
                      key={emotion.id}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      $active={selectedEmotion === emotion.id}
                    >
                      <span>{emotion.emoji}</span>
                      <span>{emotion.label}</span>
                    </S.MoodButton>
                  ))}
                </S.MoodGrid>
              </div>

              {/* Stress Factors */}
              <div>
                <S.FormLabel>
                  <AlertCircle size={16} className="text-indigo-500" />
                  주요 스트레스 요인 (중복 선택)
                </S.FormLabel>
                <S.FactorGrid>
                  {stressFactors.map((factor) => (
                    <S.FactorButton
                      key={factor}
                      onClick={() => toggleFactor(factor)}
                      $active={selectedFactors.includes(factor)}
                    >
                      {factor}
                    </S.FactorButton>
                  ))}
                </S.FactorGrid>
              </div>

              {/* Memo */}
              <div>
                <S.FormLabel>
                  <MessageSquare size={16} className="text-indigo-500" />
                  특이사항 및 메모
                </S.FormLabel>
                <S.MemoTextarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="오늘 팀장님께 하고 싶은 말이나, 기록하고 싶은 점을 적어주세요."
                />
              </div>

              <S.SubmitModalButton
                onClick={handleModalSubmit}
                $type={modalType}
              >
                <Send size={20} />
                {modalType === "IN"
                  ? "출근 완료"
                  : modalType === "OUT"
                    ? "퇴근 완료"
                    : "쿨다운 체크인"}
              </S.SubmitModalButton>
            </S.ModalBody>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default Dashboard;
