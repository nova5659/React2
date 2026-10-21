'use client';

import { useState } from 'react';

interface LikeButtonProps {
  likes?: number;
}

export default function LikeButton({ likes = 0 }: LikeButtonProps) {
  const [count, setCount] = useState<number>(likes ?? 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const handleLike = async () => {
    setIsLiking(true);
    // 낙관적 업데이트(Optimistic Update): 서버 응답 전에 화면 숫자를 먼저 증가
    setCount((prev) => prev + 1);

    try {
      // 서버 요청 딜레이 시뮬레이션 (0.5초)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      // 에러 발생 시 원래 값으로 롤백 처리
      setCount((prev) => prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 disabled:opacity-60 text-sm font-medium transition-colors"
    >
      {isLiking ? '반영 중...' : `❤️ 좋아요 ${count}`}
    </button>
  );
}

