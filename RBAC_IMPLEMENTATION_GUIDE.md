# Role-Based Access Control (RBAC) Implementation Guide

## Overview
Hệ thống phân quyền 3 cấp độ cho ABC Fashion Store admin panel:
- **Staff (Nhân viên)**: Quản lý sản phẩm (cần phê duyệt), xử lý đơn hàng, chăm sóc khách hàng
- **Manager (Quản lý)**: Tất cả quyền của Staff + khuyến mãi, bộ sưu tập, báo cáo, phân tích, phê duyệt
- **Admin (Quản trị viên)**: Toàn quyền hệ thống, quản lý người dùng, cấu hình hệ thống

## Components Created

### 1. Enhanced ProtectedRoute Component
**Location**: `src/components/ProtectedRoute.jsx`

**Features**:
- Authentication checking (unchanged from original)
- Role-based authorization (NEW)
- Flexible role requirements (single role or array of roles)
- Custom redirect paths

**Usage Examples**:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Authentication only (original behavior)
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Admin only
<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  } 
/>

// Manager or Admin
<Route 
  path="/admin/promotions" 
  element={
    <ProtectedRoute requiredRole={['manager', 'admin']}>
      <PromotionManagement />
    </ProtectedRoute>
  } 
/>

// Staff, Manager, or Admin (all authenticated users)
<Route 
  path="/admin/products" 
  element={
    <ProtectedRoute requiredRole={['staff', 'manager', 'admin']}>
      <ProductManagement />
    </ProtectedRoute>
  } 
/>

// Custom redirect for unauthorized access
<Route 
  path="/admin/settings" 
  element={
    <ProtectedRoute requiredRole="admin" redirectTo="/forbidden">
      <SystemSettings />
    </ProtectedRoute>
  } 
/>
```

### 2. useRole Hook
**Location**: `src/hooks/useRole.jsx`

**Features**:
- Get current user and role
- Role checking functions
- Permission-based access control
- Pre-defined permission constants

**Usage Examples**:

```jsx
import { useRole } from '@/hooks/useRole';

function AdminPanel() {
  const { role, isAdmin, isManager, hasMinRole, permissions } = useRole();

  return (
    <div>
      <h1>Welcome, {role}!</h1>
      
      {/* Check specific role */}
      {isAdmin && <AdminOnlyFeature />}
      {isManager && <ManagerFeature />}
      
      {/* Check minimum role level */}
      {hasMinRole('manager') && <ManagerAndAbove />}
      
      {/* Check specific permissions */}
      {permissions.canManageUsers && <UserManagementButton />}
      {permissions.canViewAnalytics && <AnalyticsDashboard />}
      {permissions.canApproveProductChanges && <ApprovalQueue />}
    </div>
  );
}
```

**Available Role Checkers**:
```jsx
const {
  role,              // Current role string: 'staff' | 'manager' | 'admin'
  isStaff,           // Boolean: true if user is staff
  isManager,         // Boolean: true if user is manager
  isAdmin,           // Boolean: true if user is admin
  hasRole,           // Function: hasRole('admin')
  hasMinRole,        // Function: hasMinRole('manager') - includes higher roles
  hasAnyRole,        // Function: hasAnyRole(['staff', 'manager'])
  permissions        // Object with all permission flags
} = useRole();
```

**Available Permissions**:
```jsx
permissions = {
  // Product Management
  canViewProducts: true,           // All roles
  canCreateProduct: true,          // All roles (staff needs approval)
  canEditProduct: true,            // All roles (staff needs approval)
  canDeleteProduct: false,         // Manager and Admin only
  canApproveProductChanges: false, // Manager and Admin only

  // Order Management
  canViewOrders: true,             // All roles
  canProcessOrders: true,          // All roles
  canCancelOrders: false,          // Manager and Admin only

  // Promotions & Collections
  canViewPromotions: true,         // All roles
  canManagePromotions: false,      // Manager and Admin only
  canManageCollections: false,     // Manager and Admin only

  // Reports & Analytics
  canViewBasicReports: true,       // All roles
  canViewSalesReports: false,      // Manager and Admin only
  canViewAnalytics: false,         // Manager and Admin only
  canViewCustomerBehavior: false,  // Manager and Admin only

  // Customer Support
  canRespondToCustomers: true,     // All roles
  canAccessCustomerData: false,    // Manager and Admin only

  // User Management
  canViewUsers: false,             // Admin only
  canCreateUsers: false,           // Admin only
  canEditUsers: false,             // Admin only
  canManagePermissions: false,     // Admin only

  // System Configuration
  canAccessSystemSettings: false,  // Admin only
  canConfigurePayments: false,     // Admin only
  canManageBackups: false,         // Admin only
  canAccessSecuritySettings: false,// Admin only
  canMonitorSystem: false          // Admin only
}
```

### 3. Forbidden Page
**Location**: `src/pages/Forbidden.jsx`

403 error page for unauthorized access attempts.

## Backend Requirements

### User Model Enhancement
Add role field to User/UserProfile model:

```javascript
// server/src/models/User.js or UserProfile.js
const userSchema = new Schema({
  // ... existing fields
  role: {
    type: String,
    enum: ['staff', 'manager', 'admin'],
    default: 'staff',
    required: true
  }
});
```

### Role Verification Middleware
Create middleware for API route protection:

```javascript
// server/src/middleware/requireRole.js
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role || 'staff';
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

module.exports = requireRole;
```

### Apply Middleware to Routes
```javascript
// server/src/routes/admin.js
const requireRole = require('../middleware/requireRole');

// Admin only
router.get('/users', requireRole('admin'), userController.getUsers);
router.post('/users', requireRole('admin'), userController.createUser);

// Manager and Admin
router.get('/analytics', requireRole(['manager', 'admin']), analyticsController.getAnalytics);
router.post('/promotions', requireRole(['manager', 'admin']), promotionController.create);

// All authenticated users
router.get('/products', requireRole(['staff', 'manager', 'admin']), productController.getProducts);
```

## Implementation Checklist

### Backend
- [ ] Add `role` field to User model
- [ ] Create migration script to add role to existing users
- [ ] Create `requireRole` middleware
- [ ] Apply middleware to admin API routes
- [ ] Update login response to include `role` in user object
- [ ] Test role-based API access

### Frontend
- [x] Enhanced ProtectedRoute component with role checking
- [x] Created useRole hook for permission checking
- [x] Created Forbidden (403) page
- [ ] Update router configuration with role-protected routes
- [ ] Add role-based UI feature toggling in admin components
- [ ] Update login flow to store role in localStorage
- [ ] Test role-based navigation and UI visibility

## Example Route Configuration

```jsx
// src/App.jsx or router configuration
import ProtectedRoute from '@/components/ProtectedRoute';
import Forbidden from '@/pages/Forbidden';

const router = createBrowserRouter([
  // ... existing routes

  // Forbidden page
  {
    path: '/forbidden',
    element: <Forbidden />
  },

  // Admin routes - all require authentication
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      // Staff, Manager, Admin can access
      {
        path: 'products',
        element: (
          <ProtectedRoute requiredRole={['staff', 'manager', 'admin']}>
            <ProductManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute requiredRole={['staff', 'manager', 'admin']}>
            <OrderManagement />
          </ProtectedRoute>
        )
      },
      
      // Manager and Admin only
      {
        path: 'promotions',
        element: (
          <ProtectedRoute requiredRole={['manager', 'admin']}>
            <PromotionManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute requiredRole={['manager', 'admin']}>
            <Analytics />
          </ProtectedRoute>
        )
      },
      
      // Admin only
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredRole="admin">
            <SystemSettings />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
```

## Example Admin Component with Role-Based UI

```jsx
// src/pages/admin/ProductManagement.jsx
import { useRole } from '@/hooks/useRole';

function ProductManagement() {
  const { permissions, isStaff } = useRole();

  return (
    <div>
      <h1>Product Management</h1>

      {/* All roles can create */}
      {permissions.canCreateProduct && (
        <button onClick={handleCreate}>
          Create Product
          {isStaff && <span className="text-xs">(Requires approval)</span>}
        </button>
      )}

      {/* Manager and Admin can delete */}
      {permissions.canDeleteProduct && (
        <button onClick={handleDelete}>Delete Product</button>
      )}

      {/* Manager and Admin see approval queue */}
      {permissions.canApproveProductChanges && (
        <ApprovalQueue />
      )}

      <ProductList />
    </div>
  );
}
```

## Testing Role-Based Access

### Test User Accounts
Create test accounts for each role:

```javascript
// In MongoDB or through admin interface
{
  username: "staff_test",
  email: "staff@test.com",
  password: "hashed_password",
  role: "staff"
}

{
  username: "manager_test",
  email: "manager@test.com",
  password: "hashed_password",
  role: "manager"
}

{
  username: "admin_test",
  email: "admin@test.com",
  password: "hashed_password",
  role: "admin"
}
```

### Test Scenarios
1. **Staff User**:
   - ✅ Can access product management
   - ✅ Can access order management
   - ❌ Cannot access promotions
   - ❌ Cannot access analytics
   - ❌ Cannot access user management
   - ❌ Cannot access system settings

2. **Manager User**:
   - ✅ Can access all Staff features
   - ✅ Can access promotions
   - ✅ Can access analytics
   - ✅ Can approve product changes
   - ❌ Cannot access user management
   - ❌ Cannot access system settings

3. **Admin User**:
   - ✅ Can access all features
   - ✅ Can manage users
   - ✅ Can configure system
   - ✅ Full access to all admin features

## Security Best Practices

1. **Never trust frontend checks alone**: Always verify permissions on the backend
2. **Validate user role on every API request**: Use middleware consistently
3. **Log permission-related activities**: Track who accesses what
4. **Use role hierarchy**: Implement hasMinRole to reduce code duplication
5. **Regular permission audits**: Review and update role permissions as needed
6. **Secure role assignment**: Only admins can change user roles
7. **Session validation**: Ensure role is part of authenticated session/token

## Troubleshooting

### User role not recognized
- Check if `role` field exists in localStorage user object
- Verify backend includes `role` in login/auth response
- Clear localStorage and login again

### Permission denied despite correct role
- Check role spelling: 'staff' vs 'Staff'
- Verify role hierarchy in useRole hook
- Check if middleware is applied to route

### UI shows features user can't access
- Ensure useRole hook is called in component
- Check permission conditions in JSX
- Verify backend API also has role protection

## Migration Guide

To add roles to existing users:

```javascript
// server/scripts/add-roles-to-users.js
const User = require('../models/User');

async function addRolesToUsers() {
  // Set all existing users to staff by default
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'staff' } }
  );

  // Promote specific users to admin
  await User.updateOne(
    { email: 'admin@abcfashion.com' },
    { $set: { role: 'admin' } }
  );

  console.log('Roles added successfully');
}

addRolesToUsers();
```

## Next Steps

1. **Update Backend**:
   - Add role field to User model
   - Create and apply requireRole middleware
   - Test API protection

2. **Update Frontend**:
   - Configure routes with ProtectedRoute
   - Add role-based UI in admin components
   - Update login to store role

3. **Create Admin Features**:
   - User management page (admin only)
   - Promotion management (manager+)
   - Analytics dashboard (manager+)
   - Product approval workflow (manager+)

4. **Testing**:
   - Create test users for each role
   - Test route access
   - Test API endpoints
   - Test UI visibility

## Contact

For questions or issues with RBAC implementation, contact the development team.
