import { MBTIProfileData } from '../types';

export const MBTI_PROFILES: Record<string, MBTIProfileData> = {
  ISTP: {
    code: 'ISTP',
    nickname: 'Sang Mekanik',
    shortDescription: 'Praktisi teknis yang tenang, analitis, dan sangat cekatan dalam memecahkan masalah mekanis di lapangan.',
    industrialAnalysis:
      'Sebagai seorang ISTP dalam konteks industrial, Anda menunjukkan tingkat efisiensi praktis dan observasi tajam yang luar biasa. Profil ini ditandai dengan pemahaman mekanis yang melekat—baik berhadapan dengan mesin fisik, sistem perangkat lunak, maupun struktur organisasi yang kompleks.\n\nAnda memproses informasi secara internal dan logis (Introverted Thinking), didukung oleh pengumpulan data waktu nyata dari lingkungan sekitar (Extraverted Sensing). Hal ini membuat Anda sangat efektif dalam situasi krisis atau saat pemecahan masalah (troubleshooting) secara langsung diperlukan, lebih memilih tindakan berbasis bukti daripada teori abstrak.',
    operationalStrengths: [
      'Kemampuan diagnosa kegagalan teknis (root-cause failure analysis) yang cepat dan presisi.',
      'Sangat tenang dan berkepala dingin di bawah tekanan kondisi darurat lapangan.',
      'Penguasaan penggunaan instrumen, tooling, dan teknologi diagnostik modern.',
      'Efisiensi tinggi dalam eksekusi perbaikan tanpa birokrasi berbelit-belit.'
    ],
    growthAreas: [
      'Perlu meningkatkan keterbukaan komunikasi dan koordinasi proaktif dengan regu lain.',
      'Terkadang kurang sabar terhadap dokumentasi administratif atau prosedur birokratis.',
      'Dianjurkan melatih kemampuan mendelegasikan tugas daripada menyelesaikan semua hal sendiri.'
    ],
    crisisResponse:
      'Menilai situasi fisik dengan cepat, mematikan sumber bahaya secara tepat, dan mengeksekusi perbaikan taktis langsung di titik kerusakan.',
    safetyOrientation:
      'Memahami fungsi keselamatan secara mekanis; patuh pada keselamatan karena logika pencegahan bahaya nyata, bukan sekadar kepatuhan formal.',
    teamCollaboration:
      'Bekerja mandiri secara optimal; menjadi andalan utama ketika regu membutuhkan eksekutor teknis yang handal tanpa banyak bicara.',
    preferredWorkEnvironment:
      'Bengkel pemeliharaan (workshop), ruang kontrol diagnostik, rig lapangan, atau lini produksi bergerak dengan kebebasan operasional tinggi.',
    careerRecommendations: [
      {
        title: 'Teknisi Pemeliharaan Sistem',
        matchScore: 98,
        description: 'Merawat, mendiagnosa, dan memperbaiki mesin serta instrumen elektro-mekanik di area pabrik.',
        keySkills: ['Root-Cause Analysis', 'Hydraulic & Pneumatic', 'Vibration Monitoring']
      },
      {
        title: 'Insinyur Mekanik Lapangan',
        matchScore: 95,
        description: 'Memimpin investigasi teknis dan perbaikan darurat pada instalasi mesin bertekanan dan turbin.',
        keySkills: ['Field Troubleshooting', 'P&ID Reading', 'Mechanical Overhaul']
      },
      {
        title: 'Analis Keamanan Data & PLC',
        matchScore: 89,
        description: 'Menganalisis integritas logika kontrol SCADA, PLC, dan jaringan telemetri industri.',
        keySkills: ['SCADA Diagnostics', 'Industrial IoT', 'Network Integrity']
      },
      {
        title: 'Spesialis Forensik Digital & Kerusakan',
        matchScore: 87,
        description: 'Menginvestigasi kegagalan material, data sensor blackout, dan anomali telemetri pasca insiden.',
        keySkills: ['Data Forensics', 'Incident Investigation', 'Telemetry Analysis']
      }
    ]
  },

  INTJ: {
    code: 'INTJ',
    nickname: 'Sang Arsitek Strategis',
    shortDescription: 'Perancang sistem visioner yang mengoptimalkan keandalan pabrik dan efisiensi jangka panjang secara metodis.',
    industrialAnalysis:
      'Sebagai INTJ di lingkungan industri, Anda bertindak sebagai perancang strategi keandalan dan arsitek transformasi operasional. Anda melihat seluruh pabrik sebagai satu kesatuan ekosistem terintegrasi, mampu memproyeksikan potensi bottleneck beberapa kuartal sebelum masalah tersebut terwujud di lantai produksi.\n\nDengan memadukan intuisi mendalam (Introverted Intuition) dan eksekusi berbasis data logis (Extraverted Thinking), Anda merombak proses kerja konvensional menjadi sistem otomatisasi mutakhir yang tahan uji.',
    operationalStrengths: [
      'Pemodelan prediktif keandalan pabrik (Predictive Reliability Modeling).',
      'Standar kualitas dan efisiensi yang sangat tinggi tanpa toleransi pemborosan.',
      'Perencanaan jangka panjang untuk ekspansi kapasitas dan digitalisasi plant.',
      'Keputusan strategis objektif berbasis data telemetri historis.'
    ],
    growthAreas: [
      'Perlu melatih kesabaran saat menjelaskan konsep rumit kepada operator lapangan.',
      'Memberikan ruang bagi masukan taktis spontan dari tim teknis.',
      'Menghargai proses adaptasi bertahap tim sebelum memaksakan perubahan sistem.'
    ],
    crisisResponse:
      'Segera memetakan dampak krisis terhadap seluruh rantai produksi dan mengaktifkan rencana mitigasi kontinjensi terpadu.',
    safetyOrientation:
      'Merancang sistem keselamatan berlapis (fail-safe mechanisms) yang meminimalkan celah human-error secara struktural.',
    teamCollaboration:
      'Memimpin melalui perancangan kerangka kerja yang jelas, metrik terukur, dan ekspektasi akuntabilitas tinggi.',
    preferredWorkEnvironment:
      'Pusat kendali keandalan (Reliability Center), divisi Engineering & Projects, atau tim transformasi industri 4.0.',
    careerRecommendations: [
      {
        title: 'Plant Reliability Architect',
        matchScore: 98,
        description: 'Merancang arsitektur keandalan pabrik, predictive maintenance, dan optimalisasi siklus hidup aset.',
        keySkills: ['Asset Integrity', 'RCM (Reliability Centered Maint.)', 'Data Modeling']
      },
      {
        title: 'Automation & SCADA Lead Engineer',
        matchScore: 94,
        description: 'Memimpin perancangan logika otomatisasi terdistribusi dan integrasi kendali proses DCS.',
        keySkills: ['DCS Architecture', 'Cyber-Physical Systems', 'Process Optimization']
      },
      {
        title: 'Continuous Improvement Director',
        matchScore: 91,
        description: 'Menghilangkan inefisiensi operasional dan merancang roadmap Lean Six Sigma tingkat korporat.',
        keySkills: ['Six Sigma Master Black Belt', 'Value Stream Mapping', 'Cost Optimization']
      },
      {
        title: 'Industrial Safety Systems Designer',
        matchScore: 88,
        description: 'Mendesain arsitektur Safety Instrumented Systems (SIS) dan verifikasi SIL untuk fasilitas berisiko tinggi.',
        keySkills: ['HAZOP/SIL Analysis', 'Safety Interlocks', 'Risk Assessment']
      }
    ]
  },

  ENTJ: {
    code: 'ENTJ',
    nickname: 'Sang Komandan Lapangan',
    shortDescription: 'Pemimpin operasional yang tegas, berorientasi hasil, dan tangguh menggerakkan seluruh lini pabrik menuju target produksi.',
    industrialAnalysis:
      'Sebagai ENTJ, Anda adalah penggerak utama pencapaian target produksi dan efisiensi industri skala besar. Anda memiliki dorongan alami untuk memimpin, mengorganisasi sumber daya manusia dan peralatan, serta menuntut akuntabilitas tinggi di seluruh lini kerja.\n\nDalam situasi perbaikan pabrik berskala besar (Turnaround/Shutdown), kehadiran Anda memberikan komando yang jelas, memotong keraguan, dan memobilisasi regu kerja dengan determinasi tinggi.',
    operationalStrengths: [
      'Kepemimpinan tegas dan pengambilan keputusan cepat dalam tempo operasional tinggi.',
      'Manajemen proyek Turnaround/Shutdown skala masif dengan disiplin tenggat ketat.',
      'Alokasi sumber daya tenaga kerja dan vendor secara efisien dan produktif.',
      'Kemampuan menyelaraskan target manajemen puncak dengan realitas lantai pabrik.'
    ],
    growthAreas: [
      'Menghindari kecenderungan bersikap terlalu dominan tanpa mendengarkan keberatan personel.',
      'Memperhatikan kelelahan mental regu kerja pada periode lembur berkepanjangan.',
      'Mendorong inovasi dari bawah (bottom-up) selain instruksi top-down.'
    ],
    crisisResponse:
      'Mengambil alih pusat komando (Incident Command System), membagi tugas secara tegas, dan memulihkan operasi secepat mungkin.',
    safetyOrientation:
      'Menegakkan budaya keselamatan berstandar nol-toleransi (Zero Harm Culture) melalui inspeksi dan evaluasi rutin.',
    teamCollaboration:
      'Membangun struktur hierarki yang solid, menuntut profesionalisme, dan memberi penghargaan bagi pekerja berprestasi.',
    preferredWorkEnvironment:
      'Ruang komando operasi pabrik, kepemimpinan proyek konstruksi EPC, atau manajemen operasional multi-site.',
    careerRecommendations: [
      {
        title: 'Plant Operations Director',
        matchScore: 99,
        description: 'Memegang tanggung jawab penuh atas produksi, keselamatan, keandalan, dan efisiensi finansial fasilitas industri.',
        keySkills: ['Operations Management', 'Turnaround Leadership', 'P&L Accountability']
      },
      {
        title: 'Shutdown / Turnaround Manager',
        matchScore: 96,
        description: 'Mengomandoi pemeliharaan total pabrik tahunan dengan ratusan kontraktor dalam jadwal kritis.',
        keySkills: ['Critical Path Management', 'Contractor Management', 'Risk Mitigation']
      },
      {
        title: 'HSE Corporate Director',
        matchScore: 90,
        description: 'Menegakkan kepatuhan regulasi lingkungan, keselamatan, dan tata kelola keselamatan proses.',
        keySkills: ['Process Safety Management', 'Regulatory Compliance', 'Crisis Governance']
      }
    ]
  },

  ESTJ: {
    code: 'ESTJ',
    nickname: 'Sang Pelaksana Disiplin',
    shortDescription: 'Pengawas operasional yang taat prosedur, rapi, terstruktur, dan menjamin kepatuhan standar kerja tanpa celah.',
    industrialAnalysis:
      'Sebagai ESTJ, Anda adalah tulang punggung kepatuhan dan keteraturan di plant industri. Anda memastikan bahwa setiap standar operasional prosedur (SOP), jadwal pemeliharaan berkala, dan checklist keselamatan dieksekusi dengan presisi tanpa deviasi.\n\nKekuatan Anda terletak pada konsistensi, pengelolaan logistik harian, dan ketegasan dalam menegakkan aturan demi mencegah terjadinya kegagalan akibat kelalaian manusia.',
    operationalStrengths: [
      'Kepatuhan ketat terhadap standar keselamatan kerja, SOP, dan regulasi ketenagakerjaan.',
      'Organisasi logistik suku cadang, perkakas, dan perizinan kerja (Permit to Work) yang sempurna.',
      'Pengawasan langsung terhadap kualitas hasil kerja shift secara konsisten.',
      'Pelaporan operasional yang akurat, terinci, dan tepat waktu.'
    ],
    growthAreas: [
      'Perlu lebih terbuka terhadap metode kerja inovatif yang belum masuk dalam SOP lama.',
      'Mengurangi kekakuan dalam merespons situasi tak terduga yang membutuhkan diskresi fleksibel.',
      'Membangun pendekatan persuasif selain pendekatan instruksional murni.'
    ],
    crisisResponse:
      'Mengaktifkan prosedur darurat (Emergency Operating Procedure) langkah-demi-langkah sesuai buku panduan tanpa panik.',
    safetyOrientation:
      'Penjaga kepatuhan keselamatan garis depan; tidak akan membiarkan pekerjaan dimulai tanpa kelengkapan APD dan JSA (Job Safety Analysis).',
    teamCollaboration:
      'Menetapkan ekspektasi kerja yang sangat jelas, memberikan instruksi terukur, dan memantau realisasi harian.',
    preferredWorkEnvironment:
      'Lantai produksi manufaktur, pengawasan proyek pemeliharaan mekanis, atau departemen Quality Assurance/HSE.',
    careerRecommendations: [
      {
        title: 'Maintenance Supervisor',
        matchScore: 97,
        description: 'Memimpin regu mekanik dan elektrikal dalam eksekusi harian preventive dan corrective maintenance.',
        keySkills: ['Supervisory Control', 'SOP Enforcement', 'Work Order Scheduling']
      },
      {
        title: 'Quality Assurance & Audit Superintendent',
        matchScore: 94,
        description: 'Memastikan seluruh produk dan komponen memenuhi standar ISO, ASME, dan spesifikasi klien.',
        keySkills: ['Quality Control', 'ISO/ASME Auditing', 'Non-Conformance Tracking']
      },
      {
        title: 'HSE Field Inspector',
        matchScore: 92,
        description: 'Menginspeksi kepatuhan izin kerja, perlindungan bahaya gas, dan kelaikan peralatan di site.',
        keySkills: ['Job Safety Analysis', 'Permit-to-Work Audits', 'Field Compliance']
      }
    ]
  },

  ISTJ: {
    code: 'ISTJ',
    nickname: 'Sang Inspektur Prosedural',
    shortDescription: 'Pekerja teliti, andal, dan berdedikasi tinggi yang menjaga integritas dokumen dan kualitas teknis tanpa kompromi.',
    industrialAnalysis:
      'Sebagai ISTJ, Anda adalah pilar stabilitas operasional yang tidak pernah melewatkan satu detail pun. Keahlian Anda dalam memeriksa spesifikasi teknis, kalibrasi instrumen, dan audit keselamatan menjamin operasional pabrik berjalan sesuai baku mutu.\n\nAnda dapat dipercaya sepenuhnya untuk memegang tanggung jawab kritikal yang membutuhkan ketelitian tingkat tinggi tanpa pengawasan konstan.',
    operationalStrengths: [
      'Ketelitian ekstrem dalam pemeriksaan toleransi teknis dan pembacaan logbook.',
      'Dedikasi tinggi terhadap keandalan sistem dan pemeliharaan pencegahan.',
      'Pencatatan data kalibrasi dan riwayat mesin yang sangat rapi dan terdokumentasi.',
      'Sikap kerja yang tenang, bertanggung jawab, dan dapat diandalkan dalam jangka panjang.'
    ],
    growthAreas: [
      'Menghindari resistensi berlebihan saat sistem teknologi baru diperkenalkan.',
      'Belajar merasa nyaman dengan improvisasi taktis saat SOP baku belum mencakup masalah baru.',
      'Mengkomunikasikan temuan inspeksi secara konstruktif.'
    ],
    crisisResponse:
      'Mengisolasi titik gangguan secara sistematis dan mengamankan rekaman log data untuk audit investigasi lanjutan.',
    safetyOrientation:
      'Menjadikan pedoman keselamatan sebagai hukum mutlak; memastikan seluruh instrumen keselamatan terkalibrasi akurat.',
    teamCollaboration:
      'Rekan kerja yang tenang dan solid; bekerja sangat baik dalam tugas terfokus dengan parameter yang terdefinisi rapi.',
    preferredWorkEnvironment:
      'Laboratorium pengujian material (NDT), ruang kalibrasi instrumen, unit audit keselamatan, atau stasiun kontrol mutu.',
    careerRecommendations: [
      {
        title: 'Non-Destructive Testing (NDT) Inspector',
        matchScore: 98,
        description: 'Menguji integritas struktural pipa, bejana tekan, dan pengelasan menggunakan metode ultrasonik/radiografi.',
        keySkills: ['NDT Techniques', 'Structural Integrity', 'Welding Inspection']
      },
      {
        title: 'Instrumentation Calibration Specialist',
        matchScore: 95,
        description: 'Mengkalibrasi sensor suhu, tekanan, dan flow meter presisi tinggi untuk kendali proses.',
        keySkills: ['Instrument Calibration', 'Loop Checking', 'Tolerance Standards']
      },
      {
        title: 'Plant Reliability Data Analyst',
        matchScore: 91,
        description: 'Menganalisis MTBF (Mean Time Between Failures) dan riwayat downtime aset pabrik.',
        keySkills: ['CMMS Management', 'Failure Rate Analytics', 'Maintenance Records']
      }
    ]
  },

  INTP: {
    code: 'INTP',
    nickname: 'Sang Analis Sistem',
    shortDescription: 'Pemikir analitis mendalam yang membedah akar permasalahan sistem kendali, logika PLC, dan algoritma proses.',
    industrialAnalysis:
      'Sebagai INTP, Anda adalah pemecah teka-teki teknis yang paling cemerlang di fasilitas industri. Ketika tim menghadapi kerusakan anomali yang membingungkan para teknisi lapangan, Anda mampu membedah logika internal, menganalisis sinyal data telemetri, dan menemukan anomali yang tersembunyi.\n\nFokus Anda adalah memahami prinsip kerja fundamental dan merancang solusi elegan untuk tantangan teknik yang kompleks.',
    operationalStrengths: [
      'Analisis mendalam terhadap logika program PLC, DCS, dan algoritma kendali proses.',
      'Pemecahan masalah anomali langka (rare anomaly troubleshooting) yang rumit.',
      'Pengembangan model matematika untuk efisiensi energi dan optimasi termodinamika.',
      'Kemandirian tinggi dalam riset teknologi baru dan integrasi sistem telemetri.'
    ],
    growthAreas: [
      'Menyelesaikan implementasi praktis hingga tuntas tanpa terjebak dalam analisa berlebihan (analysis paralysis).',
      'Meningkatkan komunikasi verbal yang ringkas dan mudah dipahami teknisi lapangan.',
      'Memperhatikan batasan tenggat waktu operasional yang mendesak.'
    ],
    crisisResponse:
      'Menganalisis akar penyebab kegagalan (Root Cause) di tingkat fundamental untuk mencegah terulangnya insiden serupa selamanya.',
    safetyOrientation:
      'Menganalisis risiko melalui simulasi skenario kegagalan multi-variabel untuk mendeteksi bahaya tersembunyi.',
    teamCollaboration:
      'Berperan sebagai konsultan teknis spesialis; paling efektif saat diberi otonomi menyelesaikan masalah sulit.',
    preferredWorkEnvironment:
      'Laboratorium rekayasa sistem, unit R&D proses industri, atau tim rekayasa otomasi & kendali cerdas.',
    careerRecommendations: [
      {
        title: 'Process Control Systems Engineer',
        matchScore: 96,
        description: 'Mengembangkan logika kontrol PLC/DCS dan algoritma PID tuning untuk stabilitas reaktor/pabrik.',
        keySkills: ['PLC/DCS Programming', 'Control Theory', 'PID Tuning']
      },
      {
        title: 'Industrial Diagnostics Specialist',
        matchScore: 93,
        description: 'Menganalisis data getaran, spektrum termografi, dan sinyal listrik untuk diagnosa mesin.',
        keySkills: ['Vibration Analysis', 'Signal Processing', 'Diagnostics Modeling']
      },
      {
        title: 'Energy & Thermodynamics Modeler',
        matchScore: 89,
        description: 'Memodelkan efisiensi termal boiler, turbin, dan konsumsi energi plant.',
        keySkills: ['Thermal Simulation', 'Energy Optimization', 'Process Modeling']
      }
    ]
  },

  ENTP: {
    code: 'ENTP',
    nickname: 'Sang Inovator Lapangan',
    shortDescription: 'Eksplorator teknologi yang cerdik, suka menguji coba metode modifikasi baru, dan lincah mengatasi kebuntuan teknis.',
    industrialAnalysis:
      'Sebagai ENTP, Anda adalah katalis pembaruan di plant industri. Anda tidak puas dengan status quo jika ada cara yang lebih cerdas, lebih cepat, atau lebih efisien untuk menyelesaikan pekerjaan.\n\nAnda sangat adaptif dan tangkas saat menghadapi kegagalan tak terduga, mampu menggabungkan berbagai teknologi yang ada untuk menciptakan solusi kreatif saat suku cadang standar tidak tersedia.',
    operationalStrengths: [
      'Inovasi cepat dalam mengatasi keterbatasan peralatan atau suku cadang di lapangan.',
      'Kemampuan merancang retrofit dan upgrade teknologi pada mesin warisan (legacy systems).',
      'Debat teknis yang tajam untuk menguji ketahanan desain sebelum implementasi.',
      'Ketangkasan beradaptasi di lingkungan multi-disiplin (mekanikal, elektrikal, IT).'
    ],
    growthAreas: [
      'Memastikan ide inovatif tetap mematuhi regulasi keselamatan dan batasan izin operasional.',
      'Menjaga konsistensi penyelesaian proyek rutin tanpa cepat bosan.',
      'Menghormati pengalaman empiris teknisi senior di lapangan.'
    ],
    crisisResponse:
      'Mengembangkan solusi taktis alternatif di luar kebiasaan (out-of-the-box workaround) untuk memulihkan operasi seketika.',
    safetyOrientation:
      'Menemukan celah dalam prosedur keselamatan lama dan mengusulkan modernisasi instrumen pelindung cerdas.',
    teamCollaboration:
      'Menghidupkan suasana tim dengan ide-ide segar dan memotivasi regu untuk keluar dari kebiasaan lama.',
    preferredWorkEnvironment:
      'Divisi modernisasi plant, proyek EPC eksplorasi, atau unit modifikasi & fabrikasi khusus.',
    careerRecommendations: [
      {
        title: 'Field Modernization & Retrofit Engineer',
        matchScore: 96,
        description: 'Memimpin proyek modifikasi dan peremajaan sistem lama dengan teknologi industri 4.0.',
        keySkills: ['Retrofitting', 'Industrial IoT', 'System Integration']
      },
      {
        title: 'Field Automation Consultant',
        matchScore: 92,
        description: 'Mendiagnosa hambatan produksi dan merancang solusi otomasi cerdas bersama vendor.',
        keySkills: ['Automation Scoping', 'Vendor Trials', 'Rapid Prototyping']
      },
      {
        title: 'Reliability Innovation Lead',
        matchScore: 90,
        description: 'Menguji coba metode predictive maintenance berbasis AI dan sensor nirkabel di plant.',
        keySkills: ['Predictive Tech Trials', 'Condition Monitoring', 'Process Innovation']
      }
    ]
  },

  INFJ: {
    code: 'INFJ',
    nickname: 'Sang Penasihat Visi',
    shortDescription: 'Pemerhati integritas jangka panjang yang peduli pada keselamatan holistik, ergonomi, dan keberlanjutan kerja.',
    industrialAnalysis:
      'Sebagai INFJ, Anda membawa kedalaman wawasan kemanusiaan dan visi masa depan ke dalam lingkungan industri yang keras. Anda fokus pada bagaimana teknologi dan proses kerja berinteraksi dengan kesejahteraan pekerja serta dampaknya terhadap lingkungan sekitar.\n\nAnda mahir merumuskan budaya keselamatan berkelanjutan dan menjadi jembatan diplomatis antara manajemen dan tenaga kerja lapangan.',
    operationalStrengths: [
      'Pengembangan budaya keselamatan kerja berwawasan jangka panjang (Sustainable Safety Culture).',
      'Analisis ergonomi dan faktor manusia (Human Factors Engineering) untuk mencegah kelelahan pekerja.',
      'Penyelesaian konflik interpersonal di tim lapangan dengan pendekatan empatik dan berprinsip.',
      'Konsistensi menjaga standar etika operasional dan kepatuhan lingkungan (ESG).'
    ],
    growthAreas: [
      'Belajar bersikap lebih lugas dalam situasi darurat lapangan yang membutuhkan instruksi kilat.',
      'Tidak membiarkan beban emosional insiden kerja mempengaruhi ketajaman analisis.',
      'Memberikan ruang untuk kompromi praktis dalam realitas operasional yang dinamis.'
    ],
    crisisResponse:
      'Fokus pada evakuasi personel, penyelamatan korban, dan pendampingan psikologis pasca-insiden.',
    safetyOrientation:
      'Memandang keselamatan bukan sekadar angka statistik, melainkan tanggung jawab moral menjaga setiap nyawa pekerja.',
    teamCollaboration:
      'Membangun kepercayaan mendalam, mendengarkan kekhawatiran tersembunyi pekerja, dan menumbuhkan solidaritas.',
    preferredWorkEnvironment:
      'Divisi Corporate HSE & Environment, tim pengembangan budaya organisasi industri, atau unit investigasi insiden.',
    careerRecommendations: [
      {
        title: 'Industrial Human Factors & Safety Advisor',
        matchScore: 95,
        description: 'Menganalisis interaksi manusia-mesin untuk mencegah kelelahan, stres kerja, dan insiden operasional.',
        keySkills: ['Human Factors Analysis', 'Safety Culture Development', 'Ergonomics']
      },
      {
        title: 'Environmental & Sustainability Specialist',
        matchScore: 92,
        description: 'Memantau emisi, pengelolaan limbah B3, dan kepatuhan regulasi lingkungan industri (AMDAL).',
        keySkills: ['Environmental Compliance', 'Waste Management', 'Sustainability Metrics']
      },
      {
        title: 'Asset Lifecycle Ethicist & Planner',
        matchScore: 88,
        description: 'Merencanakan dekomisioning dan mitigasi dampak lingkungan fasilitas industri jangka panjang.',
        keySkills: ['Decommissioning Strategy', 'Risk Assessment', 'ESG Compliance']
      }
    ]
  },

  ENFJ: {
    code: 'ENFJ',
    nickname: 'Sang Mentor Tim',
    shortDescription: 'Pemimpin karismatik yang menginspirasi disiplin keselamatan dan membangun kekompakan regu kerja lapangan.',
    industrialAnalysis:
      'Sebagai ENFJ di lingkungan industri, Anda bertindak sebagai perekat tim dan pembina talenta pekerja lapangan. Anda memiliki bakat alami untuk mengomunikasikan visi keselamatan dan kinerja unggul sehingga setiap anggota shift merasa dihargai dan termotivasi memberikan yang terbaik.\n\nKepemimpinan Anda menciptakan iklim kerja yang aman, harmonis, dan sangat tanggap terhadap kebutuhan operasional harian.',
    operationalStrengths: [
      'Kemampuan memotivasi regu kerja lapangan dan membangun kekompakan lintas shift.',
      'Penyelenggaraan program pelatihan teknis dan edukasi HSE yang interaktif dan berkesan.',
      'Resolusi konflik antar kru di area plant secara cepat dan menjaga moral tetap tinggi.',
      'Komunikasi publik yang efektif saat memimpin Toolbox Meeting dan safety briefing.'
    ],
    growthAreas: [
      'Menghindari keengganan memberikan sanksi disipliner tegas demi menjaga relasi baik.',
      'Memastikan pertimbangan logis-teknis tidak terpinggirkan oleh empati antarpribadi.',
      'Menjaga batasan energi pribadi agar tidak kelelahan menampung keluhan seluruh personel.'
    ],
    crisisResponse:
      'Menenangkan kepanikan kru, memastikan semua anggota regu selamat, dan mengoordinasikan bantuan darurat terpadu.',
    safetyOrientation:
      'Membangun budaya "Brother\'s Keeper"—saling menjaga dan mengingatkan keselamatan antar rekan kerja tanpa rasa segan.',
    teamCollaboration:
      'Menciptakan lingkungan inklusif, memberi pengakuan atas kontribusi pekerja, dan membimbing operator muda.',
    preferredWorkEnvironment:
      'Manajemen operasional shift, pusat pelatihan keselamatan industri (Safety Training Center), atau koordinasi kontraktor site.',
    careerRecommendations: [
      {
        title: 'Shift Superintendent / Field Crew Lead',
        matchScore: 97,
        description: 'Mengkoordinasikan operasional seluruh regu shift, menjaga moral, dan memastikan target produksi serta keselamatan tercapai.',
        keySkills: ['Shift Leadership', 'Crew Morale Management', 'Incident Escalation']
      },
      {
        title: 'Technical & HSE Training Manager',
        matchScore: 94,
        description: 'Merancang dan memfasilitasi sertifikasi kompetensi pekerja lapangan dan simulasi tanggap darurat.',
        keySkills: ['Safety Induction', 'Competency Training', 'Drill Facilitation']
      },
      {
        title: 'Subcontractor & Community Liaison',
        matchScore: 89,
        description: 'Menjembatani hubungan kerja harmonis antara perusahaan, vendor kontraktor, dan warga sekitar area pabrik.',
        keySkills: ['Stakeholder Relations', 'Conflict Mediation', 'Contractor Coordination']
      }
    ]
  },

  ISFP: {
    code: 'ISFP',
    nickname: 'Sang Teknisi Fleksibel',
    shortDescription: 'Praktisi yang peka terhadap kondisi fisik lapangan, adaptif, teliti, dan mengutamakan kualitas pengerjaan langsung.',
    industrialAnalysis:
      'Sebagai ISFP, Anda bekerja dengan sentuhan presisi dan kepekaan tinggi terhadap lingkungan fisik di plant. Anda mengamati perubahan suara mesin, getaran kecil pipa, atau bau gas yang tidak biasa dengan indera yang sangat tajam.\n\nGaya kerja Anda tenang, tidak menyukai konflik, namun sangat berkomitmen menghasilkan pengerjaan teknis yang rapi dan aman.',
    operationalStrengths: [
      'Ketajaman observasi indrawi terhadap perubahan kondisi fisik mesin di lapangan.',
      'Keahlian pengerjaan manual (craftsmanship) berkualitas tinggi dalam instalasi komponen.',
      'Adaptabilitas tinggi dalam menyesuaikan diri dengan dinamika kondisi cuaca dan area sempit (confined space).',
      'Sikap tenang dan tidak menimbulkan gesekan dalam regu kerja.'
    ],
    growthAreas: [
      'Meningkatkan rasa percaya diri untuk menyuarakan peringatan bahaya di forum rapat resmi.',
      'Membiasakan diri dengan pelaporan dokumen digital dan analisis data abstrak.',
      'Lebih proaktif dalam mengambil inisiatif kepemimpinan regu.'
    ],
    crisisResponse:
      'Membantu evakuasi dan perbaikan taktis langsung di lokasi tanpa mencari sorotan.',
    safetyOrientation:
      'Sangat patuh pada rambu keselamatan lapangan dan selalu waspada terhadap bahaya fisik di sekitar area kerja.',
    teamCollaboration:
      'Rekan kerja yang kooperatif, rendah hati, dan selalu siap membantu tugas fisik yang membutuhkan ketelitian.',
    preferredWorkEnvironment:
      'Pekerjaan lapangan luar ruangan (outdoor site), instalasi instrumen presisi, atau pemantauan lingkungan fisik pabrik.',
    careerRecommendations: [
      {
        title: 'Precision Tooling & Mechanical Specialist',
        matchScore: 94,
        description: 'Melakukan perakitan presisi, penyelarasan poros (shaft alignment), dan pengerjaan toleransi mikro.',
        keySkills: ['Laser Alignment', 'Precision Assembly', 'Dynamic Balancing']
      },
      {
        title: 'Environmental Field Technician',
        matchScore: 91,
        description: 'Mengambil sampel air buangan, gas cerobong, dan kebisingan lingkungan di seluruh perimeter plant.',
        keySkills: ['Field Sampling', 'Gas Detection', 'Noise Monitoring']
      },
      {
        title: 'Rope Access & Confined Space Specialist',
        matchScore: 88,
        description: 'Melakukan inspeksi dan pemeliharaan struktur tinggi atau ruang terbatas dengan protokol keselamatan ketat.',
        keySkills: ['Rope Access (IRATA)', 'Confined Space Rescue', 'Hazard Identification']
      }
    ]
  },

  INFP: {
    code: 'INFP',
    nickname: 'Sang Penjaga Harmoni',
    shortDescription: 'Individu berprinsip yang menjaga nilai-nilai keselamatan mendasar dan memperjuangkan keadilan bagi pekerja.',
    industrialAnalysis:
      'Sebagai INFP di sektor industri, Anda bertindak sebagai penjaga hati nurani keselamatan dan kepatuhan etis. Anda sangat peduli agar setiap pekerja pulang ke rumah dengan selamat dan hak-hak dasar tenaga kerja dihormati.\n\nAnda berkontribusi besar dalam merancang sistem komunikasi keselamatan yang menyentuh kesadaran internal pekerja daripada sekadar ancaman sanksi.',
    operationalStrengths: [
      'Komitmen mendalam terhadap nilai-nilai keselamatan kerja dan pelestarian lingkungan.',
      'Pendekatan humanis dalam merancang kampanye keselamatan dan kesehatan kerja (K3).',
      'Kemampuan mendengarkan keluhan pekerja bawah tanpa prasangka.',
      'Integritas etika tinggi dalam pelaporan insiden tanpa rekayasa data.'
    ],
    growthAreas: [
      'Menghadapi konfrontasi langsung dengan pekerja yang melanggar SOP secara tegas.',
      'Tidak larut dalam kekecewaan emosional ketika target idealisme keselamatan belum tercapai.',
      'Memperkuat pemahaman aspek teknis-kuantitatif dalam audit pabrik.'
    ],
    crisisResponse:
      'Memberikan dukungan pemulihan mental dan memastikan hak-hak penanganan medis bagi personel terdampak.',
    safetyOrientation:
      'Menjadikan keselamatan sebagai nilai hidup hakiki yang melindungi harkat martabat setiap pekerja industri.',
    teamCollaboration:
      'Menciptakan suasana kerja yang saling menghormati dan mendukung rekan kerja yang sedang mengalami kesulitan.',
    preferredWorkEnvironment:
      'Unit komunikasi HSE, advokasi keselamatan pekerja, atau program tanggung jawab sosial & lingkungan (CSR) industri.',
    careerRecommendations: [
      {
        title: 'Safety Culture & Campaign Specialist',
        matchScore: 93,
        description: 'Merancang materi edukasi, studi kasus insiden, dan kampanye interaktif untuk menumbuhkan kesadaran K3.',
        keySkills: ['Safety Communication', 'Behavior-Based Safety', 'Incident Case Studies']
      },
      {
        title: 'Occupational Health & Welfare Officer',
        matchScore: 90,
        description: 'Memantau kesehatan kerja, nutrisi catering shift, dan fasilitas peristirahatan pekerja lapangan.',
        keySkills: ['Occupational Health', 'Ergonomics Assessment', 'Welfare Auditing']
      },
      {
        title: 'Industrial Sustainability Liaison',
        matchScore: 86,
        description: 'Mengawasi dampak sosial operasional pabrik terhadap komunitas lokal dan pelestarian ekosistem sekitar.',
        keySkills: ['Community Engagement', 'Environmental Ethics', 'Social Impact Assessment']
      }
    ]
  },

  ESTP: {
    code: 'ESTP',
    nickname: 'Sang Troubleshooter Taktis',
    shortDescription: 'Aktor lapangan pemberani yang bergerak cepat di tengah krisis, responsif, dan menyukai tantangan teknis berisiko tinggi.',
    industrialAnalysis:
      'Sebagai ESTP, Anda adalah personel yang paling dicari saat terjadi insiden mendesak di plant. Anda memiliki insting aksi yang sangat cepat, keberanian menghadapi situasi panas (seperti kebocoran pipa bertekanan atau trip pembangkit), dan kemampuan berpikir di atas kaki sendiri.\n\nAnda tidak suka teori bertele-tele; Anda ingin berada langsung di tengah aksi, memegang perkakas, dan menstabilkan situasi secepat mungkin.',
    operationalStrengths: [
      'Respon super cepat dalam situasi darurat dan tanggap insiden (Emergency Response).',
      'Keberanian dan ketangkasan fisik dalam menangani peralatan berat di medan menantang.',
      'Kemampuan membaca dinamika mesin secara langsung dan melakukan triase perbaikan.',
      'Negosiasi taktis cepat dengan operator dan supervisor di lapangan.'
    ],
    growthAreas: [
      'Menghindari kecenderungan mengambil jalan pintas (shortcut) yang mengorbankan prosedur keselamatan.',
      'Membiasakan diri mengisi logbook perbaikan secara lengkap pasca-pekerjaan selesai.',
      'Mempertimbangkan konsekuensi sistemik jangka panjang sebelum melakukan modifikasi darurat.'
    ],
    crisisResponse:
      'Masuk langsung ke zona terdepan, memimpin tim penanggulangan darurat, dan memadamkan sumber bahaya dengan tindakan nyata.',
    safetyOrientation:
      'Sangat reaktif dan piawai dalam pengendalian bahaya langsung; perlu diingatkan untuk konsisten pada mitigasi preventif.',
    teamCollaboration:
      'Membakar semangat regu dengan energi tinggi dan memimpin melalui keteladanan aksi di lapangan.',
    preferredWorkEnvironment:
      'Tim penanggulangan keadaan darurat (ERT/Fire & Rescue), rig pengeboran migas lepas pantai, atau regu perbaikan kilat jalur pipa.',
    careerRecommendations: [
      {
        title: 'Emergency Response Team (ERT) Leader',
        matchScore: 98,
        description: 'Mengomandoi pemadaman kebakaran industri, penyelamatan korban, dan isolasi bahan berbahaya (Hazmat).',
        keySkills: ['Hazmat Control', 'Industrial Firefighting', 'Rescue Operations']
      },
      {
        title: 'Rapid Tactical Repair Specialist',
        matchScore: 95,
        description: 'Diterjunkan untuk perbaikan kilat pada kegagalan kritis yang menghentikan seluruh lini produksi.',
        keySkills: ['Hot Tapping', 'Emergency Leak Sealing', 'High-Pressure Diagnostics']
      },
      {
        title: 'Drilling & Rig Operations Specialist',
        matchScore: 91,
        description: 'Mengoperasikan peralatan mekanis berat dan sistem hidrolik pada operasi pengeboran bertekanan tinggi.',
        keySkills: ['Rig Mechanics', 'Well Control', 'Heavy Equipment Operation']
      }
    ]
  },

  ESFP: {
    code: 'ESFP',
    nickname: 'Sang Koordinator Dinamis',
    shortDescription: 'Pekerja lapangan yang penuh semangat, luwes, komunikatif, dan menjaga suasana kerja tetap ceria dan produktif.',
    industrialAnalysis:
      'Sebagai ESFP, Anda menghadirkan energi positif dan keluwesan koordinasi di area kerja industri yang padat. Anda sangat peka terhadap dinamika tim di lapangan, cepat menyadari jika ada anggota yang kelelahan, dan tangkas dalam mengoordinasikan logistik harian antar regu.\n\nGaya kerja Anda praktis, langsung, dan menyenangkan sehingga mempermudah kerja sama antar berbagai kontraktor dan departemen.',
    operationalStrengths: [
      'Kemampuan koordinasi lapangan yang cair, ramah, dan memecah ketegangan shift.',
      'Cepat beradaptasi dengan perubahan jadwal dan kondisi mendesak di site.',
      'Keterampilan demonstrasi langsung yang menarik saat sosialisasi alat pelindung diri baru.',
      'Responsif dalam menyediakan kebutuhan logistik dan peralatan bagi teknisi lapangan.'
    ],
    growthAreas: [
      'Meningkatkan disiplin dalam perencanaan preventif jangka panjang.',
      'Menjaga fokus pada detail dokumen teknis yang membutuhkan ketelitian tinggi.',
      'Tidak mengabaikan kritik atau evaluasi kinerja yang bersifat konstruktif.'
    ],
    crisisResponse:
      'Membantu mobilisasi evakuasi personel dengan pengeras suara dan memastikan penghitungan logistik di muster point lengkap.',
    safetyOrientation:
      'Menjadikan keselamatan sebagai kebiasaan yang menyenangkan melalui simulasi interaktif dan keterlibatan aktif semua kru.',
    teamCollaboration:
      'Pembangun moral tim (morale booster); menciptakan keakraban antar kru shift sehingga pekerjaan terasa lebih ringan.',
    preferredWorkEnvironment:
      'Pusat logistik material proyek, koordinasi operasional armada alat berat, atau fasilitas pelatihan lapangan.',
    careerRecommendations: [
      {
        title: 'Site Logistics & Dispatch Coordinator',
        matchScore: 95,
        description: 'Mengatur lalu lintas material, armada crane, dan pergerakan kru di area plant yang luas.',
        keySkills: ['Material Dispatch', 'Fleet Logistics', 'Radio Communication']
      },
      {
        title: 'Safety Drill & Simulation Facilitator',
        matchScore: 92,
        description: 'Mengorganisir latihan evakuasi darurat, simulasi kebakaran, dan demonstrasi penggunaan APD.',
        keySkills: ['Emergency Drill Design', 'Public Address', 'Interactive Training']
      },
      {
        title: 'Field Warehouse & Tool Crib Superintendent',
        matchScore: 89,
        description: 'Mengelola ketersediaan perkakas khusus, sertifikasi lifting gear, dan distribusi perlengkapan kerja.',
        keySkills: ['Tool Crib Management', 'Inventory Turnover', 'Equipment Certification']
      }
    ]
  },

  ENFP: {
    code: 'ENFP',
    nickname: 'Sang Penggerak Sinergi',
    shortDescription: 'Inovator yang antusias, kaya gagasan pembaruan, dan piawai menjembatani kolaborasi antar divisi industri.',
    industrialAnalysis:
      'Sebagai ENFP, Anda melihat potensi perbaikan dan transformasi di setiap sudut pabrik. Anda gemar mengkoneksikan ide baru—seperti penerapan aplikasi digital untuk checklist inspeksi atau integrasi sensor nirkabel—dengan orang-orang yang tepat di lapangan.\n\nAntusiasme Anda menular dan mampu menggerakkan para teknisi yang awalnya enggan berubah menjadi bersemangat menyambut metode baru.',
    operationalStrengths: [
      'Inisiator program perbaikan berkelanjutan (Continuous Improvement & Kaizen).',
      'Kemampuan menjembatani komunikasi antara teknisi lapangan dan manajemen TI/Engineering.',
      'Pemecahan masalah yang kreatif dengan melihat analogi dari industri lain.',
      'Kemampuan memotivasi regu untuk mengadopsi teknologi digital baru.'
    ],
    growthAreas: [
      'Menjaga konsistensi eksekusi hingga tuntas sebelum beralih ke proyek ide baru lainnya.',
      'Memperhatikan batas anggaran dan spesifikasi teknis baku yang ketat.',
      'Menghindari optimisme berlebihan saat memprediksi waktu penyelesaian pekerjaan.'
    ],
    crisisResponse:
      'Mencari rute evakuasi alternatif dan menyusun skenario pemulihan operasional dengan ide-ide fleksibel.',
    safetyOrientation:
      'Mendorong budaya keselamatan partisipatif di mana setiap saran perbaikan dari operator bawah dihargai dan diuji.',
    teamCollaboration:
      'Inspiratif dan penuh antusiasme; menghubungkan berbagai orang dengan latar belakang berbeda ke dalam satu tujuan bersama.',
    preferredWorkEnvironment:
      'Unit Continuous Improvement/Lean Manufacturing, tim adopsi transformasi digital industri, atau kantor proyek lintas divisi.',
    careerRecommendations: [
      {
        title: 'Continuous Improvement / Kaizen Facilitator',
        matchScore: 95,
        description: 'Memfasilitasi workshop Kaizen di lantai pabrik untuk memangkas pemborosan dan meningkatkan ergonomi.',
        keySkills: ['Kaizen Events', 'Visual Management', 'Stakeholder Engagement']
      },
      {
        title: 'Digital Plant Adoption Specialist',
        matchScore: 91,
        description: 'Membimbing pekerja lapangan dalam menggunakan tablet inspeksi, e-Permit, dan platform CMMS modern.',
        keySkills: ['Change Management', 'Digital Tool Training', 'User Feedback Synthesis']
      },
      {
        title: 'Cross-Site Operations Liaison',
        matchScore: 88,
        description: 'Menyebarkan best-practice pemeliharaan dan keselamatan antar fasilitas pabrik di berbagai wilayah.',
        keySkills: ['Knowledge Transfer', 'Multi-Site Coordination', 'Operational Best Practices']
      }
    ]
  },

  ESFJ: {
    code: 'ESFJ',
    nickname: 'Sang Pengayom Operasional',
    shortDescription: 'Penyokong operasional yang loyal, teratur, peduli pada kebersihan standar kerja, dan melayani kebutuhan regu.',
    industrialAnalysis:
      'Sebagai ESFJ, Anda adalah pengayom yang memastikan seluruh kebutuhan operasional regu kerja terpenuhi dengan rapi. Anda memperhatikan jadwal pergantian shift, kecukupan APD setiap personel, dan keteraturan ruang kerja dengan disiplin tinggi.\n\nAnda menciptakan atmosfer kerja yang solid dan saling peduli, memastikan tidak ada rekan kerja yang terabaikan keselamatannya selama shift berlangsung.',
    operationalStrengths: [
      'Pengorganisasian administrasi shift, logbook absensi, dan jadwal kerja yang sangat tertata.',
      'Kepedulian tinggi terhadap keselamatan fisik dan kesiapan APD setiap anggota regu.',
      'Menjaga kebersihan dan kerapian area kerja sesuai standar 5S/5R industri.',
      'Kerja sama tim yang loyal dan kepatuhan tinggi terhadap arahan pimpinan.'
    ],
    growthAreas: [
      'Belajar menerima kritik teknis tanpa merasa tersinggung secara pribadi.',
      'Lebih berani mengambil keputusan mandiri saat atasan tidak berada di lokasi.',
      'Menghadapi perubahan SOP yang mendadak dengan pikiran terbuka.'
    ],
    crisisResponse:
      'Memastikan seluruh personel di bawah tanggung jawabnya sudah berada di zona aman dan mendata kondisi kesehatan kru.',
    safetyOrientation:
      'Menegakkan kepatuhan APD melalui pendekatan perhatian dan kepedulian tulus terhadap keselamatan rekan.',
    teamCollaboration:
      'Menjadi tuan rumah yang ramah di ruang kontrol, menyediakan dukungan administratif, dan memperkuat kekeluargaan regu.',
    preferredWorkEnvironment:
      'Kantor pengawas shift (Shift Office), pusat administrasi operasi pabrik, atau koordinasi layanan pendukung operasional site.',
    careerRecommendations: [
      {
        title: 'Shift Administration & Operations Support Lead',
        matchScore: 96,
        description: 'Mengelola jadwal kerja regu, koordinasi izin lembur, dokumen keselamatan, dan logistik harian shift.',
        keySkills: ['5S/5R Management', 'Shift Administration', 'Crew Welfare Coordination']
      },
      {
        title: 'Safety Equipment & PPE Controller',
        matchScore: 92,
        description: 'Memastikan stok alat pelindung diri, tabung SCBA, dan kotak P3K di seluruh unit kerja selalu siap pakai.',
        keySkills: ['PPE Inventory Management', 'SCBA Inspection', 'First Aid Preparedness']
      },
      {
        title: 'Site Visitor & Contractor Safety Induction Officer',
        matchScore: 90,
        description: 'Menyambut tamu, vendor, dan pekerja kontraktor baru dengan induksi keselamatan yang komprehensif.',
        keySkills: ['Visitor Induction', 'Site Badge Issuance', 'Compliance Briefing']
      }
    ]
  },

  ISFJ: {
    code: 'ISFJ',
    nickname: 'Sang Pelindung Standar',
    shortDescription: 'Penjaga integritas operasional yang setia, cermat, penuh tanggung jawab, dan menjaga keselamatan tanpa lelah.',
    industrialAnalysis:
      'Sebagai ISFJ, Anda adalah pelindung standar operasional yang paling berdedikasi. Anda bekerja dengan kesabaran luar biasa untuk memeriksa setiap instrumen, memastikan valve terkunci dengan aman (LOTO - Lockout Tagout), dan menjaga catatan kepatuhan pabrik bebas cela.\n\nKekuatan Anda adalah ketelitian yang tak tergoyahkan dan rasa tanggung jawab mendalam untuk melindungi rekan kerja dari bahaya kecelakaan kerja.',
    operationalStrengths: [
      'Ketelitian tinggi dalam penerapan prosedur isolasi energi berbahaya (Lockout/Tagout - LOTO).',
      'Penyusunan dan pemeliharaan arsip riwayat pemeliharaan mesin yang rapi dan terverifikasi.',
      'Sikap kerja yang tenang, penuh kehati-hatian, dan pantang menyerah dalam tugas rutin.',
      'Kesiapsiagaan tinggi dalam mematuhi regulasi keselamatan dan standar lingkungan.'
    ],
    growthAreas: [
      'Belajar mengungkapkan pendapat saat melihat ketidakefisienan dalam prosedur kerja lama.',
      'Menyesuaikan diri dengan perubahan teknologi tanpa rasa cemas berlebihan.',
      'Membagi beban kerja kepada rekan lain agar tidak memikul tanggung jawab sendirian.'
    ],
    crisisResponse:
      'Melaksanakan prosedur penutupan darurat (emergency shutdown) langkah demi langkah dengan sangat teliti untuk mencegah eskalasi bahaya.',
    safetyOrientation:
      'Menjadi teladan keselamatan; tidak akan pernah melangkahi satu tahapan JSA atau LOTO sekecil apa pun.',
    teamCollaboration:
      'Rekan kerja yang sangat loyal, dapat dipercaya memegang kunci isolasi penting, dan selalu siap mendukung tim.',
    preferredWorkEnvironment:
      'Ruang kontrol dokumen keselamatan, stasiun kendali isolasi energi (LOTO Station), atau unit pemeliharaan preventif berkala.',
    careerRecommendations: [
      {
        title: 'Lockout/Tagout (LOTO) & Energy Isolation Specialist',
        matchScore: 97,
        description: 'Memimpin verifikasi isolasi energi listrik, hidrolik, dan kimia sebelum teknisi masuk area berbahaya.',
        keySkills: ['Energy Isolation (LOTO)', 'Permit Verification', 'Zero Energy Verification']
      },
      {
        title: 'Preventive Maintenance Records Controller',
        matchScore: 93,
        description: 'Memelihara kepatuhan jadwal perawatan preventif mesin dan memvalidasi sertifikat uji kelayakan alat.',
        keySkills: ['CMMS Compliance', 'Inspection Records', 'Equipment Certification']
      },
      {
        title: 'Process Safety Document Controller',
        matchScore: 90,
        description: 'Mengelola database P&ID terkini, dokumen HAZOP, dan Manual Operasi Standar fasilitas pabrik.',
        keySkills: ['Document Control', 'P&ID Archiving', 'Audit Readiness']
      }
    ]
  }
};
