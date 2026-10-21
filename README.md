# React2

# 박현준 202230114

React2 수업 내용과 실습 기록입니다. 최신 수업부터 역순으로 정리합니다.

---

## 7주차 (2026-10-14)

### 1. Server Component와 Client Component 선택 기준

Next.js App Router에서는 기본적으로 모든 컴포넌트가 **Server Component**로 작동하며, 특정 기능이 필요한 경우에 한해 최상단에 `'use client'`를 선언하여 **Client Component**로 전환합니다. 두 환경은 제공하는 기능과 실행 컨텍스트가 상이하므로 명확한 기준에 따라 구분하여 작성해야 합니다.

#### 🔹 Client Component를 선택해야 하는 상황
* **상호작용 및 이벤트 처리**: `onClick`, `onChange`, `onSubmit` 등 사용자의 입력 이벤트를 직접 감지해야 할 때
* **컴포넌트 내부 상태 및 생명주기 관리**: `useState`, `useReducer`, `useEffect`, `useLayoutEffect` 등을 활용할 때
* **브라우저 전용 Web API 접근**: `window`, `document`, `localStorage`, `sessionStorage`, `navigator.geolocation` 등이 필요할 때
* **커스텀 리액트 훅(Custom Hook) 사용**: 브라우저 상태나 이벤트에 종속된 훅을 호출할 때

#### 🔹 Server Component를 선택해야 하는 상황
* **백엔드 리소스 직접 접근**: 서버 데이터베이스(DB), 백엔드 내부 서비스, 파일 시스템(FS) 등에서 데이터를 직접 fetch할 때
* **민감 정보 은닉**: API Secret Key, 인증 토큰, 환경 변수 등 클라이언트에 노출되면 안 되는 보안 데이터를 다룰 때
* **클라이언트 JS 번들 최적화**: 무거운 외부 라이브러리를 서버에서만 실행하고 브라우저로 전송되는 JavaScript 용량을 최소화하고자 할 때
* **초기 로딩 속도(FCP) 개선**: 완성된 정적 HTML을 즉시 생성하여 제공하고, 점진적으로 콘텐츠를 스트리밍하고자 할 때

#### 🔹 구조적 패턴: Server Component에서 Client Component로 Props 전달
* 상위 `<Page>` 컴포넌트(Server Component)에서 필요한 데이터를 안전하게 조회한 뒤, 버튼 클릭 등 UI 상호작용이 필요한 하위 `<LikeButton>` 컴포넌트(Client Component)에 `props`로 데이터를 전달하는 패턴이 일반적입니다.

```tsx
// app/blog/[slug]/page.tsx (Server Component)
import LikeButton from '@/components/like-button';
import { posts } from '@/app/blog/posts';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* Client Component에 props 전달 */}
      <LikeButton likes={post.likes} />
    </main>
  );
}
```

```tsx
// components/like-button.tsx (Client Component)
'use client';

import { useState } from 'react';

export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes ?? 0);
  // ...
}
```

---

### 2. 동적 라우트(Slug) 처리와 Next.js 15 비동기 params

* Next.js 15에서는 동적 경로의 매개변수인 `params`가 **Promise 객체**로 제공되므로, 값을 읽기 전에 반드시 `await`로 언래핑해야 합니다.
* 일치하는 데이터가 없을 경우 `next/navigation`의 `notFound()` 함수를 호출하여 404 페이지로 전환합니다.

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 비동기 언래핑
  const { id } = await params;
  const post = posts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return <div>{post.title}</div>;
}
```

---

### 3. 상태 관리와 `isLiking` 플래그의 역할

좋아요 컴포넌트(`like-button.tsx`)에서는 2개의 상태(State)를 분리하여 운용합니다.
1. **`count`**: 현재 화면에 표시되는 좋아요 누적 수
2. **`isLiking`**: 서버와의 비동기 통신이 진행 중인지 여부를 나타내는 불리언 값

#### 🔹 `isLiking` 상태를 두는 핵심 목적
* **중복 클릭 및 중복 요청 방지**: 버튼 클릭 직후 `disabled` 속성을 활성화하여 사용자의 연타로 인한 불필요한 네트워크 트래픽 및 오작동을 차단합니다.
* **로딩 시각 피드백**: '반영 중...', 스피너 등의 문구를 화면에 표시하여 사용자에게 처리가 정상적으로 진행되고 있음을 알립니다.
* **상태 동기화 안정성**: 비동기 통신이 완료될 때까지 추가 상태 전이를 잠시 차단하여 데이터 불일치를 예방합니다.

---

### 4. JavaScript Falsy 값의 개념과 기본값 지정

자바스크립트에서는 조건식 및 불리언 문맥에서 `false`로 평가되는 특별한 값들을 **Falsy(거짓 같은 값)**라고 부릅니다.
컴포넌트에서 `likes ?? 0`과 같이 Nullish 병합 연산자(`??`)를 사용하면 `null` 또는 `undefined`일 때만 안전하게 기본값 0을 부여할 수 있습니다.

#### 🔹 대표적인 Falsy 값 6가지
1. **`false`**: 불리언 false 원시값
2. **`0` / `-0`**: 숫자 영
3. **`""` (빈 문자열)**: 내용이 없는 문자열
4. **`null`**: 개발자가 명시적으로 '값이 비어 있음'을 지정한 상태
5. **`undefined`**: 변수가 선언되었으나 값이 아직 할당되지 않은 상태
6. **`NaN`**: Not-a-Number (숫자 연산 실패 결과값)

---

### 5. Optimistic Update (낙관적 업데이트) vs Pessimistic Update (비관적 업데이트)

웹 애플리케이션에서 서버와의 데이터 갱신을 처리하는 두 가지 핵심 패러다임입니다.

#### 🔹 낙관적 업데이트 (Optimistic Update)
* **동작 원리**: 사용자가 버튼을 클릭하면 서버의 응답을 기다리지 않고 **클라이언트 UI를 즉시 갱신**합니다. 그 후 백그라운드에서 서버에 요청을 전송하며, 만약 실패하면 UI를 이전 상태로 롤백합니다.
* **장점**: 네트워크 지연에 상관없이 즉각적인 반응성을 제공하여 사용자 경험(UX)이 극대화됩니다.
* **단점**: 서버 요청 실패 시 롤백 로직을 별도로 작성해야 하며, 일시적으로 잘못된 상태가 화면에 보일 수 있습니다.
* **적용 사례**: SNS 좋아요, 북마크 토글, 채팅 메시지 전송 목록

#### 🔹 비관적 업데이트 (Pessimistic Update)
* **동작 원리**: 사용자의 요청을 서버로 먼저 전달한 뒤, **서버로부터 성공 응답을 수신한 시점에 비로소 UI를 갱신**합니다.
* **장점**: 서버와 클라이언트 간의 데이터 정합성이 철저히 보장되며, 롤백에 대한 부가 로직이 필요 없습니다.
* **단점**: 서버 응답 시간만큼 화면 반응이 늦어져 네트워크 환경이 열악할 경우 지연이 체감됩니다.
* **적용 사례**: 결제 승인, 회원 탈퇴, 계좌 이체 등 데이터 정합성이 최우선인 작업

| 비교 항목 | 낙관적 업데이트 (Optimistic) | 비관적 업데이트 (Pessimistic) |
| :--- | :--- | :--- |
| **화면 반영 시점** | 클릭/요청 발생 즉시 선반영 | 서버 처리 성공 응답 수신 후 반영 |
| **요청 실패 시** | 이전 상태로 롤백(Rollback) 처리 | UI 변경 없이 에러 알림 노출 |
| **사용자 체감 속도** | 매우 빠름 (지연 없는 즉각 피드백) | 서버 네트워크 속도에 비례함 |
| **적합한 작업** | 좋아요, 간단한 반응, 댓글 추가 | 금융 거래, 예약, 데이터 결제 |

---

### 6. Next.js App Router 렌더링 파이프라인 (RSC Payload & Hydration)

Next.js App Router에서 컴포넌트가 브라우저에 표시되기까지의 내부 구동 메커니즘입니다.

#### 🔹 RSC Payload (React Server Component Payload)
* Server Component를 렌더링한 결과 트리를 직렬화(Serialization)하여 표현한 경량 데이터 포맷입니다.
* 렌더링된 HTML 엘리먼트 정보와 Client Component가 렌더링될 위치(Placeholder), 전달된 `props`를 포함합니다.
* **포맷의 발전**: 초기에는 JSON 문자열 형태였으나, 최신 React/Next.js에서는 효율적인 압축과 고속 파싱을 위해 **바이너리 스트림(Compact Binary Format)** 형태로 최적화되어 전송됩니다.

#### 🔹 클라이언트 첫 방문 시 실행 단계 (Initial Load)
1. **정적 HTML 스트리밍**: 서버는 즉시 렌더링 가능한 기본 HTML을 생성하여 브라우저에 전달합니다. (사용자는 빈 화면 없이 즉시 콘텐츠를 시각적으로 확인 가능)
2. **RSC Payload 수신**: 클라이언트 리액트 런타임이 RSC Payload를 받아 서버 컴포넌트와 클라이언트 컴포넌트 트리를 정합합니다.
3. **JavaScript 번들 다운로드 및 Hydration**: 클라이언트 컴포넌트에 필요한 JS 번들을 내려받아 정적 DOM에 이벤트 리스너를 결합(`Hydration`)함으로써 인터랙티브한 앱으로 전환됩니다.

> 📌 **Hydration(하이드레이션)의 정의**  
> 서버 사이드에서 미리 생성된 정적(비대화형) HTML 문서 위에, 클라이언트 JavaScript가 이벤트 핸들러 및 상태(State) 바인딩을 주입하여 동적으로 상호작용 가능한 React DOM 트리로 활성화하는 과정.

---

## 6주차 (2026-10-07)

### 1. `generateStaticParams`를 활용한 정적 사이트 생성 (SSG)

동적 세그먼트(`[slug]`)를 사용하는 페이지를 빌드 시점에 사전 렌더링(Static Generation)하여 정적 HTML 파일로 생성하는 핵심 함수입니다.

```tsx
// app/blog3/[slug]/page.tsx
import { posts } from "@/app/blog/posts";

// 빌드 시점에 사전 생성할 slug 목록을 반환
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return <div>{post?.title}</div>;
}
```

#### 🔹 `generateStaticParams`의 실행 원리
1. 빌드(`next build`) 시점에 Next.js가 `generateStaticParams()`를 호출합니다.
2. 함수가 반환한 객체 배열(`[{ slug: 'nextjs' }, { slug: 'routing' }, ...]`)을 순회합니다.
3. 각 `slug` 인자를 `BlogPostPage` 컴포넌트에 전달하여 실행한 뒤, 완성된 결과물을 개별 정적 HTML 파일(`/blog3/nextjs/index.html`)로 디스크에 저장합니다.

#### 🔹 `generateStaticParams` 선언 유무 비교
| 구분 | `generateStaticParams` 미사용 | `generateStaticParams` 사용 |
| :--- | :--- | :--- |
| **렌더링 방식** | 동적 렌더링 (SSR/요청 시점 렌더링) | 정적 사이트 생성 (SSG/빌드 시점 렌더링) |
| **페이지 생성 시점** | 사용자가 접속하는 순간 서버에서 실행 | 애플리케이션 빌드 시점에 미리 생성 |
| **응답 속도 (TTFB)** | 서버 연산 시간이 소요되어 상대적으로 느림 | CDN에서 정적 캐시를 즉시 제공하여 극도로 빠름 |
| **검색 엔진 최적화 (SEO)** | 동적 생성되나 정적 캐시에 비해 부하 존재 | 완성된 HTML이 항상 대기 중이므로 크롤링에 최적 |

---

### 2. 컴포넌트 함수에 `async`를 기본 부여하는 이유

Next.js 13+ App Router의 Server Component는 기본적으로 비동기 처리를 염두에 두고 설계되었습니다. 코드 내부에서 당장 `await`를 호출하지 않더라도 `async`를 유지하는 것이 권장됩니다.
1. **코드의 일관성**: 전체 페이지 컴포넌트의 시그니처를 `async function`으로 통일하여 구조적 일관성을 유지합니다.
2. **유지보수 및 확장성**: 향후 데이터베이스 쿼리나 비동기 API 통신(`await fetch(...)`)이 추가될 때 함수 선언을 수정할 필요가 없습니다.
3. **프레임워크 호환성**: Server Component는 내부적으로 `Promise`를 반환하도록 파이프라인이 최적화되어 있으므로 별도의 성능 페널티가 없습니다.

---

### 3. 느린 네트워크 환경 대응과 `useLinkStatus` 훅

네트워크 속도가 느릴 경우 사용자가 링크를 클릭해도 프리페칭이 완료되지 않아 화면 전환이 멈춘 것처럼 보일 수 있습니다. 이때 `useLinkStatus` 훅을 사용하면 이동 진행 중 상태를 감지하여 사용자에게 시각적 인라인 피드백을 즉시 제공할 수 있습니다.

```tsx
// components/loading-indicator.tsx
'use client';

import { useLinkStatus } from 'next/link';

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <div className="spinner">이동 중...</div> : null;
}
```

---

### 4. `<Link>` 프리페칭(Prefetching) 제어와 최적화

Next.js의 `<Link>` 컴포넌트는 기본적으로 뷰포트에 보이는 모든 링크를 사전에 백그라운드로 로드(`prefetch={true}`)합니다.

```tsx
// 무한 스크롤 등 링크가 지나치게 많을 때 불필요한 네트워크 부하 방지
<Link href="/blog" prefetch={false}>
  블로그 가기
</Link>
```

* **비활성화 시 영향**: 링크를 실제로 클릭하는 시점에 리소스를 가져오므로 초기 네트워크 트래픽은 감소하지만 페이지 전환 시 약간의 지연이 발생할 수 있습니다.
* **절충안**: 링크 전체를 비활성화하기보다는 마우스 호버(Hover) 시에만 프리페치를 수행하도록 설계하면 대역폭과 체감 전환 속도의 균형을 잡을 수 있습니다.

---

## 5주차 (2026-09-30)

### 1. Next.js App Router 렌더링 전략

* **Static Rendering (정적 렌더링)**: 빌드 시점 또는 데이터 재검증(Revalidation) 시점에 렌더링되어 결과가 캐시됩니다.
* **Dynamic Rendering (동적 렌더링)**: 사용자의 요청이 들어올 때마다 서버에서 새로 렌더링합니다. (쿠키, 요청 헤더, `searchParams` 사용 시 자동 전환)
* **초기 방문 HTML 사전 생성**: 전통적인 SPA/CSR과 달리, 첫 요청 시점에 서버가 완성된 HTML 뼈대를 즉시 응답하므로 초기 로딩 체감 속도와 SEO가 대폭 개선됩니다.

---

### 2. Client-Side Transitions & Prefetching

* **전체 새로고침 없는 전환**: 일반 HTML `<a>` 태그는 브라우저 전체를 새로고침(Full Page Reload)하여 State가 소멸되고 흰 화면이 번쩍이지만, Next.js의 `<Link>`는 클라이언트 사이드 전환을 통해 공유 레이아웃을 그대로 유지한 채 변경된 세그먼트만 동적으로 교체합니다.
* **Prefetching**: 사용자가 링크를 누르기 전에 백그라운드에서 다음 경로의 데이터를 미리 다운로드하여 즉각적인 이동 경험을 구현합니다.

---

### 3. Streaming과 `<Suspense>`를 통한 점진적 로딩

* **Streaming 개념**: 전체 페이지의 렌더링이 모두 끝날 때까지 브라우저를 기다리게 하지 않고, 서버에서 준비된 UI 청크(Chunk)부터 순차적으로 클라이언트에 전송합니다.
* **`loading.tsx`의 장점**: Next.js는 각 세그먼트 폴더의 `loading.tsx`를 자동으로 React `<Suspense>` 래퍼로 변환합니다. 데이터 페칭 동안 대체 로딩 UI(스켈레톤)를 즉시 표시하여 TTFB(Time To First Byte)와 FCP(First Contentful Paint)를 대폭 단축합니다.

---

### 4. Core Web Vitals (핵심 웹 활력 지표)

구글이 웹 사용자 경험 품질을 평가하는 3대 핵심 성능 지표입니다.
1. **LCP (Largest Contentful Paint)**: 화면 내 가장 큰 주요 콘텐츠(대표 이미지 또는 메인 텍스트 블록)가 렌더링되기까지 걸리는 시간 (로딩 성능)
2. **FID / INP (First Input Delay / Interaction to Next Paint)**: 사용자가 버튼 등을 처음 탭하거나 클릭했을 때 브라우저가 반응을 시작하기까지 걸리는 지연 시간 (상호작용성)
3. **CLS (Cumulative Layout Shift)**: 웹페이지 로딩 과정에서 예기치 않게 레이아웃이 덜컥거리며 위치가 이동하는 정도 (시각적 안정성)

---

### 5. Shared Layout과 Interruptible Navigation

* **공유 레이아웃 상태 유지 (Shared Layout)**: `layout.tsx`는 하위 페이지 간 이동 시 언마운트되지 않고 계속 유지됩니다. 네비게이션 바의 메뉴 상태, 입력 폼 값, 오디오 플레이어 등이 끊김 없이 유지됩니다.
* **취소 가능한 네비게이션 (Interruptible Navigation)**: 특정 경로로 이동 중 네트워크 지연이 발생하더라도 사용자가 다른 링크를 클릭하면 이전의 로딩 요청은 자동으로 취소되고 새 요청이 즉시 처리됩니다.

---

## 4주차 (2026-09-23)

### 1. 레이아웃(Layout) 설계 원칙

* **`RootLayout`은 필수**: `src/app/layout.tsx`는 모든 라우트의 최상위 틀이며, 반드시 `<html>`과 `<body>` 태그를 직접 작성해야 합니다.
* **서브 레이아웃은 선택**: `app/blog/layout.tsx`와 같은 하위 세그먼트 레이아웃은 특정 경로에만 공통 헤더/사이드바가 필요할 때 선택적으로 구성하며, `<html>`/`<body>` 태그를 중복 작성하지 않습니다.

---

### 2. URL 세그먼트와 동적 세그먼트 (`[slug]`)

* **URL Segment 계층 구조**: URL은 슬래시(`/`) 단위로 세그먼트가 분할됩니다.
  * `/blog/[slug]` 구조에서 `/`는 Root Segment, `blog`는 Segment, `[slug]`는 트리의 끝단인 Leaf Segment가 됩니다.
* **폴더명 = URL 세그먼트**: App Router에서는 폴더 구조가 곧 브라우저 URL 경로로 1:1 매핑됩니다.
* **동적 세그먼트 문법**: 대괄호 `[폴더명]`을 사용하면 고정된 주소가 아닌 동적인 파라미터 값(게시물 ID, 슬러그 등)을 라우트로 바인딩할 수 있습니다.

---

### 3. `params` vs `searchParams` 상세 비교

| 구분 | `params` (경로 매개변수) | `searchParams` (쿼리 문자열) |
| :--- | :--- | :--- |
| **추출 위치** | 동적 세그먼트 폴더명 (`/blog/[slug]`) | URL의 `?` 기호 뒷부분 (`/products?id=123`) |
| **데이터 성격** | 리소스의 고유 식별 주소 자체 | 정렬, 필터, 검색 조건 등의 부가 정보 |
| **렌더링 영향** | `generateStaticParams` 결합 시 **정적(SSG)** 빌드 가능 | 접근 시점마다 값이 달라지므로 **무조건 동적(Dynamic)** 렌더링 |
| **Client 접근** | `useParams()` 훅 사용 | `useSearchParams()` 훅 사용 |

---

### 4. `<Link>` 컴포넌트의 `href` 사용법

* **문자열 방식**: `<Link href="/blog">Blog</Link>`
* **객체(Object) 방식**:
  ```tsx
  <Link
    href={{
      pathname: '/products',
      query: { id: '202230114', name: '박현준' },
    }}
  >
    내 정보 보기
  </Link>
  ```
* 브라우저 렌더링 시 표준 HTML `<a href="...">` 태그로 변환되어 SEO 크롤러에 완벽히 대응하며, 사용자 클릭 시에는 자바스크립트 기반 클라이언트 사이드 전환으로 부드럽게 작동합니다.

---

## 3주차 (2026-09-16)

### 1. Open Graph Protocol (오픈 그래프 프로토콜)

SNS 및 메신저(카카오톡, 디스코드 등)에 웹사이트 URL을 공유할 때 미리보기 카드(Link Preview)를 규격화하는 웹 표준 메타태그 규약입니다.

* `og:title`: 미리보기 카드의 핵심 제목
* `og:description`: 제목 하단에 표시되는 요약 설명
* `og:image`: 카드에 노출될 대표 썸네일 이미지 절대 경로
* `og:url`: 해당 페이지의 대표 표준 URL
* `og:type`: 콘텐츠의 유형 (`website`, `article` 등)

---

### 2. App Router 컴포넌트 계층 트리 구조

동일 디렉터리 내의 예약어 파일들은 Next.js 렌더링 시 다음과 같이 바깥쪽부터 안쪽으로 계층적으로 중첩(Wrapping)됩니다.

```text
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<NotFound />}>
          <Page />
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

---

### 3. `layout.js` vs `template.js` 핵심 비교

| 비교 항목 | `layout.js` (기본 추천) | `template.js` |
| :--- | :--- | :--- |
| **인스턴스 생명주기** | 페이지 이동 시에도 마운트 상태 지속 | **경로 이동 시마다 언마운트 후 새 인스턴스 재생성** |
| **State 보존 여부** | 하위 페이지 이동 시 내부 상태(State) 유지 | 하위 페이지 이동 시 내부 상태(State) 초기화 |
| **`useEffect` 호출** | 초기 진입 시 1회만 호출 | **페이지 전환 시마다 매번 재실행** |
| **주요 사용 사례** | 전역 헤더, 네비게이션 바, 사이드바, 푸터 | 페이지 진입 애니메이션, 페이지뷰 분석 로깅 |

---

### 4. Route Groups (소괄호 폴더 `(folder)`)

* 소괄호로 감싼 폴더는 **URL 경로에 전혀 영향을 주지 않습니다.**
* 예: `app/(marketing)/about/page.tsx`의 실제 접속 주소는 `/about`이 됩니다.
* 서비스 영역별(사용자 영역 `(user)`, 관리자 영역 `(admin)`)로 완전히 다른 레이아웃 구조를 적용할 때 유용합니다.

---

## 2주차 (2026-09-09)

### 1. Next.js 프로젝트 수동 초기화

Next.js의 내부 구동 방식을 체득하기 위해 수동으로 프로젝트를 구축하는 절차입니다.

```bash
# 1. package.json 생성
npm init -y

# 2. 핵심 런타임 의존성 설치
npm install next react react-dom

# 3. 개발용 TypeScript 의존성 설치 (-D)
npm install -D typescript @types/react @types/node
```

#### 🔹 `dependencies` vs `devDependencies`
* **`dependencies`**: 배포 후 실제 서비스 런타임에 필요한 패키지 (`react`, `react-dom`, `next`)
* **`devDependencies` (`-D`)**: 개발 단계에서 코드 작성, 컴파일, 린트 시에만 사용되는 패키지 (`typescript`, `@types/*`, `eslint`)

---

### 2. 모던 TypeScript 경로 별칭 (Path Aliases)

* TypeScript 6.0 이후 `baseUrl`이 Deprecated되고 7.0에서 삭제됨에 따라, `tsconfig.json`에서 프로젝트 루트 기준 상대 경로(`./`)로 경로 별칭을 구성합니다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

---

### 3. 실습 중 발생한 오류 및 트러블슈팅

* **PowerShell 스크립트 실행 제한**: Windows 환경에서 `npm.ps1` 실행이 차단될 경우 관리자 권한으로 실행 정책을 변경하거나 `npm.cmd`를 직접 호출합니다.
* **`Couldn't find any pages or app directory`**: Next.js가 라우팅 루트 디렉터리를 감지하지 못했을 때 발생하므로 `src/app` 또는 `app` 폴더의 경로 위치를 점검합니다.
* **Git 이메일 누락 에러**: `git config --local user.email` 및 `user.name`을 사전에 등록하여 커밋 작성자 정보를 명시합니다.

---

## 1주차 (2026-09-02)

### 1. Next.js 개요 및 메타 프레임워크의 개념

* **메타 프레임워크 (Meta-framework)**: UI 라이브러리인 **React 위에 구축된 완성형 풀스택 프레임워크**입니다. 번들러(Webpack/Turbopack), 컴파일러, 라우터, 서버 렌더링 엔진 등의 설정을 기본 내장하여 개발 생산성을 높입니다.
* **공식 문서 학습 로드맵**:
  * **Getting Started / Learn**: 프레임워크 핵심 튜토리얼 (최우선 학습)
  * **Guides**: 도메인별 세부 구현 가이드 (필요 시 열람)
  * **API Reference**: 규격 및 옵션 사전 (참고용)

---

### 2. 라우터 아키텍처 변천사: App Router vs Pages Router

* **App Router (Next.js 13+ 현재 표준)**: 디렉터리 기반 라우팅, React Server Components(RSC) 기본 적용, 스트리밍 및 중첩 레이아웃 지원.
* **Pages Router (구버전 레거시)**: `pages/` 폴더 아래의 파일명 기반 라우팅, `getServerSideProps` / `getStaticProps`를 통한 데이터 페칭.

---

### 3. 내장 최적화 도구 및 배포

* **이미지 최적화 (`next/image`)**: 브라우저와 기기 화면에 맞춰 차세대 포맷(WebP, AVIF)으로 자동 압축 변환 및 반응형 리사이징 지원, CLS(레이아웃 밀림) 방지.
* **폰트 최적화 (`next/font`)**: 구글 폰트 등 웹 폰트를 빌드 시점에 셀프 호스팅하여 외부 네트워크 요청 없이 제로 레이아웃 시프트 구현.
* **배포**: Vercel을 비롯한 모던 클라우드 플랫폼을 통해 Git push와 연동된 자동 빌드 및 배포 파이프라인(CI/CD) 구축.
