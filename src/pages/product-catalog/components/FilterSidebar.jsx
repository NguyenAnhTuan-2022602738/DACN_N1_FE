import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: false,
    color: false,
    brand: false,
    material: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleFilterChange = (filterType, value, checked) => {
    onFilterChange(filterType, value, checked);
  };

  const priceRanges = [
    { label: 'Dưới 500.000 VND', value: '0-500000' },
    { label: '500.000 - 1.000.000 VND', value: '500000-1000000' },
    { label: '1.000.000 - 2.000.000 VND', value: '1000000-2000000' },
    { label: '2.000.000 - 5.000.000 VND', value: '2000000-5000000' },
    { label: 'Trên 5.000.000 VND', value: '5000000-999999999' }
  ];

  const categories = [
    { label: 'Áo sơ mi', value: 'shirts' },
    { label: 'Quần jeans', value: 'jeans' },
    { label: 'Váy', value: 'dresses' },
    { label: 'Áo khoác', value: 'jackets' },
    { label: 'Giày dép', value: 'shoes' },
    { label: 'Phụ kiện', value: 'accessories' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Đen', value: 'black', color: '#000000' },
    { name: 'Trắng', value: 'white', color: '#FFFFFF' },
    { name: 'Xám', value: 'gray', color: '#6B7280' },
    { name: 'Xanh navy', value: 'navy', color: '#1E3A8A' },
    { name: 'Đỏ', value: 'red', color: '#DC2626' },
    { name: 'Hồng', value: 'pink', color: '#EC4899' }
  ];

  const brands = ['Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas', 'Local Brand'];
  const materials = ['Cotton', 'Polyester', 'Denim', 'Silk', 'Wool', 'Linen'];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-accent transition-smooth"
      >
        <span>{title}</span>
        <Icon 
          name={expandedSections?.[sectionKey] ? "ChevronUp" : "ChevronDown"} 
          size={16} 
        />
      </button>
      {expandedSections?.[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-full
        bg-background border-r lg:border-r-0 border-border
        transform transition-transform duration-300 z-50 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Bộ lọc</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-accent hover:text-accent/80"
              >
                Xóa tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {Object.values(filters)?.some(filterArray => filterArray?.length > 0) && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Bộ lọc đang áp dụng:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters)?.map(([filterType, values]) =>
                  values?.map(value => (
                    <span
                      key={`${filterType}-${value}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {value}
                      <button
                        onClick={() => handleFilterChange(filterType, value, false)}
                        className="hover:text-accent/80"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <FilterSection title="Danh mục" sectionKey="category">
            {categories?.map(category => (
              <Checkbox
                key={category?.value}
                label={category?.label}
                checked={filters?.category?.includes(category?.value)}
                onChange={(e) => handleFilterChange('category', category?.value, e?.target?.checked)}
              />
            ))}
          </FilterSection>

          {/* Price Filter */}
          <FilterSection title="Khoảng giá" sectionKey="price">
            {priceRanges?.map(range => (
              <Checkbox
                key={range?.value}
                label={range?.label}
                checked={filters?.price?.includes(range?.value)}
                onChange={(e) => handleFilterChange('price', range?.value, e?.target?.checked)}
              />
            ))}
          </FilterSection>

          {/* Size Filter */}
          <FilterSection title="Kích thước" sectionKey="size">
            <div className="grid grid-cols-3 gap-2">
              {sizes?.map(size => (
                <button
                  key={size}
                  onClick={() => handleFilterChange('size', size, !filters?.size?.includes(size))}
                  className={`
                    px-3 py-2 text-sm border rounded-lg transition-smooth
                    ${filters?.size?.includes(size)
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-background text-foreground border-border hover:border-accent'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Color Filter */}
          <FilterSection title="Màu sắc" sectionKey="color">
            <div className="grid grid-cols-4 gap-2">
              {colors?.map(color => (
                <button
                  key={color?.value}
                  onClick={() => handleFilterChange('color', color?.value, !filters?.color?.includes(color?.value))}
                  className={`
                    relative w-10 h-10 rounded-full border-2 transition-smooth
                    ${filters?.color?.includes(color?.value)
                      ? 'border-accent shadow-lg'
                      : 'border-border hover:border-accent'
                    }
                  `}
                  style={{ backgroundColor: color?.color }}
                  title={color?.name}
                >
                  {filters?.color?.includes(color?.value) && (
                    <Icon 
                      name="Check" 
                      size={16} 
                      className={`absolute inset-0 m-auto ${color?.value === 'white' ? 'text-black' : 'text-white'}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Brand Filter */}
          <FilterSection title="Thương hiệu" sectionKey="brand">
            {brands?.map(brand => (
              <Checkbox
                key={brand}
                label={brand}
                checked={filters?.brand?.includes(brand)}
                onChange={(e) => handleFilterChange('brand', brand, e?.target?.checked)}
              />
            ))}
          </FilterSection>

          {/* Material Filter */}
          <FilterSection title="Chất liệu" sectionKey="material">
            {materials?.map(material => (
              <Checkbox
                key={material}
                label={material}
                checked={filters?.material?.includes(material)}
                onChange={(e) => handleFilterChange('material', material, e?.target?.checked)}
              />
            ))}
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;