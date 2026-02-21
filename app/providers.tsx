'use client'

import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        backdropFilter: 'blur(10px)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#38bdf8',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Analytics />
        </>
    )
}
