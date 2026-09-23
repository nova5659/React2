# React2

# 박현준 202230114

React2 수업 내용과 실습 기록입니다. 최신 수업부터 정리합니다.

## 2026년 9월 23일 | 4주차

### README 작성 및 학습 기록 정리

- 프로젝트 루트의 `README.md`에 주차별 수업 내용을 기록한다.
- 맨 위에 이름과 학번을 H1 크기로 작성한다.
- 각 수업 내용 앞에 날짜와 주차를 표시한다.
- 최신 자료가 가장 위에 오도록 정리한다.
- 3주차 정리 내용부터 수행 평가에 반영된다.

### Markdown 기본 문법

- `# 제목`: H1 제목
- `## 제목`: H2 제목
- `### 제목`: H3 제목
- `- 내용`: 목록
- 백틱으로 코드를 감싸면 코드 형식으로 표시할 수 있다.

---

## 2026년 9월 16일 | 3주차

### Next.js의 페이지와 레이아웃

- `src/app/page.tsx`는 루트 경로 `/`에 표시할 페이지를 정의한다.
- `src/app/layout.tsx`는 페이지를 감싸는 공통 구조를 정의한다.
- 루트 레이아웃에는 `<html>`과 `<body>`가 필요하다.
- `children` 위치에 현재 페이지의 내용이 표시된다.

### 프로젝트 구조

```text
React2/
├── package.json
├── tsconfig.json
└── src/
    └── app/
        ├── layout.tsx
        └── page.tsx
```

### 공통 헤더와 푸터 실습

`src/app/layout.tsx`

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header>Root Layout Header</header>
        {children}
        <footer>Root Layout Footer</footer>
      </body>
    </html>
  );
}
```

`src/app/page.tsx`

```tsx
export default function Page() {
  return <div>루트 페이지</div>;
}
```

실행 결과:

```text
Root Layout Header
루트 페이지
Root Layout Footer
```

### 실행 오류 해결

- PowerShell에서 `npm.ps1` 실행이 차단되면 `npm.cmd run dev`로 실행한다.
- `Couldn't find any pages or app directory` 오류가 발생하면 프로젝트의 `app` 또는 `src/app` 폴더 위치를 확인한다.
- C드라이브와 D드라이브처럼 프로젝트 경로가 다르면 수정한 파일이 실행하는 폴더에도 있는지 확인해야 한다.
- 브라우저에서 연결이 거부되면 터미널에서 서버가 종료되었는지 확인한다.
- 실행 후 터미널의 `Local` 주소로 접속한다.

---

## 2026년 9월 9일 | 2주차

### Next.js 프로젝트 설정

`package.json`은 프로젝트 정보, 의존성, 실행 명령을 관리하는 파일이다.

프로젝트 폴더에서 다음 명령으로 초기 설정을 진행한다.

```bash
npm init -y
npm install next react react-dom
npm install -D typescript @types/react @types/node
```

### 실행 스크립트

`package.json`의 `scripts`에 명령을 등록한다.

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

- `npm run dev`: 개발 서버 실행
- `npm run build`: 배포용 빌드 생성
- `npm run start`: 빌드한 애플리케이션 실행

명령은 `package.json`이 있는 프로젝트 폴더에서 실행해야 한다.

### 기본 페이지 작성

`src/app/page.tsx`

```tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

### 모듈 설정

`package.json`의 CommonJS 설정과 코드의 `import`·`export` 문법이 충돌하는 오류를 확인했다.

프로젝트에서는 다음 설정을 사용했다.

```json
"type": "module"
```

### TypeScript 경로 별칭

`tsconfig.json`의 `compilerOptions`에 경로 별칭을 설정했다.

```json
"ignoreDeprecations": "6.0",
"paths": {
  "@/styles/*": ["./src/styles/*"],
  "@/components/*": ["./src/components/*"]
}
```

실습 환경의 TypeScript 7에서는 `baseUrl`이 제거되어, 각 경로를 `./src/` 기준으로 직접 지정했다.

### VS Code와 Git Bash

- VS Code는 코드를 작성하고 수정하는 편집기이다.
- Git은 코드의 변경 이력을 관리하는 도구이다.
- Git Bash는 Git 명령과 셸 명령을 실행하는 터미널이다.
- VS Code의 `Terminal: Select Default Profile`에서 Git Bash를 선택하면 통합 터미널로 사용할 수 있다.

### Git과 GitHub

- 저장: 편집한 내용을 파일에 반영한다.
- 커밋: 변경 사항을 로컬 Git 이력에 기록한다.
- 푸시: 로컬 커밋을 GitHub 저장소에 전송한다.
- 풀: 원격 변경 사항을 가져와 현재 브랜치에 통합한다.

커밋 작성자 정보는 `user.name`과 `user.email`로 설정한다.

```bash
git config --local user.name "박현준"
git config --local user.email "GitHub에 등록한 이메일"
```

원격 저장소 연결 상태 확인:

```bash
git remote -v
```

GitHub의 기존 커밋과 로컬 커밋을 병합한 후 업로드했다.

### 실습 중 확인한 오류

- `ENOENT: Could not read package.json`: 실행 폴더에 `package.json`이 없었다.
- `unable to auto-detect email address`: Git 작성자 이메일 설정이 필요했다.
- `GitHub repository already exists`: 같은 이름의 저장소가 이미 존재했다.
- 푸시 거절: 원격 저장소의 변경 사항을 먼저 통합해야 했다.

### Git 관리 시 주의할 점

`node_modules`와 `.next`는 의존성 및 자동 생성 결과물이므로 Git 관리에서 제외한다. 이미 추적 중인 파일은 `.gitignore`에 추가하는 것만으로 추적이 해제되지는 않는다.
