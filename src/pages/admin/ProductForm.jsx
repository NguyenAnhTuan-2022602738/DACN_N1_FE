import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import ProductFormParts from './components/ProductFormParts';

const emptyTemplate = {
   sku: '', name: '', slug: '', short_description: '', description: '', category_id: '',
   price: 0, original_price: 0, cost_price: 0, stock_quantity: 0, min_stock_level: 5,
   weight: 0, dimensions: '', status: 'active', is_featured: false,
   tags: [], meta_title: '', meta_description: '', created_by: '', vendor: '',
   images: [], variants: [], rating: 0, review_count: 0
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(!!id);
  const [form, setForm] = useState(emptyTemplate);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        if (!mounted) return;
        const p = res?.data?.product || res?.data;
        if (p) {
          setForm({
          sku: p.sku || '', name: p.name || '', slug: p.slug || '', short_description: p.short_description || '', description: p.description || '', category_id: p.category_id || '',
          price: p.price || 0, original_price: p.original_price || 0, cost_price: p.cost_price || 0, stock_quantity: p.stock_quantity || 0, min_stock_level: p.min_stock_level || 5,
          weight: p.weight || 0, dimensions: p.dimensions || '', status: p.status || 'active', is_featured: !!p.is_featured,
          tags: p.tags || [], meta_title: p.meta_title || '', meta_description: p.meta_description || '', created_by: p.created_by || '', vendor: p.vendor || '',
          images: p.images || [], variants: p.variants || [], rating: p.rating || 0, review_count: p.review_count || 0
          });
        }
      } catch (e) {
        toast.push({ title: 'Lỗi', message: 'Không tải được sản phẩm', type: 'error' });
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleSave = async (payload) => {
    setLoading(true);
    try {
      const toSend = { ...payload };
    toSend.price = Number(toSend.price || 0);
    toSend.original_price = Number(toSend.original_price || 0);
    toSend.cost_price = Number(toSend.cost_price || 0);
    toSend.stock_quantity = Number(toSend.stock_quantity || 0);
    toSend.min_stock_level = Number(toSend.min_stock_level || 5);
    toSend.weight = Number(toSend.weight || 0);
    // dimensions stored as string in this schema
    toSend.dimensions = toSend.dimensions || '';
    toSend.is_featured = !!toSend.is_featured;

      // clear previous errors
      setErrors(null);
      if (id) {
        await API.put(`/api/products/${id}`, toSend);
        toast.push({ title: 'Cập nhật', message: 'Sản phẩm đã được cập nhật', type: 'success' });
      } else {
        await API.post('/api/products', toSend);
        toast.push({ title: 'Tạo', message: 'Sản phẩm mới đã được tạo', type: 'success' });
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Save product error:', err?.response?.data || err);
      const data = err?.response?.data;
      // If server returns validation errors in data.errors (object keyed by field) use it
      if (data && data.errors && typeof data.errors === 'object') {
        setErrors(data.errors);
      }
      toast.push({ title: 'Lỗi', message: data?.message || 'Không thể lưu sản phẩm', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">{id ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h2>
      <ProductFormParts
        form={form}
        setForm={setForm}
        errors={errors}
        loading={loading}
        onSave={() => handleSave(form)}
        onCancel={() => navigate('/admin/products')}
      />
    </div>
  );
};

export default ProductForm;
