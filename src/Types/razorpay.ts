declare interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id?: string;
    name: string;
    description: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string;
    };
  }
  
  declare interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  declare class Razorpay {
    constructor(options: RazorpayOptions);
    open(): void;
  }
  
  declare global {
    interface Window {
      Razorpay: typeof Razorpay;
    }
  }
  
  export {};
  