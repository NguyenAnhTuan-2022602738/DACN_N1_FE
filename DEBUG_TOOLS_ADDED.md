# 🔧 DEBUG TOOLS ADDED - Admin Access Troubleshooting

## ✅ Đã Thêm

### 1. Console Debug Logs
**Login.jsx:** Log đầy đủ thông tin khi login
```javascript
console.log('🔍 Login Debug:', {
  user,
  userRole,
  isAdminUser,
  redirectPath
});
```

**AdminRoute.jsx:** Log khi check quyền truy cập
```javascript
console.log('🛡️ AdminRoute Check:', { ... });
console.log('✅ AdminRoute: Access granted');
console.log('❌ AdminRoute: Unauthorized role');
```

### 2. Debug Page
**URL:** `http://localhost:3000/debug-auth`

**Tính năng:**
- ✅ Hiển thị user object từ localStorage
- ✅ Hiển thị token
- ✅ Phân tích role và permissions
- ✅ Check có thể vào admin panel không
- ✅ Button "Set Test Admin" để test
- ✅ Button "Clear Auth Data"
- ✅ Button "Try Admin Panel"
- ✅ Hướng dẫn fix nếu có vấn đề

### 3. Documentation
- ✅ `DEBUG_ADMIN_ACCESS.md` - Hướng dẫn debug chi tiết
- ✅ `QUICK_FIX.md` - Fix nhanh trong 5 phút
- ✅ `backend-scripts/add-user-roles.js` - Script update database

## 🎯 Cách Sử Dụng

### Bước 1: Login và Check Console
```bash
1. Đăng nhập
2. Mở browser Console (F12)
3. Xem log "🔍 Login Debug"
4. Check có role không
```

### Bước 2: Vào Debug Page
```
http://localhost:3000/debug-auth
```

Trang này sẽ cho biết:
- ❌ User KHÔNG có role → Backend cần fix
- ✅ User CÓ role = customer → Không phải admin
- ✅ User CÓ role = admin/staff/manager → Nên vào được

### Bước 3: Test với Admin Giả
```
1. Click "Set Test Admin" trong debug page
2. Thử vào /admin-panel
3. Nếu vào được → Frontend OK, backend cần fix
4. Nếu không vào được → Có bug frontend (không nên xảy ra)
```

### Bước 4: Fix Backend (Nếu Cần)
Xem `QUICK_FIX.md` hoặc `DEBUG_ADMIN_ACCESS.md`

## 🔍 Các Console Logs

### Khi Login Thành Công (Admin User):
```
🔍 Login Debug: {
  user: {
    _id: "...",
    email: "admin@test.com",
    role: "admin"  ← CÓ ROLE
  },
  userRole: "admin",
  isAdminUser: true,
  redirectPath: "/admin-panel"
}
```

### Khi Vào Admin Panel (Access Granted):
```
🛡️ AdminRoute Check: {
  hasUser: true,
  hasToken: true,
  user: { ... },
  userRole: "admin"
}
✅ AdminRoute: Access granted
```

### Khi Bị Chặn (Customer):
```
🛡️ AdminRoute Check: {
  hasUser: true,
  hasToken: true,
  user: { ... },
  userRole: "customer"
}
❌ AdminRoute: Unauthorized role, redirecting to home
```

### Khi Chưa Login:
```
🛡️ AdminRoute Check: {
  hasUser: false,
  hasToken: false,
  user: null,
  userRole: undefined
}
❌ AdminRoute: No user/token, redirecting to login
```

## 📊 Troubleshooting Matrix

| Symptom | Cause | Solution |
|---------|-------|----------|
| No role in console log | Backend không return role | Update login controller |
| role = undefined | User model không có role field | Update User schema |
| role = customer | User không phải admin | Update user trong database |
| Redirect to /user-dashboard | isAdminUser = false | User không có admin role |
| Redirect to / when access /admin-panel | AdminRoute block | User role không hợp lệ |
| No console logs | Code không chạy | Hard refresh browser |

## 🎓 Backend Fix Steps (Summary)

### 1. User Model
```javascript
// Add to schema
role: {
  type: String,
  enum: ['customer', 'staff', 'manager', 'admin'],
  default: 'customer'
}
```

### 2. Login Controller
```javascript
// Return role in response
res.json({
  user: {
    ...user._doc,
    role: user.role
  },
  token
});
```

### 3. Database Update
```javascript
// MongoDB
db.users.updateOne(
  { email: "YOUR_EMAIL" },
  { $set: { role: "admin" } }
);
```

### 4. Restart Backend
```bash
npm start
```

### 5. Clear Frontend & Login Again
```javascript
localStorage.clear();
// Then login
```

## 📱 Quick Test Commands

### Browser Console:
```javascript
// Check user
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user.role);

// Test admin access
const isAdmin = ['staff','manager','admin'].includes(user.role);
console.log('Can access admin:', isAdmin);
```

## 🚀 Next Steps

1. ✅ Đã thêm debug tools
2. ⏳ User test và check console logs
3. ⏳ Xác định vấn đề cụ thể (backend hay frontend)
4. ⏳ Fix theo hướng dẫn trong QUICK_FIX.md
5. ⏳ Verify fix bằng debug page

## 📞 Support

Nếu vẫn không work sau khi làm theo QUICK_FIX.md:

**Cần thông tin:**
1. Screenshot trang `/debug-auth`
2. Console logs sau khi login
3. Network tab - login API response
4. User object từ MongoDB (screenshot)

---

**All debug tools are ready! 🎉**

Vào `/debug-auth` để bắt đầu troubleshooting!
