import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Package, DollarSign, Image as ImageIcon, X, Tag, Activity, Star } from 'lucide-react';

/**
 * Empty template matching ProductMongo.js schema exactly
 */
const emptyTemplate = {
  // Basic fields
  name: '',
  slug: '',
  description: '',
  short_description: '',
  sku: '',
  
  // Pricing
  price: 0,
  original_price: 0,
  cost_price: 0,
  
  // Inventory
  stock_quantity: 0,
  min_stock_level: 5,
  
  // Physical
  weight: 0,
  dimensions: '',
  
  // Status
  status: 'active', // enum: 'active', 'inactive', 'out_of_stock'
  is_featured: false,
  
  // Ratings (read-only, set by reviews)
  rating: 0,
  review_count: 0,
  
  // SEO
  tags: [],
  meta_title: '',
  meta_description: '',
  
  // Relations
  category_id: '',
  created_by: '',
  
  // Nested arrays - ProductMongo schema
  images: [], // Array of { image_url, alt_text, sort_order, is_primary }
  variants: [], // Array of { name, value, price_adjustment, stock_quantity, sku, image_url, sort_order }
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState(emptyTemplate);
  const [errors, setErrors] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Helper functions
  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    if (!form.name) return;
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    update('slug', slug);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = form.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      update('tags', [...currentTags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    update('tags', (form.tags || []).filter(t => t !== tag));
  };

  // Variant management
  const addVariant = () => {
    const newVariant = {
      name: 'Size',
      value: '',
      price_adjustment: 0,
      stock_quantity: 0,
      sku: '',
      image_url: '',
      sort_order: (form.variants || []).length
    };
    update('variants', [...(form.variants || []), newVariant]);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...(form.variants || [])];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    update('variants', updatedVariants);
  };

  const removeVariant = (index) => {
    update('variants', (form.variants || []).filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.push({ title: 'Lỗi', message: 'Chỉ chấp nhận file ảnh', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.push({ title: 'Lỗi', message: 'File quá lớn (max 5MB)', type: 'error' });
      return;
    }

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await API.post('/api/uploads/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res?.data?.url;
      if (url) {
        const currentImages = form.images || [];
        const newImage = {
          image_url: url,
          alt_text: form.name || 'Product image',
          sort_order: currentImages.length,
          is_primary: currentImages.length === 0
        };
        
        const updatedImages = [...currentImages, newImage];
        
        console.log('✅ Image uploaded:', newImage);
        console.log('📸 Updated images array:', updatedImages);
        
        update('images', updatedImages);
        toast.push({ title: 'Thành công', message: 'Upload ảnh thành công', type: 'success' });
      }
    } catch (e) {
      console.error('Upload error:', e);
      toast.push({ title: 'Lỗi', message: 'Upload ảnh thất bại', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Calculations
  const discountPercent = (form.original_price > 0 && form.price > 0)
    ? Math.round(((form.original_price - form.price) / form.original_price) * 100)
    : 0;

  // Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/api/categories');
        if (!mounted) return;
        const cats = res?.data?.data || res?.data?.categories || res?.data || [];
        // Ensure cats is always an array
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (e) {
        console.error('Failed to load categories:', e);
        // If backend not ready, use empty array
        if (e.response?.status === 404) {
          console.warn('Categories API not available yet.');
          if (mounted) setCategories([]);
        } else {
          if (mounted) setCategories([]);
        }
        // Don't show error toast, categories are optional
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load product if editing
  useEffect(() => {
    let mounted = true;
    if (!id) return;
    
    (async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        if (!mounted) return;
        
        const p = res?.data?.product || res?.data;
        if (p) {
          // Map backend data to form - ensure schema compliance
          setForm({
            // Basic
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            short_description: p.short_description || '',
            sku: p.sku || '',
            
            // Pricing
            price: Number(p.price) || 0,
            original_price: Number(p.original_price) || 0,
            cost_price: Number(p.cost_price) || 0,
            
            // Inventory
            stock_quantity: Number(p.stock_quantity) || 0,
            min_stock_level: Number(p.min_stock_level) || 5,
            
            // Physical
            weight: Number(p.weight) || 0,
            dimensions: p.dimensions || '',
            
            // Status
            status: p.status || 'active',
            is_featured: !!p.is_featured,
            
            // Ratings
            rating: Number(p.rating) || 0,
            review_count: Number(p.review_count) || 0,
            
            // SEO
            tags: Array.isArray(p.tags) ? p.tags : [],
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
            
            // Relations
            category_id: p.category_id || '',
            created_by: p.created_by || '',
            
            // Nested arrays - ensure proper structure
            images: Array.isArray(p.images) ? p.images : [],
            variants: Array.isArray(p.variants) ? p.variants : [],
          });
        }
      } catch (e) {
        console.error('Load product error:', e);
        toast.push({ 
          title: 'Lỗi', 
          message: 'Không tải được sản phẩm', 
          type: 'error' 
        });
      } finally { 
        if (mounted) setLoading(false); 
      }
    })();
    
    return () => { mounted = false; };
  }, [id, toast]);

  const handleSave = async (payload) => {
    setLoading(true);
    setErrors(null);
    
    // Debug: Check images before sending
    console.log('📸 Images before save:', payload.images);
    console.log('📦 Full payload:', payload);
    
    try {
      // Prepare data for backend - ensure types match schema
      const toSend = {
        // Basic
        name: payload.name?.trim() || '',
        slug: payload.slug?.trim() || '',
        description: payload.description || '',
        short_description: payload.short_description || '',
        sku: payload.sku?.trim() || '',
        
        // Pricing
        price: Number(payload.price) || 0,
        original_price: Number(payload.original_price) || 0,
        cost_price: Number(payload.cost_price) || 0,
        
        // Inventory
        stock_quantity: Number(payload.stock_quantity) || 0,
        min_stock_level: Number(payload.min_stock_level) || 5,
        
        // Physical
        weight: Number(payload.weight) || 0,
        dimensions: payload.dimensions?.trim() || '',
        
        // Status
        status: payload.status || 'active',
        is_featured: !!payload.is_featured,
        
        // SEO
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        meta_title: payload.meta_title || '',
        meta_description: payload.meta_description || '',
        
        // Relations
        category_id: payload.category_id || '',
        
        // Nested arrays - images and variants
        images: Array.isArray(payload.images) ? payload.images : [],
        variants: Array.isArray(payload.variants) ? payload.variants : [],
      };

      // Debug: Check toSend object
      console.log('📤 Data to send:', toSend);
      console.log('📸 Images in toSend:', toSend.images);

      // Validate required fields
      if (!toSend.name) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Tên sản phẩm là bắt buộc', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      if (!toSend.slug) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Slug là bắt buộc', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      if (toSend.price <= 0) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Giá bán phải lớn hơn 0', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // Save to backend
      if (id) {
        await API.put(`/api/products/${id}`, toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Sản phẩm đã được cập nhật', 
          type: 'success' 
        });
      } else {
        await API.post('/api/products', toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Sản phẩm mới đã được tạo', 
          type: 'success' 
        });
      }
      
      navigate('/admin-panel?tab=products');
    } catch (err) {
      console.error('Save product error:', err?.response?.data || err);
      const data = err?.response?.data;
      
      // Handle validation errors from backend
      if (data && data.errors && typeof data.errors === 'object') {
        setErrors(data.errors);
      }
      
      toast.push({ 
        title: 'Lỗi', 
        message: data?.message || 'Không thể lưu sản phẩm', 
        type: 'error' 
      });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-background rounded-xl border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {id ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {id 
                  ? 'Cập nhật thông tin sản phẩm' 
                  : 'Điền đầy đủ thông tin để tạo sản phẩm mới'
                }
              </p>
            </div>
            {id && form.name && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Đang chỉnh sửa</div>
                <div className="font-semibold text-primary">{form.name}</div>
              </div>
            )}
          </div>
        </div>

        {/* Form - INLINE ALL SECTIONS */}
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(form); }}>
          
          {/* === SECTION 1: THÔNG TIN CƠ BẢN === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Thông tin cơ bản
            </h3>

            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Tên sản phẩm"
                  placeholder="VD: Áo thun nam cotton"
                  value={form.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors?.name}
                  required
                />
              </div>
              <div>
                <Input
                  label="Slug (URL)"
                  placeholder="ao-thun-nam-cotton"
                  value={form.slug || ''}
                  onChange={(e) => update('slug', e.target.value)}
                  error={errors?.slug}
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="mt-1 text-sm text-primary hover:underline"
                >
                  Tạo tự động
                </button>
              </div>
            </div>

            {/* SKU, Category & Brand - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input
                  label="SKU"
                  placeholder="VD: AT-NAM-001"
                  value={form.sku || ''}
                  onChange={(e) => update('sku', e.target.value)}
                  error={errors?.sku}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  value={form.category_id || ''}
                  onChange={(e) => update('category_id', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Thương hiệu"
                  placeholder="VD: Nike, Adidas"
                  value={form.brand || ''}
                  onChange={(e) => update('brand', e.target.value)}
                />
              </div>
            </div>

            {/* Short & Full Description in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Mô tả ngắn"
                  placeholder="Mô tả ngắn gọn..."
                  rows={4}
                  value={form.short_description || ''}
                  onChange={(e) => update('short_description', e.target.value)}
                  error={errors?.short_description}
                />
              </div>
              <div>
                <Textarea
                  label="Mô tả chi tiết"
                  placeholder="Mô tả đầy đủ về sản phẩm..."
                  rows={4}
                  value={form.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  error={errors?.description}
                />
              </div>
            </div>
          </div>

          {/* === SECTION 2: GIÁ & TỒN KHO === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-primary" />
              Giá & Tồn kho
            </h3>

            {/* Prices - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Input
                  label="Giá bán (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.price || ''}
                  onChange={(e) => update('price', Number(e.target.value))}
                  error={errors?.price}
                  required
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Giá gốc (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.original_price || ''}
                  onChange={(e) => update('original_price', Number(e.target.value))}
                  error={errors?.original_price}
                  min={0}
                  helper={discountPercent > 0 ? `Giảm ${discountPercent}%` : ''}
                />
              </div>
              <div>
                <Input
                  label="Giá vốn (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.cost_price || ''}
                  onChange={(e) => update('cost_price', Number(e.target.value))}
                  error={errors?.cost_price}
                  min={0}
                  helper="Để tính lợi nhuận"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Số lượng tồn kho"
                  type="number"
                  placeholder="0"
                  value={form.stock_quantity || ''}
                  onChange={(e) => update('stock_quantity', Number(e.target.value))}
                  error={errors?.stock_quantity}
                  required
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Mức tồn kho tối thiểu"
                  type="number"
                  placeholder="5"
                  value={form.min_stock_level || ''}
                  onChange={(e) => update('min_stock_level', Number(e.target.value))}
                  error={errors?.min_stock_level}
                  min={0}
                  helper="Cảnh báo khi tồn kho < giá trị này"
                />
              </div>
            </div>

            {/* Stock Status */}
            {form.stock_quantity !== undefined && (
              <div className={`mt-4 p-3 rounded ${form.stock_quantity <= 0 ? 'bg-red-50 text-red-700' : form.stock_quantity <= (form.min_stock_level || 5) ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                <div className="font-medium">
                  {form.stock_quantity <= 0 ? '🔴 Hết hàng' : form.stock_quantity <= (form.min_stock_level || 5) ? '⚠️ Sắp hết hàng' : '✅ Còn hàng'}
                </div>
                <div className="text-sm">Tồn kho: {form.stock_quantity || 0} sản phẩm</div>
              </div>
            )}
          </div>

          {/* === SECTION 2.5: BIẾN THỂ (SIZES/VARIANTS) === */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Biến thể sản phẩm (Size, Màu sắc...)
              </h3>
              <Button type="button" onClick={addVariant} size="sm">
                + Thêm biến thể
              </Button>
            </div>

            {(form.variants || []).length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Chưa có biến thể. Click "Thêm biến thể" để thêm size, màu sắc, v.v.
              </p>
            ) : (
              <div className="space-y-4">
                {(form.variants || []).map((variant, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Biến thể #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Loại</label>
                        <select
                          value={variant.name || 'Size'}
                          onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="Size">Size</option>
                          <option value="Màu sắc">Màu sắc</option>
                          <option value="Chất liệu">Chất liệu</option>
                          <option value="Kiểu dáng">Kiểu dáng</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Giá trị</label>
                        <input
                          type="text"
                          placeholder="VD: S, M, L hoặc Đỏ, Xanh"
                          value={variant.value || ''}
                          onChange={(e) => updateVariant(idx, 'value', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">SKU riêng</label>
                        <input
                          type="text"
                          placeholder="VD: AT-NAM-001-M"
                          value={variant.sku || ''}
                          onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Tồn kho</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={variant.stock_quantity || ''}
                          onChange={(e) => updateVariant(idx, 'stock_quantity', Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Chênh lệch giá (VNĐ)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={variant.price_adjustment || ''}
                          onChange={(e) => updateVariant(idx, 'price_adjustment', Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Giá cuối: {((form.price || 0) + (variant.price_adjustment || 0)).toLocaleString()} VNĐ
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">URL ảnh riêng</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={variant.image_url || ''}
                          onChange={(e) => updateVariant(idx, 'image_url', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === SECTION 3: TRẠNG THÁI === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Trạng thái
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Radio */}
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái sản phẩm</label>
                <div className="space-y-2">
                  {[
                    { value: 'active', label: 'Hoạt động', color: 'green' },
                    { value: 'inactive', label: 'Không hoạt động', color: 'gray' },
                    { value: 'out_of_stock', label: 'Hết hàng', color: 'red' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${form.status === opt.value ? `border-${opt.color}-500 bg-${opt.color}-50` : 'border-gray-200 hover:border-primary'}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={form.status === opt.value}
                        onChange={(e) => update('status', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm font-medium mb-2">Hiển thị đặc biệt</label>
                <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured || false}
                    onChange={(e) => update('is_featured', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2 text-sm">
                      <Star size={16} className={form.is_featured ? 'text-amber-600 fill-amber-600' : ''} />
                      Sản phẩm nổi bật
                    </div>
                    <div className="text-xs text-muted-foreground">Ưu tiên trang chủ</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* === SECTION 4: HÌNH ẢNH === */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                Hình ảnh sản phẩm
              </h3>
              {(form.images || []).length > 0 && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {(form.images || []).length} ảnh
                </span>
              )}
            </div>

            {/* Upload */}
            <div className="mb-4">
              <label className="block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  disabled={uploadingImage}
                />
                <ImageIcon size={48} className="mx-auto mb-2 text-muted-foreground" />
                <div className="text-sm font-medium">
                  {uploadingImage ? 'Đang upload...' : 'Click để chọn ảnh'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF (Max 5MB)
                </div>
              </label>
            </div>

            {/* Image Grid */}
            {(form.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(form.images || []).map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.image_url}
                      alt={img.alt_text || ''}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = (form.images || []).filter((_, i) => i !== idx);
                        update('images', updatedImages);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {img.is_primary && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                        Chính
                      </span>
                    )}
                    <input
                      type="text"
                      placeholder="Alt text..."
                      value={img.alt_text || ''}
                      onChange={(e) => {
                        const updatedImages = [...(form.images || [])];
                        updatedImages[idx] = { ...updatedImages[idx], alt_text: e.target.value };
                        update('images', updatedImages);
                      }}
                      className="mt-1 w-full text-xs px-2 py-1 border rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === SECTION 5: SEO & TAGS === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag size={20} className="text-primary" />
              SEO & Tags
            </h3>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Thêm tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button type="button" onClick={addTag} size="sm">Thêm</Button>
              </div>
              {(form.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(form.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Meta fields - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Meta Title"
                placeholder="SEO title..."
                value={form.meta_title || ''}
                onChange={(e) => update('meta_title', e.target.value)}
                error={errors?.meta_title}
                helper="Tiêu đề Google"
              />
              <Textarea
                label="Meta Description"
                placeholder="SEO description..."
                rows={3}
                value={form.meta_description || ''}
                onChange={(e) => update('meta_description', e.target.value)}
                error={errors?.meta_description}
                helper="Mô tả Google"
              />
            </div>
          </div>

          {/* === SECTION 6: THÔNG SỐ VẬT LÝ === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Thông số vật lý</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Input
                  label="Cân nặng (g)"
                  type="number"
                  placeholder="0"
                  value={form.weight || ''}
                  onChange={(e) => update('weight', Number(e.target.value))}
                  error={errors?.weight}
                  min={0}
                  helper={form.weight > 0 ? `≈ ${(form.weight / 1000).toFixed(2)} kg` : ''}
                />
              </div>
              <div>
                <Input
                  label="Dài (cm)"
                  type="number"
                  placeholder="0"
                  value={form.length || ''}
                  onChange={(e) => update('length', Number(e.target.value))}
                  error={errors?.length}
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Rộng (cm)"
                  type="number"
                  placeholder="0"
                  value={form.width || ''}
                  onChange={(e) => update('width', Number(e.target.value))}
                  error={errors?.width}
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Cao (cm)"
                  type="number"
                  placeholder="0"
                  value={form.height || ''}
                  onChange={(e) => update('height', Number(e.target.value))}
                  error={errors?.height}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* === ACTION BUTTONS === */}
          <div className="flex justify-end gap-3 sticky bottom-0 bg-background p-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin-panel?tab=products')} type="button" disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
