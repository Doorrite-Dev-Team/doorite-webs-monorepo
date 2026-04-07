// src/components/signup/types.ts
export interface FormValues {
  businessName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: {
    country: string;
    state: string;
    address: string;
  };
  category: string[];
  logo?: string | null;
  openingTime: string;
  closingTime: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
}
