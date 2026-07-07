1. เบิก FPC เพื่อนำมาใช้ในการเทส

   1.1 สำหรับงานที่ใช้ระบบ New World

      1.1.1 เช็ค FPC ในระบบ MAMA

         1.1.1.1 Log-in เข้าระบบ Store ผ่านระบบ MMS (MAMA)

            - Operator Test Login เข้าระบบ MMS โดยใส่ User/Password ของตนเอง
            - คลิ๊ก MES GUI
            - คลิ๊ก Store Management
            - พิมพ์ชื่อ FPC ที่ต้องการเบิกโดยไม่ต้องใส่ PW

         1.1.1.2 จอง FPC ในระบบ MMS (MAMA)

            - คลิ๊ก Reservation
            - คลิ๊กที่ Probe card family
            - ติ๊กหน้า FPC ที่ต้องการจอง
            - คลิ๊ก Add to Cart

         1.1.1.3 การใส่ข้อมูลใน Cart ในระบบ MMS (MAMA)

            - ติ๊กหน้า FPC ที่ต้องการจอง
            - คลิ๊กที่ Checkout
            - เลือกวันเวลาที่ต้องการเบิก **ห้ามเป็นเวลาก่อน Submit**
            - เลือกวันเวลาที่ต้องการคืน
            - กด Submit *** FPC Store Operator จะต้อง Approve + เปลี่ยนสถานะเป็น Production ***

   1.2 สำหรับงานที่ใช้ระบบ EWFM

      - เช็ค FPC ว่ามีพร้อมเบิกไหม โดยเข้า Web Store System WT ผ่านหน้าเว็บของระบบ ACS
      - กดเข้าเมนู Borrow Hardware
      - กดเข้าเมนู Borrow Production
      - ใส่ชื่อ FPC ในช่อง FPC GROUP NAME เช่น `2ID004FV`
      - กด SUBMIT

   1.3 ==Operator เดินไปหยิบ Tablet ที่ตู้ชาร์จ เพื่อตั้งคำสั่ง AGV Robot ไปรับ FPC ที่หน้าห้อง Store (600-0272)==

   1.4 ==Operator กด UNLOAD Probe Card ออกจาก Smart Cabinet (600-0255)==

      - ==กดคำว่า UNLOAD ในหน้าจอหลัก หน้าจอจะแสดงชื่อ Probe Card ทั้งหมดที่มีใน Smart Cabinet==

      - ==Operator เลือก Probe Card ที่ต้องการนำออกมา ปุ่ม “เลือกกล่องที่จะนำออก” จะเปลี่ยนจากสีขาวเป็นสีเขียว จากนั้นกดปุ่ม “เลือกกล่องที่จะนำออก”==

      - ==Operator ตรวจสอบข้อมูล Probe Card==

         - ==ถ้าข้อมูลไม่ถูกต้อง ให้กด CANCEL==
         - ==ถ้าข้อมูลถูกต้อง ให้กด “กรุณาตรวจสอบความถูกต้องและกดปุ่มเมื่อพร้อมการทำงาน”==

      - ==จากนั้น Robot จะเริ่มทำงาน เพื่อนำ Probe Card ออกมาวางยังตำแหน่งที่ถูกกำหนดไว้==

   1.5 ==Operator Test แจ้ง FPC Operator ให้ปรับสถานะของ Probe Card==

      - ==สำหรับ Web ใหม่ *** FPC Store Operator จะต้อง Approve + เปลี่ยนสถานะเป็น Production ***==

   1.6 ==Operator สั่ง AGV Robot ให้เคลื่อนย้ายมายังตำแหน่งพร้อมทำงานหน้าห้อง Store (600-0272)==

      - ==เลือกภารกิจ “Assign AGV operate!” (2) เพื่อให้หุ่นยนต์เคลื่อนที่มาตำแหน่งที่พร้อมทำงาน==

      - ==เลือกภารกิจ “คำสั่งรับ FPC ที่ Store” (3) เพื่อให้หุ่นยนต์หยิบ FPC หลังจากหยิบเสร็จ หุ่นยนต์จะเคลื่อนที่ออกจากตำแหน่งพร้อมทำงาน==

      - ==เลือก “FPC Page 2” จากนั้นเลือกเครื่อง Prober ที่ต้องการให้หุ่นยนต์ทำงาน==

      - ==หุ่นยนต์จะเคลื่อนที่ไปตำแหน่งหน้า Prober==

      - ==หลังจากหุ่นยนต์เคลื่อนไปที่ตำแหน่งหน้าเครื่อง Prober ที่ต้องการ หน้าจอ Tablet จะมีหน้าต่างรับ Input การสั่งงาน ให้ทำการตรวจสอบสภาพแวดล้อมการทำงาน==

         - ==ตรวจสอบว่าต้องไม่มีสิ่งกีดขวางใด ๆ บนพื้น==
         - ==จอเครื่องจักรถูกพับเก็บไว้ขนานกับตัวเครื่องจักรอย่างเรียบร้อย==
         - ==ประตูหน้าเครื่องจักรถูกเปิด==
         - ==ถาดเปล่า FPC ถูกดึงออกมารอจนสุดไว่างเรียบร้อย==


2. ติดตั้ง FPC

   2.1 ถอด FPC ที่อยู่ในเครื่อง Prober และใส่ FPC ใบใหม่

      สำหรับเครื่อง Prober TSKUF3000

      - Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober

      - ==Move AGV เข้าหน้าเครื่อง และกดคำสั่ง Unload & Load ที่ AGV เพื่อให้ AGV Load ใบเก่าออกมา==

      - ทำการตรวจสอบสภาพ FPC และ C จากนั้นปิดฝา Cover Hard และ==ทำขั้นตอนคำสั่งตาม Step AGV ต่อ เพื่อวาง FPC พักไว้ที่ AGV==

      - คำสั่งถัดไป AGV จะ Load ใบใหม่เข้า Prober

         - ==AGV หยุดให้เปิดฝา Cover Hard==
         - ==ทำการตรวจสอบ Pin และ C==
         - ==กดปุ่ม Start ที่ AGV เพื่อนำ FPC เข้าไปใน Prober==
         - ==AGV นำใบเก่าวางแทนใบใหม่ในแนวนอน==

      - ==Operator กดคำสั่ง Move Out AGV ออกจากหน้าเครื่อง==

      - Operator ดัน Tray FPC เข้า Prober ไปให้สุด และปิดฝา Prober

      - Operator กด Start Prober

      - กดรีโมทล็อก FPC

      - กด Continue 2 ครั้ง

   2.2 ล็อก FPC เพื่อส่งคืน FPC ใบเก่า

      2.2.1 สำหรับเครื่องที่เทสด้วยระบบ New World ล็อกผ่านเมนู MAMA ในระบบ MMS

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

     2.2.2 สำหรับเครื่องที่เทสด้วยระบบ EWFM ล็อก FPC ผ่านระบบ OOI

      - เข้า OOI จาก e-Logsheet

      - เลือก From Tooling

      - ใส่ยอดงานที่เทสได้ เช่น จำนวนแผ่น

      - ใส่เหตุผลการคืน FPC

        - กรณีคืนเนื่องจากเปลี่ยน Product ให้ลง Comment: `Return`

        - กรณีอาการ Down ทางช่างจะใส่ Comment เอง

   2.3 ส่งคืน FPC ที่ถอดออกจากเครื่องส่งคืนห้อง Store

      2.3.1 ส่งคืนด้วย AGV Robot

      - ==Operator กดคำสั่งให้ Robot และเดินตาม Robot ไปที่หน้าห้อง Store==

      - ==Operator กดคืน FPC ผ่าน Smart Storage จากนั้น Smart Storage Load FPC Jig เปล่าออกมา==

      - ==Operator กดคำสั่งให้ AGV ขยับเข้ามาที่หน้า Smart Storage และกดคำสั่งคืน FPC==

      - Operator กดคำสั่งเพื่อตรวจสอบยืนยัน FPC ผ่าน Smart Storage จากนั้น FPC ถูก Load เข้า Smart Storage

      - Operator กดคำสั่งให้ AGV ไปแท่นชาร์จ

      - Operator เก็บ Tablet เข้าตู้ชาร์จ

      2.3.2 ส่งคืนด้วยรถเข็น

      2.3.3 ส่งคืนโดยคนยกกล่อง FPC ไปคืน


3. ถอด FPC

   3.1 สำหรับ PS1600

      - Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober
      - ==Operator ไปหยิบ Tablet และตั้งคำสั่งให้ AGV Robot มาที่หน้าเครื่อง==
      - ==ตั้งคำสั่ง Move AGV เข้าหน้าเครื่อง และกดคำสั่ง Unload==
      - ==AGV Load ใบเก่าออกมา==
         - ==ทำการตรวจสอบ Pin และ C==
         - ==ปิดฝา Cover Hard==
         - ==ทำขั้นตอนคำสั่งตาม Step AGV ต่อ==
         - ==วาง FPC พักไว้ที่ AGV==
      - ==Operator กดคำสั่ง Move Out AGV ออกจากหน้าเครื่อง==
      - กรณี AGV Robot Down
         - ให้ Handling โดยคน
         - ใช้รถเข็นในการเคลื่อนย้าย


4. ล็อก FPC ก่อนส่งคืนห้อง FPC Store

   4.1 สำหรับเครื่องที่เทสด้วยระบบ New World ล็อกผ่านเมนู MAMA ในระบบ MMS

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

   4.2 สำหรับเครื่องที่เทสด้วยระบบ EWFM ล็อก FPC ผ่านระบบ OOI

      - เข้า OOI จาก e-Logsheet
      - เลือก From Tooling
      - ใส่ยอดงานที่เทสได้ เช่น จำนวนแผ่น
      - ใส่ Comment เหตุผลการคืน FPC ให้ลง Comment: `Return`


5. ส่งคืน FPC ที่ถอดออกจากเครื่องส่งคืนห้อง Store

   5.1 สำหรับเครื่องที่ใช้ AGV Robot

      - ==Operator กดคำสั่งให้ Robot และเดินตาม Robot ไปที่หน้าห้อง Store==
      - ==Operator กดคืน FPC ผ่าน Smart Storage จากนั้น Smart Storage Load FPC Jig เปล่าออกมา==
      - ==Operator กดคำสั่งให้ AGV มาที่หน้า Smart Storage และกดคำสั่งคืน FPC==
      - ==Operator กดคำสั่งเพื่อตรวจสอบยืนยัน FPC ผ่าน Smart Storage จากนั้น FPC ถูก Load เข้า Smart Storage==
      - ==Operator กดคำสั่งให้ AGV ไปแท่นชาร์จ==
      - ==Operator เก็บ Tablet เข้าตู้ชาร์จ==
      - กรณี AGV Robot Down
         - ให้ใช้รถเข็นในการเคลื่อนย้าย FPC

   5.2 สำหรับเครื่องที่ไม่ใช้ AGV Robot

      - ส่งคืนโดยคนยกกล่อง FPC ไปคืน


Note. ถอด FPC ที่อยู่ในเครื่อง Prober และนำไปใส่อีกเครื่อง

   - ==Operator กด Card Change เพื่อต้องการ Move FPC ออกจากเครื่อง และเปิดฝา Prober==
   - ==Move AGV เข้าหน้าเครื่อง และกดคำสั่ง Unload & Load ที่ AGV เพื่อให้ AGV Load FPC ออกมา==
   - ==ทำการตรวจสอบสภาพ FPC และ C==
   - ==ปิดฝา Cover Hard==
   - ==ทำขั้นตอนคำสั่งตาม Step AGV==
   - ==Operator กดคำสั่ง Move Out AGV ออกจากหน้าเครื่อง==
   - Operator ดัน Tray FPC เข้า Prober ไปให้สุด และปิดฝา Prober
   - ==Operator สั่ง AGV Robot ให้เคลื่อนย้ายมายังตำแหน่งเครื่อง Tester ที่ต้องการไป Setup==
   - Operator ทำขั้นตอนติดตั้ง FPC