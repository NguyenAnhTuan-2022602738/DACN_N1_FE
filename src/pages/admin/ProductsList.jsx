import React, { useEffect, useState } from 'react';
import API from '../../lib/api';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useToast } from '../../components/ui/ToastProvider';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/ui/ConfirmModal';

const ProductsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/api/products');
        if (mounted) setItems(res?.data?.products || []);
      } catch (e) {
        toast.push({ title: 'Lỗi', message: 'Không tải được danh sách sản phẩm', type: 'error' });
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/products/${deleteId}`);
      setItems(prev => prev.filter(p => p._id !== deleteId));
      toast.push({ title: 'Đã xóa', message: 'Sản phẩm đã được xóa', type: 'success' });
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể xóa sản phẩm', type: 'error' });
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
        <Link to="/admin/products/new"><Button>Thêm sản phẩm</Button></Link>
      </div>
      {loading ? <p>Đang tải...</p> : (
        <div className="space-y-3">
          {items.map(p => (
            <div key={p._id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">SKU: {p.sku} • Giá: {p.salePrice}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/admin/products/${p._id}`}><Button variant="outline" size="sm">Sửa</Button></Link>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p._id)}>Xóa</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xóa sản phẩm?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default ProductsList;
