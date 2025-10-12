import React from 'react';
import Input from '../../../components/ui/Input';
import { Activity, Star, TrendingUp, Tag as TagIcon } from 'lucide-react';

/**
 * ProductStatusCategory - Status, featured flag, category, and ratings
 * Fields: status, is_featured, category_id, rating, review_count
 */
const ProductStatusCategory = ({ form = {}, onChange, errors = {}, categories = [] }) => {
  const update = (field, value) => onChange(field, value);

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Đang bán', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300', icon: '✓' },
    { value: 'inactive', label: 'Ngừng bán', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-300', icon: '○' },
    { value: 'out_of_stock', label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300', icon: '✕' },
  ];

  const currentStatus = statusOptions.find(opt => opt.value === form.status) || statusOptions[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <Activity size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Trạng thái & Phân loại</h3>
      </div>

      {/* Status Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Activity size={16} />
          Trạng thái sản phẩm
        </h4>

        {/* Status Radio Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${form.status === option.value 
                  ? `${option.border} ${option.bg}` 
                  : 'border-border bg-background hover:border-primary/30'
                }
              `}
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={form.status === option.value}
                onChange={(e) => update('status', e.target.value)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className={`font-medium ${form.status === option.value ? option.color : ''}`}>
                  {option.icon} {option.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {option.value === 'active' && 'Hiển thị trên website'}
                  {option.value === 'inactive' && 'Ẩn khỏi website'}
                  {option.value === 'out_of_stock' && 'Tạm hết, không bán'}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Current Status Display */}
        <div className={`${currentStatus.bg} border ${currentStatus.border} rounded-lg p-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="font-medium">Trạng thái hiện tại:</span>
            <span className={`${currentStatus.color} font-semibold`}>
              {currentStatus.icon} {currentStatus.label}
            </span>
          </div>
          {form.status === 'active' && (
            <span className="text-sm text-green-700">🟢 Đang hoạt động</span>
          )}
          {form.status === 'inactive' && (
            <span className="text-sm text-gray-700">⚪ Tạm ngừng</span>
          )}
          {form.status === 'out_of_stock' && (
            <span className="text-sm text-red-700">🔴 Không khả dụng</span>
          )}
        </div>

        {/* Auto Status Notes */}
        {form.stock_quantity === 0 && form.status !== 'out_of_stock' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ <strong>Lưu ý:</strong> Tồn kho = 0 nhưng trạng thái không phải "Hết hàng". 
            Nên chuyển sang "Hết hàng" để tránh nhầm lẫn.
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Star size={16} />
          Sản phẩm nổi bật
        </h4>

        <label className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
          <input
            type="checkbox"
            checked={form.is_featured || false}
            onChange={(e) => update('is_featured', e.target.checked)}
            className="w-5 h-5"
          />
          <div className="flex-1">
            <div className="font-medium flex items-center gap-2">
              <Star size={16} className={form.is_featured ? 'text-amber-600 fill-amber-600' : 'text-muted-foreground'} />
              <span>Đánh dấu là sản phẩm nổi bật</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Sản phẩm nổi bật sẽ hiển thị ở vị trí ưu tiên trên trang chủ và trang danh mục
            </div>
          </div>
        </label>

        {form.is_featured && (
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
            ⭐ Sản phẩm này sẽ được ưu tiên hiển thị cho khách hàng
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <TagIcon size={16} />
          Danh mục sản phẩm
        </h4>

        <div>
          <label className="block text-sm font-medium mb-2">
            Chọn danh mục <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category_id || ''}
            onChange={(e) => update('category_id', e.target.value)}
            className={`
              w-full px-4 py-2 rounded-lg border
              ${errors.category_id ? 'border-red-500' : 'border-border'}
              focus:outline-none focus:ring-2 focus:ring-primary/50
            `}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>
          )}
          <div className="text-sm text-muted-foreground mt-1">
            Chọn danh mục phù hợp để khách hàng dễ tìm kiếm
          </div>
        </div>

        {/* Category Info */}
        {form.category_id && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <div className="flex items-center gap-2 text-blue-900">
              <TagIcon size={14} />
              <span className="font-medium">Danh mục đã chọn:</span>
              <span className="font-semibold">
                {categories.find(c => (c._id || c.id) === form.category_id)?.name || 'N/A'}
              </span>
            </div>
          </div>
        )}

        {!form.category_id && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Vui lòng chọn danh mục cho sản phẩm
          </div>
        )}
      </div>

      {/* Ratings Section (Read-only display) */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <TrendingUp size={16} />
          Đánh giá & Hiệu suất
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rating - Read only (calculated by reviews) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Đánh giá trung bình
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold">
                {form.rating ? form.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Tự động tính từ đánh giá khách hàng
            </div>
          </div>

          {/* Review Count - Read only */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Số lượt đánh giá
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="text-2xl font-bold">
                {form.review_count || 0}
              </span>
              <span className="text-muted-foreground">đánh giá</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Tăng khi khách hàng đánh giá sản phẩm
            </div>
          </div>
        </div>

        {/* Rating Display */}
        {form.rating > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-800">
                {form.rating >= 4.5 && '⭐⭐⭐⭐⭐ Xuất sắc!'}
                {form.rating >= 4 && form.rating < 4.5 && '⭐⭐⭐⭐ Rất tốt!'}
                {form.rating >= 3 && form.rating < 4 && '⭐⭐⭐ Tốt'}
                {form.rating >= 2 && form.rating < 3 && '⭐⭐ Trung bình'}
                {form.rating < 2 && '⭐ Cần cải thiện'}
              </span>
              <span className="font-medium text-green-900">
                {form.review_count} người đã đánh giá
              </span>
            </div>
          </div>
        )}

        {!form.rating && (
          <div className="bg-muted/50 border rounded p-3 text-sm text-muted-foreground text-center">
            Chưa có đánh giá nào. Khuyến khích khách hàng đánh giá sau khi mua!
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📊 Tóm tắt trạng thái:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Trạng thái</div>
            <div className={`font-semibold ${currentStatus.color}`}>
              {currentStatus.label}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Nổi bật</div>
            <div className="font-semibold">
              {form.is_featured ? '⭐ Có' : '○ Không'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Đánh giá</div>
            <div className="font-semibold">
              {form.rating ? `${form.rating.toFixed(1)} ⭐` : 'Chưa có'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Lượt đánh giá</div>
            <div className="font-semibold">
              {form.review_count || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Chỉ sản phẩm "Đang bán" mới hiển thị trên website</li>
          <li>• Sản phẩm nổi bật giúp tăng doanh số</li>
          <li>• Chọn đúng danh mục giúp SEO tốt hơn</li>
          <li>• Đánh giá cao (≥4.5⭐) tăng uy tín shop</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductStatusCategory;
