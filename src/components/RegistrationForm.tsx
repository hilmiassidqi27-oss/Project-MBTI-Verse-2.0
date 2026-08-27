import React, { useState } from 'react';
import { UserProfile } from '../types';
import { INDUSTRIAL_DEPARTMENTS } from '../data/questions';
import { User, BadgeCheck, Briefcase, Building2, Mail, ArrowRight, Activity, PlusCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegistrationFormProps {
  initialData?: UserProfile;
  onSubmit: (data: UserProfile) => void;
  isDarkMode: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialData,
  onSubmit,
  isDarkMode
}) => {
  const initialDeptIsPredefined = initialData?.department && INDUSTRIAL_DEPARTMENTS.includes(initialData.department);
  const [selectedDeptOption, setSelectedDeptOption] = useState<string>(
    initialData?.department
      ? (initialDeptIsPredefined ? initialData.department : 'OTHER')
      : INDUSTRIAL_DEPARTMENTS[0]
  );
  const [customDept, setCustomDept] = useState<string>(
    initialData?.department && !initialDeptIsPredefined ? initialData.department : ''
  );

  const [formData, setFormData] = useState<UserProfile>(
    initialData || {
      fullName: '',
      nik: '',
      position: '',
      department: INDUSTRIAL_DEPARTMENTS[0],
      workArea: '',
      email: ''
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile | 'customDept', string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile | 'customDept', string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.nik.trim()) newErrors.nik = 'Nomor Induk Kependudukan (NIK) wajib diisi';
    if (!formData.position.trim()) newErrors.position = 'Jabatan / posisi kerja wajib diisi';
    
    if (selectedDeptOption === 'OTHER') {
      if (!customDept.trim()) {
        newErrors.department = 'Sebutkan nama departemen / unit kerja Anda';
      }
    } else {
      if (!formData.department.trim()) {
        newErrors.department = 'Departemen wajib dipilih';
      }
    }

    if (!formData.workArea?.trim()) {
      newErrors.workArea = 'Area kerja / lokasi operasional wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email aktif wajib diisi';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeptSelectChange = (val: string) => {
    setSelectedDeptOption(val);
    if (val === 'OTHER') {
      setFormData(prev => ({ ...prev, department: customDept.trim() || '' }));
    } else {
      setFormData(prev => ({ ...prev, department: val }));
    }
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: undefined }));
    }
  };

  const handleCustomDeptChange = (val: string) => {
    setCustomDept(val);
    setFormData(prev => ({ ...prev, department: val }));
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const finalDept = selectedDeptOption === 'OTHER' ? customDept.trim() : formData.department;
      onSubmit({
        ...formData,
        department: finalDept,
        workArea: formData.workArea?.trim() || ''
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Industrial Background Ambient Layer with Hotlink */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className={`w-full h-full bg-cover bg-center transition-opacity duration-700 ${
            isDarkMode ? 'opacity-15 mix-blend-luminosity' : 'opacity-10 mix-blend-multiply'
          }`}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCY3Rn_079x9fU44pj9JBRBB2iBIkeNJChWt4WgBhfLsvM1NTKySe587pokIaemAASVfPNhkN3lrT9QhZUiApOhzAVu8mDl4eZ54uTLsJF_NHAJZj9xBm4wTaBTBvBQjIcFKJ-mpVnVP1FoXwM8D-s-eMdp2jKDvRmgPNbklmChQN1rV6846uLAL2ewSnyZzQGSMkLYBWxXKG4xHGfdd28vzxKN0-IoTd2uezcJ7dB0p3UPBGYLodpx')"
          }}
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDarkMode
              ? 'bg-gradient-to-t from-[#0b1326] via-[#0b1326]/90 to-[#0b1326]/70'
              : 'bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-[#f8fafc]/60'
          }`}
        />
      </div>

      {/* Glow Effects */}
      <div
        className={`fixed top-1/4 left-1/4 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none ${
          isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-500/10'
        }`}
      />
      <div
        className={`fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${
          isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/10'
        }`}
      />

      {/* Main Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        id="registration-card"
        className={`relative z-10 w-full max-w-[720px] rounded-xl p-6 sm:p-10 md:p-12 border transition-all duration-300 shadow-2xl ${
          isDarkMode
            ? 'bg-[#111b34]/90 border-slate-800 backdrop-blur-xl'
            : 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-slate-200/50'
        }`}
      >
        {/* Accent Bar at Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

        {/* Technical Status Dots in Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-xl border mb-5 shadow-sm transition-all ${
              isDarkMode
                ? 'bg-indigo-950/70 border-indigo-500/30 text-indigo-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-600'
            }`}
          >
            <Activity className="w-8 h-8" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Asesmen Kepribadian
          </h1>
          <p
            className={`text-sm sm:text-base max-w-[520px] mx-auto ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Temukan potensi dan gaya kerja Anda melalui asesmen berbasis skenario industri terkalibrasi.
          </p>
        </div>

        {/* Assessment Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" id="assessment-registration-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Field: Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="input-fullName"
                className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="input-fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Masukkan nama Anda"
                  className={`w-full h-12 rounded-lg pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDarkMode
                      ? 'bg-[#0b1326] border border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  } ${errors.fullName ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>}
            </div>

            {/* Field: NIK */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="input-nik"
                className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                NIK (Nomor Induk Kependudukan)
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="input-nik"
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={e => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="Contoh: 3201xxxxxxxxxxxx (16 digit NIK)"
                  className={`w-full h-12 rounded-lg pl-10 pr-4 text-sm font-data-mono transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDarkMode
                      ? 'bg-[#0b1326] border border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  } ${errors.nik ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                />
              </div>
              {errors.nik && <p className="text-xs text-red-500 mt-0.5">{errors.nik}</p>}
            </div>

            {/* Field: Jabatan */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="input-position"
                className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Jabatan / Posisi Kerja
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="input-position"
                  type="text"
                  value={formData.position}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Contoh: Senior Mechanical Technician"
                  className={`w-full h-12 rounded-lg pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDarkMode
                      ? 'bg-[#0b1326] border border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  } ${errors.position ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                />
              </div>
              {errors.position && <p className="text-xs text-red-500 mt-0.5">{errors.position}</p>}
            </div>

            {/* Field: Departemen */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="select-department"
                className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Departemen / Unit Kerja
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  id="select-department"
                  value={selectedDeptOption}
                  onChange={e => handleDeptSelectChange(e.target.value)}
                  className={`w-full h-12 rounded-lg pl-10 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#0b1326] border border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-white border border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                >
                  {INDUSTRIAL_DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept} className={isDarkMode ? 'bg-[#0b1326] text-white' : 'bg-white text-slate-900'}>
                      {dept}
                    </option>
                  ))}
                  <option value="OTHER" className={isDarkMode ? 'bg-[#0b1326] text-indigo-400 font-semibold' : 'bg-white text-indigo-600 font-semibold'}>
                    + Lainnya (Unit Kerja Belum Terdaftar...)
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Conditional Input for Custom Department if 'OTHER' selected */}
              <AnimatePresence>
                {selectedDeptOption === 'OTHER' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-1 overflow-hidden"
                  >
                    <div className="relative">
                      <PlusCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
                      <input
                        id="input-custom-department"
                        type="text"
                        value={customDept}
                        onChange={e => handleCustomDeptChange(e.target.value)}
                        placeholder="Ketikkan nama unit kerja / departemen Anda"
                        autoFocus
                        className={`w-full h-11 rounded-lg pl-10 pr-4 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                          isDarkMode
                            ? 'bg-[#0b1326] border border-indigo-500/50 text-white placeholder:text-slate-500 focus:border-indigo-400'
                            : 'bg-indigo-50/40 border border-indigo-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                        } ${errors.department ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.department && <p className="text-xs text-red-500 mt-0.5">{errors.department}</p>}
            </div>

            {/* Field: Area Kerja (Manual Text Input) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="input-work-area"
                className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Area Kerja / Lokasi Operasional
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="input-work-area"
                  type="text"
                  value={formData.workArea || ''}
                  onChange={e => {
                    setFormData({ ...formData, workArea: e.target.value });
                    if (errors.workArea) {
                      setErrors(prev => ({ ...prev, workArea: undefined }));
                    }
                  }}
                  placeholder="Contoh: Central Control Room, Workshop, Processing Unit, QC Hub..."
                  className={`w-full h-12 rounded-lg pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isDarkMode
                      ? 'bg-[#0b1326] border border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                      : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                  } ${errors.workArea ? 'border-red-500 focus:ring-red-500/50' : ''}`}
                />
              </div>
              {errors.workArea && <p className="text-xs text-red-500 mt-0.5">{errors.workArea}</p>}
            </div>
          </div>

          {/* Field: Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="input-email"
              className={`font-label-caps text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Email Perusahaan / Aktif
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="input-email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Alamat email aktif untuk pengiriman laporan"
                className={`w-full h-12 rounded-lg pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDarkMode
                    ? 'bg-[#0b1326] border border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500'
                    : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                } ${errors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
          </div>

          {/* Action Button */}
          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              id="start-assessment-submit-button"
              className={`w-full h-14 flex items-center justify-center gap-2 rounded-lg font-label-caps text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg active:scale-[0.99] ${
                isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/40'
              }`}
            >
              <span>Mulai Asesmen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* System Status / Microcopy */}
          <div className="text-center pt-2">
            <span className="font-data-mono text-xs text-slate-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              SYSTEM READY // MBTI-IND-V2 // 24 SCENARIOS
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
