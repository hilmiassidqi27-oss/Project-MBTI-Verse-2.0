import { Question } from '../types';

export const INDUSTRIAL_DEPARTMENTS = [
  'Engineering & Maintenance',
  'Operations & Production',
  'Health, Safety & Environment (HSE)',
  'Plant Logistics & Warehouse',
  'Quality Assurance & Control (QA/QC)',
  'Instrumentation & SCADA',
  'Electrical & Power Utilities',
  'Asset Reliability & Planning'
];

export const INDUSTRIAL_WORK_AREAS = [
  'Plant Area / Processing Unit',
  'Central Control Room (CCR)',
  'Workshop & Maintenance Yard',
  'Warehouse & Storage Facility',
  'Field / Area Lapangan Terbuka',
  'Laboratorium QA/QC Hub',
  'Gardu & Utility Substation',
  'Office / Administrasi Plant'
];

export const INDUSTRIAL_QUESTIONS: Question[] = [
  // EI - Extraversion vs Introversion (Soal 1 - 8)
  {
    id: 1,
    text: 'Saat briefing sebelum kerja, saya aktif bertanya jika ada instruksi yang kurang jelas.',
    dimension: 'EI',
    direction: -1, // Positif Dimensi Kiri (E)
    scenarioContext: 'Briefing Tim & Instruksi',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 2,
    text: 'Saya lebih nyaman memahami instruksi sendiri tanpa banyak diskusi.',
    dimension: 'EI',
    direction: 1, // Positif Dimensi Kanan (I)
    scenarioContext: 'Pemahaman Instruksi Mandiri',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 3,
    text: 'Saat ada kendala alat, saya langsung berkoordinasi dengan rekan kerja.',
    dimension: 'EI',
    direction: -1, // Positif Dimensi Kiri (E)
    scenarioContext: 'Koordinasi Kendala Alat',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 4,
    text: 'Sebelum melapor masalah, saya lebih suka menganalisis sendiri terlebih dahulu.',
    dimension: 'EI',
    direction: 1, // Positif Dimensi Kanan (I)
    scenarioContext: 'Analisis Masalah Mandiri',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 5,
    text: 'Saya mudah beradaptasi dengan anggota tim baru.',
    dimension: 'EI',
    direction: -1, // Positif Dimensi Kiri (E)
    scenarioContext: 'Adaptasi Anggota Tim',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 6,
    text: 'Saya lebih nyaman bekerja pada area yang minim interaksi.',
    dimension: 'EI',
    direction: 1, // Positif Dimensi Kanan (I)
    scenarioContext: 'Area Kerja Minim Interaksi',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 7,
    text: 'Saya nyaman memberi update progres pekerjaan kepada atasan.',
    dimension: 'EI',
    direction: -1, // Positif Dimensi Kiri (E)
    scenarioContext: 'Update Progres ke Atasan',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },
  {
    id: 8,
    text: 'Saya lebih suka menyelesaikan pekerjaan tanpa banyak komunikasi.',
    dimension: 'EI',
    direction: 1, // Positif Dimensi Kanan (I)
    scenarioContext: 'Fokus Kerja Tanpa Gangguan',
    leftTrait: 'Ekstrovert (E)',
    rightTrait: 'Introvert (I)'
  },

  // SN - Sensing vs Intuition (Soal 9 - 16)
  {
    id: 9,
    text: 'Saya selalu memastikan checklist kerja terisi lengkap.',
    dimension: 'SN',
    direction: -1, // Positif Dimensi Kiri (S)
    scenarioContext: 'Ketelitian Checklist Kerja',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 10,
    text: 'Saya sering menemukan pola masalah sebelum kerusakan besar terjadi.',
    dimension: 'SN',
    direction: 1, // Positif Dimensi Kanan (N)
    scenarioContext: 'Pola Masalah & Anomali',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 11,
    text: 'Saya fokus memeriksa detail kecil pada alat atau mesin.',
    dimension: 'SN',
    direction: -1, // Positif Dimensi Kiri (S)
    scenarioContext: 'Pemeriksaan Detail Mesin',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 12,
    text: 'Saya cepat menangkap hubungan antar masalah operasional.',
    dimension: 'SN',
    direction: 1, // Positif Dimensi Kanan (N)
    scenarioContext: 'Hubungan Masalah Operasional',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 13,
    text: 'Saya lebih percaya pada data aktual dibanding asumsi.',
    dimension: 'SN',
    direction: -1, // Positif Dimensi Kiri (S)
    scenarioContext: 'Data Aktual vs Asumsi',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 14,
    text: 'Saya sering memprediksi potensi kendala sebelum terjadi.',
    dimension: 'SN',
    direction: 1, // Positif Dimensi Kanan (N)
    scenarioContext: 'Prediksi Potensi Kendala',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 15,
    text: 'Saya teliti terhadap angka, indikator, dan parameter kerja.',
    dimension: 'SN',
    direction: -1, // Positif Dimensi Kiri (S)
    scenarioContext: 'Parameter & Indikator Kerja',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },
  {
    id: 16,
    text: 'Saya sering memikirkan improvement proses kerja.',
    dimension: 'SN',
    direction: 1, // Positif Dimensi Kanan (N)
    scenarioContext: 'Improvement Proses Kerja',
    leftTrait: 'Sensing (S)',
    rightTrait: 'Intuition (N)'
  },

  // TF - Thinking vs Feeling (Soal 17 - 24)
  {
    id: 17,
    text: 'Dalam kondisi darurat, saya fokus pada tindakan paling efektif.',
    dimension: 'TF',
    direction: -1, // Positif Dimensi Kiri (T)
    scenarioContext: 'Tindakan Efektif Darurat',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 18,
    text: 'Saya mempertimbangkan kondisi rekan sebelum memberi masukan.',
    dimension: 'TF',
    direction: 1, // Positif Dimensi Kanan (F)
    scenarioContext: 'Kondisi Rekan Kerja',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 19,
    text: 'Aturan safety harus ditegakkan meski rekan dekat melanggar.',
    dimension: 'TF',
    direction: -1, // Positif Dimensi Kiri (T)
    scenarioContext: 'Penegakan Aturan Safety',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 20,
    text: 'Saya berusaha menegur rekan dengan cara yang tidak menyinggung.',
    dimension: 'TF',
    direction: 1, // Positif Dimensi Kanan (F)
    scenarioContext: 'Menegur Tanpa Menyinggung',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 21,
    text: 'Saya mampu mengambil keputusan cepat saat tekanan tinggi.',
    dimension: 'TF',
    direction: -1, // Positif Dimensi Kiri (T)
    scenarioContext: 'Keputusan Tekanan Tinggi',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 22,
    text: 'Kekompakan tim penting untuk keberhasilan pekerjaan.',
    dimension: 'TF',
    direction: 1, // Positif Dimensi Kanan (F)
    scenarioContext: 'Kekompakan Tim',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 23,
    text: 'Saya menilai masalah berdasarkan fakta yang ada.',
    dimension: 'TF',
    direction: -1, // Positif Dimensi Kiri (T)
    scenarioContext: 'Penilaian Berbasis Fakta',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },
  {
    id: 24,
    text: 'Saya sering menjadi penengah saat ada konflik tim.',
    dimension: 'TF',
    direction: 1, // Positif Dimensi Kanan (F)
    scenarioContext: 'Penengah Konflik Tim',
    leftTrait: 'Thinking (T)',
    rightTrait: 'Feeling (F)'
  },

  // JP - Judging vs Perceiving (Soal 25 - 32)
  {
    id: 25,
    text: 'Saya datang siap kerja sebelum shift dimulai.',
    dimension: 'JP',
    direction: -1, // Positif Dimensi Kiri (J)
    scenarioContext: 'Kesiapan Sebelum Shift',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 26,
    text: 'Saya nyaman menerima penugasan mendadak.',
    dimension: 'JP',
    direction: 1, // Positif Dimensi Kanan (P)
    scenarioContext: 'Penugasan Mendadak',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 27,
    text: 'Saya menyiapkan alat kerja sebelum digunakan.',
    dimension: 'JP',
    direction: -1, // Positif Dimensi Kiri (J)
    scenarioContext: 'Persiapan Alat Kerja',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 28,
    text: 'Saya cepat menyesuaikan diri saat kondisi lapangan berubah.',
    dimension: 'JP',
    direction: 1, // Positif Dimensi Kanan (P)
    scenarioContext: 'Penyesuaian Kondisi Lapangan',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 29,
    text: 'Saya menyukai jadwal kerja yang terstruktur.',
    dimension: 'JP',
    direction: -1, // Positif Dimensi Kiri (J)
    scenarioContext: 'Jadwal Kerja Terstruktur',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 30,
    text: 'Saya dapat improvisasi ketika terjadi gangguan operasional.',
    dimension: 'JP',
    direction: 1, // Positif Dimensi Kanan (P)
    scenarioContext: 'Improvisasi Gangguan Operasional',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 31,
    text: 'Saya membuat urutan pekerjaan berdasarkan prioritas.',
    dimension: 'JP',
    direction: -1, // Positif Dimensi Kiri (J)
    scenarioContext: 'Urutan Prioritas Kerja',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  },
  {
    id: 32,
    text: 'Saya tetap efektif meskipun prioritas kerja berubah mendadak.',
    dimension: 'JP',
    direction: 1, // Positif Dimensi Kanan (P)
    scenarioContext: 'Efektivitas Perubahan Prioritas',
    leftTrait: 'Judging (J)',
    rightTrait: 'Perceiving (P)'
  }
];
