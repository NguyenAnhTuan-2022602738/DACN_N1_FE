import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CheckoutModal = ({ isOpen, onClose, cartItems, orderSummary, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [isGuest, setIsGuest] = useState(false);
  const [formData, setFormData] = useState({
    // Guest/Login info
    email: '',
    password: '',
    createAccount: false,
    
    // Shipping info
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    
    // Payment info
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Additional
    deliveryNotes: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const cities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' }
  ];

  const paymentMethods = [
    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'momo', label: 'Ví MoMo' },
    { value: 'zalopay', label: 'ZaloPay' },
    { value: 'vnpay', label: 'VNPay' },
    { value: 'credit', label: 'Thẻ tín dụng/ghi nợ' },
    { value: 'banking', label: 'Chuyển khoản ngân hàng' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      await onPlaceOrder(formData);
      onClose();
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-lg shadow-elegant max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">Thanh toán</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3]?.map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      step > stepNum ? 'bg-accent' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Login/Guest */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Thông tin tài khoản
                  </h3>
                  <p className="text-muted-foreground">
                    Đăng nhập hoặc tiếp tục với tư cách khách
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant={!isGuest ? "default" : "outline"}
                    onClick={() => setIsGuest(false)}
                    className="flex-1"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant={isGuest ? "default" : "outline"}
                    onClick={() => setIsGuest(true)}
                    className="flex-1"
                  >
                    Khách hàng
                  </Button>
                </div>

                {!isGuest ? (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      placeholder="Nhập email của bạn"
                      required
                    />
                    <Input
                      label="Mật khẩu"
                      type="password"
                      value={formData?.password}
                      onChange={(e) => handleInputChange('password', e?.target?.value)}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <div className="text-center">
                      <Button variant="link" size="sm">
                        Quên mật khẩu?
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      placeholder="Nhập email để nhận thông tin đơn hàng"
                      required
                    />
                    <Checkbox
                      label="Tạo tài khoản để theo dõi đơn hàng dễ dàng hơn"
                      checked={formData?.createAccount}
                      onChange={(e) => handleInputChange('createAccount', e?.target?.checked)}
                    />
                  </div>
                )}

                <Button onClick={handleNextStep} fullWidth>
                  Tiếp tục
                </Button>
              </div>
            )}

            {/* Step 2: Shipping Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Thông tin giao hàng
                  </h3>
                  <p className="text-muted-foreground">
                    Nhập địa chỉ để chúng tôi giao hàng cho bạn
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    value={formData?.fullName}
                    onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                    placeholder="Nhập họ và tên"
                    required
                  />
                  <Input
                    label="Số điện thoại"
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <Input
                  label="Địa chỉ"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  placeholder="Số nhà, tên đường"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Tỉnh/Thành phố"
                    options={cities}
                    value={formData?.city}
                    onChange={(value) => handleInputChange('city', value)}
                    placeholder="Chọn tỉnh/thành"
                    required
                  />
                  <Input
                    label="Quận/Huyện"
                    value={formData?.district}
                    onChange={(e) => handleInputChange('district', e?.target?.value)}
                    placeholder="Nhập quận/huyện"
                    required
                  />
                  <Input
                    label="Phường/Xã"
                    value={formData?.ward}
                    onChange={(e) => handleInputChange('ward', e?.target?.value)}
                    placeholder="Nhập phường/xã"
                    required
                  />
                </div>

                <Input
                  label="Ghi chú giao hàng (tùy chọn)"
                  value={formData?.deliveryNotes}
                  onChange={(e) => handleInputChange('deliveryNotes', e?.target?.value)}
                  placeholder="Ví dụ: Giao hàng giờ hành chính"
                />

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                    Quay lại
                  </Button>
                  <Button onClick={handleNextStep} className="flex-1">
                    Tiếp tục
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Phương thức thanh toán
                  </h3>
                  <p className="text-muted-foreground">
                    Chọn cách thức thanh toán phù hợp với bạn
                  </p>
                </div>

                <Select
                  label="Phương thức thanh toán"
                  options={paymentMethods}
                  value={formData?.paymentMethod}
                  onChange={(value) => handleInputChange('paymentMethod', value)}
                  placeholder="Chọn phương thức thanh toán"
                  required
                />

                {formData?.paymentMethod === 'credit' && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <Input
                      label="Số thẻ"
                      value={formData?.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Ngày hết hạn"
                        value={formData?.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                        placeholder="MM/YY"
                        required
                      />
                      <Input
                        label="CVV"
                        value={formData?.cvv}
                        onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                    <Input
                      label="Tên trên thẻ"
                      value={formData?.cardName}
                      onChange={(e) => handleInputChange('cardName', e?.target?.value)}
                      placeholder="NGUYEN VAN A"
                      required
                    />
                  </div>
                )}

                <Checkbox
                  label="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"
                  checked={formData?.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e?.target?.checked)}
                  required
                />

                <div className="flex gap-4">
                  <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="flex-1"
                    disabled={!formData?.agreeTerms || isLoading}
                    loading={isLoading}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80 bg-muted/30 border-l border-border p-6 overflow-y-auto">
            <h4 className="font-semibold text-foreground mb-4">Đơn hàng của bạn</h4>
            
            <div className="space-y-3 mb-6">
              {cartItems?.slice(0, 3)?.map((item) => (
                <div key={item?.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded bg-background overflow-hidden flex-shrink-0">
                    <img src={item?.image} alt={item?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item?.color} • Size {item?.size} • SL: {item?.quantity}
                    </p>
                    <p className="text-sm font-medium text-accent">{formatPrice(item?.price * item?.quantity)}</p>
                  </div>
                </div>
              ))}
              {cartItems?.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{cartItems?.length - 3} sản phẩm khác
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-foreground">{formatPrice(orderSummary?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="text-foreground">
                  {orderSummary?.shipping === 0 ? 'Miễn phí' : formatPrice(orderSummary?.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế</span>
                <span className="text-foreground">{formatPrice(orderSummary?.tax)}</span>
              </div>
              {orderSummary?.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Giảm giá</span>
                  <span className="text-success">-{formatPrice(orderSummary?.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t border-border pt-2">
                <span className="text-foreground">Tổng cộng</span>
                <span className="text-accent">{formatPrice(orderSummary?.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;