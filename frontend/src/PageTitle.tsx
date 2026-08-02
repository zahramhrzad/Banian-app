import type { ReactNode } from 'react'

function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm font-bold mb-4 text-center z-10" style={{ color: '#be9c77' }}>
      {children}
    </div>
  )
}

export default PageTitle