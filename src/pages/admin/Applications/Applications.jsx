import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardList,
  Plane,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import * as S from './Applications.styles.js';
import { applicationsApi } from '../../../api/applicationsApi.js';

const statusMap = { 승인대기: '대기', 승인완료: '승인', 반려: '반려' };
const consultationStatusMap = { WAITING: '대기', IN_PROGRESS: '진행중', COMPLETED: '승인', CANCELLED: '취소' };

const AdminApplications = () => {
  const [activeSubTab, setActiveSubTab] = useState('LEAVE');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [consultationRequests, setConsultationRequests] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listPage, setListPage] = useState(0);

  const LIST_PAGE_SIZE = 6;

  const fetchLeaves = useCallback(async () => {
    try {
      const response = await applicationsApi.getLeaves();
      const data = response?.content || response || [];
      setLeaveRequests(data.map((item) => {
        const startDate = item.startDate ? new Date(item.startDate) : null;
        return {
          id: item.id,
          name: item.requestMemberName || '-',
          dept: item.departmentName || '-',
          type: item.type,
          period: item.period,
          status: statusMap[item.status] ?? item.status,
          reason: item.reason || '',
          day: startDate ? startDate.getDate() : null,
          date: item.startDate || null,
          avatar: '👤'
        };
      }));
    } catch (e) {
      setLeaveRequests([]);
      if (e.response?.status !== 401) {
        const msg = e.response?.data?.message || e.message || '휴가 목록 조회 실패';
        setError(msg);
      }
    }
  }, []);

  const fetchConsultations = useCallback(async () => {
    try {
      const response = await applicationsApi.getConsultations();
      const data = response?.content || response || [];
      setConsultationRequests(data.map((item) => {
        const created = item.createdDate ? new Date(item.createdDate) : null;
        return {
          id: item.id,
          name: item.memberName || '-',
          dept: item.departmentName || '-',
          type: item.title || '상담',
          time: created ? created.toLocaleString('ko-KR') : '-',
          status: consultationStatusMap[item.status] ?? item.status ?? '대기',
          message: item.description || '',
          day: created ? created.getDate() : null,
          date: item.createdDate || null,
          avatar: '👤'
        };
      }));
    } catch (e) {
      setConsultationRequests([]);
      if (e.response?.status !== 401) {
        const msg = e.response?.data?.message || e.message || '상담 목록 조회 실패';
        setError(msg);
      }
    }
  }, []);

  const fetchJoins = useCallback(async () => {
    try {
      const response = await applicationsApi.getJoins();
      const data = response?.content || response || [];
      setJoinRequests(data.map((item) => ({
        id: item.id,
        name: item.name,
        dept: item.departmentName || '-',
        position: item.rankName,
        department: item.departmentName,
        joinStatus: item.joinStatus,
        phone: item.phone,
        type: '입사 신청',
        status: item.joinStatus === 'PENDING' ? '대기' : (item.joinStatus === 'APPROVED' ? '승인' : '반려'),
        reason: `부서: ${item.departmentName || '-'} / 직급: ${item.rankName || '-'}`,
        avatar: '👤'
      })));
    } catch (e) {
      setJoinRequests([]);
      if (e.response?.status !== 401) {
        const msg = e.response?.data?.message || e.message || '입사 신청 목록 조회 실패';
        setError(msg);
      }
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchLeaves(), fetchConsultations(), fetchJoins()]);
    setLoading(false);
  }, [fetchLeaves, fetchConsultations, fetchJoins]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    setListPage(0);
  }, [statusFilter, activeSubTab]);

  const handleLeaveAction = async (vacationId, action) => {
    if (vacationId == null || vacationId === undefined) {
      setError('휴가 ID가 없습니다. 목록을 새로고침 후 다시 시도해주세요.');
      return;
    }
    setError(null);
    try {
      if (action === 'APPROVE') await applicationsApi.approveLeave(vacationId);
      else await applicationsApi.rejectLeave(vacationId);
      await fetchLeaves();
      setSelectedRequest(null);
      setSelectedDay(null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || '처리 실패';
      const status = e.response?.status;
      setError(status === 403 ? '권한이 없습니다. 관리자 계정으로 로그인해주세요.' : msg);
    }
  };

  const handleJoinAction = async (memberId, action) => {
    if (memberId == null || memberId === undefined) {
      setError('대상 ID가 없습니다. 목록을 새로고침 후 다시 시도해주세요.');
      return;
    }
    setError(null);
    try {
      if (action === 'APPROVE') await applicationsApi.approveJoin(memberId);
      else await applicationsApi.rejectJoin(memberId);
      await fetchJoins();
      setSelectedRequest(null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || '처리 실패';
      const status = e.response?.status;
      setError(status === 403 ? '권한이 없습니다. 관리자 계정으로 로그인해주세요.' : msg);
    }
  };

  const handleConsultationAction = async (consultationId, action) => {
    if (consultationId == null || consultationId === undefined) {
      setError('상담 ID가 없습니다. 목록을 새로고침 후 다시 시도해주세요.');
      return;
    }
    setError(null);
    try {
      if (action === 'APPROVE') await applicationsApi.completeConsultation(consultationId);
      else await applicationsApi.cancelConsultation(consultationId);
      await fetchConsultations();
      setSelectedRequest(null);
      setSelectedDay(null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || '처리 실패';
      const status = e.response?.status;
      setError(status === 403 ? '권한이 없습니다. 관리자 계정으로 로그인해주세요.' : msg);
    }
  };

  const filteredList = useMemo(() => {
    let list = [];
    if (activeSubTab === 'LEAVE') list = leaveRequests;
    else if (activeSubTab === 'CONSULTATION') list = consultationRequests;
    else if (activeSubTab === 'JOIN') list = joinRequests;

    if (statusFilter === '전체') return list;
    if (statusFilter === '반려') {
      return list.filter(req => req.status === '반려' || req.status === '취소');
    }
    return list.filter(req => req.status === statusFilter);
  }, [activeSubTab, statusFilter, leaveRequests, consultationRequests, joinRequests]);

  const paginatedList = useMemo(() => {
    const start = listPage * LIST_PAGE_SIZE;
    return filteredList.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredList, listPage]);

  const listTotalPages = Math.ceil(filteredList.length / LIST_PAGE_SIZE);

  const calendarGrid = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();
    const totalCells = 42;
    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const dayIndex = i - startWeekday + 1;
      if (dayIndex < 1 || dayIndex > daysInMonth) {
        cells.push(null);
        continue;
      }
      const day = dayIndex;
      const leaves = leaveRequests.filter((l) => {
        if (!l.date) return l.day === day;
        const d = new Date(l.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      });
      const consults = consultationRequests.filter((c) => {
        if (!c.date) return c.day === day;
        const d = new Date(c.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      });
      cells.push({ day, leaves, consults });
    }
    return cells;
  }, [calendarDate, leaveRequests, consultationRequests]);

  const getRequestsForSelectedDay = () => {
    if (selectedDay === null) return [];
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const leaves = leaveRequests
      .filter((l) => {
        if (!l.date) return l.day === selectedDay;
        const d = new Date(l.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
      })
      .map((l) => ({ ...l, category: 'LEAVE' }));
    const consults = consultationRequests
      .filter((c) => {
        if (!c.date) return c.day === selectedDay;
        const d = new Date(c.date);
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
      })
      .map((c) => ({ ...c, category: 'CONSULTATION' }));
    return [...leaves, ...consults];
  };

  const closeModal = () => {
    setSelectedDay(null);
    setSelectedRequest(null);
  };

  return (
    <S.Container>
      <S.Header>
        <S.TitleBox>
          <h2>
            <ClipboardList size={28} color="#818cf8" />
            통합 신청 매니저
          </h2>
          <p>Global Schedule & Request Control</p>
          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: 4 }}>{error}</p>}
          {loading && <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>불러오는 중...</p>}
        </S.TitleBox>
        <S.TabGroup>
          <S.TabButton
            active={activeSubTab === 'LEAVE'}
            onClick={() => setActiveSubTab('LEAVE')}
          >
            <Plane size={14} />
            휴가 관리
          </S.TabButton>
          <S.TabButton
            active={activeSubTab === 'CONSULTATION'}
            onClick={() => setActiveSubTab('CONSULTATION')}
          >
            <MessageSquare size={14} />
            상담 관리
          </S.TabButton>
          <S.TabButton
            active={activeSubTab === 'JOIN'}
            onClick={() => setActiveSubTab('JOIN')}
          >
            <UserPlus size={14} />
            입사 신청
          </S.TabButton>
        </S.TabGroup>
      </S.Header>

      <S.MainGrid>
        {/* Left Side: Calendar (Only show for Leave/Consultation) */}
        {activeSubTab !== 'JOIN' ? (
          <S.LeftColumn>
            <S.CalendarCard>
              <S.CalendarHeader>
                <S.MonthTitle>
                  <S.MonthIconBox>
                    <CalendarIcon size={24} />
                  </S.MonthIconBox>
                  <S.MonthText>
                    <h3>{calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월</h3>
                    <p>Calendar Overview</p>
                  </S.MonthText>
                </S.MonthTitle>
                <S.CalendarControls>
                  <S.NavButton
                    type="button"
                    onClick={() => setCalendarDate((prev) => {
                      const d = new Date(prev);
                      d.setMonth(d.getMonth() - 1);
                      return d;
                    })}
                  >
                    <ChevronLeft size={20} />
                  </S.NavButton>
                  <S.TodayButton
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const d = new Date(today.getFullYear(), today.getMonth(), 1);
                      setCalendarDate(d);
                      setSelectedDay(today.getDate());
                    }}
                  >
                    오늘
                  </S.TodayButton>
                  <S.NavButton
                    type="button"
                    onClick={() => setCalendarDate((prev) => {
                      const d = new Date(prev);
                      d.setMonth(d.getMonth() + 1);
                      return d;
                    })}
                  >
                    <ChevronRightIcon size={20} />
                  </S.NavButton>
                </S.CalendarControls>
              </S.CalendarHeader>

              <S.CalendarGrid>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <S.DayHeader key={day}>{day}</S.DayHeader>
                ))}
                {calendarGrid.map((cell, idx) => (
                  <S.DayCell
                    key={idx}
                    empty={!cell}
                    selected={cell && selectedDay === cell.day}
                    onClick={() => cell && setSelectedDay(cell.day)}
                  >
                    {cell && (
                      <>
                        <S.DayNumber
                          isWeekend={[0, 6].includes(idx % 7)}
                          selected={selectedDay === cell.day}
                        >
                          <span>{cell.day}</span>
                          {(cell.leaves.length > 0 || cell.consults.length > 0) && (
                            <S.IndicatorDots>
                              {cell.leaves.some(l => l.status === '대기') && <S.Dot color="amber" />}
                              {cell.consults.some(c => c.status === '대기') && <S.Dot color="rose" />}
                            </S.IndicatorDots>
                          )}
                        </S.DayNumber>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          {cell.leaves.slice(0, 2).map(l => (
                            <S.RequestItem key={l.id} status={l.status}>
                              {l.name}
                            </S.RequestItem>
                          ))}
                          {cell.consults.map(c => (
                            <S.RequestItem key={c.id} type="consultation">
                              [상담] {c.name}
                            </S.RequestItem>
                          ))}
                        </div>
                      </>
                    )}
                  </S.DayCell>
                ))}
              </S.CalendarGrid>
            </S.CalendarCard>
          </S.LeftColumn>
        ) : (
          /* Join Request Full Width View */
          <S.LeftColumn>
            <S.EmptyJoinView>
              <div>
                <UserPlus size={48} />
                <p>입사 신청 내역은 우측 리스트에서 확인 및 승인 처리할 수 있습니다.</p>
              </div>
            </S.EmptyJoinView>
          </S.LeftColumn>
        )}

        {/* Right Side: Quick List */}
        <S.RightColumn>
          <S.ListCard>
            <S.ListHeader>
              <S.ListTitle>
                <h3>처리 대기 리스트</h3>
                <p>Pending Queue</p>
              </S.ListTitle>
              <S.FilterGrid>
                {['전체', '대기', '승인', '반려'].map(status => (
                  <S.FilterChip
                    key={status}
                    type="button"
                    active={statusFilter === status}
                    onClick={(e) => {
                      e.preventDefault();
                      setStatusFilter(status);
                    }}
                  >
                    {status}
                  </S.FilterChip>
                ))}
              </S.FilterGrid>
            </S.ListHeader>

            <S.ScrollList>
              {paginatedList.map((req, idx) => (
                <S.ListItem
                  key={req.id || idx}
                  onClick={() => setSelectedRequest(req)}
                >
                  <S.ItemTop>
                    <S.ItemAvatar>
                      {req.avatar || '👤'}
                    </S.ItemAvatar>
                    <S.ItemInfo>
                      <h4>{req.name}</h4>
                      <p>{req.dept} {req.joinStatus ? '' : ''}</p>
                    </S.ItemInfo>
                    <S.StatusPill status={req.status}>
                      {req.status}
                    </S.StatusPill>
                  </S.ItemTop>
                  <S.ItemBottom>
                    <span>{req.type}</span>
                    <button>
                      자세히 <ChevronRight size={12} />
                    </button>
                  </S.ItemBottom>
                </S.ListItem>
              ))}
              {filteredList.length === 0 && (
                <S.EmptyList>내역이 없습니다.</S.EmptyList>
              )}
            </S.ScrollList>
            {filteredList.length > LIST_PAGE_SIZE && (
              <S.Pagination>
                <button
                  type="button"
                  disabled={listPage <= 0}
                  onClick={() => setListPage((p) => p - 1)}
                >
                  이전
                </button>
                <span>
                  {listPage + 1} / {listTotalPages}
                </span>
                <button
                  type="button"
                  disabled={listPage >= listTotalPages - 1}
                  onClick={() => setListPage((p) => p + 1)}
                >
                  다음
                </button>
              </S.Pagination>
            )}
          </S.ListCard>
        </S.RightColumn>
      </S.MainGrid>

      {/* Detail Modal */}
      {(selectedDay !== null || selectedRequest !== null) && (
        <S.ModalOverlay>
          <S.Backdrop onClick={closeModal} />
          <S.ModalContainer>
            <S.ModalHeader>
              <S.ModalTitle>
                <S.ModalIconBox>
                  {selectedRequest && selectedRequest.type === '입사 신청' ? <UserPlus size={28} color="white" /> : <CalendarIcon size={28} color="white" />}
                </S.ModalIconBox>
                <S.ModalTexts>
                  <h3>
                    {selectedRequest ? `${selectedRequest.name}님 상세 신청` : `${calendarDate.getFullYear()}년 ${calendarDate.getMonth() + 1}월 ${selectedDay}일 신청 현황`}
                  </h3>
                  <p>Daily Review & Decisions</p>
                </S.ModalTexts>
              </S.ModalTitle>
              <S.CloseButton onClick={closeModal}>
                <X size={24} color="white" />
              </S.CloseButton>
            </S.ModalHeader>

            <S.ModalBody>
              {(selectedRequest ? [selectedRequest] : getRequestsForSelectedDay()).map((req, i) => (
                <S.DetailCard key={req.id || i}>
                  <S.DetailHeader>
                    <S.PersonInfo>
                      <S.PersonAvatar>
                        {req.avatar || '👤'}
                      </S.PersonAvatar>
                      <S.PersonTexts>
                        <h4>{req.name}</h4>
                        <p>{req.dept} • {req.type}</p>
                      </S.PersonTexts>
                    </S.PersonInfo>
                    <S.StatusPill status={req.status} style={{ fontSize: '0.625rem' }}>
                      {req.status}
                    </S.StatusPill>
                  </S.DetailHeader>

                  <S.ContentBox>
                    {req.type === '입사 신청' ? (
                      <>
                        <S.JoinInfo style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                          <p>지원 직급: {req.position}</p>
                          <p>연락처: {req.phone}</p>
                        </S.JoinInfo>
                      </>
                    ) : (
                      <>
                        <p>사유 / 메시지</p>
                        <p>{req.reason || req.message || '입력된 상세 내용이 없습니다.'}</p>
                      </>
                    )}
                  </S.ContentBox>

                  {req.status === '대기' && (
                    <S.ActionButtons>
                      <S.ActionBtn
                        $variant="approve"
                        onClick={() => {
                          if (req.type === '입사 신청') handleJoinAction(req.id, 'APPROVE');
                          else if (['연차', '반차', '워케이션'].includes(req.type)) handleLeaveAction(req.id, 'APPROVE');
                          else handleConsultationAction(req.id, 'APPROVE');
                        }}
                      >
                        <CheckCircle2 size={16} /> 승인
                      </S.ActionBtn>
                      <S.ActionBtn
                        $variant="reject"
                        onClick={() => {
                          if (req.type === '입사 신청') handleJoinAction(req.id, 'REJECT');
                          else if (['연차', '반차', '워케이션'].includes(req.type)) handleLeaveAction(req.id, 'REJECT');
                          else handleConsultationAction(req.id, 'REJECT');
                        }}
                      >
                        <XCircle size={16} /> 반려
                      </S.ActionBtn>
                    </S.ActionButtons>
                  )}
                </S.DetailCard>
              ))}
            </S.ModalBody>
            <S.ModalFooter>
              <button onClick={closeModal}>닫기</button>
            </S.ModalFooter>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default AdminApplications;
