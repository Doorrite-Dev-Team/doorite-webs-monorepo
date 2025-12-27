// src/components/signup/types.ts
export interface FormValues {
  businessName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: [string, string];
  category: string[];
  logo?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}
