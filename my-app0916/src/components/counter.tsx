'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="inline-flex flex-col items-start gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <p className="font-semibold text-gray-800">카운터 값: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          +1 증가
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-medium"
        >
          초기화
        </button>
      </div>
    </div>
  );
}

