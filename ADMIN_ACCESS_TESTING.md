# Role-Based Admin Access - Testing Guide

## Tóm Tắt Thay Đổi

### 1. Login Flow - Tự Động Redirect Dựa Trên Role
**File:** `src/pages/auth/Login.jsx`

Khi đăng nhập thành công:
- **Staff, Manager, Admin** → Redirect sang `/admin-panel`
- **Customer (hoặc không có role)** → Redirect sang `/user-dashboard`

```javascript
const userRole = user?.role || 'customer';
const isAdminUser = ['staff', 'manager', 'admin'].includes(userRole);
const redirectPath = isAdminUser ? '/admin-panel' : '/user-dashboard';
```

### 2. AdminRoute Component - Chặn Customer
**File:** `src/components/AdminRoute.jsx`

- Kiểm tra authentication
- Kiểm tra role: chỉ cho phép `staff`, `manager`, `admin`
- Redirect customer về homepage `/`
- Redirect chưa login về `/login`

### 3. Protected Admin Routes
**File:** `src/Routes.jsx`

Tất cả admin routes đã được bảo vệ bằng `<AdminRoute>`:
```jsx
<Route path='/admin-panel' element={<AdminRoute><AdminPanel /></AdminRoute>} />
<Route path='/admin/products' element={<AdminRoute><ProductsList /></AdminRoute>} />
<Route path='/admin/products/new' element={<AdminRoute><ProductForm /></AdminRoute>} />
<Route path='/admin/products/:id' element={<AdminRoute><ProductForm /></AdminRoute>} />
```

### 4. Role-Based Admin Panel UI
**File:** `src/pages/admin-panel/index.jsx`

Tabs hiển thị dựa trên role:

| Tab | Staff | Manager | Admin |
|-----|-------|---------|-------|
| Tổng quan (Dashboard) | ✅ | ✅ | ✅ |
| Đơn hàng (Orders) | ✅ | ✅ | ✅ |
| Sản phẩm (Products) | ✅ | ✅ | ✅ |
| Phân tích (Analytics) | ❌ | ✅ | ✅ |
| Người dùng (Users) | ❌ | ❌ | ✅ |
| Cài đặt (Settings) | ❌ | ❌ | ✅ |

Buttons hiển thị theo quyền hạn:
- **"Xuất báo cáo"**: Chỉ Manager và Admin
- **"Thêm mới"**: Tất cả (Staff cần approval)

## Cách Test

### Test Case 1: Customer không thể vào admin panel
1. Login bằng tài khoản customer (không có role hoặc role = 'customer')
2. Redirect về `/user-dashboard`
3. Thử truy cập `/admin-panel` trực tiếp
4. **Expected**: Redirect về homepage `/`

### Test Case 2: Staff redirect sang admin panel
1. Login bằng tài khoản có `role: 'staff'`
2. **Expected**: Redirect sang `/admin-panel`
3. Thấy tabs: Tổng quan, Đơn hàng, Sản phẩm
4. **Không thấy**: Phân tích, Người dùng, Cài đặt

### Test Case 3: Manager có thêm quyền
1. Login bằng tài khoản có `role: 'manager'`
2. **Expected**: Redirect sang `/admin-panel`
3. Thấy tabs: Tổng quan, Đơn hàng, Sản phẩm, Phân tích
4. Thấy button "Xuất báo cáo"
5. **Không thấy**: Người dùng, Cài đặt

### Test Case 4: Admin có toàn quyền
1. Login bằng tài khoản có `role: 'admin'`
2. **Expected**: Redirect sang `/admin-panel`
3. Thấy tất cả tabs: Tổng quan, Đơn hàng, Sản phẩm, Phân tích, Người dùng, Cài đặt
4. Thấy tất cả buttons

### Test Case 5: Direct URL Access
Với customer account:
- Truy cập `/admin-panel` → Redirect về `/`
- Truy cập `/admin/products` → Redirect về `/`
- Truy cập `/admin/products/new` → Redirect về `/`

Với staff/manager/admin account:
- Tất cả admin URLs hoạt động bình thường

## Backend Requirements (Cần Làm)

### 1. User Model - Thêm Role Field
```javascript
// server/src/models/User.js hoặc UserProfile.js
role: {
  type: String,
  enum: ['customer', 'staff', 'manager', 'admin'],
  default: 'customer',
  required: true
}
```

### 2. Login API - Return Role
Đảm bảo API `/api/auth/login` return user object có field `role`:
```javascript
{
  user: {
    _id: "...",
    email: "...",
    username: "...",
    role: "staff" // QUAN TRỌNG: Phải có field này
  },
  token: "..."
}
```

### 3. Tạo Test Users
Trong MongoDB, tạo users với các role khác nhau:

```javascript
// Customer (default)
{
  email: "customer@test.com",
  password: "hashed_password",
  role: "customer"
}

// Staff
{
  email: "staff@test.com",
  password: "hashed_password",
  role: "staff"
}

// Manager
{
  email: "manager@test.com",
  password: "hashed_password",
  role: "manager"
}

// Admin
{
  email: "admin@test.com",
  password: "hashed_password",
  role: "admin"
}
```

### 4. Migration Script (Nếu Cần)
Nếu có users hiện tại không có role, chạy script:

```javascript
// Set all existing users to 'customer' by default
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: 'customer' } }
);

// Promote specific users
db.users.updateOne(
  { email: 'admin@abcfashion.com' },
  { $set: { role: 'admin' } }
);
```

## Debug Tips

### Kiểm tra User Object trong Browser
```javascript
// Open browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user.role);
```

### Nếu Redirect Không Hoạt Động
1. Clear localStorage: `localStorage.clear()`
2. Login lại
3. Check console for errors
4. Verify user object có field `role`

### Nếu Vẫn Thấy Tabs Không Nên Thấy
1. Check `useRole` hook đang return đúng role
2. Verify `tabs` array được filter đúng
3. Hard refresh browser (Ctrl + Shift + R)

## Security Notes

⚠️ **QUAN TRỌNG**: Frontend checks chỉ để UX, backend PHẢI verify role:

1. **Frontend**: Ẩn UI, redirect users
2. **Backend**: Protect API endpoints với middleware
   ```javascript
   router.get('/admin/users', requireRole('admin'), controller);
   ```

3. Customer có thể bypass frontend bằng DevTools
4. Backend PHẢI là tầng bảo mật cuối cùng

## Next Steps

1. ✅ Frontend role-based routing (DONE)
2. ✅ Frontend UI permissions (DONE)
3. ⏳ Backend User model with role field (TODO)
4. ⏳ Backend API protection middleware (TODO)
5. ⏳ Create test users with different roles (TODO)
6. ⏳ Test all scenarios (TODO)

## Files Changed

- ✅ `src/pages/auth/Login.jsx` - Role-based redirect after login
- ✅ `src/components/AdminRoute.jsx` - NEW: Admin-only route guard
- ✅ `src/Routes.jsx` - Protected admin routes
- ✅ `src/pages/admin-panel/index.jsx` - Role-based tabs and buttons
- ✅ `src/hooks/useRole.jsx` - Already created
- ✅ `src/components/ProtectedRoute.jsx` - Already enhanced

## Troubleshooting

### Problem: "Tôi vẫn vào được admin panel bằng customer account"
**Solution**: 
- Kiểm tra localStorage có user object với role chưa
- Clear localStorage và login lại
- Verify backend trả về role trong login response

### Problem: "Login rồi nhưng không redirect"
**Solution**:
- Check browser console for errors
- Verify `navigate()` được import từ react-router-dom
- Check toast notifications có hiện không

### Problem: "Tabs không hiển thị đúng"
**Solution**:
- Clear browser cache
- Verify `useRole()` hook được import đúng
- Check role spelling: 'staff' vs 'Staff'
