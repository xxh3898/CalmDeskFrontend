import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User as UserIcon,
  Briefcase,
  Phone,
  Mail,
  Lock
} from 'lucide-react';
import { MOCK_USER } from '../../../constants/constants';
import * as S from './MyPage.styles';
import useStore from '../../../store/useStore';

const ProfileEditView = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  const displayUser = {
    ...MOCK_USER,
    ...(user ? {
      name: user.name,
      department: user.department,
      phone: user.phone || MOCK_USER.phone,
      joinDate: user.joinDate || MOCK_USER.joinDate
    } : {})
  };

  return (
    <S.SubPageContainer>
      <S.SubPageHeader>
        <S.HeaderLeft>
          <S.BackButton onClick={() => navigate('/app/mypage')}>
            <ArrowLeft size={24} />
          </S.BackButton>
          <S.SubTitleGroup>
            <h2>프로필 수정</h2>
          </S.SubTitleGroup>
        </S.HeaderLeft>
      </S.SubPageHeader>

      <S.ProfileGrid>
        <S.AvatarCard>
          <S.AvatarWrapper>
            <S.AvatarImage>
              {displayUser.avatar}
            </S.AvatarImage>
          </S.AvatarWrapper>
        </S.AvatarCard>

        <div style={{ gridColumn: 'span 2' }}>
          <S.FormCard>
            <S.FormGrid>
              <S.InputGroup>
                <S.Label>이름</S.Label>
                <S.ReadOnlyField>
                  <UserIcon size={18} color="#94a3b8" />
                  <span>{displayUser.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', backgroundColor: '#e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>수정불가</span>
                </S.ReadOnlyField>
              </S.InputGroup>
              <S.InputGroup>
                <S.Label>부서</S.Label>
                <S.ReadOnlyField>
                  <Briefcase size={18} color="#94a3b8" />
                  <span>{displayUser.department}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', backgroundColor: '#e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>수정불가</span>
                </S.ReadOnlyField>
              </S.InputGroup>
              <S.InputGroup>
                <S.Label>연락처</S.Label>
                <S.InputField>
                  <Phone size={18} color="#3b82f6" />
                  <input type="text" defaultValue={displayUser.phone} />
                </S.InputField>
              </S.InputGroup>
              <S.InputGroup>
                <S.Label>이메일</S.Label>
                <S.InputField>
                  <Mail size={18} color="#3b82f6" />
                  <input type="email" defaultValue={displayUser.email} />
                </S.InputField>
              </S.InputGroup>
            </S.FormGrid>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Lock size={18} color="#94a3b8" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 900, color: '#1e293b' }}>비밀번호 변경</h3>
              </div>

              <S.InputGroup>
                <S.Label>현재 비밀번호</S.Label>
                <S.PasswordInput type="password" placeholder="••••••••" />
              </S.InputGroup>

              <S.FormGrid>
                <S.InputGroup>
                  <S.Label>새 비밀번호</S.Label>
                  <S.PasswordInput type="password" placeholder="새 비밀번호" />
                </S.InputGroup>
                <S.InputGroup>
                  <S.Label>비밀번호 확인</S.Label>
                  <S.PasswordInput type="password" placeholder="새 비밀번호 확인" />
                </S.InputGroup>
              </S.FormGrid>
            </div>

            <S.ActionRow>
              <S.CancelButton onClick={() => navigate('/app/mypage')}>
                취소
              </S.CancelButton>
              <S.SaveButton onClick={() => {
                alert('프로필이 성공적으로 수정되었습니다.');
                navigate('/app/mypage');
              }}>
                <Save size={18} />
                저장하기
              </S.SaveButton>
            </S.ActionRow>
          </S.FormCard>
        </div>
      </S.ProfileGrid>
    </S.SubPageContainer>
  );
};

export default ProfileEditView;
