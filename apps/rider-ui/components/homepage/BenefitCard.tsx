"use client";

import { ReactNode } from "react";

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="bg-white md:bg-gray-900 md:text-white shadow rounded-xl p-6 hover:shadow-lg transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm md:text-gray-300">{description}</p>
    </div>
  );
}
