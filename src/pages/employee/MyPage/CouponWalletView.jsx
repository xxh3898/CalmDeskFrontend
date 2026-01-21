import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ShoppingBag
} from 'lucide-react';
import { COUPONS } from '../../../constants/constants';
import * as S from './MyPage.styles';

const CouponWalletView = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('AVAILABLE');
  const filteredCoupons = COUPONS.filter(c => c.status === filter);

  return (
    <S.SubPageContainer>
      <S.SubPageHeader>
        <S.HeaderLeft>
          <S.BackButton onClick={() => navigate('/app/mypage')}>
            <ArrowLeft size={24} />
          </S.BackButton>
          <S.SubTitleGroup>
            <h2>기프티콘 보관함</h2>
            <p>획득한 보상을 확인하고 사용하세요.</p>
          </S.SubTitleGroup>
        </S.HeaderLeft>
        <S.FilterGroup>
          <S.FilterButton active={filter === 'AVAILABLE'} onClick={() => setFilter('AVAILABLE')}>
            사용 가능
          </S.FilterButton>
          <S.FilterButton active={filter === 'USED'} onClick={() => setFilter('USED')}>
            사용 완료
          </S.FilterButton>
        </S.FilterGroup>
      </S.SubPageHeader>

      <S.CouponGrid>
        {filteredCoupons.map((coupon) => (
          <S.CouponCard key={coupon.id} isUsed={coupon.status === 'USED'}>
            <S.CouponTopBar color={coupon.color.replace('bg-', 'var(--tw-bg-opacity, 1) ')} />
            <S.CouponHeader>
              <S.CouponIcon>
                {coupon.icon}
              </S.CouponIcon>
              <S.CouponStatus status={coupon.status}>
                {coupon.status === 'AVAILABLE' ? 'D-30' : '사용됨'}
              </S.CouponStatus>
            </S.CouponHeader>

            <S.CouponInfo>
              <p>{coupon.shop}</p>
              <h3>{coupon.name}</h3>
            </S.CouponInfo>

            <S.CouponFooter>
              <S.CouponDate>
                <Clock size={12} /> {coupon.date}
              </S.CouponDate>
              <S.CouponButton disabled={coupon.status !== 'AVAILABLE'}>
                {coupon.status === 'AVAILABLE' ? '바코드 보기' : '사용 완료'}
              </S.CouponButton>
            </S.CouponFooter>

            <S.CouponDecorCircle side="left" />
            <S.CouponDecorCircle side="right" />
          </S.CouponCard>
        ))}

        <S.CouponCard
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer', minHeight: '300px' }}
          onClick={() => navigate('/app/pointmall')}
        >
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShoppingBag size={24} color="#cbd5e1" />
          </div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 900, color: '#94a3b8' }}>포인트몰 바로가기</h3>
          <p style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '0.25rem' }}>포인트를 사용하여<br />새로운 쿠폰을 획득하세요!</p>
        </S.CouponCard>
      </S.CouponGrid>
    </S.SubPageContainer>
  );
};

export default CouponWalletView;
