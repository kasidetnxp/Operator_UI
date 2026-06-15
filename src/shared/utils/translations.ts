// ─────────────────────────────────────────────
// Translations utility — EN + Thai (TH)
// Migrated from mockup: "Operator Workflow Management System"
// ─────────────────────────────────────────────

// Single source of truth — Language type lives in @/shared/types
export type { Language } from '@/shared/types';

export const translations = {
  en: {
    appTitle: 'FPC Management System',
    employeeId: 'Employee ID',
    logout: 'Logout',
    login: 'Login',
    enterEmployeeId: 'Enter Employee ID',
    employeeIdRequired: 'Employee ID is required',
    viewQueue: 'View Queue',
    taskQueuePage: 'Task Queue',

    // Mode Selection
    selectMode: 'Select Operation Mode',
    returnFPC: 'LOAD (คืน FPC)',
    requestFPC: 'UNLOAD (เบิก FPC)',
    swapFPC: 'Swap FPC',
    returnFPCDesc: 'Pick up FPC from machine and return to Smart Storage',
    requestFPCDesc: 'Request FPC from Smart Storage and deliver to machine',
    swapFPCDesc: 'Transfer FPC directly from source machine to destination machine',

    // Machine Selection
    selectMachine: 'Select Machine',
    selectSourceMachine: 'Select Source Machine',
    selectDestinationMachine: 'Select Destination Machine',
    available: 'Available',
    unavailable: 'Unavailable',
    machineStatus: 'Machine Status',
    searchMachine: 'Search Machine',
    searchMachinePlaceholder: 'Enter machine name or ID...',

    // FPC Search
    searchFPC: 'Search FPC',
    searchPlaceholder: 'Enter FPC ID or details...',
    search: 'Search',
    noResults: 'No FPC found matching your search',
    searchResults: 'Search Results',
    selectFPC: 'Select FPC',
    fpcId: 'FPC ID',
    fpcType: 'Type',
    location: 'Location',

    // Status
    status: 'Status',
    queued: 'Queued',
    inProgress: 'In Progress',
    arrived: 'Arrived',
    waitingConfirmation: 'Waiting for Confirmation',
    complete: 'Complete',
    error: 'Error',
    submitted: 'Submitted',
    starting: 'Starting',
    movingToSource: 'Moving to Source',
    arrivedAtSource: 'Arrived at Source',
    pickingUpFPC: 'Picking Up FPC',
    waitingCoverHeadInstall: 'Waiting for Cover Head Installation Confirmation',
    movingToDestination: 'Moving to Destination',
    arrivedAtDestination: 'Arrived at Destination',
    placingFPC: 'Placing FPC',
    waitingCoverHeadRemove: 'Waiting for Cover Head Removal Confirmation',
    completed: 'Completed',
    rejected: 'Rejected',
    blocked: 'Blocked',
    failedStatus: 'Failed',
    canceled: 'Canceled',

    // Actions
    confirm: 'Confirm',
    confirmCoverHeadInstalled: 'Confirm Cover Head Installed',
    confirmCoverHeadRemoved: 'Confirm Cover Head Removed',
    coverHeadInstallationConfirm: 'Please press the physical button on the AGV to confirm that the Cover Head has been installed.',
    coverHeadRemovalConfirm: 'Please press the physical button on the AGV to confirm that the Cover Head has been removed.',
    submit: 'Submit',
    cancel: 'Cancel',
    back: 'Back',
    retry: 'Retry',
    newJob: 'New Job',
    new: 'New',

    // Messages
    jobSubmitted: 'Job submitted successfully',
    jobQueued: 'Job has been queued',
    confirmationSent: 'Confirmation sent to backend',
    pleaseWait: 'Please wait...',
    processing: 'Processing...',

    // Errors
    error_title: 'Error',
    error_network: 'Network error. Please check your connection.',
    error_timeout: 'Request timed out. Please try again.',
    error_server: 'Server error. Please contact support.',
    error_validation: 'Validation error. Please check your input.',
    selectMachineFirst: 'Please select a machine first',
    selectFPCFirst: 'Please select an FPC first',

    // Workflow
    currentTask: 'Current Task',
    taskDetails: 'Task Details',
    source: 'Source',
    destination: 'Destination',
    smartStorage: 'Smart Storage',
    jobId: 'Job ID',
    taskQueue: 'Task Queue',
    myTask: 'My Task',
    submittedBy: 'Submitted By',
    createdAt: 'Created At',
    type: 'Type',
    noTasksInQueue: 'No Task',

    // Confirmation
    confirmSubmit: 'Confirm Submission',
    confirmSubmitMessage: 'Are you sure you want to submit this job?',
    yes: 'Yes',
    no: 'No',
  },
  th: {
    appTitle: 'ระบบจัดการ FPC',
    employeeId: 'รหัสพนักงาน',
    logout: 'ออกจากระบบ',
    login: 'เข้าสู่ระบบ',
    enterEmployeeId: 'กรอกรหัสพนักงาน',
    employeeIdRequired: 'กรุณากรอกรหัสพนักงาน',
    viewQueue: 'ดูคิว',
    taskQueuePage: 'คิวงาน',

    // Mode Selection
    selectMode: 'เลือกโหมดการทำงาน',
    returnFPC: 'LOAD (คืน FPC)',
    requestFPC: 'UNLOAD (เบิก FPC)',
    swapFPC: 'สลับ FPC',
    returnFPCDesc: 'รับ FPC จากเครื่องจักรและส่งคืนไปที่คลังสมาร์ท',
    requestFPCDesc: 'ขอ FPC จากคลังสมาร์ทและส่งไปยังเครื่องจักร',
    swapFPCDesc: 'โอนย้าย FPC ระหว่างเครื่องจักรโดยตรง',

    // Machine Selection
    selectMachine: 'เลือกเครื่องจักร',
    selectSourceMachine: 'เลือกเครื่องต้นทาง',
    selectDestinationMachine: 'เลือกเครื่องปลายทาง',
    available: 'พร้อมใช้งาน',
    unavailable: 'ไม่พร้อมใช้งาน',
    machineStatus: 'สถานะเครื่องจักร',
    searchMachine: 'ค้นหาเครื่องจักร',
    searchMachinePlaceholder: 'กรอกชื่อหรือรหัสเครื่องจักร...',

    // FPC Search
    searchFPC: 'ค้นหา FPC',
    searchPlaceholder: 'กรอกรหัส FPC หรือรายละเอียด...',
    search: 'ค้นหา',
    noResults: 'ไม่พบ FPC ที่ตรงกับการค้นหา',
    searchResults: 'ผลการค้นหา',
    selectFPC: 'เลือก FPC',
    fpcId: 'รหัส FPC',
    fpcType: 'ประเภท',
    location: 'ตำแหน่ง',

    // Status
    status: 'สถานะ',
    queued: 'อยู่ในคิว',
    inProgress: 'กำลังดำเนินการ',
    arrived: 'มาถึงแล้ว',
    waitingConfirmation: 'รอการยืนยัน',
    complete: 'เสร็จสมบูรณ์',
    error: 'เกิดข้อผิดพลาด',
    submitted: 'ส่งคำขอแล้ว',
    starting: 'กำลังเริ่มต้น',
    movingToSource: 'กำลังไปต้นทาง',
    arrivedAtSource: 'ถึงต้นทางแล้ว',
    pickingUpFPC: 'กำลังหยิบ FPC',
    waitingCoverHeadInstall: 'รอการยืนยันติดตั้ง Cover Head',
    movingToDestination: 'กำลังไปปลายทาง',
    arrivedAtDestination: 'ถึงปลายทางแล้ว',
    placingFPC: 'กำลังวาง FPC',
    waitingCoverHeadRemove: 'รอการยืนยันถอด Cover Head',
    completed: 'เสร็จสมบูรณ์',
    rejected: 'ปฏิเสธการทำงาน',
    blocked: 'ถูกบล็อก',
    failedStatus: 'ล้มเหลว',
    canceled: 'ยกเลิกแล้ว',

    // Actions
    confirm: 'ยืนยัน',
    confirmCoverHeadInstalled: 'ยืนยันติดตั้ง Cover Head แล้ว',
    confirmCoverHeadRemoved: 'ยืนยันถอด Cover Head แล้ว',
    coverHeadInstallationConfirm: 'กรุณากดปุ่มที่เครื่อง AGV เพื่อยืนยันว่าติดตั้ง Cover Head แล้ว',
    coverHeadRemovalConfirm: 'กรุณากดปุ่มที่เครื่อง AGV เพื่อยืนยันว่าถอด Cover Head แล้ว',
    submit: 'ส่ง',
    cancel: 'ยกเลิก',
    back: 'ย้อนกลับ',
    retry: 'ลองใหม่',
    newJob: 'งานใหม่',
    new: 'ใหม่',

    // Messages
    jobSubmitted: 'ส่งงานสำเร็จแล้ว',
    jobQueued: 'งานถูกเพิ่มในคิวแล้ว',
    confirmationSent: 'ส่งการยืนยันไปยังเซิร์ฟเวอร์แล้ว',
    pleaseWait: 'กรุณารอสักครู่...',
    processing: 'กำลังประมวลผล...',

    // Errors
    error_title: 'ข้อผิดพลาด',
    error_network: 'ข้อผิดพลาดเครือข่าย กรุณาตรวจสอบการเชื่อมต่อ',
    error_timeout: 'หมดเวลาคำขอ กรุณาลองใหม่อีกครั้ง',
    error_server: 'ข้อผิดพลาดเซิร์ฟเวอร์ กรุณาติดต่อฝ่ายสนับสนุน',
    error_validation: 'ข้อผิดพลาดการตรวจสอบ กรุณาตรวจสอบข้อมูลของคุณ',
    selectMachineFirst: 'กรุณาเลือกเครื่องจักรก่อน',
    selectFPCFirst: 'กรุณาเลือก FPC ก่อน',

    // Workflow
    currentTask: 'งานปัจจุบัน',
    taskDetails: 'รายละเอียดงาน',
    source: 'ต้นทาง',
    destination: 'ปลายทาง',
    smartStorage: 'คลังสมาร์ท',
    jobId: 'รหัสงาน',
    taskQueue: 'คิวงาน',
    myTask: 'งานของฉัน',
    submittedBy: 'ส่งโดย',
    createdAt: 'สร้างเมื่อ',
    type: 'ประเภท',
    noTasksInQueue: 'No Task',

    // Confirmation
    confirmSubmit: 'ยืนยันการส่ง',
    confirmSubmitMessage: 'คุณแน่ใจหรือไม่ว่าต้องการส่งงานนี้?',
    yes: 'ใช่',
    no: 'ไม่',
  },
};
