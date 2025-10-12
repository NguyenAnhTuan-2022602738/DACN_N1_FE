# ✅ ADMIN ACCESS CHECKLIST

## 🚨 VẤN ĐỀ: Đăng nhập admin nhưng không vào được /admin-panel

---

## 📋 CHECKLIST - Làm Từng Bước

### [ ] Bước 1: Vào Debug Page (30 giây)
```
URL: http://localhost:3000/debug-auth
```

**Kiểm tra:**
- [ ] User object có hiển thị?
- [ ] Có field "role" không?
- [ ] Role value là gì? (customer/staff/manager/admin)

**Nếu KHÔNG có role → Làm Bước 2**  
**Nếu CÓ role = customer → Làm Bước 3**  
**Nếu CÓ role = admin/staff/manager → Làm Bước 5**

---

### [ ] Bước 2: Update Backend (5 phút)

#### 2.1. Update User Model
```javascript
// File: server/src/models/User.js hoặc UserProfile.js
// Thêm vào schema:

role: {
  type: String,
  enum: ['customer', 'staff', 'manager', 'admin'],
  default: 'customer',
  required: true
}
```

#### 2.2. Update Login Controller
```javascript
// File: server/src/controllers/authController.js
// Trong function login, ensure response includes role:

res.json({
  success: true,
  user: {
    _id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    role: user.role  // ← THÊM DÒNG NÀY
  },
  token: token
});
```

#### 2.3. Restart Backend
```bash
# Ctrl+C to stop
npm start
```

---

### [ ] Bước 3: Update Database (2 phút)

**Option A: MongoDB Compass (GUI)**
1. Mở MongoDB Compass
2. Connect to database
3. Vào collection `users`
4. Tìm user của bạn (by email)
5. Click "Edit Document"
6. Thêm/sửa field: `role: "admin"`
7. Click "Update"

**Option B: MongoDB Shell**
```javascript
// Set user cụ thể làm admin
db.users.updateOne(
  { email: "YOUR_EMAIL@example.com" },
  { $set: { role: "admin" } }
);

// Set tất cả users khác làm customer (nếu chưa có role)
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: "customer" } }
);
```

**Option C: Run Migration Script**
```bash
cd server
node scripts/add-user-roles.js
# (File script đã cung cấp trong backend-scripts/)
```

---

### [ ] Bước 4: Clear Browser & Test (1 phút)

```javascript
// Mở Browser Console (F12)
// Copy paste và Enter:

localStorage.clear();
sessionStorage.clear();
console.log('✅ Cleared!');
// Reload page hoặc:
window.location.href = '/login';
```

---

### [ ] Bước 5: Login & Verify (1 phút)

1. **Login** với account đã set role = admin

2. **Kiểm tra Console** - Phải thấy:
```
🔍 Login Debug: {
  userRole: "admin",
  isAdminUser: true,
  redirectPath: "/admin-panel"
}
```

3. **Tự động redirect** sang `/admin-panel`

4. **Vào Debug Page** lần nữa để verify:
```
http://localhost:3000/debug-auth
```

5. **Check Admin Panel:**
   - [ ] Thấy tabs: Tổng quan, Đơn hàng, Sản phẩm, Phân tích, Người dùng, Cài đặt
   - [ ] Thấy role trong header: "Admin Test (Quản trị viên)"
   - [ ] Tất cả buttons hoạt động

---

## 🧪 Test Cases

### ✅ Test 1: Admin Login
```
Input: Login với role = admin
Expected: Redirect to /admin-panel
Console: "redirectPath: /admin-panel"
```

### ✅ Test 2: Customer Login  
```
Input: Login với role = customer
Expected: Redirect to /user-dashboard
Console: "redirectPath: /user-dashboard"
```

### ✅ Test 3: Direct Access
```
Input: Customer tries to access /admin-panel
Expected: Redirect to / (homepage)
Console: "❌ AdminRoute: Unauthorized role"
```

### ✅ Test 4: Admin Tabs
```
Input: Admin views admin panel
Expected: See all 6 tabs
Staff: See only 3 tabs
Manager: See 4 tabs
```

---

## 🎯 Success Criteria

- [x] Backend model có field `role`
- [x] Login API trả về `role`
- [x] Database users có role
- [ ] **← YOUR TURN** Backend restarted
- [ ] **← YOUR TURN** Browser cache cleared
- [ ] **← YOUR TURN** User có role = admin trong database
- [ ] **← YOUR TURN** Login thấy console log với role
- [ ] **← YOUR TURN** Tự động redirect đến /admin-panel
- [ ] **← YOUR TURN** Admin panel hiển thị đầy đủ tabs
- [ ] **← YOUR TURN** Customer không vào được admin panel

---

## 🆘 Vẫn Không Work?

### Debug với Test Admin (1 phút)
```
1. Vào /debug-auth
2. Click "Set Test Admin" 
3. Click "Try Admin Panel"
4. Nếu VÀO ĐƯỢC:
   → Frontend OK, backend chưa return role đúng
   → Quay lại Bước 2
5. Nếu KHÔNG VÀO ĐƯỢC:
   → Frontend có bug (rất hiếm)
   → Check console errors
```

### Check Network Tab
```
1. F12 → Network tab
2. Login
3. Click login request
4. Check Response:
   {
     "user": {
       "role": "admin"  ← PHẢI CÓ
     }
   }
```

### Restart Everything
```bash
# Backend
Ctrl+C
npm start

# Frontend  
Ctrl+C
npm start

# Browser
Ctrl+Shift+R (hard refresh)
```

---

## 📞 Need More Help?

**Gửi screenshot của:**
1. `/debug-auth` page
2. Browser console sau khi login
3. Network tab - login API response
4. MongoDB - user document

**Files to review:**
- `QUICK_FIX.md` - Fix trong 5 phút
- `DEBUG_ADMIN_ACCESS.md` - Chi tiết troubleshooting
- `DEBUG_TOOLS_ADDED.md` - Giải thích debug tools

---

## 🎉 DONE!

Khi tất cả checkboxes ✅:
- Login admin → Auto vào admin panel
- Login customer → Auto vào user dashboard  
- Customer không thể truy cập admin routes
- Admin panel hiển thị đúng tabs theo role

**Estimated Time:** 10-15 phút total
