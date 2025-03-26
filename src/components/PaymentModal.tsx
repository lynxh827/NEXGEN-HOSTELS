
import { useState, useEffect } from 'react';
import { Check, CreditCard, Phone, AlertTriangle, Loader2, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBooking } from '@/contexts/BookingContext';
import { Booking, PaymentResponse } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPaymentComplete: (response: PaymentResponse) => void;
}

// These would typically come from environment variables in a real application
const MPESA_API_ENDPOINTS = {
  stkPush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  queryStatus: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
};

const MPESA_CONFIG = {
  shortCode: '174379',
  passKey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  callbackUrl: 'https://example.com/callback',
  consumerKey: 'your-consumer-key', // Would come from env in real app
  consumerSecret: 'your-consumer-secret' // Would come from env in real app
};

const PaymentModal = ({ isOpen, onClose, booking, onPaymentComplete }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mpesaCode, setMpesaCode] = useState<string>('');
  const [mpesaPrompt, setMpesaPrompt] = useState<boolean>(false);
  const [stkPushSent, setStkPushSent] = useState<boolean>(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const { toast } = useToast();
  
  const { processPayment, sendPaymentReminder } = useBooking();

  // Validate phone number in Kenyan format
  const validatePhoneNumber = (phone: string): boolean => {
    // Accept format: 07XXXXXXXX, 01XXXXXXXX, or +254XXXXXXXXX
    const kenyanRegex = /^(?:(?:\+254)|(?:0))(7|1)\d{8}$/;
    return kenyanRegex.test(phone);
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === 'mpesa') {
      if (mpesaPrompt) {
        if (!mpesaCode.trim() || mpesaCode.length < 6) {
          setValidationError('Please enter a valid M-Pesa confirmation code');
          return false;
        }
      } else {
        if (!phoneNumber.trim()) {
          setValidationError('Please enter a phone number');
          return false;
        }
        
        if (!validatePhoneNumber(phoneNumber)) {
          setValidationError('Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)');
          return false;
        }
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
        setValidationError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
        setValidationError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!cvc.trim() || !/^\d{3}$/.test(cvc)) {
        setValidationError('Please enter a valid 3-digit CVC');
        return false;
      }
    }
    
    setValidationError(null);
    return true;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Handle +254 prefix
    if (phone.startsWith('+254')) {
      return digitsOnly;
    }
    
    // Handle 0 prefix (convert to 254)
    if (phone.startsWith('0')) {
      return '254' + digitsOnly.substring(1);
    }
    
    return digitsOnly;
  };

  const generateMpesaTimestamp = (): string => {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  };

  const generateMpesaPassword = (): string => {
    const timestamp = generateMpesaTimestamp();
    const str = MPESA_CONFIG.shortCode + MPESA_CONFIG.passKey + timestamp;
    return btoa(str);
  };

  const handleMpesaRequest = async () => {
    if (!booking) return;
    
    if (!validatePayment()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Simulate M-Pesa STK Push API call
      const response = await initiateSTKPush(formattedPhone, booking.amount);
      
      if (response.success) {
        setCheckoutRequestId(response.checkoutRequestId || '');
        
        toast({
          title: "M-Pesa Payment Request Sent",
          description: `A payment prompt has been sent to ${phoneNumber}. Please check your phone and enter your M-Pesa PIN.`,
        });
        
        setStkPushSent(true);
        
        // In a real implementation, you would poll the M-Pesa API to check the status
        // For this demo, we'll just set a timeout to simulate the flow
        setTimeout(() => {
          setMpesaPrompt(true);
        }, 8000);
      } else {
        setValidationError(response.message || 'Failed to send M-Pesa request. Please try again.');
      }
    } catch (error) {
      console.error('M-Pesa request error:', error);
      setValidationError('Failed to connect to M-Pesa. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const initiateSTKPush = async (phone: string, amount: number): Promise<{
    success: boolean; 
    message?: string;
    checkoutRequestId?: string;
  }> => {
    // In a real implementation, you would make an actual API call to M-Pesa
    // This is a simulation for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() < 0.95) {
          console.log(`[M-Pesa STK Push] Initiated for phone: ${phone}, amount: ${amount}`);
          
          // Generate a mock checkout request ID
          const checkoutRequestId = 'ws_CO_' + Date.now().toString() + Math.floor(Math.random() * 1000);
          
          resolve({ 
            success: true,
            message: 'STK Push sent successfully',
            checkoutRequestId: checkoutRequestId
          });
        } else {
          resolve({ 
            success: false, 
            message: 'M-Pesa service is temporarily unavailable. Please try again later.'
          });
        }
      }, 3000);
    });
  };

  const checkSTKPushStatus = async (checkoutRequestId: string): Promise<{
    success: boolean;
    message?: string;
    resultCode?: string;
  }> => {
    // In a real implementation, this would query the M-Pesa API
    // This is a simulation for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() < 0.9) {
          resolve({
            success: true,
            resultCode: '0', // 0 = success in M-Pesa
            message: 'The service request has been accepted successfully'
          });
        } else {
          resolve({
            success: false,
            resultCode: '1032', // Example M-Pesa error code
            message: 'Request cancelled by user'
          });
        }
      }, 2000);
    });
  };

  const handlePayment = async () => {
    if (!booking) return;
    
    if (!validatePayment()) {
      return;
    }
    
    setLoading(true);
    try {
      // For M-Pesa with confirmation code, verify the transaction status first
      if (paymentMethod === 'mpesa' && mpesaPrompt && checkoutRequestId) {
        const statusCheck = await checkSTKPushStatus(checkoutRequestId);
        if (!statusCheck.success) {
          setValidationError(statusCheck.message || 'M-Pesa transaction verification failed');
          setLoading(false);
          return;
        }
      }
      
      const paymentDetails = {
        method: paymentMethod,
        mpesaCode: mpesaCode || undefined,
        phoneNumber: phoneNumber || undefined,
        cardNumber: cardNumber || undefined,
        expiry: expiry || undefined,
        cvc: cvc || undefined,
        stk_pushed: stkPushSent,
        checkoutRequestId: checkoutRequestId || undefined
      };
      
      const response = await processPayment(booking.id, paymentDetails);
      
      if (response.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment of KSh ${booking.amount.toLocaleString()} has been processed successfully.`,
        });
        onPaymentComplete(response);
      } else {
        setValidationError(response.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setValidationError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!booking) return;
    
    try {
      await sendPaymentReminder(booking.id);
      toast({
        title: "Reminder Sent",
        description: "A payment reminder has been sent to the student.",
      });
    } catch (error) {
      console.error('Reminder error:', error);
      toast({
        title: "Error",
        description: "Failed to send payment reminder.",
        variant: "destructive"
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setExpiry(value);
  };

  // Reset error when phone number changes
  useEffect(() => {
    if (validationError && validationError.includes('phone number')) {
      setValidationError(null);
    }
  }, [phoneNumber]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] animate-in slide-in-from-bottom-10 duration-300">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select a payment method to complete your booking.
          </DialogDescription>
        </DialogHeader>
        
        {!mpesaPrompt ? (
          <>
            <Tabs defaultValue="mpesa" onValueChange={(value) => setPaymentMethod(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mpesa" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  M-Pesa
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mpesa" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="0712345678 or +254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the phone number that will receive the M-Pesa payment request
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="py-4">
              <div className="flex justify-between items-center py-2 border-t border-b">
                <span className="font-medium">Amount</span>
                <span className="font-bold">
                  KSh {booking?.amount.toLocaleString() || '-'}
                </span>
              </div>
            </div>
            
            {validationError && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-800">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{validationError}</p>
              </div>
            )}
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              
              {booking?.paymentStatus === 'pending' && (
                <Button 
                  variant="outline" 
                  onClick={handleSendReminder}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Bell className="h-4 w-4" />
                  Send Reminder
                </Button>
              )}
              
              {paymentMethod === 'mpesa' ? (
                <Button 
                  onClick={handleMpesaRequest} 
                  disabled={loading || stkPushSent}
                  className="bg-nexgen-600 hover:bg-nexgen-700 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : stkPushSent ? (
                    <>
                      <Check className="h-4 w-4" />
                      STK Push Sent
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4" />
                      Send M-Pesa Request
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="bg-nexgen-600 hover:bg-nexgen-700 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="mpesaCode">M-Pesa Confirmation Code</Label>
              <Input
                id="mpesaCode"
                placeholder="Enter code from your phone"
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter the confirmation code you received after completing the M-Pesa payment
              </p>
            </div>
            
            {validationError && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-800">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{validationError}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setMpesaPrompt(false)} disabled={loading}>
                Back
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={loading}
                className="bg-nexgen-600 hover:bg-nexgen-700 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
