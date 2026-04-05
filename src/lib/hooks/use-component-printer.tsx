import React from "react";
import { useReactToPrint } from "react-to-print";
import { SIZE } from "@/lib/page-size";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { toCanvas } from "html-to-image";
import { Options as HtmlToImageOptions } from "html-to-image/lib/types";
import { jsPDF, jsPDFOptions } from "jspdf";
import JSZip from "jszip";

type HtmlToPdfOptions = {
  margin: [number, number, number, number];
  filename: string;
  image: { type: string; quality: number };
  htmlToImage: HtmlToImageOptions;
  jsPDF: jsPDFOptions;
};

// Convert units to px using the conversion value 'k' from jsPDF.
export const toPx = function toPx(val: number, k: number) {
  return Math.floor(((val * k) / 72) * 96);
};

function getPdfPageSize(opt: HtmlToPdfOptions) {
  // @ts-ignore function not explicitly exported
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  if (!pageSize.hasOwnProperty("inner")) {
    pageSize.inner = {
      width: pageSize.width - opt.margin[1] - opt.margin[3],
      height: pageSize.height - opt.margin[0] - opt.margin[2],
    };
    pageSize.inner.px = {
      width: toPx(pageSize.inner.width, pageSize.k),
      height: toPx(pageSize.inner.height, pageSize.k),
    };
    pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
  }

  return pageSize;
}

function canvasToPdf(canvas: HTMLCanvasElement, opt: HtmlToPdfOptions) {
  const pdfPageSize = getPdfPageSize(opt);

  var pxFullHeight = canvas.height;
  var pxPageHeight = Math.floor(canvas.width * pdfPageSize.inner.ratio);
  var nPages = Math.ceil(pxFullHeight / pxPageHeight);
  var pageHeight = pdfPageSize.inner.height;

  var pageCanvas = document.createElement("canvas");
  var pageCtx = pageCanvas.getContext("2d");
  if (!pageCtx) {
    throw Error("Canvas context of created element not found");
  }
  pageCanvas.width = canvas.width;
  pageCanvas.height = pxPageHeight;

  const pdf = new jsPDF(opt.jsPDF);

  for (var page = 0; page < nPages; page++) {
    if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
      pageCanvas.height = pxFullHeight % pxPageHeight;
      pageHeight =
        (pageCanvas.height * pdfPageSize.inner.width) / pageCanvas.width;
    }

    var w = pageCanvas.width;
    var h = pageCanvas.height;

    pageCtx.fillStyle = "white";
    pageCtx.fillRect(0, 0, w, h);
    pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

    if (page) pdf.addPage();
    var imgData = pageCanvas.toDataURL(
      "image/" + opt.image.type,
      opt.image.quality
    );
    pdf.addImage(
      imgData,
      opt.image.type,
      opt.margin[1],
      opt.margin[0],
      pdfPageSize.inner.width,
      pageHeight
    );
  }
  return pdf;
}

function canvasToImages(
  canvas: HTMLCanvasElement,
  numPages: number,
  quality: number
): string[] {
  const pxPageHeight = Math.floor(canvas.height / numPages);
  const images: string[] = [];

  for (let page = 0; page < numPages; page++) {
    const pageCanvas = document.createElement("canvas");
    const pageCtx = pageCanvas.getContext("2d");
    if (!pageCtx) throw Error("Canvas context not found");

    pageCanvas.width = canvas.width;
    pageCanvas.height = pxPageHeight;

    pageCtx.fillStyle = "white";
    pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    pageCtx.drawImage(
      canvas,
      0,
      page * pxPageHeight,
      canvas.width,
      pxPageHeight,
      0,
      0,
      canvas.width,
      pxPageHeight
    );

    images.push(pageCanvas.toDataURL("image/png", quality));
  }

  return images;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)![1];
  const bstr = atob(parts[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}

export type ExportMode = "pdf" | "images";

export function useComponentPrinter() {
  const { numPages } = useFieldArrayValues("slides");
  const { watch }: DocumentFormReturn = useFormContext();

  const [isPrinting, setIsPrinting] = React.useState(false);
  const componentRef = React.useRef(null);
  const exportModeRef = React.useRef<ExportMode>("pdf");

  const reactToPrintContent = React.useCallback(() => {
    const current = componentRef.current;

    if (current && typeof current === "object") {
      // @ts-ignore should type narrow more precisely
      const clone = current.cloneNode(true);
      proxyImgSources(clone);
      removeSelectionStyleById(clone, "page-base-");
      removeSelectionStyleById(clone, "content-image-");
      removePaddingStyleById(clone, "carousel-item-");
      removeStyleById(clone, "slide-wrapper-", "px-2");
      removeAllById(clone, "add-slide-");
      removeAllById(clone, "add-element-");
      removeAllById(clone, "element-menubar-");
      removeAllById(clone, "slide-menubar-");
      insertFonts(clone);
      clone.className = "flex flex-col";
      clone.style = {};

      return clone;
    }

    return componentRef.current;
  }, []);

  const handleExport = useReactToPrint({
    content: reactToPrintContent,
    removeAfterPrint: true,
    onBeforePrint: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `@page { size: ${SIZE.width}px ${SIZE.height}px;  margin: 0; } @media print { body { -webkit-print-color-adjust: exact; }}`,
    print: async (printIframe) => {
      const contentDocument = printIframe.contentDocument;
      if (!contentDocument) {
        console.error("iFrame does not have a document content");
        return;
      }

      const html = contentDocument.getElementById("element-to-download-as-pdf");
      if (!html) {
        console.error("Couldn't find element to convert to PDF");
        return;
      }

      const SCALE_TO_LINKEDIN_INTRINSIC_SIZE = 1.8;
      const filename = watch("filename");
      const options: HtmlToPdfOptions = {
        margin: [0, 0, 0, 0],
        filename,
        image: { type: "webp", quality: 0.98 },
        htmlToImage: {
          height: SIZE.height * numPages,
          width: SIZE.width,
          canvasHeight:
            SIZE.height * numPages * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          canvasWidth: SIZE.width * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
        },
        jsPDF: { unit: "px", format: [SIZE.width, SIZE.height] },
      };

      const canvas = await toCanvas(html, options.htmlToImage).catch((err) => {
        console.error(err);
      });
      if (!canvas) {
        console.error("Failed to create canvas");
        return;
      }

      if (exportModeRef.current === "pdf") {
        const pdf = canvasToPdf(canvas, options);
        pdf.save(filename);
      } else {
        const images = canvasToImages(canvas, numPages, 0.98);
        const zip = new JSZip();
        images.forEach((dataUrl, i) => {
          const blob = dataUrlToBlob(dataUrl);
          zip.file(`${filename}-${i + 1}.png`, blob);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${filename}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    },
  });

  const handlePrint = React.useCallback(
    (mode: ExportMode) => {
      exportModeRef.current = mode;
      handleExport();
    },
    [handleExport]
  );

  return {
    componentRef,
    handlePrint,
    isPrinting,
  };
}

function proxyImgSources(html: HTMLElement) {
  const url = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const images = Array.from(
    html.getElementsByTagName("img")
  ) as HTMLImageElement[];

  const externalImages = images.filter(
    (image) => !image.src.startsWith("/") && !image.src.startsWith("data:")
  );

  externalImages.forEach((image) => {
    const apiRequestURL = new URL(`${url}/api/proxy`);
    apiRequestURL.searchParams.set("url", image.src);
    image.src = apiRequestURL.toString();
  });
}

function removeAllById(html: HTMLElement, id: string) {
  const elements = Array.from(
    html.querySelectorAll(`[id^=${id}]`)
  ) as HTMLDivElement[];

  elements.forEach((element) => {
    element.remove();
  });
}

function removePaddingStyleById(html: HTMLElement, id: string) {
  const classNames = "pl-2 md:pl-4";
  removeStyleById(html, id, classNames);
}

function removeSelectionStyleById(html: HTMLElement, id: string) {
  const classNames = "outline-input ring-2 ring-offset-2 ring-ring";
  removeStyleById(html, id, classNames);
}

function removeStyleById(html: HTMLElement, id: string, classNames: string) {
  const elements = Array.from(
    html.querySelectorAll(`[id^=${id}]`)
  ) as HTMLDivElement[];
  elements.forEach((element) => {
    element.className = removeClassnames(element, classNames);
  });
}

function removeClassnames(element: HTMLDivElement, classNames: string): string {
  return element.className
    .split(" ")
    .filter((el) => !classNames.split(" ").includes(el))
    .join(" ");
}

function insertFonts(element: HTMLElement) {
  // Get all elements in the document
  const allElements = Array.from(
    element.getElementsByTagName(`textarea`)
  ) as HTMLTextAreaElement[];

  // Iterate through each element
  allElements.forEach(function (element) {
    let tailwindFonts = element.className
      .split(" ")
      .filter((cn) => cn.startsWith("font-"));

    // Get the computed style of the element
    tailwindFonts.forEach((font) => {
      const fontFaceValue = getComputedStyle(
        element.ownerDocument.body
      ).getPropertyValue("--" + font); // Font var name convention is starts with `--font`
      if (fontFaceValue) {
        element.style.fontFamily = fontFaceValue;
      }
    });
  });
}
