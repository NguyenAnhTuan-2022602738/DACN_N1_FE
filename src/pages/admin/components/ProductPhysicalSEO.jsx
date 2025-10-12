import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { Weight, Ruler, Tag, FileText, X } from 'lucide-react';

/**
 * ProductPhysicalSEO - Physical properties and SEO section
 * Fields: weight, dimensions, tags, meta_title, meta_description
 */
const ProductPhysicalSEO = ({ form = {}, onChange, errors = {} }) => {
  const [tagInput, setTagInput] = useState('');
  
  const update = (field, value) => onChange(field, value);

  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    
    const currentTags = form.tags || [];
    if (currentTags.includes(trimmed)) {
      return; // Already exists
    }
    
    update('tags', [...currentTags, trimmed]);
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    const currentTags = form.tags || [];
    update('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // SEO score calculation
  const calculateSEOScore = () => {
    let score = 0;
    let max = 100;
    
    // Meta title (30 points)
    if (form.meta_title) {
      const titleLength = form.meta_title.length;
      if (titleLength >= 30 && titleLength <= 60) score += 30;
      else if (titleLength > 0) score += 15;
    }
    
    // Meta description (30 points)
    if (form.meta_description) {
      const descLength = form.meta_description.length;
      if (descLength >= 120 && descLength <= 160) score += 30;
      else if (descLength > 0) score += 15;
    }
    
    // Tags (20 points)
    const tagCount = (form.tags || []).length;
    if (tagCount >= 3 && tagCount <= 10) score += 20;
    else if (tagCount > 0) score += 10;
    
    // Product name (10 points)
    if (form.name && form.name.length >= 10) score += 10;
    
    // Description (10 points)
    if (form.description && form.description.length >= 100) score += 10;
    
    return { score, max };
  };

  const seoScore = calculateSEOScore();
  const scorePercent = Math.round((seoScore.score / seoScore.max) * 100);
  const scoreColor = scorePercent >= 80 ? 'text-green-600' : scorePercent >= 50 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = scorePercent >= 80 ? 'bg-green-50' : scorePercent >= 50 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <Ruler size={20} className="text-primary" />
        <h3 className="text-lg font-semibold">Thuộc tính & SEO</h3>
      </div>

      {/* Physical Properties */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Weight size={16} />
          Thuộc tính vật lý
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <Input
              label="Cân nặng (gam)"
              type="number"
              placeholder="0"
              value={form.weight || ''}
              onChange={(e) => update('weight', Number(e.target.value))}
              error={errors.weight}
              helper="Dùng để tính phí vận chuyển"
              min={0}
            />
            {form.weight > 0 && (
              <div className="mt-1 text-sm text-muted-foreground">
                ≈ {(form.weight / 1000).toFixed(2)} kg
              </div>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <Input
              label="Kích thước (D×R×C)"
              type="text"
              placeholder="VD: 20×30×10 cm"
              value={form.dimensions || ''}
              onChange={(e) => update('dimensions', e.target.value)}
              error={errors.dimensions}
              helper="Dài × Rộng × Cao (cm)"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <div className="font-medium mb-1">📦 Lưu ý về vận chuyển:</div>
          <ul className="space-y-0.5 ml-4">
            <li>• Cân nặng và kích thước ảnh hưởng đến phí ship</li>
            <li>• Sản phẩm nhỏ gọn thường được ưu đãi phí</li>
            <li>• Nhập chính xác để tránh phát sinh phí</li>
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Tag size={16} />
          Thẻ (Tags)
        </h4>

        {/* Tag Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Nhập thẻ và Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagKeyPress}
            helper="VD: áo thun, nam, cotton"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Thêm
          </button>
        </div>

        {/* Tag List */}
        {form.tags && form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                <Tag size={14} />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {(!form.tags || form.tags.length === 0) && (
          <div className="text-sm text-muted-foreground italic">
            Chưa có thẻ nào. Thêm thẻ để tăng khả năng tìm kiếm.
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Số thẻ:</span> {(form.tags || []).length}
          <span className="ml-3 text-yellow-600">
            {(form.tags || []).length < 3 && '⚠️ Nên có ít nhất 3 thẻ'}
            {(form.tags || []).length > 10 && '⚠️ Quá nhiều thẻ (> 10)'}
          </span>
        </div>
      </div>

      {/* SEO Meta */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2">
            <FileText size={16} />
            Tối ưu SEO
          </h4>
          
          {/* SEO Score */}
          <div className={`${scoreBg} px-3 py-1 rounded-full`}>
            <span className={`${scoreColor} font-semibold`}>
              Điểm SEO: {scorePercent}%
            </span>
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <Input
            label="Tiêu đề SEO (Meta Title)"
            type="text"
            placeholder="VD: Áo Thun Nam Cotton Cao Cấp - ABC Fashion Store"
            value={form.meta_title || ''}
            onChange={(e) => update('meta_title', e.target.value)}
            error={errors.meta_title}
            helper="Hiển thị trên kết quả tìm kiếm Google"
            maxLength={60}
          />
          <div className="mt-1 text-sm">
            <span className={form.meta_title?.length >= 30 && form.meta_title?.length <= 60 ? 'text-green-600' : 'text-muted-foreground'}>
              {form.meta_title?.length || 0}/60 ký tự
            </span>
            <span className="ml-2 text-muted-foreground">
              (Tốt nhất: 30-60 ký tự)
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <Textarea
            label="Mô tả SEO (Meta Description)"
            placeholder="VD: Áo thun nam cotton 100% cao cấp, form regular fit thoải mái. Chất liệu thấm hút tốt, đa dạng màu sắc. Giao hàng toàn quốc."
            value={form.meta_description || ''}
            onChange={(e) => update('meta_description', e.target.value)}
            error={errors.meta_description}
            helper="Hiển thị dưới tiêu đề trên Google"
            rows={3}
            maxLength={160}
          />
          <div className="mt-1 text-sm">
            <span className={form.meta_description?.length >= 120 && form.meta_description?.length <= 160 ? 'text-green-600' : 'text-muted-foreground'}>
              {form.meta_description?.length || 0}/160 ký tự
            </span>
            <span className="ml-2 text-muted-foreground">
              (Tốt nhất: 120-160 ký tự)
            </span>
          </div>
        </div>

        {/* SEO Preview */}
        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-2">Xem trước trên Google:</div>
          <div className="space-y-1">
            <div className="text-blue-600 text-lg font-medium">
              {form.meta_title || form.name || 'Tên sản phẩm'}
            </div>
            <div className="text-green-700 text-xs">
              https://abc-fashion.com/products/{form.slug || 'san-pham'}
            </div>
            <div className="text-sm text-muted-foreground">
              {form.meta_description || form.short_description || 'Mô tả sản phẩm sẽ hiển thị ở đây...'}
            </div>
          </div>
        </div>

        {/* SEO Checklist */}
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
          <div className="font-semibold text-green-900 mb-2">✅ Checklist SEO:</div>
          <ul className="space-y-1 text-green-800">
            <li className={form.meta_title?.length >= 30 && form.meta_title?.length <= 60 ? '' : 'opacity-50'}>
              {form.meta_title?.length >= 30 && form.meta_title?.length <= 60 ? '✓' : '○'} Tiêu đề 30-60 ký tự
            </li>
            <li className={form.meta_description?.length >= 120 && form.meta_description?.length <= 160 ? '' : 'opacity-50'}>
              {form.meta_description?.length >= 120 && form.meta_description?.length <= 160 ? '✓' : '○'} Mô tả 120-160 ký tự
            </li>
            <li className={(form.tags || []).length >= 3 ? '' : 'opacity-50'}>
              {(form.tags || []).length >= 3 ? '✓' : '○'} Có ít nhất 3 thẻ
            </li>
            <li className={form.name?.length >= 10 ? '' : 'opacity-50'}>
              {form.name?.length >= 10 ? '✓' : '○'} Tên sản phẩm rõ ràng
            </li>
            <li className={form.description?.length >= 100 ? '' : 'opacity-50'}>
              {form.description?.length >= 100 ? '✓' : '○'} Mô tả chi tiết đầy đủ
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Mẹo SEO:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Tiêu đề nên có từ khóa chính sản phẩm</li>
          <li>• Mô tả nên hấp dẫn để tăng tỷ lệ click</li>
          <li>• Thẻ giúp khách hàng tìm thấy sản phẩm dễ hơn</li>
          <li>• SEO tốt giúp sản phẩm lên top Google</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductPhysicalSEO;
