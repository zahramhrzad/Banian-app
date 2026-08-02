function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-5 left-5 z-20 rounded-full flex items-center justify-center"
      style={{
        width: '36px',
        height: '36px',
        background: 'rgba(190,156,119,0.15)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be9c77" strokeWidth="2.2">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  )
}

export default BackButton