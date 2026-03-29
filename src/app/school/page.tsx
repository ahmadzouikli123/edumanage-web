export const dynamic = 'force-dynamic'
"use client"
import dynamic from "next/dynamic"
const SchoolApp = dynamic(() => import("@/components/SchoolApp"), { ssr: false })
export default function Page() { return <SchoolApp /> }
