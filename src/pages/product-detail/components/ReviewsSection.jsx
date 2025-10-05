import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewsSection = ({ reviews, averageRating, totalReviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const filteredReviews = reviews?.filter(review => {
    if (filterRating === 'all') return true;
    return review?.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Đánh giá sản phẩm ({totalReviews})
        </h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={i < Math.floor(averageRating) ? 'text-accent fill-accent' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Dựa trên {totalReviews} đánh giá
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground w-8">
                  {rating} sao
                </span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-smooth"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution?.[rating] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {ratingDistribution?.[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Đánh giá cao nhất</option>
              <option value="lowest">Đánh giá thấp nhất</option>
            </select>
          </div>

          <Button variant="outline" size="sm" iconName="PenTool" iconPosition="left">
            Viết đánh giá
          </Button>
        </div>
      </div>
      {/* Reviews List */}
      <div className="divide-y divide-border">
        {sortedReviews?.map((review) => (
          <div key={review?.id} className="p-6">
            <div className="flex items-start space-x-4">
              <Image
                src={review?.avatar}
                alt={review?.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review?.userName}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < review?.rating ? 'text-accent fill-accent' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                      {review?.verified && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-foreground mb-3 leading-relaxed">
                  {review?.comment}
                </p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Size and Color Info */}
                {(review?.size || review?.color) && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    {review?.size && <span>Kích thước: {review?.size}</span>}
                    {review?.color && <span>Màu sắc: {review?.color}</span>}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Hữu ích ({review?.helpful})</span>
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      {sortedReviews?.length < totalReviews && (
        <div className="p-6 text-center border-t border-border">
          <Button variant="outline">
            Xem thêm đánh giá
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;