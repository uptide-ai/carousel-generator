import React from "react";
import * as z from "zod";
import { ConfigSchema } from "@/lib/validation/document-schema";
import Footer from "../elements/footer";
import { cn } from "@/lib/utils";
import { CommonSlideSchema } from "@/lib/validation/slide-schema";
import { BackgroundLayer } from "@/components/elements/background-layer";
import { BackgroundImageLayer } from "@/components/elements/background-image-layer";
import { PageBase } from "@/components/pages/page-base";
import { Title } from "@/components/elements/title";
import { Subtitle } from "@/components/elements/subtitle";
import { Description } from "@/components/elements/description";
import {
  ElementArrayFieldPath,
  ElementFieldPath,
  SlideFieldPath,
  TextFieldPath,
} from "@/lib/document-form-types";
import { PageFrame } from "@/components/pages/page-frame";
import { PageLayout } from "@/components/pages/page-layout";
import { AddElement } from "@/components/pages/add-element";
import { ElementType } from "@/lib/validation/element-type";
import { ContentImage, ContentImageFillLayer } from "@/components/elements/content-image";
import ElementMenubarWrapper from "@/components/element-menubar-wrapper";
import { ObjectFitType, ContentImageSchema } from "@/lib/validation/image-schema";
import { XTwitter } from "@/components/elements/x-twitter";
import { TweetBlock } from "@/components/elements/tweet-block";
import { BrandTemplate } from "@/lib/validation/brand-schema";

export function CommonPage({
  index,
  config,
  slide,
  size,
  fieldName,
  className,
}: {
  index: number;
  config: z.infer<typeof ConfigSchema>;
  slide: z.infer<typeof CommonSlideSchema>;
  size: { width: number; height: number };
  fieldName: SlideFieldPath;
  className?: string;
}) {
  const backgroundImageField = fieldName + ".backgroundImage";

  const firstElement = slide.elements[0];
  const lastElement = slide.elements[slide.elements.length - 1];
  const firstIsExpand =
    firstElement?.type === ElementType.enum.ContentImage &&
    (firstElement as z.infer<typeof ContentImageSchema>).style.objectFit === ObjectFitType.enum.Expand;
  const lastIsExpand =
    lastElement?.type === ElementType.enum.ContentImage &&
    (lastElement as z.infer<typeof ContentImageSchema>).style.objectFit === ObjectFitType.enum.Expand;

  const brandTemplate = config.brand.template ?? BrandTemplate.enum.FooterHandle;
  const showBrandTweetAtTop =
    config.brand.showBrand && brandTemplate === BrandTemplate.enum.Tweet;
  // FooterHandle is rendered absolutely at the bottom of the slide so it
  // does NOT steal grid space from the centered content.
  const isFooterHandleFloating =
    brandTemplate === BrandTemplate.enum.FooterHandle &&
    config.brand.showBrand;

  return (
    <PageBase size={size} fieldName={backgroundImageField}>
      <BackgroundLayer background={slide.backgroundColor || config.theme.background} className="-z-20" />
      {slide.backgroundImage?.source.src ? (
        <BackgroundImageLayer image={slide.backgroundImage} className="-z-10" />
      ) : null}
      {slide.elements.map((element, idx) =>
        element.type == ElementType.enum.ContentImage ? (
          <ContentImageFillLayer
            key={`fill-${idx}`}
            fieldName={`${fieldName}.elements.${idx}` as ElementFieldPath}
          />
        ) : null
      )}
      <PageFrame
        fieldName={backgroundImageField}
        className={cn(className)}
        style={{
          paddingTop: firstIsExpand ? 0 : `${config.theme.padding ?? 30}px`,
          paddingBottom: lastIsExpand ? 0 : `${config.theme.padding ?? 30}px`,
          paddingLeft: `${config.theme.padding ?? 30}px`,
          paddingRight: `${config.theme.padding ?? 30}px`,
          ...(lastIsExpand || isFooterHandleFloating
            ? { gridTemplateRows: "1fr" }
            : {}),
        }}
      >
        <PageLayout
          fieldName={backgroundImageField}
          className={cn("gap-2", firstIsExpand && "justify-start")}
        >
          {showBrandTweetAtTop && (
            <div className="w-full mb-2">
              <TweetBlock
                config={config}
                name={config.brand.name}
                handle={config.brand.handle}
                avatar={config.brand.avatar}
              />
            </div>
          )}
          {slide.elements.map((element, index) => {
            const currentField = (fieldName +
              ".elements." +
              index) as ElementFieldPath;
            return element.type == ElementType.enum.Title ? (
              <ElementMenubarWrapper
                key={currentField}
                fieldName={currentField}
              >
                <Title fieldName={currentField as TextFieldPath} />
              </ElementMenubarWrapper>
            ) : element.type == ElementType.enum.Subtitle ? (
              <ElementMenubarWrapper
                key={currentField}
                fieldName={currentField}
              >
                <Subtitle fieldName={currentField as TextFieldPath} />
              </ElementMenubarWrapper>
            ) : element.type == ElementType.enum.Description ? (
              <ElementMenubarWrapper
                key={currentField}
                fieldName={currentField}
              >
                <Description fieldName={currentField as TextFieldPath} />
              </ElementMenubarWrapper>
            ) : element.type == ElementType.enum.ContentImage ? (
              <ElementMenubarWrapper
                key={currentField}
                fieldName={currentField}
                style={
                  element.style.objectFit === ObjectFitType.enum.Expand
                    ? {
                        marginLeft: `-${config.theme.padding ?? 30}px`,
                        marginRight: `-${config.theme.padding ?? 30}px`,
                        width: `calc(100% + ${(config.theme.padding ?? 30) * 2}px)`,
                        ...(index < slide.elements.length - 1 ? { marginBottom: "12px" } : {}),
                        ...(index === slide.elements.length - 1 ? { flexGrow: 1 } : {}),
                      }
                    : undefined
                }
              >
                <ContentImage
                  fieldName={currentField as ElementFieldPath}
                  isFirst={index === 0}
                  isLast={index === slide.elements.length - 1}
                />
              </ElementMenubarWrapper>
            ) : element.type == ElementType.enum.XTwitter ? (
              <ElementMenubarWrapper
                key={currentField}
                fieldName={currentField}
              >
                <XTwitter fieldName={currentField as ElementFieldPath} />
              </ElementMenubarWrapper>
            ) : null;
          })}
        </PageLayout>
        {!isFooterHandleFloating && (
          <div>
            {!lastIsExpand && (
              <Footer number={index + 1} config={config} />
            )}
          </div>
        )}
      </PageFrame>
      {isFooterHandleFloating && (
        <div
          className="absolute left-0 right-0 bottom-4 pointer-events-none"
          style={{
            paddingLeft: `${config.theme.padding ?? 30}px`,
            paddingRight: `${config.theme.padding ?? 30}px`,
          }}
        >
          <Footer number={index + 1} config={config} />
        </div>
      )}
      <AddElement
        fieldName={(fieldName + ".elements") as ElementArrayFieldPath}
        className="absolute bottom-3 right-3 z-10"
      />
    </PageBase>
  );
}
