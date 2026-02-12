import React from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';
import * as S from '../TeamManagement.styles';

export default function MemberCard({ member, onClick, onChatClick }) {
  return (
    <S.MemberCard onClick={() => onClick(member)}>
      <S.CardContent>
        <S.MemberProfile>
          <S.AvatarBox>{member.avatar}</S.AvatarBox>
          <S.MemberNames>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </S.MemberNames>
        </S.MemberProfile>
        <S.MemberStats>
          <S.StatColumn white>
            <span>Department</span>
            <span>{member.dept}</span>
          </S.StatColumn>
          <S.StatColumn stress value={member.stress}>
            <span>Stress</span>
            <span>{member.stress}%</span>
          </S.StatColumn>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <S.StatusBadge status={member.status}>{member.status}</S.StatusBadge>
          </div>
        </S.MemberStats>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onChatClick && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChatClick(member);
              }}
              style={{
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageCircle size={16} color="#64748b" />
            </div>
          )}
          <ChevronRight size={16} color="#334155" />
        </div>
      </S.CardContent>
    </S.MemberCard>
  );
}
