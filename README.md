# Playwright Google Forms Automation Bot (OOP Style)

สคริปต์อัตโนมัติสำหรับกรอกข้อมูลและประเมินผลบนระบบ **Google Forms** โดยใช้ **Playwright** ร่วมกับการออกแบบโครงสร้างโค้ดแบบ **Object-Oriented Programming (OOP)** รองรับการทำงานวนลูปดันยอดเป้าหมาย, การสุ่มค่าข้อมูลเพื่อความสมจริง, และระบบเช็กยอดคำตอบแบบเรียลไทม์ผ่านลิงก์สาธารณะโดยไม่ต้องล็อกอินแอดมินหลังบ้าน

---

## ✨ คุณสมบัติเด่น (Features)

*   **🏛️ OOP Architecture (Base & Child Class):** แยกสัดส่วนโครงสร้างชัดเจน คลาสแม่ (`BaseFormBot`) ควบคุมเครื่องยนต์ สภาพแวดล้อม และลูปทั้งหมด ส่วนคลาสลูก (`FriendBot`) จัดการเฉพาะตำแหน่งปุ่มและการคลิกในหน้าฟอร์มจริง
*   **📊 Real-time Dashboard Analytics Check:** บอทสามารถแอบเข้าไปอ่านยอดสรุปจำนวนผู้ตอบล่าสุดจากหน้า `/viewanalytics` ของฟอร์มนั้น ๆ โดยอัตโนมัติ เพื่อคำนวณและรันต่อเฉพาะจำนวนรอบที่ยังขาดอยู่จนครบเป้าหมาย ไม่ต้องรันใหม่จากศูนย์
*   **🕵️‍♂️ Advanced Anti-Bot Detection:**
    *   **User-Agent Switching:** สุ่มเปลี่ยนข้อมูลอุปกรณ์ (Windows, Mac, Firefox, Chrome) ในทุก ๆ รอบลูปที่เปิดหน้าต่างใหม่
    *   **Browser Context Isolation:** สร้างและเผาทำลายเซสชัน (`BrowserContext`) ทิ้งทุกรอบ เพื่อล้างแคช คุกกี้ และประวัติแบบ 100% ป้องกันระบบความปลอดภัยของ Google ล็อกไอพี
    *   **Human-like Delay:** สุ่มเวลาหน่วงหลังทำภารกิจสำเร็จในแต่ละรอบ (3-6 วินาที) เพื่อความเป็นธรรมชาติ
*   **🛡️ Robust Error Handling & Lazy Loading Bypass:**
    *   มีระบบ `let isConnected = false` ดักลูปรีไทรกรณีอินเทอร์เน็ตแกว่งหรือหลุดข้ามคืน บอทจะรอ 10 วินาทีแล้วเข้าลิงก์ใหม่โดยสคริปต์ไม่ตัดจบ
    *   ใช้คำสั่ง `window.scrollTo` และ `.scrollIntoViewIfNeeded()` บังคับรูดหน้าจอลงด้านล่างสุด เพื่อดึงข้อคำถามย่อยที่เกิดจากระบบ Lazy Loading ของ Google Forms ให้แสดงผลครบทุกข้อก่อนทำการติ๊กคะแนน ป้องกันการกดหลุดขอบจอ

---

## 📂 โครงสร้างของโปรเจกต์ (Project Structure)

```text
├── tests/
│   ├── BaseFormBot.spec.ts   # คลาสแม่ คุมระบบหลังบ้าน ลูป สุ่ม UA และดึงยอดสรุป
│   └── google-bot.spec.ts    # คลาสลูก ใส่ตรรกะการคลิกฟอร์ม และท่อนเปิดสั่งรัน (Runner)
├── package.json              # ไฟล์บันทึก Dependencies ของโปรเจกต์
└── README.md                 # คู่มืออธิบายการใช้งาน (ไฟล์นี้)
```

---

## 🛠️ วิธีการติดตั้งและเริ่มใช้งาน (Installation & Setup)
### 1. คัดลอกโปรเจกต์ลงเครื่องคอมพิวเตอร์

```bash 
git clone https://github.com/phattharaphon0012/BotRunGoogleForm.git

cd D:\Bot-test-google_from
```

### 2. ติดตั้ง Dependencies และเบราว์เซอร์ของ Playwright:

```bash 
npm install

npx playwright install chromium
```

---

## 🚀 วิธีการสั่งรันบอท (Running the Bot)

### รันแบบปกติ (โหมดซ่อนหน้าต่างหลังบ้าน - เบาเครื่องที่สุด):

```bash
npx playwright test google-bot
```

### รันแบบโชว์หน้าต่างเบราว์เซอร์ (Headed Mode สำหรับนั่งเฝ้าดูบอททำงาน):

```bash
npx playwright test google-bot --headed
```
