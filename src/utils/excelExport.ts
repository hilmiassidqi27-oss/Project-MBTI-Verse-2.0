import * as XLSX from 'xlsx';
import { SubmissionRecord } from '../types';

export function exportWorkforceToExcel(submissions: SubmissionRecord[]): void {
  const wb = XLSX.utils.book_new();
  const origin = window.location.origin + window.location.pathname;

  // --- SHEET 1: REKAP HASIL KANDIDAT ---
  const sheet1Data = submissions.map((s, idx) => ({
    No: idx + 1,
    'ID Submisi': s.id,
    'Tautan Laporan Web': `${origin}?report=${s.id}`,
    'Nama Lengkap': s.user.fullName,
    NIK: s.user.nik,
    Jabatan: s.user.position,
    Departemen: s.user.department,
    'Area Kerja': s.user.workArea || '-',
    Email: s.user.email,
    'Tipe MBTI': s.result.code,
    'Julukan Arketipe': s.result.nickname,
    'Waktu Tes': s.result.completionTime || s.createdAt
  }));

  const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
  // Column Widths for Sheet 1
  ws1['!cols'] = [
    { wch: 5 },  // No
    { wch: 16 }, // ID Submisi
    { wch: 45 }, // Tautan
    { wch: 25 }, // Nama
    { wch: 14 }, // NIK
    { wch: 22 }, // Jabatan
    { wch: 26 }, // Departemen
    { wch: 26 }, // Area Kerja
    { wch: 28 }, // Email
    { wch: 12 }, // MBTI
    { wch: 26 }, // Julukan
    { wch: 20 }  // Waktu
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Hasil Kandidat');

  // --- SHEET 2: DETAIL SKOR DIMENSI ---
  const sheet2Data = submissions.map((s, idx) => {
    const { EI, SN, TF, JP } = s.result.dimensions;
    return {
      No: idx + 1,
      'ID Submisi': s.id,
      'Nama Lengkap': s.user.fullName,
      'Tipe MBTI': s.result.code,
      'Ekstrovert E (%)': EI.leftPct,
      'Introvert I (%)': EI.rightPct,
      'Dominan E/I': EI.dominantCode,
      'Kejelasan E/I': EI.clarityScore,
      'Sensing S (%)': SN.leftPct,
      'Intuition N (%)': SN.rightPct,
      'Dominan S/N': SN.dominantCode,
      'Kejelasan S/N': SN.clarityScore,
      'Thinking T (%)': TF.leftPct,
      'Feeling F (%)': TF.rightPct,
      'Dominan T/F': TF.dominantCode,
      'Kejelasan T/F': TF.clarityScore,
      'Judging J (%)': JP.leftPct,
      'Perceiving P (%)': JP.rightPct,
      'Dominan J/P': JP.dominantCode,
      'Kejelasan J/P': JP.clarityScore
    };
  });

  const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
  ws2['!cols'] = [
    { wch: 5 },
    { wch: 16 },
    { wch: 25 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 }
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Detail Skor Dimensi');

  // --- SHEET 3: STATISTIK DISTRIBUSI MBTI ---
  const typeCounts: Record<string, number> = {};
  const typeDepts: Record<string, Record<string, number>> = {};

  submissions.forEach(s => {
    const code = s.result.code;
    typeCounts[code] = (typeCounts[code] || 0) + 1;
    if (!typeDepts[code]) typeDepts[code] = {};
    typeDepts[code][s.user.department] = (typeDepts[code][s.user.department] || 0) + 1;
  });

  const total = submissions.length || 1;
  const sheet3Data = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([code, cnt], idx) => {
      // Find highest department for this type
      const depts = typeDepts[code] || {};
      let topDept = '-';
      let topDeptCnt = 0;
      Object.entries(depts).forEach(([dept, dcnt]) => {
        if (dcnt > topDeptCnt) {
          topDeptCnt = dcnt;
          topDept = dept;
        }
      });

      return {
        Peringkat: idx + 1,
        'Tipe MBTI': code,
        'Jumlah Orang': cnt,
        'Persentase Tenaga Kerja (%)': `${Math.round((cnt / total) * 100)}%`,
        'Departemen Mayoritas': topDept
      };
    });

  const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
  ws3['!cols'] = [
    { wch: 10 },
    { wch: 14 },
    { wch: 16 },
    { wch: 28 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Statistik Distribusi MBTI');

  // Generate File Download
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `MBTI_Industrial_Rekap_Karyawan_${dateStr}.xlsx`);
}
