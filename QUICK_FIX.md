# 🚨 QUICK FIX: Admin Access Not Working

## TL;DR - Làm Ngay

### 1️⃣ Vào Debug Page (1 phút)
```
http://localhost:3000/debug-auth
```

Xem user có `role` không?
- **CÓ role = admin/staff/manager** → OK, skip xuống bước 3
- **KHÔNG có role hoặc role = customer** → Làm bước 2

### 2️⃣ Backend Cần Fix (5 phút)

#### A. Update User Model
File: `server/src/models/User.js` hoặc `UserProfile.js`

Thêm vào schema:
```javascript
role: {
  type: String,
  enum: ['customer', 'staff', 'manager', 'admin'],
  default: 'customer',
  required: true
}
```

#### B. Update Login Controller
File: `server/src/controllers/authController.js`

Đảm bảo return role:
```javascript
res.json({
  user: {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role  // ← ADD THIS
  },
  token: token
});
```

#### C. Update Database
Trong MongoDB shell hoặc Compass:
```javascript
// Set user của bạn làm admin
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

#### D. Restart Backend
```bash
# Stop server (Ctrl+C)
# Start lại
npm start
```

### 3️⃣ Test (30 giây)

1. **Clear browser:**
   ```javascript
   // Browser console
   localStorage.clear();
   ```

2. **Login lại** với account đã set role = admin

3. **Check console** - Phải thấy:
   ```
   🔍 Login Debug: {
     userRole: "admin",
     isAdminUser: true,
     redirectPath: "/admin-panel"
   }
   ```

4. **Tự động redirect** sang `/admin-panel` ✅

## 🎯 Test Nhanh (Không Cần Backend)

Nếu muốn test frontend mà chưa fix backend:

1. Vào `/debug-auth`
2. Click **"Set Test Admin"**
3. Thử vào `/admin-panel`
4. Nếu VÀO ĐƯỢC → Frontend OK, backend cần fix
5. Nếu KHÔNG VÀO ĐƯỢC → Có bug frontend

## 📱 Console Commands

### Check User
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Has role:', !!user.role);
console.log('Role value:', user.role);
```

### Set Test Admin
```javascript
localStorage.setItem('user', JSON.stringify({
  _id: 'test',
  email: 'admin@test.com',
  username: 'Test Admin',
  role: 'admin'
}));
localStorage.setItem('token', 'test-token');
window.location.reload();
```

### Clear All
```javascript
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

## ❓ FAQ

### Q: Login thành công nhưng về /user-dashboard thay vì /admin-panel?
**A:** User không có role hoặc role = customer. Fix backend step 2.

### Q: Vào /admin-panel bị redirect về homepage?
**A:** User không phải admin. Check role trong database.

### Q: Console log "❌ AdminRoute: Unauthorized role"?
**A:** User role không phải staff/manager/admin. Update trong database.

### Q: Backend đã update nhưng vẫn không work?
**A:** 
1. Clear localStorage
2. Restart backend
3. Login lại
4. Check network tab - response có role không

## 🔍 Debug Checklist

- [ ] User model có field `role` ✓
- [ ] Login API response có `user.role` ✓
- [ ] Database user có role = admin/staff/manager ✓
- [ ] localStorage user object có role ✓
- [ ] Console log "isAdminUser: true" ✓
- [ ] Redirect path = "/admin-panel" ✓
- [ ] Backend restarted ✓
- [ ] Browser localStorage cleared ✓

## 🆘 Still Not Working?

1. **Screenshot** `/debug-auth` page
2. **Console logs** sau khi login
3. **Network tab** - login API response
4. Gửi để được support

## 📞 Quick Commands

```bash
# Backend
cd server
npm start

# Frontend  
cd fe
npm start

# Debug page
http://localhost:3000/debug-auth

# Admin panel
http://localhost:3000/admin-panel
```

---

**Expected Time:** 5-10 phút total
**Difficulty:** Easy (chỉ cần update backend)
**Success Rate:** 99% (nếu làm đúng steps)
