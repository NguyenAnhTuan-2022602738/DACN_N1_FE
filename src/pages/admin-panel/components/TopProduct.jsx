import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TopProducts = () => {
  const topProducts = [
    {
      id: 1,
      name: "Áo thun nam basic",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      sales: 156,
      revenue: "7.800.000",
      growth: "+12%",
      category: "Áo nam"
    },
    {
      id: 2,
      name: "Quần jeans nữ skinny",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
      sales: 134,
      revenue: "6.700.000",
      growth: "+8%",
      category: "Quần nữ"
    },
    {
      id: 3,
      name: "Váy maxi hoa",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      sales: 98,
      revenue: "4.900.000",
      growth: "+15%",
      category: "Váy"
    },
    {
      id: 4,
      name: "Áo sơ mi trắng",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      sales: 87,
      revenue: "4.350.000",
      growth: "+5%",
      category: "Áo nữ"
    },
    {
      id: 5,
      name: "Giày sneaker trắng",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      sales: 76,
      revenue: "3.800.000",
      growth: "+20%",
      category: "Giày"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Sản phẩm bán chạy</h3>
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-smooth">
            Xem tất cả
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {topProducts?.map((product, index) => (
            <div key={product?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-smooth">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-bold">
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image 
                  src={product?.image} 
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground truncate">{product?.name}</h4>
                    <p className="text-sm text-muted-foreground">{product?.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{product?.revenue} VND</p>
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-sm text-muted-foreground">{product?.sales} bán</span>
                      <div className="flex items-center text-success">
                        <Icon name="TrendingUp" size={12} />
                        <span className="text-xs ml-1">{product?.growth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;