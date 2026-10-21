// 블로그 실습용 더미 데이터
export interface Post {
  slug: string;
  title: string;
  content: string;
  likes: number;
}

export const posts: Post[] = [
  { slug: "nextjs", title: "Next.js 핵심 소개", content: "Next.js는 React 기반의 대표적인 풀스택 웹 프레임워크입니다.", likes: 12 },
  { slug: "routing", title: "App Router 아키텍처", content: "Next.js 13부터 도입된 폴더 기반의 새로운 라우팅 시스템입니다.", likes: 8 },
  { slug: "ssr-ssg", title: "SSR과 SSG 렌더링 방식", content: "서버 사이드 렌더링과 정적 사이트 생성의 차이점 및 장단점을 살펴봅니다.", likes: 15 },
  { slug: "dynamic-routes", title: "동적 세그먼트와 [slug]", content: "대괄호 폴더명을 사용하여 데이터에 맞춘 동적 URL 라우팅을 구성합니다.", likes: 5 },
];