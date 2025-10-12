# 🔍 DEBUG: Admin Access Not Working

## Vấn Đề
Đăng nhập tài khoản quản trị nhưng vẫn không vào được `/admin-panel`

## Các Nguyên Nhân Có Thể

### 1. ❌ Backend CHƯA trả về `role` trong user object
**Triệu chứng:**
- Login thành công
- Nhưng redirect về `/user-dashboard` thay vì `/admin-panel`
- Console log không thấy role

**Giải pháp:**
Backend phải update login API để trả về role:

```javascript
// Backend: controllers/authController.js
res.json({
  success: true,
  user: {
    _id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    role: user.role  // ← CẦN CÓ DÒNG NÀY
  },
  token: token
});
```

### 2. ❌ User trong database CHƯA có field `role`
**Triệu chứng:**
- Backend có code return role
- Nhưng user object vẫn không có role
- Hoặc role = undefined

**Giải pháp:**
Update user trong MongoDB:

```javascript
// Option 1: Update một user cụ thể
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);

// Option 2: Update tất cả users (set default = customer)
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: "customer" } }
);
```

### 3. ❌ User Model CHƯA có field definition
**Triệu chứng:**
- Mongoose không save role field
- Validation errors

**Giải pháp:**
Update User model schema:

```javascript
// Backend: models/User.js hoặc UserProfile.js
const userSchema = new Schema({
  // ... existing fields
  role: {
    type: String,
    enum: ['customer', 'staff', 'manager', 'admin'],
    default: 'customer',
    required: true
  }
});
```

## 🛠️ Cách Debug

### Bước 1: Kiểm Tra Console Log
Sau khi login, check browser console:

```
🔍 Login Debug: {
  user: { 
    _id: "...",
    email: "...",
    role: "admin" ← CẦN CÓ DÒNG NÀY
  },
  userRole: "admin",
  isAdminUser: true,
  redirectPath: "/admin-panel"
}
```

**Nếu không thấy role hoặc role = undefined:**
→ Backend chưa trả về role

**Nếu role = "customer":**
→ User này không phải admin, cần update trong database

### Bước 2: Vào Debug Page
Truy cập: http://localhost:3000/debug-auth

Trang này sẽ hiển thị:
- User object trong localStorage
- Token
- Role check
- Có thể set test admin

### Bước 3: Kiểm Tra localStorage
Mở browser console và chạy:

```javascript
// Check user object
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Role:', user.role);

// Check if admin
const isAdmin = ['staff', 'manager', 'admin'].includes(user.role);
console.log('Is Admin:', isAdmin);
```

### Bước 4: Test với Admin Giả
Trong debug page, click "Set Test Admin" để test với admin giả:
- Nếu vào được admin panel → Frontend OK, backend cần fix
- Nếu vẫn không vào được → Frontend có vấn đề

## ✅ Giải Pháp Nhanh (Test)

### Tạm thời set admin trong browser (chỉ để test):

```javascript
// Open browser console
const testUser = {
  _id: 'test123',
  email: 'admin@test.com',
  username: 'Admin Test',
  role: 'admin'
};
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('token', 'test-token');
// Reload page
window.location.reload();
```

Sau đó thử vào `/admin-panel`
- Nếu VÀO ĐƯỢC → Frontend OK, backend cần update
- Nếu VẪN KHÔNG → Check AdminRoute component

## 🔧 Backend Fix Steps

### 1. Update User Model
```javascript
// server/src/models/User.js
role: {
  type: String,
  enum: ['customer', 'staff', 'manager', 'admin'],
  default: 'customer',
  required: true
}
```

### 2. Update Login Controller
```javascript
// server/src/controllers/authController.js
res.json({
  user: {
    ...user._doc,
    role: user.role // Ensure role is included
  },
  token
});
```

### 3. Update Existing Users
```javascript
// Run in MongoDB shell or create migration script
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: 'customer' } }
);

// Set specific user as admin
db.users.updateOne(
  { email: 'your-admin-email@example.com' },
  { $set: { role: 'admin' } }
);
```

### 4. Test Backend API
```bash
# Test login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"yourpassword"}'

# Check response includes role
# Expected:
# {
#   "user": {
#     "_id": "...",
#     "email": "...",
#     "role": "admin"  ← MUST HAVE THIS
#   },
#   "token": "..."
# }
```

## 🎯 Expected Behavior

### Customer Login:
```
Login → Toast: "Đăng nhập thành công" → Redirect to /user-dashboard
```

### Admin Login (staff/manager/admin):
```
Login → Toast: "Chào mừng đến trang quản trị!" → Redirect to /admin-panel
```

### Customer tries /admin-panel:
```
Type /admin-panel in URL → Redirect to / (homepage)
Console: "❌ AdminRoute: Unauthorized role, redirecting to home"
```

### Staff tries /admin-panel:
```
Type /admin-panel in URL → Show admin panel
Console: "✅ AdminRoute: Access granted"
Tabs: Tổng quan, Đơn hàng, Sản phẩm
```

## 📝 Checklist

- [ ] Backend User model có field `role`
- [ ] Login API trả về `role` trong user object
- [ ] User trong database có role được set
- [ ] Browser console log ra role khi login
- [ ] LocalStorage user object có field `role`
- [ ] Role value là một trong: customer, staff, manager, admin
- [ ] Admin users redirect đến /admin-panel
- [ ] Customer users redirect đến /user-dashboard
- [ ] Customer không thể truy cập /admin-panel

## 🆘 Still Not Working?

1. **Clear ALL browser data:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   // Then reload and login again
   ```

2. **Check Network tab:**
   - Inspect login API response
   - Verify response has `user.role`

3. **Restart backend server:**
   ```bash
   # Stop server
   # Then start again
   npm start
   ```

4. **Check backend logs:**
   - Does login controller have role in response?
   - Any errors when fetching user from database?

5. **Try debug page:**
   - Go to `/debug-auth`
   - Check all information
   - Try "Set Test Admin"

## 📞 Need Help?

Gửi thông tin sau:
1. Screenshot của `/debug-auth` page
2. Browser console logs sau khi login
3. Network tab response của login API
4. User object từ MongoDB
