import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux'
import { removeItem, updateQuantity, clearCart, saveForLater, moveToCart, removeSavedItem } from '../../store/slices/cartSlice'
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import SavedForLater from './components/SavedForLater';
import CheckoutModal from './components/CheckoutModal';
import EmptyCart from './components/EmptyCart';
import { useToast } from '../../components/ui/ToastProvider';

const ShoppingCart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartItems)
  const savedItems = useSelector(state => state.cart.savedItems)
  const [couponCode, setCouponCode] = useState('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    const subtotal = (cartItems || [])?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0) || 0;
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const tax = Math.round(subtotal * 0.1);
    const discount = couponCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
  }, [cartItems, couponCode]);

  // Cart actions
  const handleUpdateQuantity = (itemId, newQuantity) => dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
  const handleRemoveItem = (itemId) => dispatch(removeItem(itemId))
  const handleSaveForLater = (itemId) => dispatch(saveForLater(itemId))
  const handleMoveToWishlist = (itemId) => {
    // wishlist logic placeholder
    dispatch(removeItem(itemId))
  }
  const handleMoveToCart = (itemId) => dispatch(moveToCart(itemId))
  const handleRemoveSavedItem = (itemId) => dispatch(removeSavedItem(itemId))

  const handleMoveToWishlistFromSaved = (itemId) => {
    console.log('Moved to wishlist from saved:', itemId);
    handleRemoveSavedItem(itemId);
  };

  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    // Mock coupon validation
    if (code === 'WELCOME10') {
      // Show success message
      console.log('Coupon applied successfully');
    } else {
      // Show error message
      console.log('Invalid coupon code');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handlePlaceOrder = async (orderData) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Order placed:', orderData)
    dispatch(clearCart())
    setIsLoading(false)
  toast.push({ title: 'Đặt hàng thành công', message: 'Cảm ơn bạn đã mua sắm tại ABC Fashion Store.', type: 'success' })
  }

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      dispatch(clearCart())
  toast.push({ title: 'Đã xóa', message: 'Giỏ hàng đã được làm mới.', type: 'info' })
    }
  }

  const toast = useToast();

  return (
    <>
      <Helmet>
        <title>Giỏ hàng - ABC Fashion Store</title>
        <meta name="description" content="Xem và quản lý giỏ hàng của bạn tại ABC Fashion Store. Thanh toán an toàn với nhiều phương thức thanh toán." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-muted-foreground">
                  {cartItems?.length > 0 
                    ? `${cartItems?.length} sản phẩm trong giỏ hàng`
                    : 'Chưa có sản phẩm nào trong giỏ hàng'
                  }
                </p>
              </div>
              
              {cartItems?.length > 0 && (
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                    <span className="ml-2">Xóa tất cả</span>
                  </Button>
                </div>
              )}
            </div>

            {cartItems?.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems?.map((item) => (
                    <CartItem
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}

                  {/* Continue Shopping */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => window.history?.back()}
                    >
                      <Icon name="ArrowLeft" size={16} />
                      <span className="ml-2">Tiếp tục mua sắm</span>
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Shield" size={16} />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <OrderSummary
                    subtotal={orderSummary?.subtotal}
                    shipping={orderSummary?.shipping}
                    tax={orderSummary?.tax}
                    discount={orderSummary?.discount}
                    total={orderSummary?.total}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onApplyCoupon={handleApplyCoupon}
                    onProceedToCheckout={handleProceedToCheckout}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems?.length > 0 && (
              <div className="mt-12">
                <SavedForLater
                  items={savedItems}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemoveSavedItem}
                  onMoveToWishlist={handleMoveToWishlistFromSaved}
                />
              </div>
            )}

            {/* Benefits Section */}
            {cartItems?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Truck" size={24} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Miễn phí vận chuyển</h3>
                    <p className="text-sm text-muted-foreground">Cho đơn hàng từ 500.000 VND</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="RotateCcw" size={24} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Đổi trả miễn phí</h3>
                    <p className="text-sm text-muted-foreground">Trong vòng 30 ngày</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Shield" size={24} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Thanh toán an toàn</h3>
                    <p className="text-sm text-muted-foreground">Bảo mật SSL 256-bit</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cartItems={cartItems}
          orderSummary={orderSummary}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </>
  );
};

export default ShoppingCart;