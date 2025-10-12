# Role-Based Access Control (RBAC) - Implementation Complete

## Tổng Quan
Hệ thống phân quyền 3 cấp độ cho ABC Fashion Store admin panel đã được tạo với đầy đủ các component và hướng dẫn cần thiết.

## Các Vai Trò (Roles)

### 1. Staff (Nhân viên)
**Quyền hạn:**
- ✅ Xem và quản lý sản phẩm (các thay đổi cần được phê duyệt)
- ✅ Xử lý đơn hàng
- ✅ Hỗ trợ khách hàng qua chat/email
- ✅ Xem báo cáo cơ bản
- ❌ Không thể thay đổi cài đặt admin hoặc quyền hạn

### 2. Manager (Quản lý)
**Quyền hạn:** Tất cả quyền của Staff +
- ✅ Tạo và quản lý khuyến mãi
- ✅ Cập nhật bộ sưu tập
- ✅ Xem báo cáo doanh số
- ✅ Phân tích hành vi khách hàng
- ✅ Phê duyệt các thay đổi từ Staff
- ✅ Hủy đơn hàng
- ✅ Xóa sản phẩm

### 3. Admin (Quản trị viên)
**Quyền hạn:** Toàn quyền hệ thống
- ✅ Tạo, chỉnh sửa người dùng và phân quyền
- ✅ Giám sát tất cả hoạt động
- ✅ Quản lý sản phẩm, đơn hàng, thanh toán
- ✅ Cấu hình phương thức thanh toán
- ✅ Quản lý hệ thống
- ✅ Sao lưu dữ liệu
- ✅ Cài đặt bảo mật

## Files Đã Tạo

### Frontend Components

#### 1. ProtectedRoute (Enhanced)
**File:** `src/components/ProtectedRoute.jsx`

**Tính năng:**
- Kiểm tra authentication (giữ nguyên chức năng cũ)
- Kiểm tra role-based authorization (MỚI)
- Hỗ trợ single role hoặc array of roles
- Custom redirect path

**Sử dụng:**
```jsx
// Admin only
<ProtectedRoute requiredRole="admin">
  <UserManagement />
</ProtectedRoute>

// Manager or Admin
<ProtectedRoute requiredRole={['manager', 'admin']}>
  <PromotionManagement />
</ProtectedRoute>
```

#### 2. useRole Hook
**File:** `src/hooks/useRole.jsx`

**Tính năng:**
- Lấy thông tin user và role hiện tại
- Các hàm kiểm tra role: `hasRole()`, `hasMinRole()`, `hasAnyRole()`
- Boolean checkers: `isStaff`, `isManager`, `isAdmin`
- Object `permissions` với tất cả quyền hạn được định nghĩa sẵn

**Sử dụng:**
```jsx
const { isAdmin, permissions } = useRole();

{isAdmin && <AdminOnlyFeature />}
{permissions.canManagePromotions && <PromotionButton />}
```

#### 3. Forbidden Page (403)
**File:** `src/pages/Forbidden.jsx`

Trang hiển thị khi user cố truy cập vào route không có quyền.

### Backend Templates

#### 1. requireRole Middleware
**File:** `backend-templates/requireRole.middleware.js`

Middleware để protect API routes dựa trên role.

**Cách dùng:**
```javascript
router.get('/users', requireRole('admin'), userController.getUsers);
router.post('/promotions', requireMinRole('manager'), promotionController.create);
```

#### 2. Migration Script
**File:** `backend-templates/add-roles-migration.js`

Script để thêm field `role` vào existing users trong database.

#### 3. Admin Routes Example
**File:** `backend-templates/admin.routes.js`

File mẫu đầy đủ cho tất cả admin routes với đúng phân quyền theo yêu cầu.

### Documentation

#### Implementation Guide
**File:** `RBAC_IMPLEMENTATION_GUIDE.md`

Hướng dẫn đầy đủ về:
- Cách sử dụng các components
- Backend requirements
- Route configuration examples
- Testing scenarios
- Security best practices
- Migration guide
- Troubleshooting

## Checklist Triển Khai

### Backend (Cần làm)
- [ ] Thêm field `role` vào User model
  ```javascript
  role: {
    type: String,
    enum: ['staff', 'manager', 'admin'],
    default: 'staff',
    required: true
  }
  ```
- [ ] Chạy migration script để thêm role cho users hiện tại
- [ ] Copy và integrate `requireRole.middleware.js` vào backend
- [ ] Apply middleware vào admin routes (tham khảo `admin.routes.js`)
- [ ] Update login response để include `role` trong user object
- [ ] Test API protection

### Frontend (Đã làm một phần)
- [x] Enhanced ProtectedRoute component với role checking
- [x] Created useRole hook cho permission checking
- [x] Created Forbidden (403) page
- [ ] Update router configuration với role-protected routes
- [ ] Add role-based UI trong admin components
- [ ] Update login flow để lưu role vào localStorage
- [ ] Test role-based navigation và UI visibility

## Ví Dụ SửỤng

### 1. Protect Routes
```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Staff, Manager, Admin có thể truy cập
<Route 
  path="/admin/products" 
  element={
    <ProtectedRoute requiredRole={['staff', 'manager', 'admin']}>
      <ProductManagement />
    </ProtectedRoute>
  } 
/>

// Chỉ Manager và Admin
<Route 
  path="/admin/analytics" 
  element={
    <ProtectedRoute requiredRole={['manager', 'admin']}>
      <Analytics />
    </ProtectedRoute>
  } 
/>

// Chỉ Admin
<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  } 
/>
```

### 2. Role-Based UI
```jsx
import { useRole } from '@/hooks/useRole';

function ProductManagement() {
  const { permissions, isStaff } = useRole();

  return (
    <div>
      {/* Tất cả roles có thể tạo */}
      {permissions.canCreateProduct && (
        <button onClick={handleCreate}>
          Tạo sản phẩm
          {isStaff && <span>(Cần phê duyệt)</span>}
        </button>
      )}

      {/* Chỉ Manager và Admin có thể xóa */}
      {permissions.canDeleteProduct && (
        <button onClick={handleDelete}>Xóa sản phẩm</button>
      )}

      {/* Chỉ Manager và Admin thấy approval queue */}
      {permissions.canApproveProductChanges && (
        <ApprovalQueue />
      )}
    </div>
  );
}
```

### 3. Backend API Protection
```javascript
const { requireRole, requireMinRole } = require('../middleware/requireRole');

// Admin only
router.get('/users', authMiddleware, requireRole('admin'), userController.getUsers);

// Manager and Admin
router.post('/promotions', authMiddleware, requireMinRole('manager'), promotionController.create);

// All authenticated staff
router.get('/orders', authMiddleware, requireRole(['staff', 'manager', 'admin']), orderController.getOrders);
```

## Quyền Hạn Chi Tiết (Permissions)

### Product Management
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| View Products | ✅ | ✅ | ✅ |
| Create Product | ✅* | ✅ | ✅ |
| Edit Product | ✅* | ✅ | ✅ |
| Delete Product | ❌ | ✅ | ✅ |
| Approve Changes | ❌ | ✅ | ✅ |

*Cần phê duyệt

### Order Management
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| View Orders | ✅ | ✅ | ✅ |
| Process Orders | ✅ | ✅ | ✅ |
| Cancel Orders | ❌ | ✅ | ✅ |

### Promotions & Collections
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| View Promotions | ✅ | ✅ | ✅ |
| Manage Promotions | ❌ | ✅ | ✅ |
| Manage Collections | ❌ | ✅ | ✅ |

### Reports & Analytics
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| Basic Reports | ✅ | ✅ | ✅ |
| Sales Reports | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Customer Behavior | ❌ | ✅ | ✅ |

### User Management
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| View Users | ❌ | ❌ | ✅ |
| Create Users | ❌ | ❌ | ✅ |
| Edit Users | ❌ | ❌ | ✅ |
| Manage Permissions | ❌ | ❌ | ✅ |

### System Configuration
| Permission | Staff | Manager | Admin |
|------------|-------|---------|-------|
| System Settings | ❌ | ❌ | ✅ |
| Payment Config | ❌ | ❌ | ✅ |
| Backups | ❌ | ❌ | ✅ |
| Security Settings | ❌ | ❌ | ✅ |
| System Monitoring | ❌ | ❌ | ✅ |

## Testing

### Tạo Test Users
```javascript
// Staff user
{
  username: "staff_test",
  email: "staff@test.com",
  password: "hashed_password",
  role: "staff"
}

// Manager user
{
  username: "manager_test",
  email: "manager@test.com",
  password: "hashed_password",
  role: "manager"
}

// Admin user
{
  username: "admin_test",
  email: "admin@test.com",
  password: "hashed_password",
  role: "admin"
}
```

### Test Scenarios
1. **Staff User:**
   - ✅ Truy cập product management
   - ✅ Truy cập order management
   - ❌ Truy cập promotions (redirect to /)
   - ❌ Truy cập analytics (redirect to /)
   - ❌ Truy cập user management (redirect to /)

2. **Manager User:**
   - ✅ Truy cập tất cả Staff features
   - ✅ Truy cập promotions
   - ✅ Truy cập analytics
   - ❌ Truy cập user management (redirect to /)

3. **Admin User:**
   - ✅ Truy cập tất cả features
   - ✅ Quản lý users
   - ✅ Cấu hình system

## Security Notes

1. **Frontend checks chỉ cho UX** - Backend PHẢI verify permissions
2. **Validate role trên mọi API request** - Dùng middleware consistently
3. **Log permission activities** - Track ai access gì
4. **Secure role assignment** - Chỉ admin mới change roles
5. **Session validation** - Role phải là part of auth session/token

## Next Steps

1. **Backend Implementation:**
   - Add role field to User model
   - Run migration script
   - Integrate requireRole middleware
   - Apply to admin routes
   - Test API protection

2. **Frontend Integration:**
   - Update router với ProtectedRoute
   - Add role-based UI vào admin pages
   - Test route access và UI visibility

3. **Create Admin Features:**
   - User management page (admin only)
   - Promotion management (manager+)
   - Analytics dashboard (manager+)
   - Product approval workflow (manager+)

4. **Testing:**
   - Create test users
   - Test all routes với mỗi role
   - Test API endpoints
   - Test UI visibility

## Support

Tất cả code và documentation đã được tạo. Tham khảo `RBAC_IMPLEMENTATION_GUIDE.md` cho hướng dẫn chi tiết.
