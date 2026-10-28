export interface Post {
  id: string
  title: string
  content: string
  likes: number
}

export const posts: Post[] = [
  { id: "nextjs", title: "Next.js 소개", content: "Next.js는 React 기반의 풀스택 프레임워크입니다.", likes: 0 },
  { id: "routing", title: "App Router 알아보기", content: "Next.js 13부터는 App Router가 도입되었습니다.", likes: 0 },
  { id: "ssr-ssg", title: "SSR vs SSG", content: "서버사이드 렌더링과 정적 사이트 생성의 차이를 알아봅니다.", likes: 0 },
  { id: "dynamic-routes", title: "동적 라우팅", content: "Next.js에서 [slug]를 활용한 라우팅 방식입니다.", likes: 0 },
  { id: "1", title: "첫 번째 게시물", content: "Next.js App Router 실습입니다.", likes: 10 },
  { id: "2", title: "두 번째 게시물", content: "Server Component와 Client Component 학습입니다.", likes: 20 },
  { id: "3", title: "세 번째 게시물", content: "Optimistic Update 실습입니다.", likes: 30 },
]

export async function getPost(id: string): Promise<Post | undefined> {
  return posts.find((p) => p.id === id)
}
