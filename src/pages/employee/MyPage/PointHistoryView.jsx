import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Filter,
  CreditCard,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { MOCK_USER } from '../../../constants/constants';
import * as S from './MyPage.styles';
import useStore from '../../../store/useStore';

const PointHistoryView = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const displayUser = {
    ...MOCK_USER,
    ...(user ? {
      name: user.name,
      department: user.department,
      phone: user.phone || MOCK_USER.phone,
      joinDate: user.joinDate || MOCK_USER.joinDate
    } : {})
  };

  const history = [
    { id: 1, type: 'EARN', title: '주간 미션 달성', date: '2026.01.20 09:00', amount: 50, balance: 2450 },
    { id: 2, type: 'USE', title: '스타벅스 아메리카노 교환', date: '2026.01.20 09:30', amount: -4500, balance: 2400 },
    { id: 3, type: 'EARN', title: '정시 출근 보너스', date: '2026.01.20 08:50', amount: 10, balance: 6900 },
    { id: 4, type: 'EARN', title: '칭찬 카드 획득', date: '2026.01.19 17:20', amount: 30, balance: 6890 },
    { id: 5, type: 'EARN', title: '정시 출근 보너스', date: '2026.01.19 08:55', amount: 10, balance: 6860 },
  ];
  const filteredHistory = history.filter(item => filter === 'ALL' || item.type === filter);

  return (
    <S.SubPageContainer>
      <S.SubPageHeader>
        <S.HeaderLeft>
          <S.BackButton onClick={() => navigate('/app/mypage')}>
            <ArrowLeft size={24} />
          </S.BackButton>
          <S.SubTitleGroup>
            <h2>포인트 내역</h2>
            <p>포인트 적립 및 사용 내역을 확인하세요.</p>
          </S.SubTitleGroup>
        </S.HeaderLeft>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', backgroundColor: 'white' }}>
          <Download size={14} />
          내역 다운로드
        </button>
      </S.SubPageHeader>

      <S.PointSummaryCard>
        <S.BalanceSection>
          <p>Total Balance</p>
          <h3>{displayUser.point} <span>P</span></h3>
        </S.BalanceSection>
        <S.StatsSection>
          <S.StatItem isPositive>
            <p>이번 달 적립</p>
            <p>+3,250 P</p>
          </S.StatItem>
          <S.Divider />
          <S.StatItem>
            <p>이번 달 사용</p>
            <p>-4,500 P</p>
          </S.StatItem>
        </S.StatsSection>
        <CreditCard style={{ position: 'absolute', bottom: '-1.5rem', right: '-1.5rem', width: '12rem', height: '12rem', opacity: 0.05, transform: 'rotate(12deg)' }} />
      </S.PointSummaryCard>

      <S.HistoryContainer>
        <S.HistoryHeader>
          <S.FilterTabs>
            <S.TabButton active={filter === 'ALL'} onClick={() => setFilter('ALL')}>전체</S.TabButton>
            <S.TabButton active={filter === 'EARN'} onClick={() => setFilter('EARN')} color="#059669">적립</S.TabButton>
            <S.TabButton active={filter === 'USE'} onClick={() => setFilter('USE')} color="#1e293b">사용</S.TabButton>
          </S.FilterTabs>
          <button style={{ padding: '0.5rem', color: '#94a3b8' }}><Filter size={16} /></button>
        </S.HistoryHeader>

        <S.HistoryList>
          {filteredHistory.map((item) => (
            <S.HistoryItem key={item.id}>
              <S.ItemLeft>
                <S.IconBox type={item.type}>
                  {item.type === 'EARN' ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
                </S.IconBox>
                <S.ItemDetails>
                  <p>{item.title}</p>
                  <p>{item.date}</p>
                </S.ItemDetails>
              </S.ItemLeft>
              <S.ItemRight type={item.type}>
                <p>{item.type === 'EARN' ? '+' : ''}{item.amount.toLocaleString()} P</p>
                <p>잔액 {item.balance.toLocaleString()} P</p>
              </S.ItemRight>
            </S.HistoryItem>
          ))}
          {filteredHistory.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>내역이 없습니다.</div>
          )}
        </S.HistoryList>
        <S.LoadMoreButton>더 보기</S.LoadMoreButton>
      </S.HistoryContainer>
    </S.SubPageContainer>
  );
};

export default PointHistoryView;
