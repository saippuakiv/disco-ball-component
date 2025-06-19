import React, { Suspense } from 'react';
import Discoball from './Discoball';

export default function DiscoballClient() {
  return (
    <div
      style={{
        width: '300px',
        height: '300px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        zIndex: 50,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Discoball />
      </Suspense>
    </div>
  );
}
