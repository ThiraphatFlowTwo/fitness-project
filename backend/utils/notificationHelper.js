const Notification = require("../models/Notification");
 
/**
 * สร้าง notification ใหม่
 * @param {Object} opts
 * @param {string} opts.recipient_id   - user _id ของผู้รับ
 * @param {string} opts.recipient_role - role ของผู้รับ
 * @param {string} opts.type           - ประเภท notification
 * @param {string} opts.title          - หัวข้อ
 * @param {string} opts.message        - ข้อความ
 * @param {string} [opts.ref_id]       - id อ้างอิง (program/log/user)
 * @param {string} [opts.ref_model]    - model อ้างอิง
 */
async function createNotification(opts) {
  try {
    await Notification.create(opts);
  } catch (err) {
    console.error("createNotification error:", err.message);
  }
}
 
module.exports = { createNotification };