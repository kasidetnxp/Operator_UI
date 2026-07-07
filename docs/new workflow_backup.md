# 1. เบิก FPC เพื่อนำมาใช้ในการเทส

## 1.1 สำหรับงานที่ใช้ระบบ New World

### 1.1.1 เช็ค FPC ในระบบ MAMA

#### 1.1.1.1 Log-in เข้าระบบ Store ผ่านระบบ MMS (MAMA)

- Operator Test Login เข้าระบบ MMS โดยใส่ User/Password ของตนเอง
- คลิ๊ก MES GUI
- คลิ๊ก Store Management
- พิมพ์ชื่อ FPC ที่ต้องการเบิกโดยไม่ต้องใส่ PW

#### 1.1.1.2 จอง FPC ในระบบ MMS (MAMA)

- คลิ๊ก Reservation
- คลิ๊กที่ Probe card family
- ติ๊กหน้า FPC ที่ต้องการจอง
- คลิ๊ก Add to Cart

#### 1.1.1.3 การใส่ข้อมูลใน Cart ในระบบ MMS (MAMA)

- ติ๊กหน้า FPC ที่ต้องการจอง
- คลิ๊กที่ Checkout
- เลือกวันเวลาที่ต้องการเบิก **ห้ามเป็นเวลาก่อน Submit**
- เลือกวันเวลาที่ต้องการคืน
- กด Submit *** FPC Store Operator จะต้อง Approve + เปลี่ยนสถานะเป็น Production ***

## 1.2 สำหรับงานที่ใช้ระบบ EWFM

- เช็ค FPC ว่ามีพร้อมเบิกไหม โดยเข้า Web Store System WT ผ่านหน้าเว็บของระบบ ACS
- กดเข้าเมนู Borrow Hardware
- กดเข้าเมนู Borrow Production
- ใส่ชื่อ FPC ในช่อง FPC GROUP NAME เช่น `2ID004FV`
- กด SUBMIT

## 1.3 Operator เข้าระบบ Web UI ผ่านหน้าจอคอมพิวเตอร์/แท็บเล็ตหน้างาน โดยใส่รหัสพนักงานและรหัสผ่าน *(เปลี่ยนจาก: หยิบ Tablet ที่ตู้ชาร์จเพื่อสั่ง AGV)*

## 1.4 Operator เลือกโหมด UNLOAD (เบิก FPC) บนหน้าจอ Web UI *(เปลี่ยนจาก: กด UNLOAD ที่ Smart Cabinet)*

- ค้นหา FPC ที่ต้องการเบิก โดยพิมพ์ชื่อ FPC ในช่องค้นหา ระบบจะแสดงผลลัพธ์จากฐานข้อมูลคลังเก็บ Smart Storage
- Operator เลือก FPC ที่ต้องการจากรายการผลลัพธ์
- เลือกเครื่อง Prober ปลายทางที่ต้องการติดตั้ง FPC (เครื่องที่ไม่พร้อมใช้งานจะแสดงเป็นสีเทาและไม่สามารถเลือกได้)
- ตรวจสอบข้อมูลในกล่องยืนยัน (Confirm Dialog) แสดง FPC ที่เลือก, ต้นทาง (Smart Storage), และปลายทาง (เครื่อง Prober)
  - ถ้าข้อมูลไม่ถูกต้อง ให้กด **ยกเลิก**
  - ถ้าข้อมูลถูกต้อง ให้กด **ยืนยันส่งใบงาน**
- ระบบสร้างใบงานและจัดเข้าคิว AGV จะเริ่มเคลื่อนที่ไปรับ FPC จาก Smart Storage โดยอัตโนมัติ

## 1.5 Operator ติดตามสถานะงานผ่านหน้าคิวงาน (Task Queue) บน Web UI *(เปลี่ยนจาก: แจ้ง FPC Operator ให้ปรับสถานะ)*

- ระบบแสดงสถานะงานเป็นภาษาไทย เช่น "กำลังเคลื่อนที่ไปต้นทาง", "กำลังหยิบ FPC", "กำลังเคลื่อนที่ไปปลายทาง"
- ==*** FPC Store Operator จะต้อง Approve + เปลี่ยนสถานะเป็น Production *** (ขั้นตอนนี้ยังคงเหมือนเดิม)== *(คำถาม: ยังไม่มั่นใจว่าควรเอาไว้ตรงไหนดี และใครจะเอาไปไว้ตรงไหนแทน?)*

## 1.6 Operator ยืนยันขั้นตอนความปลอดภัยผ่าน Web UI เมื่อ AGV ถึงเครื่อง Prober ปลายทาง *(เปลี่ยนจาก: สั่ง AGV ผ่าน Tablet แบบ Manual)*

- เมื่อ AGV ถึงเครื่อง Prober ปลายทาง สถานะเปลี่ยนเป็น `waiting_tray_open` หน้าจอ Web UI จะแสดงคำแนะนำให้ Operator เปิด Tray ที่เครื่อง Prober
- Operator ตรวจสอบสภาพแวดล้อมการทำงาน:
  - ตรวจสอบว่าต้องไม่มีสิ่งกีดขวางใด ๆ บนพื้น
  - จอเครื่องจักรถูกพับเก็บไว้ขนานกับตัวเครื่องจักรอย่างเรียบร้อย
  - ประตูหน้าเครื่องจักรถูกเปิด
  - ถาดเปล่า FPC ถูกดึงออกมารอจนสุดไว้อย่างเรียบร้อย
- กดปุ่ม **"ยืนยันเปิด Tray เรียบร้อยแล้ว"** บนหน้าจอ Web UI
- AGV จะเริ่มกระบวนการวาง FPC ลงเครื่อง Prober
- ระหว่างวาง FPC สถานะเปลี่ยนเป็น `waiting_cover_head_remove` หน้าจอจะแสดงคำแนะนำให้ Operator ถอดฝาครอบหัววัดออก จากนั้นกดปุ่มยืนยันจริงบนตัวรถ AGV (ขั้นตอนนี้เกิดขึ้นก่อนที่ AGV จะวาง FPC เสร็จสมบูรณ์)
- เมื่อยืนยันเสร็จ AGV จะวาง FPC เสร็จสมบูรณ์ และงานจะเปลี่ยนสถานะเป็น `Completed`


# 2. ติดตั้ง FPC

## 2.1 ถอด FPC ที่อยู่ในเครื่อง Prober และใส่ FPC ใบใหม่

### สำหรับเครื่อง Prober TSKUF3000

- Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober
- Operator เข้า Web UI เลือกโหมด **เปลี่ยน FPC (UNLOAD & LOAD)** *(เปลี่ยนจาก: Move AGV เข้าหน้าเครื่อง)*
- ค้นหาและเลือก FPC ใบใหม่จาก Smart Storage แล้วเลือกเครื่อง Prober ปลายทาง
- กด **ยืนยันส่งใบงาน** ระบบจะจัดคิวให้ AGV ทำงานตามลำดับ:
  1. AGV ไปหยิบ FPC ใบใหม่จาก Smart Storage
  2. AGV เคลื่อนที่ไปเครื่อง Prober ปลายทาง
  3. สถานะ `waiting_tray_open` → Operator กดยืนยันเปิด Tray บนหน้าจอ Web UI
  4. AGV หยิบ FPC ใบเก่าออก
  5. สถานะ `waiting_cover_head_install` → Operator ติดตั้งฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV
  6. AGV ติดตั้ง FPC ใบใหม่ลงเครื่อง Prober
  7. สถานะ `waiting_cover_head_remove` → Operator ถอดฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV
  8. AGV เคลื่อนที่กลับ Smart Storage พร้อม FPC ใบเก่า
- ทำการตรวจสอบสภาพ FPC และ C จากนั้นปิดฝา Cover Hard
- Operator ดัน Tray FPC เข้า Prober ไปให้สุด และปิดฝา Prober
- Operator กด Start Prober
- กดรีโมทล็อก FPC
- กด Continue 2 ครั้ง

## 2.2 ล็อก FPC เพื่อส่งคืน FPC ใบเก่า

### 2.2.1 สำหรับเครื่องที่เทสด้วยระบบ New World ล็อกผ่านเมนู MAMA ในระบบ MMS

- Operator Test Login เข้าระบบ MMS โดยใส่ User/Password ของตนเอง
- คลิ๊ก MES GUI
- คลิ๊ก Store Management
- คลิ๊ก Store Room
- คลิ๊ก Return Part
- ใส่ Part ID
- ลง Status ให้เลือกเป็น Wait for PM/Prv ทุกครั้ง
- ใส่เหตุผลการคืน FPC
  - กรณีคืนเนื่องจากเปลี่ยน Product ให้ลง Comment: `Return`
  - กรณีอาการ Down ทางช่างจะใส่ Comment เอง

### 2.2.2 สำหรับเครื่องที่เทสด้วยระบบ EWFM ล็อก FPC ผ่านระบบ OOI

- เข้า OOI จาก e-Logsheet
- เลือก From Tooling
- ใส่ยอดงานที่เทสได้ เช่น จำนวนแผ่น
- ใส่เหตุผลการคืน FPC
  - กรณีคืนเนื่องจากเปลี่ยน Product ให้ลง Comment: `Return`
  - กรณีอาการ Down ทางช่างจะใส่ Comment เอง

## 2.3 ส่งคืน FPC ที่ถอดออกจากเครื่องส่งคืนห้อง Store

*(ในโหมดเปลี่ยน FPC ของ Web UI ใหม่ AGV จะนำ FPC ใบเก่ากลับ Smart Storage โดยอัตโนมัติหลังติดตั้ง FPC ใบใหม่เสร็จ ไม่ต้องสร้างใบงานแยก)*


# 3. ถอด FPC (ถอดมาทำไมนะ) 

## 3.1 สำหรับ PS1600

- Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober
- Operator เข้า Web UI เลือกโหมด **LOAD (คืน FPC)** เลือกเครื่อง Prober ต้นทางที่ต้องการถอด FPC *(เปลี่ยนจาก: หยิบ Tablet สั่ง AGV มาหน้าเครื่อง)*
- กด **ยืนยันส่งใบงาน** ระบบจัดคิวให้ AGV เคลื่อนที่มาหน้าเครื่อง Prober โดยอัตโนมัติ *(เปลี่ยนจาก: ตั้งคำสั่ง Move AGV เข้าหน้าเครื่อง)*
- เมื่อ AGV ถึงเครื่อง Prober สถานะ `waiting_tray_open` → Operator กดยืนยันเปิด Tray บนหน้าจอ Web UI *(เปลี่ยนจาก: AGV Load ใบเก่าออกมา)*
- AGV ทำการหยิบ FPC ขึ้นรถ
  - ทำการตรวจสอบ Pin และ C
  - ปิดฝา Cover Hard
- สถานะ `waiting_cover_head_install` → Operator ติดตั้งฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV *(เปลี่ยนจาก: ทำขั้นตอนคำสั่งตาม Step AGV)*
- AGV เคลื่อนที่ไป Smart Storage และเก็บ FPC โดยอัตโนมัติ *(เปลี่ยนจาก: กดคำสั่ง Move Out AGV ออกจากหน้าเครื่อง)*
- งานเปลี่ยนสถานะเป็น `Completed` บนหน้าจอ Web UI
- กรณี AGV ขัดข้อง (สถานะ `Error` หรือ `Failed` บน Web UI)
  - ให้ Handling โดยคน
  - ใช้รถเข็นในการเคลื่อนย้าย


# 4. ล็อก FPC ก่อนส่งคืนห้อง FPC Store

## 4.1 สำหรับเครื่องที่เทสด้วยระบบ New World ล็อกผ่านเมนู MAMA ในระบบ MMS

- Operator Test Login เข้าระบบ MMS โดยใส่ User/Password ของตนเอง
- คลิ๊ก MES GUI
- คลิ๊ก Store Management
- คลิ๊ก Store Room
- คลิ๊ก Return Part
- ใส่ Part ID
- ลง Status ให้เลือกเป็น `Wait for PM/Prv` ทุกครั้ง
- Note LM ใส่เหตุผลการคืน FPC
  - กรณีอาการ Down ให้ใส่เหตุผลอาการ Down
  - กรณีคืนเนื่องจากเปลี่ยน Product ให้ลง Comment: `Return`

## 4.2 สำหรับเครื่องที่เทสด้วยระบบ EWFM ล็อก FPC ผ่านระบบ OOI

- เข้า OOI จาก e-Logsheet
- เลือก From Tooling
- ใส่ยอดงานที่เทสได้ เช่น จำนวนแผ่น
- ใส่ Comment เหตุผลการคืน FPC ให้ลง Comment: `Return`


# 5. ส่งคืน FPC ที่ถอดออกจากเครื่องส่งคืนห้อง Store

## 5.1 สำหรับเครื่องที่ใช้ระบบ Web UI (แทน AGV Tablet) *(เปลี่ยนจาก: สำหรับเครื่องที่ใช้ AGV Robot)*

- Operator เข้า Web UI เลือกโหมด **LOAD (คืน FPC)** เลือกเครื่อง Prober ต้นทาง *(เปลี่ยนจาก: กดคำสั่งให้ Robot และเดินตาม Robot)*
- กด **ยืนยันส่งใบงาน** ระบบจัดคิวให้ AGV เคลื่อนที่ไปรับ FPC จากเครื่อง Prober
- เมื่อ AGV ถึงเครื่อง Prober สถานะ `waiting_tray_open` → Operator กดยืนยันเปิด Tray บนหน้าจอ Web UI *(เปลี่ยนจาก: กดคืน FPC ผ่าน Smart Storage)*
- AGV หยิบ FPC ขึ้นรถ
- สถานะ `waiting_cover_head_install` → Operator ติดตั้งฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV *(เปลี่ยนจาก: กดคำสั่งให้ AGV ขยับเข้า Smart Storage)*
- AGV เคลื่อนที่ไป Smart Storage และเก็บ FPC เข้าคลังอัตโนมัติ *(เปลี่ยนจาก: กดตรวจสอบยืนยัน FPC ผ่าน Smart Storage)*
- งานเปลี่ยนสถานะเป็น `Completed` บนหน้าจอ Web UI *(เปลี่ยนจาก: กดคำสั่งให้ AGV ไปแท่นชาร์จ + เก็บ Tablet)*
- กรณี AGV ขัดข้อง (สถานะ `Error` หรือ `Failed` บน Web UI)
  - ให้ใช้รถเข็นในการเคลื่อนย้าย FPC

## 5.2 สำหรับเครื่องที่ไม่ใช้ AGV Robot

- ส่งคืนโดยคนยกกล่อง FPC ไปคืน


# Note. ถอด FPC ที่อยู่ในเครื่อง Prober และนำไปใส่อีกเครื่อง

- Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober
- Operator เข้า Web UI เลือกโหมด **ย้าย FPC** *(เปลี่ยนจาก: สั่ง AGV ผ่าน Tablet)*
- เลือกเครื่อง Prober ต้นทาง และเครื่อง Prober ปลายทาง (ระบบจะป้องกันไม่ให้เลือกเครื่องเดียวกัน) *(เปลี่ยนจาก: Move AGV เข้าหน้าเครื่อง + Unload & Load)*
- ถ้าเครื่องปลายทางมี FPC อยู่แล้ว ระบบจะแจ้งเตือนและรองรับการสลับ FPC อัตโนมัติ (Swap-and-Move)
- กด **ยืนยันส่งใบงาน** ระบบจัดคิวให้ AGV ทำงาน
- เมื่อ AGV ถึงเครื่อง Prober ต้นทาง สถานะ `waiting_tray_open` → Operator กดยืนยันเปิด Tray ที่เครื่องต้นทางบนหน้าจอ Web UI *(เปลี่ยนจาก: ทำการตรวจสอบสภาพ FPC + ปิดฝา Cover Hard)*
- AGV หยิบ FPC จากเครื่องต้นทาง
- สถานะ `waiting_cover_head_install` → Operator ติดตั้งฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV *(เปลี่ยนจาก: ทำขั้นตอนคำสั่งตาม Step AGV)*
- AGV เคลื่อนที่ไปเครื่อง Prober ปลายทางโดยอัตโนมัติ *(เปลี่ยนจาก: กดคำสั่ง Move Out AGV)*
- เมื่อ AGV ถึงเครื่อง Prober ปลายทาง สถานะ `waiting_tray_open` → Operator กดยืนยันเปิด Tray ที่เครื่องปลายทางบนหน้าจอ Web UI
- ระหว่างวาง FPC สถานะ `waiting_cover_head_remove` → Operator ถอดฝาครอบหัววัดแล้วกดปุ่มยืนยันจริงบนตัว AGV
- AGV วาง FPC เสร็จสมบูรณ์
- Operator ดัน Tray FPC เข้า Prober ไปให้สุด และปิดฝา Prober
- งานเปลี่ยนสถานะเป็น `Completed` บนหน้าจอ Web UI *(เปลี่ยนจาก: สั่ง AGV ไปเครื่อง Tester ที่ต้องการ Setup)*
- Operator ทำขั้นตอนติดตั้ง FPC


[[workflow.drawio]]