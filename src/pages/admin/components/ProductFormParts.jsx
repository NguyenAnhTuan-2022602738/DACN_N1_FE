import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Toggle from '../../../components/ui/Toggle';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';

const TagInput = ({ value = [], onChange }) => {
  const [text, setText] = useState('');
  const add = () => { if (!text) return; onChange([...value, text.trim()]); setText(''); };
  return (
    <div>
      <div className="flex space-x-2 mb-2">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Nhập tag và nhấn Thêm" />
        <Button onClick={add}>Thêm</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <div key={i} className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2">
            <span>{t}</span>
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-xs text-red-500">x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageUploader = ({ images = [], onChange }) => {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      // upload to server endpoint that proxies to Cloudinary
      const res = await API.post('/api/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res?.data?.url;
      if (url) onChange([...images, url]);
    } catch (e) {
      console.error('Image upload failed', e);
      toast.push({ title: 'Lỗi', message: 'Upload ảnh thất bại', type: 'error' });
    } finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer inline-flex items-center px-3 py-2 border rounded bg-white text-sm">
          <input type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          Tải ảnh lên
        </label>
        {uploading && <div className="text-sm text-muted">Đang tải...</div>}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((src, idx) => (
          <div key={idx} className="relative border rounded overflow-hidden h-28">
            <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
            <button onClick={() => onChange(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600">x</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const VariantsEditor = ({ variants = [], onChange }) => {
  const addVariant = () => onChange([...(variants || []), { sku: '', attributes: {}, price: 0, originalPrice: 0, stock: 0, images: [] }]);
  const update = (i, v) => onChange(variants.map((it, idx) => idx === i ? { ...it, ...v } : it));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">Variants</h4>
        <Button size="sm" onClick={addVariant}>Thêm variant</Button>
      </div>
      <div className="space-y-3">
        {(variants || []).map((v, i) => (
          <div key={i} className="p-3 border rounded">
            <Input label="SKU" value={v.sku} onChange={e => update(i, { sku: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Giá bán" type="number" value={v.price} onChange={e => update(i, { price: Number(e.target.value) })} />
              <Input label="Giá gốc" type="number" value={v.originalPrice} onChange={e => update(i, { originalPrice: Number(e.target.value) })} />
            </div>
            <Input label="Stock" type="number" value={v.stock} onChange={e => update(i, { stock: Number(e.target.value) })} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductFormParts = ({ form, setForm, errors = {}, loading, onSave, onCancel }) => {
  const toast = useToast();

  const update = (path, v) => setForm(prev => ({ ...prev, [path]: v }));

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); onSave(); }}>
      {/* General */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="Tên sản phẩm" value={form.name} onChange={e => update('name', e.target.value)} error={errors?.name} />
      <Input label="SKU" value={form.sku} onChange={e => update('sku', e.target.value)} error={errors?.sku} />
      <Input label="Slug" value={form.slug} onChange={e => update('slug', e.target.value)} error={errors?.slug} />
      <Input label="Thương hiệu" value={form.brand} onChange={e => update('brand', e.target.value)} error={errors?.brand} />
    </div>

      <div>
        <Textarea label="Mô tả" value={form.description} onChange={e => update('description', e.target.value)} error={errors?.description} />
      </div>

      {/* Pricing & Stock */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input label="Giá bán" value={form.price} onChange={e => update('price', e.target.value)} error={errors?.price} />
      <Input label="Giá gốc" value={form.original_price} onChange={e => update('original_price', e.target.value)} error={errors?.original_price} />
      <Input label="Giá vốn" value={form.cost_price} onChange={e => update('cost_price', e.target.value)} error={errors?.cost_price} />
      <Input label="Số lượng" value={form.stock_quantity} onChange={e => update('stock_quantity', e.target.value)} error={errors?.stock_quantity} />
    </div>

      {/* Media */}
      <div>
        <h4 className="font-medium mb-2">Hình ảnh</h4>
      <ImageUploader images={form.images} onChange={imgs => update('images', imgs)} />
      {errors?.images && <p className="text-sm text-destructive mt-2">{errors.images}</p>}
      </div>

      {/* Variants */}
      <div>
        <VariantsEditor variants={form.variants || []} onChange={v => update('variants', v)} />
        {errors?.variants && <p className="text-sm text-destructive mt-2">{errors.variants}</p>}
      </div>

      {/* Tags & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Tags</label>
          <TagInput value={form.tags || []} onChange={v => update('tags', v)} />
          {errors?.tags && <p className="text-sm text-destructive mt-1">{errors.tags}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Tính năng (features)</label>
          <TagInput value={form.features || []} onChange={v => update('features', v)} />
          {errors?.features && <p className="text-sm text-destructive mt-1">{errors.features}</p>}
        </div>
      </div>

      {/* SEO */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">SEO</h4>
        <Input label="Tiêu đề SEO" value={form.seo?.title || form.meta_title || ''} onChange={e => update('meta_title', e.target.value)} error={errors?.meta_title} />
        <Input label="Mô tả SEO" value={form.seo?.description || form.meta_description || ''} onChange={e => update('meta_description', e.target.value)} error={errors?.meta_description} />
        <Input label="Từ khóa (comma separated)" value={(form.seo?.keywords||[]).join(',') || ''} onChange={e => update('meta_keywords', e.target.value)} />
      </div>

      {/* Logistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Cân nặng (g)" type="number" value={form.weight} onChange={e => update('weight', e.target.value)} error={errors?.weight} />
        <Input label="Phí vận chuyển" type="number" value={form.shippingCost} onChange={e => update('shippingCost', e.target.value)} />
        <Input label="Mã hàng/ Vendor" value={form.vendor} onChange={e => update('vendor', e.target.value)} error={errors?.vendor} />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
      </div>
    </form>
  );
};

export default ProductFormParts;
