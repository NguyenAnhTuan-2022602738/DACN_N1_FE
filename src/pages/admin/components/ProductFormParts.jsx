import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { Package, DollarSign, Image as ImageIcon, X, Tag, Activity, Star } from 'lucide-react';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';

/**
 * ProductFormParts - All-in-one product form with beautiful sections
 * Tất cả sections trong 1 file, chia rõ ràng và đẹp
 */
const ProductFormParts = ({ form = {}, setForm, errors = {}, loading, onSave, onCancel, categories = [] }) => {
  const toast = useToast();
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // DEBUG: Check what we received
  console.log('🔍 ProductFormParts received:', { form, formType: typeof form, formIsNull: form === null });

  // Safety check - if form is null or undefined, use empty object
  if (!form || typeof form !== 'object') {
    console.error('❌ Invalid form prop:', form);
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Đang tải dữ liệu form...</p>
      </div>
    );
  }

  const update = (field, value) => {
    console.log('📝 update called:', { field, value, formBefore: form });
    setForm(prev => {
      console.log('📝 update setForm prev:', prev);
      return { ...prev, [field]: value };
    });
  };

  // Auto-generate slug
  const generateSlug = () => {
    console.log('🔤 generateSlug called, form.name:', form?.name);
    if (!form.name) return;
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    update('slug', slug);
  };

  // Image upload
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
        update('images', [
          ...currentImages,
          { image_url: url, alt_text: '', sort_order: currentImages.length, is_primary: currentImages.length === 0 }
        ]);
        toast.push({ title: 'Thành công', message: 'Upload ảnh OK', type: 'success' });
      }
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Upload thất bại', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Tags
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const currentTags = form.tags || [];
    if (currentTags.includes(trimmed)) return;
    update('tags', [...currentTags, trimmed]);
    setTagInput('');
  };

  const removeTag = (tag) => {
    update('tags', (form.tags || []).filter(t => t !== tag));
  };

  // Calculations - with null safety
  const discountPercent = (form && form.original_price > 0 && form.price > 0)
    ? Math.round(((form.original_price - form.price) / form.original_price) * 100)
    : 0;

  console.log('💰 Discount calculation:', { discountPercent, original: form?.original_price, price: form?.price });

  // FINAL safety check before rendering
  if (!form) {
    console.error('❌ Form is null right before render!');
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Lỗi: Form data is null</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); onSave(); }}>
      
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
              error={errors.name}
              required
            />
          </div>
          <div>
            <Input
              label="Slug (URL)"
              placeholder="ao-thun-nam-cotton"
              value={form.slug || ''}
              onChange={(e) => update('slug', e.target.value)}
              error={errors.slug}
              required
            />
            <button
              type="button"
              onClick={generateSlug}
              className="mt-1 text-sm text-primary hover:underline"
            >
              Tự động tạo từ tên
            </button>
          </div>
        </div>

        {/* SKU & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              label="SKU (mã sản phẩm)"
              placeholder="SP001"
              value={form.sku || ''}
              onChange={(e) => update('sku', e.target.value)}
              error={errors.sku}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id || ''}
              onChange={(e) => update('category_id', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
          </div>
        </div>

        {/* Descriptions */}
        <div className="mb-4">
          <Input
            label="Mô tả ngắn"
            placeholder="Mô tả ngắn gọn (tối đa 200 ký tự)"
            value={form.short_description || ''}
            onChange={(e) => update('short_description', e.target.value)}
            error={errors.short_description}
            maxLength={200}
            helper={`${(form.short_description || '').length}/200 ký tự`}
          />
        </div>
        <div>
          <Textarea
            label="Mô tả chi tiết"
            placeholder="Mô tả đầy đủ về sản phẩm..."
            value={form.description || ''}
            onChange={(e) => update('description', e.target.value)}
            error={errors.description}
            rows={5}
          />
        </div>
      </div>

      {/* === SECTION 2: GIÁ CẢ & TỒN KHO === */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-primary" />
          Giá & Tồn kho
        </h3>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Input
              label="Giá bán"
              type="number"
              placeholder="0"
              value={form.price || ''}
              onChange={(e) => update('price', Number(e.target.value))}
              error={errors.price}
              required
              min={0}
              helper="Giá khách thanh toán"
            />
          </div>
          <div>
            <Input
              label="Giá gốc (trước giảm)"
              type="number"
              placeholder="0"
              value={form.original_price || ''}
              onChange={(e) => update('original_price', Number(e.target.value))}
              error={errors.original_price}
              min={0}
            />
            {discountPercent > 0 && (
              <div className="mt-1 text-sm text-green-600 font-medium">
                Giảm {discountPercent}%
              </div>
            )}
          </div>
          <div>
            <Input
              label="Giá vốn"
              type="number"
              placeholder="0"
              value={form.cost_price || ''}
              onChange={(e) => update('cost_price', Number(e.target.value))}
              error={errors.cost_price}
              min={0}
              helper="Giá nhập hàng"
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
              error={errors.stock_quantity}
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
              error={errors.min_stock_level}
              min={0}
              helper="Cảnh báo khi dưới mức này"
            />
          </div>
        </div>

        {/* Stock Status */}
        {form && form.stock_quantity !== undefined && (
          <div className={`mt-4 p-3 rounded ${form.stock_quantity <= 0 ? 'bg-red-50 text-red-700' : form.stock_quantity <= (form.min_stock_level || 5) ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
            <div className="font-medium">
              {form.stock_quantity <= 0 ? '🔴 Hết hàng' : form.stock_quantity <= (form.min_stock_level || 5) ? '⚠️ Sắp hết hàng' : '✅ Còn hàng'}
            </div>
            <div className="text-sm">Tồn kho: {form.stock_quantity || 0} sản phẩm</div>
          </div>
        )}
      </div>

      {/* === SECTION 3: TRẠNG THÁI & TÍNH NĂNG === */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Trạng thái
        </h3>

        {/* Status Radio */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Trạng thái sản phẩm</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'active', label: 'Đang bán', color: 'green' },
              { value: 'inactive', label: 'Ngừng bán', color: 'gray' },
              { value: 'out_of_stock', label: 'Hết hàng', color: 'red' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${form.status === opt.value ? `border-${opt.color}-500 bg-${opt.color}-50` : 'border-gray-200 hover:border-primary'}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={form.status === opt.value}
                  onChange={(e) => update('status', e.target.value)}
                  className="w-4 h-4"
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured || false}
            onChange={(e) => update('is_featured', e.target.checked)}
            className="w-5 h-5"
          />
          <div className="flex-1">
            <div className="font-medium flex items-center gap-2">
              <Star size={16} className={form.is_featured ? 'text-amber-600 fill-amber-600' : ''} />
              Sản phẩm nổi bật
            </div>
            <div className="text-sm text-muted-foreground">Hiển thị ưu tiên trên trang chủ</div>
          </div>
        </label>
      </div>

      {/* === SECTION 4: HÌNH ẢNH === */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ImageIcon size={20} className="text-primary" />
          Hình ảnh sản phẩm
        </h3>

        {/* Upload Button */}
        <div className="mb-4">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={uploadingImage}
            />
            {uploadingImage ? 'Đang tải...' : 'Tải ảnh lên'}
          </label>
          <span className="ml-3 text-sm text-muted-foreground">Max 5MB</span>
        </div>

        {/* Images Grid */}
        {(form.images || []).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(form.images || []).map((img, idx) => (
              <div key={idx} className="relative border rounded-lg overflow-hidden group">
                <img
                  src={img.image_url}
                  alt={img.alt_text || `Image ${idx + 1}`}
                  className="w-full h-32 object-cover"
                />
                {img.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Ảnh chính
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const updatedImages = (form.images || []).filter((_, i) => i !== idx);
                    updatedImages.forEach((img, i) => {
                      img.sort_order = i;
                      if (i === 0 && !updatedImages.some(im => im.is_primary)) img.is_primary = true;
                    });
                    update('images', updatedImages);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
                <div className="p-2 bg-white">
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={img.alt_text || ''}
                    onChange={(e) => {
                      const updatedImages = [...(form.images || [])];
                      updatedImages[idx] = { ...updatedImages[idx], alt_text: e.target.value };
                      update('images', updatedImages);
                    }}
                    className="w-full text-xs px-2 py-1 border rounded"
                  />
                </div>
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
            <Input
              placeholder="Nhập tag và nhấn Thêm"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            />
            <Button type="button" onClick={addTag}>Thêm</Button>
          </div>
          {(form.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag, idx) => (
                <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meta SEO */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Input
              label="Tiêu đề SEO (Meta Title)"
              placeholder="Tiêu đề hiển thị trên Google"
              value={form.meta_title || ''}
              onChange={(e) => update('meta_title', e.target.value)}
              error={errors.meta_title}
              maxLength={60}
              helper={`${(form.meta_title || '').length}/60 ký tự`}
            />
          </div>
          <div>
            <Textarea
              label="Mô tả SEO (Meta Description)"
              placeholder="Mô tả hiển thị trên Google"
              value={form.meta_description || ''}
              onChange={(e) => update('meta_description', e.target.value)}
              error={errors.meta_description}
              rows={3}
              maxLength={160}
              helper={`${(form.meta_description || '').length}/160 ký tự`}
            />
          </div>
        </div>
      </div>

      {/* === SECTION 6: THUỘC TÍNH VẬT LÝ === */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Thuộc tính vật lý</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Cân nặng (gam)"
              type="number"
              placeholder="0"
              value={form?.weight || ''}
              onChange={(e) => update('weight', Number(e.target.value))}
              error={errors.weight}
              min={0}
              helper={form && form.weight > 0 ? `≈ ${(form.weight / 1000).toFixed(2)} kg` : ''}
            />
          </div>
          <div>
            <Input
              label="Kích thước (D×R×C)"
              placeholder="VD: 20×30×10 cm"
              value={form.dimensions || ''}
              onChange={(e) => update('dimensions', e.target.value)}
              error={errors.dimensions}
              helper="Dài × Rộng × Cao (cm)"
            />
          </div>
        </div>
      </div>

      {/* === ACTION BUTTONS === */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-background p-4 border-t">
        <Button variant="outline" onClick={onCancel} type="button" disabled={loading}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </Button>
      </div>
    </form>
  );
};

export default ProductFormParts;
