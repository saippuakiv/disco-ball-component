# Interactive Disco Ball Component

A dynamic 3D disco ball component that responds to mouse movement, built with React and Three.js.

## Features

- Mouse-responsive tile highlighting
- Realistic metallic materials with clearcoat
- Smooth hover animations
- Lightweight and performant

## Requirements

- React 18+
- @react-three/fiber 8+
- three.js 0.150+

## Installation

```bash
npm install three @react-three/fiber

```

## Usage

```tsx
import DiscoballClient from './DiscoballClient';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
      }}
    >
      <DiscoballClient />
    </div>
  );
}
```
