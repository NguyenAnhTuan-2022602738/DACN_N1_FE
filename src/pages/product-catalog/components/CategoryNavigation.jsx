import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryNavigation = ({ activeCategory, onCategoryChange }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const mainCategories = [
    { id: 'all', name: 'Tất cả', icon: 'Grid3X3', count: 1250 },
    { id: 'men', name: 'Nam', icon: 'User', count: 450 },
    { id: 'women', name: 'Nữ', icon: 'UserCheck', count: 520 },
    { id: 'kids', name: 'Trẻ em', icon: 'Baby', count: 180 },
    { id: 'accessories', name: 'Phụ kiện', icon: 'Watch', count: 100 }
  ];

  const subCategories = {
    men: [
      { id: 'men-shirts', name: 'Áo sơ mi', count: 85 },
      { id: 'men-tshirts', name: 'Áo thun', count: 120 },
      { id: 'men-jeans', name: 'Quần jeans', count: 95 },
      { id: 'men-suits', name: 'Vest & Suit', count: 45 },
      { id: 'men-shoes', name: 'Giày dép', count: 105 }
    ],
    women: [
      { id: 'women-dresses', name: 'Váy', count: 140 },
      { id: 'women-tops', name: 'Áo', count: 160 },
      { id: 'women-bottoms', name: 'Quần', count: 120 },
      { id: 'women-shoes', name: 'Giày dép', count: 100 },
      { id: 'women-bags', name: 'Túi xách', count: 80 }
    ],
    kids: [
      { id: 'kids-boys', name: 'Bé trai', count: 90 },
      { id: 'kids-girls', name: 'Bé gái', count: 90 }
    ],
    accessories: [
      { id: 'acc-jewelry', name: 'Trang sức', count: 35 },
      { id: 'acc-watches', name: 'Đồng hồ', count: 25 },
      { id: 'acc-belts', name: 'Thắt lưng', count: 20 },
      { id: 'acc-hats', name: 'Mũ nón', count: 20 }
    ]
  };

  const allCategories = [
    ...mainCategories,
    ...Object.values(subCategories)?.flat()
  ];

  const displayCategories = showAllCategories ? allCategories : mainCategories;

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
  };

  const getActiveCategory = () => {
    return allCategories?.find(cat => cat?.id === activeCategory) || mainCategories?.[0];
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Category Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {displayCategories?.map((category) => (
              <Button
                key={category?.id}
                variant={activeCategory === category?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleCategoryClick(category?.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Icon name={category?.icon || 'Tag'} size={16} />
                <span>{category?.name}</span>
                <span className="text-xs opacity-75">({category?.count})</span>
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center space-x-1 ml-4"
          >
            <span className="hidden sm:inline">
              {showAllCategories ? 'Thu gọn' : 'Xem thêm'}
            </span>
            <Icon 
              name={showAllCategories ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 pb-4 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick('all')}
            className="text-muted-foreground hover:text-accent p-0 h-auto"
          >
            Trang chủ
          </Button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">
            {getActiveCategory()?.name}
          </span>
        </div>

        {/* Sub-categories for active main category */}
        {subCategories?.[activeCategory] && (
          <div className="pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Danh mục con:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {subCategories?.[activeCategory]?.map((subCategory) => (
                <Button
                  key={subCategory?.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryClick(subCategory?.id)}
                  className="text-xs"
                >
                  {subCategory?.name}
                  <span className="ml-1 opacity-75">({subCategory?.count})</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex items-center justify-between py-3 border-t border-border">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Lọc nhanh:</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Icon name="Zap" size={14} className="mr-1" />
                Giảm giá
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Icon name="Star" size={14} className="mr-1" />
                Đánh giá cao
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Icon name="Clock" size={14} className="mr-1" />
                Mới nhất
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Icon name="TrendingUp" size={14} className="mr-1" />
                Bán chạy
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Package" size={16} />
            <span>
              {getActiveCategory()?.count} sản phẩm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;