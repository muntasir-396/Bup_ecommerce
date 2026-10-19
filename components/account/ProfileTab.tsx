'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  Calendar,
  Phone,
  Mail,
  User,
  Check,
  X
} from 'lucide-react'
import { useBup } from '@/context/BupContext'
import { VerificationBadge } from './VerificationBadge'

// Bangladeshi Phone Number Validator
// Validates +8801[3-9]\d{8} or 01[3-9]\d{8}
export function isValidBdPhone(phone: string): boolean {
  if (!phone) return false
  const clean = phone.trim().replace(/[\s-]/g, '')
  return /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(clean)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ProfileTab() {
  const { currentUser, updateUserProfile, showToast } = useBup()

  // Form State
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Verification Modal
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [verifyMethod, setVerifyMethod] = useState<'otp' | 'idcard'>('otp')
  const [studentIdInput, setStudentIdInput] = useState(currentUser?.studentId || '')
  const [bupEmailInput, setBupEmailInput] = useState(currentUser?.email || '')
  const [otpInput, setOtpInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [idCardFile, setIdCardFile] = useState<string | null>(null)

  // Profile Form Fields
  const [name, setName] = useState(currentUser?.name || '')
  const [username, setUsername] = useState(currentUser?.username || '')
  const [bio, setBio] = useState(currentUser?.bio || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [gender, setGender] = useState(currentUser?.gender || 'Male')
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth || '')
  const [studentId, setStudentId] = useState(currentUser?.studentId || '')
  const [department, setDepartment] = useState(currentUser?.department || '')
  const [faculty, setFaculty] = useState(currentUser?.faculty || '')
  const [batch, setBatch] = useState(currentUser?.batch || '')
  const [hall, setHall] = useState(currentUser?.hall || '')
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  )
  const [coverUrl, setCoverUrl] = useState(
    currentUser?.coverUrl ||
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
  )

  // Sync state if currentUser changes from outside
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setUsername(currentUser.username || '')
      setBio(currentUser.bio || '')
      setPhone(currentUser.phone || '')
      setEmail(currentUser.email || '')
      setGender(currentUser.gender || 'Male')
      setDateOfBirth(currentUser.dateOfBirth || '')
      setStudentId(currentUser.studentId || '')
      setDepartment(currentUser.department || '')
      setFaculty(currentUser.faculty || '')
      setBatch(currentUser.batch || '')
      setHall(currentUser.hall || '')
      if (currentUser.avatarUrl) setAvatarUrl(currentUser.avatarUrl)
      if (currentUser.coverUrl) setCoverUrl(currentUser.coverUrl)
    }
  }, [currentUser])

  // Validation
  const phoneError = useMemo(() => {
    if (!phone) return null
    if (!isValidBdPhone(phone)) {
      return 'Invalid BD phone number. Must be +8801XXXXXXXXX or 01XXXXXXXXX (11 digits, e.g. 017XXXXXXXX)'
    }
    return null
  }, [phone])

  const emailError = useMemo(() => {
    if (!email) return null
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address.'
    }
    return null
  }, [email])

  const isFormValid = !phoneError && !emailError && name.trim().length > 1

  // Profile Completion Meter
  const completionData = useMemo(() => {
    const fields = [
      { key: 'name', value: name, weight: 15, label: 'Full name' },
      { key: 'phone', value: phone && !phoneError, weight: 15, label: 'Verified phone' },
      { key: 'email', value: email && !emailError, weight: 15, label: 'BUP Email' },
      { key: 'studentId', value: studentId, weight: 15, label: 'Student ID' },
      { key: 'department', value: department, weight: 10, label: 'Department' },
      { key: 'batch', value: batch, weight: 10, label: 'Intake batch' },
      { key: 'bio', value: bio, weight: 10, label: 'Bio' },
      { key: 'hall', value: hall, weight: 10, label: 'Residence/Hall' },
    ]

    const completedWeight = fields.reduce((sum, f) => (f.value ? sum + f.weight : sum), 0)
    const missing = fields.filter((f) => !f.value).map((f) => f.label)

    return {
      percentage: Math.min(100, completedWeight),
      missingField: missing[0] || null,
    }
  }, [name, phone, phoneError, email, emailError, studentId, department, batch, bio, hall])

  const handleFieldChange = () => {
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (!isFormValid) {
      showToast('Please fix the errors in the form before saving.')
      return
    }

    updateUserProfile({
      name,
      username,
      bio,
      phone,
      email,
      gender,
      dateOfBirth,
      studentId,
      department,
      faculty,
      batch,
      hall,
      avatarUrl,
      coverUrl,
    })

    setHasUnsavedChanges(false)
    setIsEditing(false)
  }

  const handleDiscard = () => {
    if (currentUser) {
      setName(currentUser.name || '')
      setUsername(currentUser.username || '')
      setBio(currentUser.bio || '')
      setPhone(currentUser.phone || '')
      setEmail(currentUser.email || '')
      setGender(currentUser.gender || 'Male')
      setDateOfBirth(currentUser.dateOfBirth || '')
      setStudentId(currentUser.studentId || '')
      setDepartment(currentUser.department || '')
      setFaculty(currentUser.faculty || '')
      setBatch(currentUser.batch || '')
      setHall(currentUser.hall || '')
    }
    setHasUnsavedChanges(false)
    setIsEditing(false)
  }

  // Cover & Avatar Upload Simulation
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverUrl(url)
      setHasUnsavedChanges(true)
      showToast('Cover photo updated! Remember to save changes.')
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      setHasUnsavedChanges(true)
      showToast('Avatar photo updated! Remember to save changes.')
    }
  }

  // Verification Handlers
  const handleSendOtp = () => {
    if (!studentIdInput || !bupEmailInput.includes('@bup.edu.bd')) {
      showToast('Please enter your BUP Student ID and official @bup.edu.bd email.')
      return
    }
    setOtpSent(true)
    showToast('OTP code sent to your BUP academic inbox: 829104')
  }

  const handleConfirmVerification = () => {
    if (verifyMethod === 'otp') {
      if (otpInput.trim() !== '829104' && otpInput.trim().length !== 6) {
        showToast('Invalid OTP. Please enter the 6-digit code (use 829104).')
        return
      }
      updateUserProfile({
        isBupVerified: true,
        verificationStatus: 'VERIFIED',
        studentId: studentIdInput,
        email: bupEmailInput,
      })
      setIsVerificationModalOpen(false)
      showToast('🎉 Congratulations! Verified as BUP Student. 5% campus discount unlocked.')
    } else {
      updateUserProfile({
        verificationStatus: 'PENDING',
        studentId: studentIdInput,
      })
      setIsVerificationModalOpen(false)
      showToast('Student ID document uploaded! Registry admin will review within 24 hours.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* UNSAVED CHANGES BANNER */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/30 text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-600 shrink-0" />
            <span>You have unsaved changes to your BUP profile.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="rounded-md border border-amber-300 px-3 py-1 font-bold text-neutral-700 hover:bg-white"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="rounded-md bg-[#1f3a2e] px-3.5 py-1 font-bold text-white hover:bg-[#b5573a] disabled:opacity-50"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {/* COVER + AVATAR HERO CARD */}
      <div className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-56 w-full bg-neutral-200">
          <img src={coverUrl} alt="Profile Cover" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Change Cover Button */}
          <label className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-md hover:bg-white cursor-pointer transition-all">
            <Camera className="size-3.5 text-[#1f3a2e]" />
            <span>Change Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Header Details */}
        <div className="p-5 sm:p-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            {/* Avatar with Crop/Upload Badge */}
            <div className="relative size-24 sm:size-28 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden shrink-0 group">
              <img src={avatarUrl} alt={name} className="size-full object-cover" />
              <label className="absolute inset-0 bg-black/40 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold">
                <Upload className="size-5 mb-1" />
                <span className="text-[10px]">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-xs"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="rounded-lg border border-neutral-300 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f3a2e] px-4 py-2 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors disabled:opacity-50 shadow-xs"
                  >
                    <Save className="size-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name & Headline */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl font-black text-neutral-900">
                  {name || 'Campus Student'}
                </h1>
                {username && (
                  <span className="text-xs text-neutral-500 font-mono">@{username}</span>
                )}
                <VerificationBadge user={currentUser} size="md" />
              </div>
              <p className="mt-1 text-xs text-neutral-600 max-w-xl">
                {bio || 'Add a bio to introduce yourself to campus peers and buyers.'}
              </p>
            </div>

            {/* Verification trigger if not verified */}
            {(!currentUser?.isBupVerified || currentUser?.verificationStatus !== 'VERIFIED') && (
              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-98"
              >
                <GraduationCap className="size-4" />
                <span>Verify as BUP Student</span>
              </button>
            )}
          </div>

          {/* PROFILE COMPLETION METER */}
          <div className="mt-6 rounded-xl bg-[#FAF5E9] p-4 border border-[#213527]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1f3a2e] flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#b5573a]" />
                Profile Completion: {completionData.percentage}%
              </span>
              {completionData.missingField ? (
                <span className="text-neutral-500 text-[11px] font-normal">
                  Next: add your <strong>{completionData.missingField}</strong> (+15%)
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">100% Complete! Top Campus Standing ✨</span>
              )}
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1f3a2e] via-emerald-600 to-[#b5573a] transition-all duration-500 rounded-full"
                style={{ width: `${completionData.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FORM: BASIC INFO & BUP ACADEMIC DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT: PERSONAL INFORMATION */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800">
              Personal Information
            </h2>
            <p className="text-xs text-neutral-500">Contact and public profile details</p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              disabled={!isEditing}
              onChange={(e) => {
                setName(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Campus Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-neutral-400">@</span>
              <input
                type="text"
                value={username}
                disabled={!isEditing}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                  handleFieldChange()
                }}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 pl-7 pr-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600 font-mono"
              />
            </div>
          </div>

          {/* BD Phone Field (STRICT VALIDATION) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                disabled={!isEditing}
                placeholder="+88017XXXXXXXX or 017XXXXXXXX"
                onChange={(e) => {
                  setPhone(e.target.value)
                  handleFieldChange()
                }}
                className={`w-full rounded-lg border px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600 font-mono ${
                  phoneError ? 'border-rose-500 bg-rose-50/40' : 'border-neutral-300 bg-neutral-50/50 focus:border-[#1f3a2e]'
                }`}
              />
            </div>
            {phoneError && (
              <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="size-3 shrink-0" />
                <span>{phoneError}</span>
              </p>
            )}
            <p className="mt-1 text-[10px] text-neutral-400">
              Used for handover SMS notifications and courier coordination.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              disabled={!isEditing}
              onChange={(e) => {
                setEmail(e.target.value)
                handleFieldChange()
              }}
              className={`w-full rounded-lg border px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600 ${
                emailError ? 'border-rose-500 bg-rose-50/40' : 'border-neutral-300 bg-neutral-50/50 focus:border-[#1f3a2e]'
              }`}
            />
            {emailError && (
              <p className="mt-1 text-[11px] font-semibold text-rose-600">{emailError}</p>
            )}
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Gender</label>
              <select
                value={gender}
                disabled={!isEditing}
                onChange={(e) => {
                  setGender(e.target.value)
                  handleFieldChange()
                }}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-2.5 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                disabled={!isEditing}
                onChange={(e) => {
                  setDateOfBirth(e.target.value)
                  handleFieldChange()
                }}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-2.5 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">About Me / Bio</label>
            <textarea
              rows={3}
              value={bio}
              disabled={!isEditing}
              onChange={(e) => {
                setBio(e.target.value)
                handleFieldChange()
              }}
              placeholder="e.g. Senior at FST, passionate about robotics, photography, and pre-loved engineering textbooks."
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>
        </div>

        {/* RIGHT: BUP ACADEMIC CREDENTIALS */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif font-black text-sm uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <GraduationCap className="size-4 text-[#1f3a2e]" />
                <span>BUP Academic Identity</span>
              </h2>
              <p className="text-xs text-neutral-500">Student registry and campus affiliation</p>
            </div>
            <VerificationBadge user={currentUser} size="sm" showSeller={false} />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              BUP Student ID
            </label>
            <input
              type="text"
              value={studentId}
              disabled={!isEditing}
              placeholder="e.g. 210204018"
              onChange={(e) => {
                setStudentId(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 font-mono focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              disabled={!isEditing}
              placeholder="e.g. Computer Science & Engineering (CSE)"
              onChange={(e) => {
                setDepartment(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Faculty
            </label>
            <input
              type="text"
              value={faculty}
              disabled={!isEditing}
              placeholder="e.g. Faculty of Science & Technology (FST)"
              onChange={(e) => {
                setFaculty(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Batch & Intake */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Batch / Intake
            </label>
            <input
              type="text"
              value={batch}
              disabled={!isEditing}
              placeholder="e.g. Intake 26 (Batch 2021)"
              onChange={(e) => {
                setBatch(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Hall / Residence */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Hall / Campus Residence
            </label>
            <input
              type="text"
              value={hall}
              disabled={!isEditing}
              placeholder="e.g. Mirpur DOHS Residence / Day Scholar"
              onChange={(e) => {
                setHall(e.target.value)
                handleFieldChange()
              }}
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:border-[#1f3a2e] focus:outline-hidden disabled:bg-neutral-100 disabled:text-neutral-600"
            />
          </div>

          {/* Verification CTA Box */}
          <div className="rounded-xl bg-[#1f3a2e]/5 p-4 border border-[#1f3a2e]/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1f3a2e]">
              <ShieldCheck className="size-4 text-[#b5573a]" />
              <span>BUP Trust & Verification Status</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Verified students unlock 5% welfare discounts, trusted seller badges, and instant listing auto-approval without manual registry moderation.
            </p>
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="mt-1 text-xs font-bold text-[#1f3a2e] hover:text-[#b5573a] hover:underline flex items-center gap-1"
            >
              <span>{currentUser?.isBupVerified ? 'View Verification Certificate' : 'Complete Verification Now'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

      {/* VERIFY AS BUP STUDENT MODAL */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-neutral-900">
                    Verify as BUP Student
                  </h3>
                  <p className="text-[11px] text-neutral-500">Official Campus Registry Check</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Method switcher */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setVerifyMethod('otp')}
                className={`py-2 rounded-lg border text-center transition-all ${
                  verifyMethod === 'otp'
                    ? 'border-[#1f3a2e] bg-[#1f3a2e] text-white shadow-xs'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                BUP Email OTP
              </button>
              <button
                type="button"
                onClick={() => setVerifyMethod('idcard')}
                className={`py-2 rounded-lg border text-center transition-all ${
                  verifyMethod === 'idcard'
                    ? 'border-[#1f3a2e] bg-[#1f3a2e] text-white shadow-xs'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Upload Student ID Card
              </button>
            </div>

            {verifyMethod === 'otp' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">BUP Student ID</label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. 210204018"
                    className="w-full rounded-lg border border-neutral-300 p-2.5 font-mono text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Official BUP Email</label>
                  <input
                    type="email"
                    value={bupEmailInput}
                    onChange={(e) => setBupEmailInput(e.target.value)}
                    placeholder="student.name@bup.edu.bd"
                    className="w-full rounded-lg border border-neutral-300 p-2.5 text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                  />
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full rounded-lg bg-[#1f3a2e] py-2.5 font-bold text-white hover:bg-[#b5573a] transition-colors"
                  >
                    Send Verification OTP Code
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="rounded-lg bg-emerald-50 p-2.5 text-[11px] text-emerald-800 border border-emerald-200">
                      OTP sent to <strong>{bupEmailInput}</strong>. (For demo testing, enter code <strong>829104</strong>)
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">Enter 6-digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="829104"
                        className="w-full rounded-lg border border-neutral-300 p-2.5 text-center font-mono text-lg font-bold tracking-widest text-neutral-900 focus:border-[#1f3a2e] focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmVerification}
                      className="w-full rounded-lg bg-emerald-700 py-2.5 font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm"
                    >
                      Verify & Activate Student Badge
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">BUP Student ID</label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder="e.g. 210204018"
                    className="w-full rounded-lg border border-neutral-300 p-2.5 font-mono text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">ID Card Front Photo</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-[#1f3a2e] cursor-pointer">
                    <Upload className="size-6 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-700">Click to upload photo of your student card</p>
                    <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setIdCardFile(URL.createObjectURL(e.target.files[0]))
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  {idCardFile && (
                    <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="size-3.5" /> ID Card photo selected
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className="w-full rounded-lg bg-[#1f3a2e] py-2.5 font-bold text-white hover:bg-[#b5573a] transition-colors"
                >
                  Submit for Admin Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
