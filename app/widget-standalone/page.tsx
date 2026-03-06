'use client'

import AIWidget from '@/components/widget/AIWidget'

export default function StandaloneWidget() {
    return (
        <div className="fixed inset-0 bg-transparent flex items-end justify-end p-4">
            <AIWidget isFloating={false} />
            <style jsx global>{`
        body { 
          background: transparent !important; 
          margin: 0; 
          padding: 0; 
          overflow: hidden; 
        }
      `}</style>
        </div>
    )
}
