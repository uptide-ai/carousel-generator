import React from "react";
import * as z from "zod";
import { ConfigSchema } from "@/lib/validation/document-schema";
import { Signature } from "@/components/elements/signature";
import { PageNumber } from "@/components/elements/page-number";
import { BrandTemplate } from "@/lib/validation/brand-schema";
import { fontIdToClassName } from "@/lib/fonts-map";
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
  const template = config.brand.template ?? BrandTemplate.enum.FooterFull;

  const brandInFooter =
    showBrand &&
    (template === BrandTemplate.enum.FooterFull ||
      template === BrandTemplate.enum.FooterHandle);

  if (!brandInFooter && !showNumbers) {
    return <div ref={ref} />;
  }

  if (template === BrandTemplate.enum.FooterHandle && brandInFooter) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-row justify-center items-center relative",
          className
        )}
      >
        <p
          className={cn(
            "text-sm font-normal",
            fontIdToClassName(config.fonts.font2)
          )}
          style={{ color: config.theme.secondary }}
        >
          {config.brand.handle}
        </p>
        {showNumbers && (
          <div className="absolute right-0">
            <PageNumber config={config} number={number} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-row justify-between items-center", className)}
    >
      {brandInFooter ? <Signature config={config} /> : <div />}
      {showNumbers && <PageNumber config={config} number={number} />}
    </div>
  );
});

export default Footer;
