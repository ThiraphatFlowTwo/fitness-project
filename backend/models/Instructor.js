const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({
  // 🔗 เชื่อมโยงหลักไปยังบัญชีผู้ใช้ (User Model) ซึ่งใช้ระบุ Role, Status และการเป็นที่ปรึกษา
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // ข้อมูลส่วนตัวของอาจารย์ผู้ดูแลหลักสูตร
  name: {
    type: String,
    required: true,
    maxlength: 70
  },
  
  email: {
    type: String,
    required: true,
    maxlength: 70
  }
})

module.exports = mongoose.model('Instructor', instructorSchema)