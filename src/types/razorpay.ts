export interface RazorpayOptions {
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
    modal?: {
      ondismiss?: () => void;
    };
  }


  export interface RazorpayFailureResponse {
    error: {
      code: string;
      description: string;
      source: string;
      step: string;
      reason: string;
      metadata: {
        order_id: string;
        payment_id: string;
      };
    };
  }
  
  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    tutorId: string; 
     amount: number; 
     creditedBy: string;
  }

  export interface RazorpayInstance {
    open(): void;
    on(event: "payment.failed", callback: (response: RazorpayFailureResponse) => void): void;
    
  }
  
  export class Razorpay {
    private razorpayInstance: RazorpayInstance;
  
    constructor(options: RazorpayOptions) {
      
      this.razorpayInstance = new window.Razorpay(options);
    }
  
    open(): void {
      this.razorpayInstance.open();
    }

    on(event: "payment.failed", callback: (response: RazorpayFailureResponse) => void): void {
      this.razorpayInstance.on(event, callback); 
    }
  }
  
  declare global {
    interface Window {
      Razorpay: typeof Razorpay;
    }
  }
  
  export {};
  