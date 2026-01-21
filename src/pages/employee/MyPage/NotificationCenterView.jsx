import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { NOTIFICATIONS_DATA } from '../../../constants/constants';
import * as S from './MyPage.styles';

const NotificationCenterView = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const filteredNotifications = NOTIFICATIONS_DATA.filter(n => filter === 'ALL' || (filter === 'UNREAD' && !n.read));

  const groupedNotifications = filteredNotifications.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  return (
    <S.SubPageContainer>
      <S.SubPageHeader>
        <S.HeaderLeft>
          <S.BackButton onClick={() => navigate('/app/mypage')}>
            <ArrowLeft size={24} />
          </S.BackButton>
          <S.SubTitleGroup>
            <h2>알림 센터</h2>
            <p>중요한 소식과 업데이트를 확인하세요.</p>
          </S.SubTitleGroup>
        </S.HeaderLeft>
        <button style={{ fontSize: '0.75rem', fontWeight: 900, color: '#64748b', padding: '0.375rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem' }}>
          모두 읽음 처리
        </button>
      </S.SubPageHeader>

      <S.NotiList>
        <S.HistoryHeader>
          <S.FilterTabs>
            <S.TabButton active={filter === 'ALL'} onClick={() => setFilter('ALL')}>전체 알림</S.TabButton>
            <S.TabButton active={filter === 'UNREAD'} onClick={() => setFilter('UNREAD')} color="#4f46e5">안 읽음</S.TabButton>
          </S.FilterTabs>
        </S.HistoryHeader>

        <div style={{ padding: '1.5rem' }}>
          {Object.entries(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(([date, items]) => (
              <S.NotiGroup key={date}>
                <S.DateHeader>{date}</S.DateHeader>
                <div>
                  {items.map(item => (
                    <S.NotiItem key={item.id} read={item.read}>
                      <S.IconWrapper type={item.type}>
                        {item.type === 'success' ? <CheckCircle2 size={18} /> :
                          item.type === 'alert' ? <AlertCircle size={18} /> :
                            item.type === 'notice' ? <Bell size={18} /> : <Info size={18} />}
                      </S.IconWrapper>
                      <S.ContentWrapper>
                        <S.ItemHeader read={item.read}>
                          <h4>{item.title}</h4>
                          <span>{item.time}</span>
                        </S.ItemHeader>
                        <S.ItemMessage read={item.read}>{item.message}</S.ItemMessage>
                      </S.ContentWrapper>
                      {!item.read && <S.UnreadDot />}
                    </S.NotiItem>
                  ))}
                </div>
              </S.NotiGroup>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0', color: '#cbd5e1' }}>
              <Bell size={40} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>새로운 알림이 없습니다.</p>
            </div>
          )}
        </div>
      </S.NotiList>
    </S.SubPageContainer>
  );
};

export default NotificationCenterView;
