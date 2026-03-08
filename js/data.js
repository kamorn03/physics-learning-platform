// PhysicsAI - Lesson Data (ตามหลักสูตรฟิสิกส์ ม.4)

const lessonsData = {
    // บทที่ 5: งานและพลังงาน
    chapter5: {
        id: 5,
        title: 'งานและพลังงาน',
        color: 'chapter-5',
        colorClass: 'from-purple-500 to-purple-700',
        description: 'ศึกษางาน พลังงาน กฎการอนุรักษ์พลังงานกล และเครื่องกล',
        progress: 0,
        status: 'not_started',
        objectives: {
            knowledge: 'อธิบายงาน พลังงาน และกฎการอนุรักษ์พลังงานกลได้',
            process: 'คำนวณงาน พลังงาน และวิเคราะห์ประสิทธิภาพของเครื่องกลได้',
            attitude: 'เห็นความสำคัญของการใช้พลังงานอย่างมีประสิทธิภาพ'
        },
        topics: [
            {
                id: '5.1',
                title: 'งาน',
                progress: 0,
                status: 'not_started',
                subtopics: [],
                content: 'งานคือผลคูณของแรงกับการกระจัดในทิศทางของแรง',
                formula: 'W = Fs cos θ',
                formulaDescription: 'W = งาน (J), F = แรง (N), s = การกระจัด (m), θ = มุมระหว่างแรงกับการกระจัด'
            },
            {
                id: '5.2',
                title: 'กำลัง',
                progress: 0,
                status: 'not_started',
                subtopics: [],
                content: 'กำลังคืออัตราการทำงาน มีหน่วยเป็นวัตต์',
                formula: 'P = W/t',
                formulaDescription: 'P = กำลัง (W), W = งาน (J), t = เวลา (s)'
            },
            {
                id: '5.3',
                title: 'พลังงานจลน์',
                progress: 0,
                status: 'not_started',
                subtopics: [],
                content: 'พลังงานจลน์คือพลังงานที่วัตถุมีเนื่องจากการเคลื่อนที่',
                formula: 'KE = ½mv²',
                formulaDescription: 'KE = พลังงานจลน์ (J), m = มวล (kg), v = ความเร็ว (m/s)'
            },
            {
                id: '5.4',
                title: 'พลังงานศักย์',
                progress: 0,
                status: 'not_started',
                subtopics: [
                    { id: '5.4.1', title: 'พลังงานศักย์โน้มถ่วง', progress: 0 },
                    { id: '5.4.2', title: 'พลังงานศักย์', progress: 0 }
                ],
                content: 'พลังงานศักย์คือพลังงานที่สะสมอยู่ในวัตถุเนื่องจากตำแหน่งหรือสภาพของวัตถุ',
                formula: 'PE = mgh',
                formulaDescription: 'PE = พลังงานศักย์โน้มถ่วง (J), m = มวล (kg), g = ความเร่งโน้มถ่วง, h = ความสูง (m)'
            },
            {
                id: '5.5',
                title: 'การอนุรักษ์พลังงานกล',
                progress: 0,
                status: 'not_started',
                subtopics: [
                    { id: '5.5.1', title: 'งานเนื่องจากแรงอนุรักษ์', progress: 0 },
                    { id: '5.5.2', title: 'กฎการอนุรักษ์พลังงานกล', progress: 0 }
                ],
                content: 'ในระบบที่มีเฉพาะแรงอนุรักษ์ พลังงานกลรวม (KE + PE) คงตัว',
                formula: 'KE₁ + PE₁ = KE₂ + PE₂',
                formulaDescription: 'พลังงานกลรวมที่ตำแหน่งเริ่มต้น = พลังงานกลรวมที่ตำแหน่งสุดท้าย'
            },
            {
                id: '5.6',
                title: 'เครื่องกล',
                progress: 0,
                status: 'not_started',
                subtopics: [
                    { id: '5.6.1', title: 'ประสิทธิภาพของเครื่องกล', progress: 0 },
                    { id: '5.6.2', title: 'หลักการของงานกับเครื่องกลอย่างง่าย', progress: 0 },
                    { id: '5.6.3', title: 'หลักการของสมดุลกลกับเครื่องกลอย่างง่าย', progress: 0 }
                ],
                content: 'เครื่องกลช่วยผ่อนแรงหรือเปลี่ยนทิศทางของแรง แต่ไม่สามารถลดงานที่ต้องทำได้',
                formula: 'η = (W_out / W_in) × 100%',
                formulaDescription: 'η = ประสิทธิภาพ, W_out = งานที่ได้, W_in = งานที่ใส่เข้าไป'
            }
        ]
    }
};

// Quiz Questions - แบ่งตามบท
const quizData = {
    chapter5: [
        {
            id: 'c5q1',
            topic: 'งาน',
            question: 'ออกแรง 50 N ดันกล่องไปได้ระยะ 4 m ในทิศเดียวกับแรง งานที่ทำคือเท่าไร?',
            options: ['12.5 J', '200 J', '54 J', '46 J'],
            correct: 1,
            explanation: 'W = Fs cos θ = 50 × 4 × cos 0° = 200 J',
            hint: 'งาน = แรง × ระยะทาง × cos(มุม) เมื่อแรงและการเคลื่อนที่ทิศเดียวกัน θ = 0°'
        },
        {
            id: 'c5q2',
            topic: 'พลังงานจลน์',
            question: 'รถยนต์มวล 1,000 kg เคลื่อนที่ด้วยความเร็ว 10 m/s พลังงานจลน์คือเท่าไร?',
            options: ['10,000 J', '50,000 J', '100,000 J', '5,000 J'],
            correct: 1,
            explanation: 'KE = ½mv² = ½ × 1,000 × 10² = 50,000 J',
            hint: 'ใช้สูตร KE = ½mv²'
        },
        {
            id: 'c5q3',
            topic: 'พลังงานศักย์',
            question: 'วัตถุมวล 5 kg อยู่สูงจากพื้น 10 m พลังงานศักย์โน้มถ่วงคือเท่าไร? (g = 10 m/s²)',
            options: ['50 J', '500 J', '5 J', '5,000 J'],
            correct: 1,
            explanation: 'PE = mgh = 5 × 10 × 10 = 500 J',
            hint: 'ใช้สูตร PE = mgh'
        },
        {
            id: 'c5q4',
            topic: 'การอนุรักษ์พลังงานกล',
            question: 'ลูกบอลตกจากที่สูง 20 m ความเร็วขณะกระทบพื้นคือเท่าไร? (g = 10 m/s², ไม่คิดแรงต้านอากาศ)',
            options: ['10 m/s', '20 m/s', '200 m/s', '400 m/s'],
            correct: 1,
            explanation: 'จากการอนุรักษ์พลังงาน: mgh = ½mv², v = √(2gh) = √(2×10×20) = 20 m/s',
            hint: 'พลังงานศักย์เปลี่ยนเป็นพลังงานจลน์ทั้งหมด'
        },
        {
            id: 'c5q5',
            topic: 'ประสิทธิภาพเครื่องกล',
            question: 'เครื่องกลใส่งาน 500 J ได้งานออกมา 400 J ประสิทธิภาพคือเท่าไร?',
            options: ['125%', '80%', '20%', '100 J'],
            correct: 1,
            explanation: 'η = (W_out / W_in) × 100% = (400/500) × 100% = 80%',
            hint: 'ประสิทธิภาพ = (งานที่ได้/งานที่ใส่) × 100%'
        }
    ]
};

// Teacher Mock Data
const teacherData = {
    students: [
        { id: 1, name: 'สมชาย ใจดี', progress: 85, score: 88, lastActive: 'วันนี้', status: 'active', chapter5: 85 },
        { id: 2, name: 'สมหญิง รักเรียน', progress: 92, score: 95, lastActive: 'วันนี้', status: 'active', chapter5: 92 },
        { id: 3, name: 'ประวิทย์ เก่งมาก', progress: 78, score: 72, lastActive: 'เมื่อวาน', status: 'active', chapter5: 78 },
        { id: 4, name: 'พิมพ์ใจ สวยงาม', progress: 45, score: 42, lastActive: '3 วันก่อน', status: 'at_risk', chapter5: 45 },
        { id: 5, name: 'วิชัย ขยันเรียน', progress: 65, score: 68, lastActive: 'วันนี้', status: 'active', chapter5: 65 },
        { id: 6, name: 'นภา ท้องฟ้า', progress: 30, score: 35, lastActive: '1 สัปดาห์', status: 'at_risk', chapter5: 30 },
    ],

    lessonProgress: [
        { name: 'บทที่ 5 - งานและพลังงาน', completed: 20, total: 35 },
    ],

    topMisconceptions: [
        { misconception: 'พลังงานศักย์และพลังงานจลน์ไม่สัมพันธ์กัน', count: 10, topic: 'บทที่ 5' },
        { misconception: 'เครื่องกลช่วยลดงานที่ต้องทำ', count: 8, topic: 'บทที่ 5' },
        { misconception: 'ประสิทธิภาพเครื่องกลเกิน 100% ได้', count: 5, topic: 'บทที่ 5' },
    ],

    allMisconceptions: [
        {
            misconception: 'พลังงานศักย์และพลังงานจลน์ไม่สัมพันธ์กัน',
            count: 10,
            topic: 'บทที่ 5 - การอนุรักษ์พลังงานกล',
            correct: 'พลังงานศักย์และพลังงานจลน์สามารถเปลี่ยนรูปแบบกันได้ โดยพลังงานกลรวมคงตัว',
            remedy: 'ใช้ PhET Simulation แสดงการแกว่งของลูกตุ้มหรือรถไฟเหาะ ให้เห็นการเปลี่ยนแปลงระหว่าง KE และ PE',
            students: ['พิมพ์ใจ', 'นภา', 'วิชัย', 'และอีก 7 คน']
        },
        {
            misconception: 'เครื่องกลช่วยลดงานที่ต้องทำ',
            count: 8,
            topic: 'บทที่ 5 - เครื่องกล',
            correct: 'เครื่องกลช่วยผ่อนแรงหรือเปลี่ยนทิศทางของแรง แต่งานที่ทำยังคงเท่าเดิมหรือมากกว่า (เนื่องจากแรงเสียดทาน)',
            remedy: 'ให้นักเรียนทดลองยกของด้วยรอกและไม่ใช้รอก แล้วคำนวณงานที่ทำ',
            students: ['ประวิทย์', 'นภา', 'และอีก 6 คน']
        },
        {
            misconception: 'ประสิทธิภาพเครื่องกลเกิน 100% ได้',
            count: 5,
            topic: 'บทที่ 5 - ประสิทธิภาพของเครื่องกล',
            correct: 'ประสิทธิภาพเครื่องกลไม่สามารถเกิน 100% ได้ เพราะพลังงานสูญเสียไปกับแรงเสียดทานเสมอ',
            remedy: 'อธิบายกฎการอนุรักษ์พลังงานและแสดงตัวอย่างการคำนวณประสิทธิภาพ',
            students: ['พิมพ์ใจ', 'และอีก 4 คน']
        },
    ],

    recentActivities: [
        { student: 'สมหญิง รักเรียน', action: 'ทำแบบทดสอบบทที่ 5 เสร็จ', time: '5 นาทีที่แล้ว', score: 95 },
        { student: 'สมชาย ใจดี', action: 'ถาม AI เรื่อง การอนุรักษ์พลังงานกล', time: '15 นาทีที่แล้ว', score: null },
        { student: 'วิชัย ขยันเรียน', action: 'เรียนเรื่องเครื่องกลเสร็จ', time: '30 นาทีที่แล้ว', score: null },
        { student: 'ประวิทย์ เก่งมาก', action: 'ทำแบบทดสอบเรื่องพลังงานศักย์', time: '1 ชั่วโมงที่แล้ว', score: 72 },
    ]
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lessonsData, quizData, teacherData };
}
