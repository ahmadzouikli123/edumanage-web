"use client"
export const dynamic = 'force-dynamic'
import dynamic from "next/dynamic"
const SchoolApp = dynamic(() => import("@/components/SchoolApp"), { ssr: false })
export default function Page() { return <SchoolApp /> }
