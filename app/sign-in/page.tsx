'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, ShieldCheck, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/marketplace/Header'
import { Footer } from '@/components/marketplace/Footer'
import { BottomNav } from '@/components/marketplace/BottomNav'
import { LocationModal } from '@/components/marketplace/LocationModal'
import { BecomeSellerModal } from '@/components/marketplace/BecomeSellerModal'
import { DEMO_USERS } from '@/lib/mock-data'
import { useBup } from '@/context/BupContext'

export default function SignInPage() {
  const router = useRouter()
  const { loginUser, currentUser } = useBup()

  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [isDemoFilled, setIsDemoFilled] = useState(false)

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Login demo student
    loginUser(DEMO_USERS.student)
    router.push('/')
  }

  const fillDemoStudent = () => {
    setStudentId('22041108')
    setPassword('••••••••')
    setIsDemoFilled(true)
  }

  const fillDemoFaculty = () => {
    loginUser(DEMO_USERS.faculty)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#392525] flex flex-col">
      <Header />

      <main className="mx-auto max-w-md w-full flex-1 px-4 py-12 flex flex-col justify-center">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-neutral-200">
          
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#1f3a2e] text-[#E3E890] shadow-sm mb-3">
              <GraduationCap className="size-7" />
            </div>
            <h1 className="font-serif text-2xl font-black text-neutral-900">
              Sign In with BUP ID
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Official authentication for BUP students, faculty & administration
            </p>
          </div>

          {currentUser ? (
            <div className="mt-6 text-center">
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                <CheckCircle2 className="size-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-900">
                  You are already signed in as {currentUser.name}
                </p>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">
                  ID: {currentUser.studentId || currentUser.email}
                </p>
              </div>
              <Link
                href="/marketplace"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors"
              >
                <span>Go to Marketplace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleStudentSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  BUP Student ID / Faculty Code
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 22041108"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Password / Campus PIN
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1f3a2e] py-2.5 text-xs font-bold text-white hover:bg-[#15271f] transition-colors shadow-xs"
              >
                Sign In to BUPCommon
              </button>

              {/* Quick Demo Fill Buttons */}
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
                  Quick Demo One-Click Fill
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoStudent}
                    className="rounded-md border border-neutral-200 bg-neutral-50 py-1.5 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100"
                  >
                    Demo Student (Tanvir)
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoFaculty}
                    className="rounded-md border border-neutral-200 bg-neutral-50 py-1.5 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100"
                  >
                    Demo Faculty (Dr. Sabrina)
                  </button>
                </div>
              </div>

              <div className="text-center text-xs text-neutral-500 pt-2">
                Don&apos;t have a BUP ID?{' '}
                <Link href="/register" className="font-bold text-[#b5573a] hover:underline">
                  Guest / Outside Register
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
      <BottomNav />
      <LocationModal />
      <BecomeSellerModal />
    </div>
  )
}
