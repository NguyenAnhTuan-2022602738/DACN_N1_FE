# Backend API - Categories Setup

## ⚠️ Backend chưa có API Categories

Frontend đang gọi `/api/categories` nhưng backend chưa có endpoint này. Bạn cần tạo:

## 1. Model: `server/src/models/Category.js`

```javascript
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image_url: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  sort_order: {
    type: Number,
    default: 0
  },
  meta_title: {
    type: String,
    default: ''
  },
  meta_description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
```

## 2. Controller: `server/src/controllers/categoryController.js`

```javascript
const Category = require('../models/Category');

// GET /api/categories - Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1, createdAt: -1 });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// GET /api/categories/:id - Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// POST /api/categories - Create new category
exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      parent_id,
      image_url,
      is_active,
      is_featured,
      sort_order,
      meta_title,
      meta_description
    } = req.body;

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Slug đã tồn tại',
        errors: { slug: 'Slug này đã được sử dụng' }
      });
    }

    const category = new Category({
      name,
      slug,
      description,
      parent_id: parent_id || null,
      image_url,
      is_active,
      is_featured,
      sort_order: sort_order || 0,
      meta_title,
      meta_description
    });

    await category.save();
    
    res.status(201).json({ 
      message: 'Tạo danh mục thành công',
      category 
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
    }
    
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// PUT /api/categories/:id - Update category
exports.updateCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      parent_id,
      image_url,
      is_active,
      is_featured,
      sort_order,
      meta_title,
      meta_description
    } = req.body;

    // Check if new slug conflicts with another category
    if (slug) {
      const existingCategory = await Category.findOne({ 
        slug, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          message: 'Slug đã tồn tại',
          errors: { slug: 'Slug này đã được sử dụng' }
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        description,
        parent_id: parent_id || null,
        image_url,
        is_active,
        is_featured,
        sort_order,
        meta_title,
        meta_description
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.json({ 
      message: 'Cập nhật danh mục thành công',
      category 
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
    }
    
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// DELETE /api/categories/:id - Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    // Note: Products with this category won't be deleted
    // You may want to set their category_id to null or handle this differently
    
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
```

## 3. Routes: `server/src/routes/categories.js`

```javascript
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (Admin only)
router.post('/', verifyToken, verifyAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
```

## 4. Update `server/src/index.js`

Thêm vào phần imports:
```javascript
const categoriesRoutes = require('./routes/categories');
```

Thêm vào phần app.use:
```javascript
app.use('/api/categories', categoriesRoutes);
```

## 5. Restart Backend Server

```bash
cd server
npm start
# hoặc
node src/index.js
```

## ✅ Sau khi setup:

1. API sẽ có các endpoint:
   - GET `/api/categories` - Lấy danh sách
   - GET `/api/categories/:id` - Lấy chi tiết
   - POST `/api/categories` - Tạo mới (cần admin)
   - PUT `/api/categories/:id` - Cập nhật (cần admin)
   - DELETE `/api/categories/:id` - Xóa (cần admin)

2. Frontend sẽ hoạt động bình thường
3. Không còn lỗi 404 trong console

## 📝 Notes:

- Model có quan hệ parent-child cho subcategories
- Slug phải unique
- Có sort_order để sắp xếp thứ tự hiển thị
- Có is_active và is_featured flags
- Có SEO fields (meta_title, meta_description)
