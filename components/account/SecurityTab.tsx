'use client'

import React, { useState } from 'react'
import { Shield, Key, Smartphone, Laptop, Trash2, LogOut, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { useBup } from '@/context/BupContext'

export function SecurityTab() {
  const { logoutUser, showToast } = useBup()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro 14" (Current Session)',
      browser: 'Chrome 122 • macOS Sonoma',
      location: 'Mirpur Cantonment, Dhaka',
      ip: '103.145.112.44',
      isCurrent: true,
      lastActive: 'Active now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro',
      browser: 'Safari Mobile • iOS 17.4',
      location: 'Mirpur DOHS, Dhaka',
      ip: '103.145.112.98',
      isCurrent: false,
      lastActive: '2 hours ago',
    },
    {
      id: 'sess-3',
      device: 'BUP FST Lab Computer #12',
      browser: 'Firefox 120 • Windows 11',
      location: 'BUP Campus Mirpur',
      ip: '172.16.20.104',
      isCurrent: false,
      lastActive: 'Yesterday',
    }
  ])

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordError(null)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showToast('Password changed successfully!')
  }

  const handleLogoutOtherSessions = () => {
    setSessions(sessions.filter((s) => s.isCurrent))
    showToast('Logged out of all other campus devices.')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm.')
      return
    }
    setIsDeleteModalOpen(false)
    logoutUser()
    showToast('Your BUPCommon account has been deleted.')
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs">
        <h2 className="font-serif font-black text-base text-neutral-900 flex items-center gap-2">
          <Shield className="size-5 text-[#1f3a2e]" />
          <span>Security & Device Sessions</span>
        </h2>
        <p className="text-xs text-neutral-500">
          Manage BUP ID authentication, passwords, and campus terminal logins
        </p>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800 flex items-center gap-2">
            <Key className="size-4 text-[#1f3a2e]" />
            <span>Change Account Password</span>
          </h3>
          <p className="text-xs text-neutral-500">Keep your student marketplace account secure</p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordError(null)
              }}
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setPasswordError(null)
                }}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setPasswordError(null)
                }}
                className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-[11px] font-semibold text-rose-600">{passwordError}</p>
          )}

          <div className="pt-1">
            <button
              type="submit"
              className="rounded-lg bg-[#1f3a2e] px-4 py-2 font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* ACTIVE SESSIONS */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800">
              Active Campus & Mobile Sessions
            </h3>
            <p className="text-xs text-neutral-500">Devices currently logged into your BUPCommon account</p>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleLogoutOtherSessions}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
            >
              <LogOut className="size-3.5 text-rose-500" />
              <span>Log Out All Other Devices</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-neutral-100 text-neutral-600">
                  {sess.device.includes('iPhone') ? (
                    <Smartphone className="size-4" />
                  ) : (
                    <Laptop className="size-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="rounded bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {sess.browser} • {sess.location} ({sess.ip})
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium text-neutral-400">{sess.lastActive}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DANGER ZONE: DELETE ACCOUNT */}
      <div className="rounded-2xl bg-rose-50/50 p-5 sm:p-6 border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-900">
          <AlertTriangle className="size-5 text-rose-600 shrink-0" />
          <h3 className="font-serif font-black text-sm uppercase tracking-wider">
            Danger Zone
          </h3>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed max-w-xl">
          Permanently delete your BUPCommon account, active listings, order history, and seller shop profile. This action cannot be reversed.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
        >
          Delete Account
        </button>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-black text-base text-rose-600">Delete Account Confirmation</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure? All your data, active stall bookings, student seller ratings, and saved addresses will be immediately removed.
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Type <strong className="text-rose-600">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-lg border border-neutral-300 p-2 text-xs font-mono font-bold text-neutral-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
