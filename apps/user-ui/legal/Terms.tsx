//legal/terms.tsx
"use client";

import { MdxClientWrapper } from "@/components/global/MdxClientWrapper";
import TermsContent from "@/legal/term.mdx";
// import * as React from 'react';

const Terms = () => {
  return <MdxClientWrapper content={TermsContent} />;
};

export default Terms;
