// PhysicsAI - Main Application Logic

function app() {
    return {
        // State
        userRole: null,
        currentPage: 'dashboard',
        selectedChapter: null,
        selectedTopic: null,
        selectedStudent: null,
        sidebarOpen: false,

        // Quiz State
        currentQuiz: null,
        currentQuestion: 0,
        selectedAnswer: null,
        showAnswer: false,
        score: 0,
        showHint: false,
        currentHint: '',
        isLoadingHint: false,

        // Chat State
        userMessage: '',
        isTyping: false,
        chatMessages: [
            {
                role: 'ai',
                content: 'สวัสดีครับ! ผมคือ AI Tutor พร้อมช่วยเรื่องฟิสิกส์\n\nผมใช้วิธีสอนแบบโซเครติส คือจะถามคำถามนำให้คุณคิดเอง เพื่อเข้าใจอย่างลึกซึ้ง\n\nถามมาได้เลยครับ!'
            }
        ],

        // Data
        chapters: [lessonsData.chapter5],
        students: teacherData.students,
        lessonProgress: teacherData.lessonProgress,
        topMisconceptions: teacherData.topMisconceptions,
        allMisconceptions: teacherData.allMisconceptions,
        recentActivities: teacherData.recentActivities,

        // Computed
        get currentChapterQuestions() {
            if (!this.selectedChapter) return [];
            const chapterKey = `chapter${this.selectedChapter.id}`;
            return quizData[chapterKey] || [];
        },

        get totalProgress() {
            const total = this.chapters.reduce((sum, ch) => sum + ch.progress, 0);
            return Math.round(total / this.chapters.length);
        },

        get completedTopics() {
            let count = 0;
            this.chapters.forEach(ch => {
                ch.topics.forEach(t => {
                    if (t.status === 'completed') count++;
                });
            });
            return count;
        },

        get totalTopics() {
            let count = 0;
            this.chapters.forEach(ch => {
                count += ch.topics.length;
            });
            return count;
        },

        // Initialization
        init() {
            console.log('PhysicsAI initialized');
        },

        // Navigation
        selectChapter(chapter) {
            this.selectedChapter = chapter;
            this.selectedTopic = null;
            this.currentPage = 'lesson-detail';
        },

        selectTopic(topic) {
            this.selectedTopic = topic;
            this.currentPage = 'topic-detail';
        },

        goBack() {
            if (this.currentPage === 'topic-detail') {
                this.selectedTopic = null;
                this.currentPage = 'lesson-detail';
            } else if (this.currentPage === 'lesson-detail') {
                this.selectedChapter = null;
                this.currentPage = 'lessons';
            } else if (this.currentPage === 'practice' && this.selectedChapter) {
                this.currentPage = 'lesson-detail';
                this.resetQuiz();
            }
        },

        // Quiz Functions
        startQuiz(chapter) {
            this.selectedChapter = chapter;
            this.currentQuiz = this.currentChapterQuestions;
            this.currentQuestion = 0;
            this.selectedAnswer = null;
            this.showAnswer = false;
            this.score = 0;
            this.showHint = false;
            this.currentHint = '';
            this.currentPage = 'practice';
        },

        selectAnswer(index) {
            if (!this.showAnswer) {
                this.selectedAnswer = index;
            }
        },

        checkAnswer() {
            this.showAnswer = true;
            if (this.currentQuiz && this.selectedAnswer === this.currentQuiz[this.currentQuestion].correct) {
                this.score++;
            }
        },

        nextQuestion() {
            if (this.currentQuiz && this.currentQuestion < this.currentQuiz.length - 1) {
                this.currentQuestion++;
                this.selectedAnswer = null;
                this.showAnswer = false;
                this.showHint = false;
                this.currentHint = '';
            } else {
                const percentage = Math.round(this.score / this.currentQuiz.length * 100);
                alert(`คุณทำได้ ${this.score} จาก ${this.currentQuiz.length} ข้อ (${percentage}%)`);
                this.resetQuiz();
                this.currentPage = 'lesson-detail';
            }
        },

        resetQuiz() {
            this.currentQuestion = 0;
            this.selectedAnswer = null;
            this.showAnswer = false;
            this.showHint = false;
            this.currentHint = '';
            this.score = 0;
        },

        getAIHint() {
            this.isLoadingHint = true;
            setTimeout(() => {
                if (this.currentQuiz && this.currentQuiz[this.currentQuestion]) {
                    this.currentHint = this.currentQuiz[this.currentQuestion].hint;
                }
                this.isLoadingHint = false;
                this.showHint = true;
            }, 800);
        },

        // Chat Functions
        addMessage(role, content) {
            this.chatMessages.push({ role, content });
            this.$nextTick(() => {
                const container = document.getElementById('chatContainer');
                if (container) container.scrollTop = container.scrollHeight;
            });
        },

        sendMessage() {
            if (!this.userMessage.trim()) return;
            this.addMessage('user', this.userMessage);
            const question = this.userMessage;
            this.userMessage = '';
            this.isTyping = true;

            setTimeout(() => {
                this.isTyping = false;
                this.addMessage('ai', this.generateAIResponse(question));
            }, 1200);
        },

        sendSuggestedQuestion(question) {
            this.userMessage = question;
            this.sendMessage();
        },

        generateAIResponse(question) {
            const q = question.toLowerCase();

            // บทที่ 1 - ธรรมชาติและพัฒนาการทางฟิสิกส์
            if (q.includes('หน่วย') || q.includes('si') || q.includes('เมตร')) {
                return `คำถามดีครับ! เรื่องหน่วย SI 📏\n\n🤔 ลองคิดดูก่อน: ทำไมเราต้องมีระบบหน่วยมาตรฐาน?\n\n💡 หน่วยฐาน SI มี 7 หน่วย:\n• ความยาว: เมตร (m)\n• มวล: กิโลกรัม (kg)\n• เวลา: วินาที (s)\n• กระแสไฟฟ้า: แอมแปร์ (A)\n• อุณหภูมิ: เคลวิน (K)\n• ปริมาณสาร: โมล (mol)\n• ความเข้มการส่องสว่าง: แคนเดลา (cd)\n\nมีคำถามเพิ่มเติมไหมครับ?`;
            }

            if (q.includes('เลขนัยสำคัญ') || q.includes('significant')) {
                return `เลขนัยสำคัญเป็นเรื่องสำคัญในการวัดครับ! 🔢\n\n📌 กฎง่ายๆ:\n1. เลข 1-9 นับทุกตัว\n2. เลข 0 ระหว่างเลขนับ\n3. เลข 0 หลังจุดทศนิยมนับ\n4. เลข 0 นำหน้าไม่นับ\n\n📝 ตัวอย่าง:\n• 0.0034 = 2 ตัว (3, 4)\n• 3.40 = 3 ตัว (3, 4, 0)\n• 1002 = 4 ตัว\n\nลองหาเลขนัยสำคัญของ 0.00500 ดูครับ มีกี่ตัว?`;
            }

            // บทที่ 2 - การเคลื่อนที่แนวตรง
            if (q.includes('ความเร็ว') || q.includes('velocity') || q.includes('อัตราเร็ว')) {
                return `มาทำความเข้าใจความเร็วกันครับ! 🚗\n\n🤔 คำถามก่อน: ความเร็วกับอัตราเร็วต่างกันอย่างไร?\n\n💡 คำตอบ:\n• **อัตราเร็ว** (speed) = ระยะทาง/เวลา (สเกลาร์)\n• **ความเร็ว** (velocity) = การกระจัด/เวลา (เวกเตอร์)\n\n📝 ตัวอย่าง:\nรถวิ่งรอบสนามรูปวงกลม 1 รอบ ใช้เวลา 1 นาที\n• อัตราเร็วเฉลี่ย ≠ 0 (วิ่งได้ระยะทาง)\n• ความเร็วเฉลี่ย = 0 (กลับมาที่เดิม!)\n\nเห็นความต่างไหมครับ?`;
            }

            if (q.includes('ความเร่ง') || q.includes('acceleration')) {
                return `ความเร่งเป็นหัวใจของการเคลื่อนที่ครับ! 🏎️\n\n💡 ความเร่ง = อัตราการเปลี่ยนแปลงความเร็ว\n\n📐 สูตร: a = Δv/Δt = (v-u)/t\n\n🤔 ลองคิด: ความเร่งเป็นลบได้ไหม?\n\n✅ ได้ครับ! ความเร่งเป็นลบหมายถึง:\n• ความเร็วลดลง (ถ้าเคลื่อนที่ไปข้างหน้า)\n• หรือเร็วขึ้นในทิศตรงข้าม\n\n📝 หน่วย: m/s² (เมตรต่อวินาทียกกำลังสอง)\n\nอยากให้ยกตัวอย่างเพิ่มไหมครับ?`;
            }

            if (q.includes('การตก') || q.includes('free fall') || q.includes('ตกอิสระ')) {
                return `การตกแบบเสรีน่าสนใจมากครับ! 🍎\n\n🤔 คำถาม: ลูกเหล็กกับขนนกตกถึงพื้นพร้อมกันไหม?\n\n💡 คำตอบ:\n• **ในอากาศ**: ลูกเหล็กตกก่อน (เพราะแรงต้านอากาศ)\n• **ในสุญญากาศ**: ตกพร้อมกัน!\n\n📐 ในการตกแบบเสรี:\n• g ≈ 9.8 m/s² (ความเร่งโน้มถ่วง)\n• v = gt (ความเร็วเมื่อตก)\n• h = ½gt² (ระยะตก)\n\n🎥 ลองดู Apollo 15 Moon Experiment นักบินอวกาศทำการทดลองบนดวงจันทร์ น่าทึ่งมาก!\n\nอยากรู้อะไรเพิ่มครับ?`;
            }

            // บทที่ 3 - แรงและกฎการเคลื่อนที่
            if (q.includes('f = ma') || q.includes('f=ma') || q.includes('นิวตัน')) {
                return `คำถามดีมากครับ! กฎนิวตัน 💪\n\n🤔 ก่อนอธิบาย ลองคิด:\nผลักรถเข็นว่าง กับรถเข็นบรรทุกของ อันไหนง่ายกว่า?\n\n💡 กฎ 3 ข้อของนิวตัน:\n\n**ข้อ 1 (ความเฉื่อย)**:\nวัตถุจะรักษาสภาพเดิม ถ้าไม่มีแรงมากระทำ\n\n**ข้อ 2 (F = ma)**:\n• F = แรงลัพธ์ (N)\n• m = มวล (kg)\n• a = ความเร่ง (m/s²)\n\n**ข้อ 3 (กิริยา-ปฏิกิริยา)**:\nทุกแรงมีแรงตอบโต้เท่ากันแต่ทิศตรงข้าม\n\nลองยกตัวอย่างในชีวิตจริงได้ไหมครับ?`;
            }

            if (q.includes('แรงเสียดทาน') || q.includes('friction')) {
                return `แรงเสียดทานอยู่รอบตัวเราครับ! 🛞\n\n🤔 ลองคิด: ถ้าไม่มีแรงเสียดทานเลย เราจะเดินได้ไหม?\n\n💡 แรงเสียดทานมี 2 ชนิด:\n\n**1. แรงเสียดทานสถิต (fs)**\n• เกิดเมื่อวัตถุยังไม่เคลื่อนที่\n• fs ≤ μsN\n\n**2. แรงเสียดทานจลน์ (fk)**\n• เกิดเมื่อวัตถุเคลื่อนที่แล้ว\n• fk = μkN\n\n📌 โดยทั่วไป: μs > μk\n(ดันให้เริ่มเคลื่อนยากกว่าดันให้เคลื่อนต่อ)\n\nมีคำถามเพิ่มเติมไหมครับ?`;
            }

            if (q.includes('ตัวอย่าง') || q.includes('ชีวิตจริง')) {
                return `มาดูตัวอย่างฟิสิกส์ในชีวิตจริงกันครับ! 🌟\n\n📌 **บทที่ 1 - การวัด**:\n• แพทย์ต้องวัดปริมาณยาให้แม่นยำ\n• วิศวกรต้องวัดขนาดชิ้นส่วนให้ถูกต้อง\n\n📌 **บทที่ 2 - การเคลื่อนที่**:\n• GPS คำนวณตำแหน่งและความเร็วรถ\n• นักกีฬาวิเคราะห์การวิ่งด้วยกราฟ\n\n📌 **บทที่ 3 - แรง**:\n• รถ F1 เบาเพื่อเร่งได้เร็ว (F = ma)\n• เข็มขัดนิรภัยป้องกันความเฉื่อย\n• จรวดใช้กฎข้อ 3 ในการขับเคลื่อน\n\nอยากให้อธิบายตัวอย่างไหนเพิ่มครับ?`;
            }

            // Default response
            return `ขอบคุณสำหรับคำถามครับ! 🙏\n\nช่วยบอกผมเพิ่มเติมหน่อยได้ไหมครับ:\n• คุณกำลังเรียนบทไหนอยู่?\n• มีส่วนไหนที่สงสัยเป็นพิเศษ?\n\n📚 หัวข้อที่ผมช่วยได้:\n• บทที่ 1: การวัด หน่วย SI เลขนัยสำคัญ\n• บทที่ 2: การเคลื่อนที่ ความเร็ว ความเร่ง\n• บทที่ 3: แรง กฎนิวตัน แรงเสียดทาน\n\nถามมาได้เลยครับ! 😊`;
        },

        // Teacher Functions
        selectStudent(student) {
            this.selectedStudent = student;
        },

        getStatusColor(status) {
            return status === 'active' ? 'bg-green-100 text-green-700' :
                   status === 'at_risk' ? 'bg-red-100 text-red-700' :
                   'bg-gray-100 text-gray-700';
        },

        getStatusText(status) {
            return status === 'active' ? 'ปกติ' :
                   status === 'at_risk' ? 'ต้องดูแล' :
                   'ไม่ทราบ';
        },

        // Helper Functions
        getChapterColor(chapterId) {
            const colors = {
                5: 'bg-gradient-to-br from-purple-500 to-purple-700'
            };
            return colors[chapterId] || 'bg-gradient-to-br from-purple-500 to-purple-700';
        },

        getProgressColor(progress) {
            if (progress >= 80) return 'bg-green-500';
            if (progress >= 50) return 'bg-yellow-500';
            if (progress > 0) return 'bg-orange-500';
            return 'bg-gray-300';
        },

        getTopicStatusIcon(status) {
            if (status === 'completed') return '✓';
            if (status === 'in_progress') return '●';
            return '○';
        },

        formatTime(minutes) {
            if (minutes < 60) return `${minutes} นาที`;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} ชม. ${mins} นาที` : `${hours} ชม.`;
        }
    }
}
