import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MBTIResult, UserProfile } from '../types';

export function exportResultToPDF(result: MBTIResult, user: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [79, 70, 229]; // Indigo-600 #4f46e5
  const darkTextColor = [30, 41, 59]; // Slate-800 #1e293b
  const mutedTextColor = [100, 116, 139]; // Slate-500 #64748b
  const emeraldColor = [16, 185, 129]; // Emerald-500 #10b981

  const pageWidth = doc.internal.pageSize.getWidth();

  // --- HEADER BANNER ---
  doc.setFillColor(17, 27, 52); // #111b34 Dark Panel
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MBTI INDUSTRIAL // LAPORAN ASESMEN LAPANGAN', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('SISTEM EVALUASI PROFIL PSIKOMETRIK & KOMPETENSI OPERASIONAL', 14, 23);

  // Date in header
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(8);
  doc.text(`Tanggal Cetak: ${todayStr}`, pageWidth - 14, 23, { align: 'right' });

  // Thin Accent line
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 38, pageWidth, 2, 'F');

  // --- CANDIDATE INFORMATION CARD ---
  let currentY = 48;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, currentY, pageWidth - 28, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DATA KANDIDAT / TENAGA KERJA', 20, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

  // Col 1
  doc.text(`Nama Lengkap : `, 20, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(user.fullName, 52, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(`NIK / ID Pegawai : `, 20, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text(user.nik, 52, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.text(`Email : `, 20, currentY + 29);
  doc.setFont('helvetica', 'bold');
  doc.text(user.email, 52, currentY + 29);

  // Col 2
  doc.setFont('helvetica', 'normal');
  doc.text(`Jabatan : `, 110, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(user.position, 135, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(`Departemen : `, 110, currentY + 22);
  doc.setFont('helvetica', 'bold');
  doc.text(user.department, 135, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.text(`Area Kerja : `, 110, currentY + 29);
  doc.setFont('helvetica', 'bold');
  doc.text(user.workArea || '-', 135, currentY + 29);

  // --- MAIN RESULT HIGHLIGHT ---
  currentY += 44;

  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(199, 210, 254); // Indigo-200
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(result.code, 22, currentY + 14);

  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`"${result.nickname}"`, 60, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('Tipe Kepribadian MBTI Terkalibrasi untuk Penugasan Sektor Industri & Lapangan', 60, currentY + 19);

  // --- 4 DIMENSIONS BREAKDOWN TABLE ---
  currentY += 32;

  const { EI, SN, TF, JP } = result.dimensions;
  const tableData = [
    [
      'Pemusatan Energi',
      `Ekstrovert (E) ${EI.leftPct}%`,
      `Introvert (I) ${EI.rightPct}%`,
      EI.dominantCode === 'I' ? 'Introvert (I)' : 'Ekstrovert (E)',
      EI.clarityScore
    ],
    [
      'Pengolahan Fakta & Informasi',
      `Sensing (S) ${SN.leftPct}%`,
      `Intuition (N) ${SN.rightPct}%`,
      SN.dominantCode === 'S' ? 'Sensing (S)' : 'Intuition (N)',
      SN.clarityScore
    ],
    [
      'Pengambilan Keputusan',
      `Thinking (T) ${TF.leftPct}%`,
      `Feeling (F) ${TF.rightPct}%`,
      TF.dominantCode === 'T' ? 'Thinking (T)' : 'Feeling (F)',
      TF.clarityScore
    ],
    [
      'Pola Kerja & Struktur SOP',
      `Judging (J) ${JP.leftPct}%`,
      `Perceiving (P) ${JP.rightPct}%`,
      JP.dominantCode === 'J' ? 'Judging (J)' : 'Perceiving (P)',
      JP.clarityScore
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Dimensi Psikometrik', 'Kutub Kiri', 'Kutub Kanan', 'Kecenderungan Dominan', 'Kejelasan']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [17, 27, 52],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // --- INDUSTRIAL ANALYSIS & STRENGTHS ---
  const finalTableY = (doc as any).lastAutoTable?.finalY || currentY + 45;
  currentY = finalTableY + 8;

  // Industrial Analysis Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ANALISIS OPERASIONAL & PERILAKU KERJA', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

  const splitAnalysis = doc.splitTextToSize(result.profile.industrialAnalysis, pageWidth - 28);
  doc.text(splitAnalysis, 14, currentY);

  currentY += splitAnalysis.length * 4.2 + 5;

  // Operational Strengths Bullet Points
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
  doc.text('Kekuatan Utama di Lapangan:', 14, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

  result.profile.operationalStrengths.forEach(str => {
    doc.text(`•  ${str}`, 16, currentY);
    currentY += 4;
  });

  // Safety & HSE Orientation
  currentY += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Orientasi Keselamatan & Kepatuhan HSE:', 14, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const splitHse = doc.splitTextToSize(result.profile.safetyOrientation, pageWidth - 28);
  doc.text(splitHse, 14, currentY);

  currentY += splitHse.length * 3.8 + 4;

  // --- CAREER RECOMMENDATIONS TABLE ---
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('REKOMENDASI PENUGASAN & JABATAN OPTIMAL', 14, currentY);
  currentY += 4;

  const careerRows = result.profile.careerRecommendations.map(c => [
    c.title,
    `${c.matchScore}% Match`,
    c.description,
    c.keySkills.join(', ')
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Posisi Rekomendasi', 'Kesesuaian', 'Deskripsi Peran', 'Kompetensi Kunci']],
    body: careerRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 24, halign: 'center' },
      2: { cellWidth: 70 },
      3: { cellWidth: 48 }
    },
    margin: { left: 14, right: 14 }
  });

  // --- FOOTER NOTE / DISCLAIMER ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Dokumen ini bersifat rahasia dan diperuntukkan bagi evaluasi penugasan & pengembangan personel industri.',
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  // Save the PDF file
  const sanitizedName = user.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Laporan_MBTI_${result.code}_${sanitizedName}.pdf`);
}
