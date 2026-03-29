"use client"
export const dynamic = 'force-dynamic'
import NextDynamic from "next/dynamic"
const SchoolApp = NextDynamic(() => import("@/components/SchoolApp"), { ssr: false })
export default function Page() { return <SchoolApp /> }