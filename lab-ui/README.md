# @lab/ui

React, TypeScript, Storybook, react-hook-form, Tailwind CSS 기반의 공유 UI 컴포넌트 라이브러리입니다.

## 설치

```bash
npm install @lab/ui
# 또는
yarn add @lab/ui
# 또는
pnpm add @lab/ui
```

## 사용법

### 스타일 import

먼저 프로젝트의 메인 CSS 파일에 Tailwind CSS를 설정해야 합니다:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

또는 패키지의 스타일을 직접 import할 수 있습니다:

```tsx
import '@lab/ui/styles'
```

### 기본 사용

```tsx
import '@lab/ui/styles'
import { useForm } from '@lab/ui'

function App() {
  // react-hook-form 사용 예제
  const { register, handleSubmit } = useForm()
  
  return (
    <div>
      {/* 컴포넌트를 여기에 추가하세요 */}
    </div>
  )
}
```

## 개발

### 개발 모드 실행

```bash
npm run dev
```

### Storybook 실행

```bash
npm run storybook
```

### 빌드

```bash
npm run build
```

빌드 결과는 `dist` 폴더에 생성됩니다:
- `dist/index.js` - 컴포넌트 번들
- `dist/index.d.ts` - TypeScript 타입 정의
- `dist/styles.css` - 스타일 파일

### 타입 체크

```bash
npm run type-check
```

## 로컬 패키지로 사용하기

다른 프로젝트에서 로컬 패키지로 사용하려면:

```bash
# 다른 프로젝트의 package.json에서
{
  "dependencies": {
    "@lab/ui": "file:../lab-ui"
  }
}
```

또는 npm link 사용:

```bash
# lab-ui 디렉토리에서
cd apps/lab-ui
npm link

# 사용할 프로젝트에서
npm link @lab/ui
```

## 컴포넌트

컴포넌트를 `src/components` 디렉토리에 추가하고 `src/index.ts`에서 export하세요.

## 스타일링

이 패키지는 Tailwind CSS를 사용합니다. 프로젝트에서 Tailwind CSS를 설정해야 합니다.

## 라이선스

MIT
