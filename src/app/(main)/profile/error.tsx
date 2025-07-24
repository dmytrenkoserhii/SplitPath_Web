'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
}
