import React from "react";
import * as z from "zod";
import { ConfigSchema, DocumentSchema } from "@/lib/validation/document-schema";
import { Signature } from "@/components/elements/signature";
import { PageNumber } from "@/components/elements/page-number";
import { cn } from "@/lib/utils";

const Footer = React.forwardRef<
  HTMLDivElement,
  {
    config: z.infer<typeof ConfigSchema>;
    number: number;
    className?: string;
  }
>(function Footer({ config, number, className }, ref) {
  const showBrand = config.brand.showBrand;
  const showNumbers = config.pageNumber.showNumbers;

  if (!showBrand && !showNumbers) {
    return <div ref={ref} />;
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-row justify-between items-center", className)}
    >
      {showBrand ? <Signature config={config} /> : <div />}
      {showNumbers && <PageNumber config={config} number={number} />}
    </div>
  );
});

export default Footer;
