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
                let message = `คุณทำได้ ${this.score} จาก ${this.currentQuiz.length} ข้อ (${percentage}%)\n\n`;

                if (percentage <= 59) {
                    message += `📚 ควรปรับปรุง\n\nไม่เป็นไรนะครับ! การเรียนรู้ต้องใช้เวลา ลองทบทวนเนื้อหาและฝึกทำแบบฝึกหัดเพิ่มเติม แล้วกลับมาทำใหม่อีกครั้งนะครับ สู้ๆ!`;
                } else if (percentage >= 60 && percentage <= 79) {
                    message += `🎉 ยอดเยี่ยม! อยู่ในเกณฑ์ดี\n\nคุณทำได้ดีมากครับ! พยายามต่อไปอีกนิดเพื่อไปให้ถึง 100% คุณทำได้แน่นอน!`;
                } else {
                    message += `🏆 ขอแสดงความยินดี! อยู่ในเกณฑ์ดีเยี่ยม\n\nเก่งมากครับ! คุณเข้าใจเนื้อหาได้อย่างดีเยี่ยม ความพยายามของคุณได้ผลลัพธ์ที่ยอดเยี่ยม!`;
                }

                alert(message);
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

            // บทที่ 5 - งานและพลังงาน

            // 5.4.2 พลังงานศักย์
            if (q.includes('พลังงานศักย์') || q.includes('pe') || q.includes('potential energy')) {
                return `มาทำความเข้าใจพลังงานศักย์กันครับ! ⬆️\n\n🤔 ลองคิดก่อน: ลูกบอลที่อยู่บนโต๊ะ กับลูกบอลที่อยู่บนพื้น อันไหนมีพลังงานมากกว่า?\n\n💡 พลังงานศักย์โน้มถ่วง:\nคือพลังงานที่สะสมเนื่องจากตำแหน่งของวัตถุ\n\n📐 สูตร: PE = mgh\n• PE = พลังงานศักย์ (J)\n• m = มวล (kg)\n• g = ความเร่งโน้มถ่วง (10 m/s²)\n• h = ความสูง (m)\n\n📝 ตัวอย่าง:\nวัตถุมวล 2 kg อยู่สูง 5 m\nPE = 2 × 10 × 5 = 100 J\n\nลองคำนวณดูครับ: วัตถุมวล 5 kg อยู่สูง 10 m มี PE เท่าไร?`;
            }

            if (q.includes('พลังงานจลน์') || q.includes('ke') || q.includes('kinetic energy')) {
                return `พลังงานจลน์คือพลังงานของการเคลื่อนที่ครับ! 🏃\n\n💡 พลังงานจลน์:\nคือพลังงานที่วัตถุมีเนื่องจากการเคลื่อนที่\n\n📐 สูตร: KE = ½mv²\n• KE = พลังงานจลน์ (J)\n• m = มวล (kg)\n• v = ความเร็ว (m/s)\n\n🤔 ลองคิด: ถ้าความเร็วเพิ่มเป็น 2 เท่า พลังงานจลน์เพิ่มกี่เท่า?\n\n✅ คำตอบ: เพิ่ม 4 เท่า! (เพราะ v ยกกำลังสอง)\n\n📝 ตัวอย่าง:\nรถมวล 1000 kg วิ่ง 20 m/s\nKE = ½ × 1000 × 20² = 200,000 J\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // 5.5 การอนุรักษ์พลังงานกล
            if (q.includes('แรงอนุรักษ์') || q.includes('conservative force')) {
                return `มาเรียนรู้เรื่องแรงอนุรักษ์กันครับ! 🔄\n\n🤔 คำถาม: แรงโน้มถ่วงกับแรงเสียดทาน แรงไหนเป็นแรงอนุรักษ์?\n\n💡 แรงอนุรักษ์คือ:\nแรงที่งานไม่ขึ้นกับเส้นทาง ขึ้นกับตำแหน่งต้นและปลายเท่านั้น\n\n✅ ตัวอย่างแรงอนุรักษ์:\n• แรงโน้มถ่วง\n• แรงสปริง\n• แรงไฟฟ้า\n\n❌ แรงไม่อนุรักษ์:\n• แรงเสียดทาน\n• แรงต้านอากาศ\n• แรงเบรก\n\n📌 สำคัญ: ในระบบที่มีเฉพาะแรงอนุรักษ์ พลังงานกลรวมคงตัว!\n\nเข้าใจไหมครับ?`;
            }

            if (q.includes('อนุรักษ์พลังงาน') || q.includes('conservation') || q.includes('พลังงานกล')) {
                return `กฎการอนุรักษ์พลังงานกลสำคัญมากครับ! ⚡\n\n💡 หลักการ:\nในระบบที่มีเฉพาะแรงอนุรักษ์ พลังงานกลรวมคงตัว\n\n📐 สูตร: KE₁ + PE₁ = KE₂ + PE₂\n\nหรือ: ½mv₁² + mgh₁ = ½mv₂² + mgh₂\n\n📝 ตัวอย่าง:\nลูกบอลตกจากที่สูง 20 m หาความเร็วขณะกระทบพื้น\n\nที่จุดเริ่มต้น: KE₁ = 0, PE₁ = mgh\nที่พื้น: KE₂ = ½mv², PE₂ = 0\n\nmgh = ½mv²\nv = √(2gh) = √(2×10×20) = 20 m/s\n\n🤔 ลองคิด: ถ้าโยนลูกบอลขึ้นด้วยความเร็ว 20 m/s จะขึ้นได้สูงเท่าไร?`;
            }

            // 5.6 เครื่องกล
            if (q.includes('เครื่องกล') || q.includes('machine') || q.includes('ผ่อนแรง')) {
                return `มาทำความเข้าใจเครื่องกลกันครับ! ⚙️\n\n🤔 คำถาม: เครื่องกลช่วยลดงานที่ต้องทำได้ไหม?\n\n💡 คำตอบ: ไม่ได้ครับ!\nเครื่องกลช่วยผ่อนแรงหรือเปลี่ยนทิศทางของแรง\nแต่งานที่ทำยังคงเท่าเดิมหรือมากกว่า\n\n📌 เครื่องกลอย่างง่าย:\n• รอก (ตาย/เคลื่อนที่)\n• คาน\n• พื้นเอียง\n• ลิ่ม\n• สกรู\n• ล้อและเพลา\n\n📐 หลักการ: งานที่ใส่ = งานที่ได้ + พลังงานสูญเสีย\n\nอยากรู้เรื่องเครื่องกลชนิดไหนเพิ่มครับ?`;
            }

            if (q.includes('ประสิทธิภาพ') || q.includes('efficiency')) {
                return `ประสิทธิภาพของเครื่องกลสำคัญมากครับ! 📊\n\n💡 ประสิทธิภาพ คือ:\nอัตราส่วนของงานที่ได้ออกมาต่องานที่ใส่เข้าไป\n\n📐 สูตร: η = (W_out / W_in) × 100%\n\n🤔 คำถาม: ประสิทธิภาพเกิน 100% ได้ไหม?\n\n❌ ไม่ได้ครับ! เพราะ:\n• มีแรงเสียดทานเสมอ\n• พลังงานสูญเสียเป็นความร้อน\n• ตามกฎอนุรักษ์พลังงาน\n\n📝 ตัวอย่าง:\nเครื่องกลใส่งาน 500 J ได้งาน 400 J\nη = (400/500) × 100% = 80%\n\nเข้าใจไหมครับ?`;
            }

            if (q.includes('รอก') || q.includes('pulley')) {
                return `มาเรียนรู้เรื่องรอกกันครับ! 🔄\n\n💡 รอกมี 2 ประเภท:\n\n**1. รอกตาย (Fixed Pulley)**\n• ไม่ช่วยผ่อนแรง\n• ช่วยเปลี่ยนทิศทางแรง\n• MA = 1 (Mechanical Advantage)\n\n**2. รอกเคลื่อนที่ (Movable Pulley)**\n• ช่วยผ่อนแรง 2 เท่า\n• ต้องดึงระยะทาง 2 เท่า\n• MA = 2\n\n📐 หลักการ:\nงานที่ทำ = แรง × ระยะทาง (คงที่)\nผ่อนแรง → ต้องเพิ่มระยะทาง\n\n📝 ตัวอย่าง:\nยกของหนัก 100 N ด้วยรอกเคลื่อนที่\nแรงที่ใช้ = 100/2 = 50 N\nแต่ต้องดึงเชือก 2 เท่าของความสูง\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            if (q.includes('คาน') || q.includes('lever') || q.includes('โมเมนต์')) {
                return `คานเป็นเครื่องกลอย่างง่ายที่ใช้บ่อยครับ! ⚖️\n\n💡 หลักการสมดุลของคาน:\nโมเมนต์ตามเข็ม = โมเมนต์ทวนเข็ม\n\n📐 สูตร: F₁ × d₁ = F₂ × d₂\n• F = แรง (N)\n• d = แขนคาน (ระยะจากจุดหมุน)\n\n📝 ตัวอย่าง:\nคานยาว 2 m จุดหมุนอยู่ตรงกลาง\nวางน้ำหนัก 20 N ที่ปลายด้านหนึ่ง\nต้องวาง 20 N ที่ปลายอีกด้านเพื่อสมดุล\n\n🤔 ถ้าเลื่อนจุดหมุนให้ใกล้น้ำหนักมากขึ้น\nจะต้องใช้แรงน้อยลง แต่ต้องกดระยะมากขึ้น\n\nเข้าใจไหมครับ?`;
            }

            if (q.includes('ตัวอย่าง') || q.includes('ชีวิตจริง')) {
                return `มาดูตัวอย่างงานและพลังงานในชีวิตจริงกันครับ! 🌟\n\n📌 **พลังงานศักย์**:\n• เขื่อนกักเก็บน้ำ - น้ำสูงมี PE มาก\n• ลูกตุ้มนาฬิกา - แกว่งโดยใช้ PE\n• รถไฟเหาะ - จุดสูงสุดมี PE มากที่สุด\n\n📌 **การอนุรักษ์พลังงาน**:\n• ชิงช้า - PE เปลี่ยนเป็น KE สลับกัน\n• สกีลงเขา - PE เปลี่ยนเป็นความเร็ว\n• บันจี้จัมพ์ - PE → KE → PE สปริง\n\n📌 **เครื่องกล**:\n• กรรไกร - คานช่วยตัด\n• รอกยกของก่อสร้าง\n• พื้นเอียงขนของขึ้นรถ\n\nอยากให้อธิบายตัวอย่างไหนเพิ่มครับ?`;
            }

            // งาน (Work)
            if (q.includes('งาน') && (q.includes('คือ') || q.includes('หมายถึง') || q.includes('อะไร'))) {
                return `มาทำความเข้าใจ "งาน" ในทางฟิสิกส์ครับ! 💪\n\n💡 งาน (Work) คือ:\nผลคูณของแรงกับระยะทางในทิศทางเดียวกับแรง\n\n📐 สูตร: W = F × s × cos(θ)\n• W = งาน (J หรือ Joule)\n• F = แรง (N)\n• s = ระยะทาง (m)\n• θ = มุมระหว่างแรงกับการเคลื่อนที่\n\n🤔 คำถาม: ถ้าแบกของเดินไปข้างหน้า ทำงานกับของไหม?\n\n❌ ไม่ทำครับ! เพราะแรงแบก (ขึ้น) ตั้งฉากกับการเคลื่อนที่ (ไปข้างหน้า)\ncos(90°) = 0 ดังนั้น W = 0\n\n📝 ตัวอย่าง:\nผลักกล่อง 10 N ไป 5 m\nW = 10 × 5 = 50 J\n\nเข้าใจไหมครับ?`;
            }

            // พื้นเอียง
            if (q.includes('พื้นเอียง') || q.includes('incline') || q.includes('ทางลาด')) {
                return `พื้นเอียงเป็นเครื่องกลอย่างง่ายที่ใช้บ่อยครับ! 📐\n\n💡 พื้นเอียงช่วย:\nผ่อนแรงในการยกของขึ้นที่สูง\n\n📐 หลักการ:\n• แรงที่ใช้ดัน = mg × sin(θ)\n• ระยะทางที่ต้องเดิน = h / sin(θ)\n\n🤔 ยิ่งเอียงน้อย (มุมเล็ก):\n• ใช้แรงน้อยลง\n• แต่ต้องเดินระยะมากขึ้น\n• งานที่ทำเท่าเดิม!\n\n📝 ตัวอย่าง:\nยกของหนัก 100 N ขึ้นสูง 2 m\n• ยกตรงๆ: ใช้แรง 100 N ระยะ 2 m\n• ใช้พื้นเอียง 30°: ใช้แรง 50 N ระยะ 4 m\nงาน = 200 J เท่ากัน!\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // ลูกตุ้ม/ชิงช้า
            if (q.includes('ลูกตุ้ม') || q.includes('ชิงช้า') || q.includes('pendulum')) {
                return `ลูกตุ้มเป็นตัวอย่างการอนุรักษ์พลังงานที่ดีครับ! 🎯\n\n💡 หลักการ:\nพลังงานกลรวมคงที่ (ถ้าไม่มีแรงต้าน)\n\n📐 การเปลี่ยนแปลงพลังงาน:\n• จุดสูงสุด: PE สูงสุด, KE = 0 (หยุดชั่วขณะ)\n• จุดต่ำสุด: KE สูงสุด, PE = 0 (เร็วสุด)\n\n🎢 ความเร็วที่จุดต่ำสุด:\nv = √(2gh)\nโดย h = ความสูงที่ปล่อย\n\n📝 ตัวอย่าง:\nปล่อยลูกตุ้มจากความสูง 0.8 m\nv = √(2 × 10 × 0.8) = 4 m/s\n\n🤔 ลองคิด: ทำไมลูกตุ้มจริงๆ หยุดในที่สุด?\n\nเพราะแรงต้านอากาศทำให้พลังงานกลลดลง!\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // รถไฟเหาะ
            if (q.includes('รถไฟเหาะ') || q.includes('roller coaster')) {
                return `รถไฟเหาะเป็นตัวอย่างการอนุรักษ์พลังงานที่สนุกครับ! 🎢\n\n💡 หลักการ:\nรถไฟเหาะใช้แรงโน้มถ่วงในการเคลื่อนที่\nไม่ต้องมีเครื่องยนต์ตลอดทาง!\n\n📐 การทำงาน:\n1. ลากรถขึ้นจุดสูงสุด → PE สูงสุด\n2. ปล่อยตก → PE เปลี่ยนเป็น KE\n3. ขึ้นเนินใหม่ → KE เปลี่ยนเป็น PE\n\n🤔 คำถาม: เนินที่สองสูงกว่าเนินแรกได้ไหม?\n\n❌ ไม่ได้! เพราะ:\n• พลังงานกลลดลงเรื่อยๆ (แรงเสียดทาน)\n• เนินต่อๆ ไปต้องเตี้ยลง\n\n📝 ความเร็วที่จุดต่ำสุด:\nv = √(2gh) โดย h คือความสูงจุดเริ่มต้น\n\nสนุกไหมครับ?`;
            }

            // สปริง/พลังงานศักย์ยืดหยุ่น
            if (q.includes('สปริง') || q.includes('spring') || q.includes('ยืดหยุ่น')) {
                return `พลังงานศักย์ยืดหยุ่นน่าสนใจครับ! 🔧\n\n💡 พลังงานศักย์สปริง:\nเกิดจากการบีบอัดหรือยืดสปริง\n\n📐 สูตร: PE = ½kx²\n• PE = พลังงานศักย์ (J)\n• k = ค่าคงที่สปริง (N/m)\n• x = ระยะยืด/หด (m)\n\n🤔 ลองคิด: บีบสปริง 2 เท่า พลังงานเพิ่มกี่เท่า?\n\n✅ เพิ่ม 4 เท่า! (x ยกกำลังสอง)\n\n📝 ตัวอย่าง:\nสปริง k = 100 N/m บีบ 0.2 m\nPE = ½ × 100 × 0.2² = 2 J\n\n🎯 การใช้งาน:\n• ธนู - เก็บพลังงานแล้วปล่อย\n• รถชนกัน - ดูดซับพลังงาน\n• นาฬิกาลาน\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // กำลัง (Power)
            if (q.includes('กำลัง') || q.includes('power') || q.includes('วัตต์')) {
                return `กำลังบอกความเร็วในการทำงานครับ! ⚡\n\n💡 กำลัง (Power) คือ:\nอัตราการทำงาน หรือ งานต่อหน่วยเวลา\n\n📐 สูตร: P = W/t = Fv\n• P = กำลัง (W หรือ Watt)\n• W = งาน (J)\n• t = เวลา (s)\n• F = แรง (N)\n• v = ความเร็ว (m/s)\n\n📝 ตัวอย่าง:\nยกของ 100 J ใน 5 วินาที\nP = 100/5 = 20 W\n\n🏋️ เปรียบเทียบ:\n• คนทำงาน 100 J ใน 10 s → P = 10 W\n• เครื่องทำ 100 J ใน 2 s → P = 50 W\nทำงานเท่ากัน แต่เครื่องมีกำลังมากกว่า!\n\n💡 1 แรงม้า (hp) ≈ 746 W\n\nเข้าใจไหมครับ?`;
            }

            // จูล (หน่วย)
            if (q.includes('จูล') || q.includes('joule') || q.includes('หน่วย')) {
                return `มาทำความเข้าใจหน่วยของพลังงานกันครับ! 📏\n\n💡 จูล (Joule, J) คือ:\nหน่วย SI ของพลังงานและงาน\n\n📐 นิยาม:\n1 J = 1 N × 1 m = 1 kg⋅m²/s²\n\n🔄 หน่วยที่เกี่ยวข้อง:\n• 1 kJ = 1,000 J\n• 1 MJ = 1,000,000 J\n• 1 cal ≈ 4.18 J\n• 1 kWh = 3,600,000 J\n\n📝 เปรียบเทียบพลังงาน:\n• ยกแอปเปิ้ล 1 m ≈ 1 J\n• วิ่ง 100 m ≈ 5,000 J\n• อาหาร 1 มื้อ ≈ 2,000,000 J\n\n💡 1 วัตต์ = 1 จูลต่อวินาที\n(W = J/s)\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // สูตร/รวมสูตร
            if (q.includes('สูตร') || q.includes('formula') || q.includes('รวม')) {
                return `รวมสูตรบทที่ 5 งานและพลังงานครับ! 📚\n\n📐 **งาน:**\nW = F × s × cos(θ)\nW = ΔKE = ΔPE\n\n📐 **พลังงานจลน์:**\nKE = ½mv²\n\n📐 **พลังงานศักย์:**\nPE (โน้มถ่วง) = mgh\nPE (สปริง) = ½kx²\n\n📐 **อนุรักษ์พลังงานกล:**\nKE₁ + PE₁ = KE₂ + PE₂\n½mv₁² + mgh₁ = ½mv₂² + mgh₂\n\n📐 **เครื่องกล:**\nη = (W_out / W_in) × 100%\nMA = F_out / F_in\n\n📐 **กำลัง:**\nP = W/t = Fv\n\n📐 **คาน:**\nF₁ × d₁ = F₂ × d₂\n\nต้องการอธิบายสูตรไหนเพิ่มครับ?`;
            }

            // การตกอิสระ
            if (q.includes('ตก') || q.includes('drop') || q.includes('fall')) {
                return `การตกอิสระกับการอนุรักษ์พลังงานครับ! 🍎\n\n💡 เมื่อวัตถุตกอิสระ:\nPE เปลี่ยนเป็น KE ทั้งหมด\n\n📐 สูตร:\nmgh = ½mv²\nv = √(2gh)\n\n🤔 สังเกต: มวล m หายไป!\nความเร็วตกไม่ขึ้นกับมวล (ถ้าไม่มีแรงต้าน)\n\n📝 ตัวอย่าง:\nปล่อยลูกบอลจากสูง 45 m\nv = √(2 × 10 × 45) = √900 = 30 m/s\n\n🔄 ในทางกลับกัน:\nโยนขึ้นด้วยความเร็ว v จะขึ้นได้สูง:\nh = v²/(2g)\n\n📝 โยนขึ้น 30 m/s:\nh = 30²/(2×10) = 45 m\n\nเข้าใจไหมครับ?`;
            }

            // MA (Mechanical Advantage)
            if (q.includes('ma') || q.includes('mechanical advantage') || q.includes('อัตราทด')) {
                return `มาเรียนรู้เรื่อง Mechanical Advantage ครับ! ⚙️\n\n💡 MA (Mechanical Advantage) คือ:\nอัตราส่วนที่เครื่องกลช่วยขยายแรง\n\n📐 สูตร: MA = F_out / F_in\nหรือ MA = d_in / d_out\n\n📌 ตัวอย่าง MA:\n\n**รอกตาย:** MA = 1\n(เปลี่ยนทิศ ไม่ขยายแรง)\n\n**รอกเคลื่อนที่:** MA = 2\n(ขยายแรง 2 เท่า)\n\n**พื้นเอียง:** MA = L/h\n(L = ความยาว, h = ความสูง)\n\n**คาน:** MA = d₁/d₂\n(อัตราส่วนแขนคาน)\n\n🤔 MA สูง = ผ่อนแรงมาก\nแต่ต้องออกแรงระยะมากขึ้น!\n\nมีคำถามเพิ่มไหมครับ?`;
            }

            // Default response
            return `ขอบคุณสำหรับคำถามครับ! 🙏\n\nช่วยบอกผมเพิ่มเติมหน่อยได้ไหมครับ:\n• คุณกำลังเรียนหัวข้อไหนอยู่?\n• มีส่วนไหนที่สงสัยเป็นพิเศษ?\n\n📚 หัวข้อที่ผมช่วยได้ (บทที่ 5 - งานและพลังงาน):\n• พลังงานศักย์ (PE = mgh)\n• พลังงานจลน์ (KE = ½mv²)\n• การอนุรักษ์พลังงานกล\n• เครื่องกล (รอก, คาน, พื้นเอียง)\n• ประสิทธิภาพของเครื่องกล\n\nถามมาได้เลยครับ! 😊`;
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
