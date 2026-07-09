declare module "html2canvas-pro" {
  interface Html2CanvasOptions {
    allowTaint?: boolean;
    backgroundColor?: string | null;
    canvas?: HTMLCanvasElement;
    foreignObjectRendering?: boolean;
    imageTimeout?: number;
    ignoreElements?: (element: Element, style: CSSStyleDeclaration) => boolean;
    letterRendering?: boolean;
    logging?: boolean;
    onclone?: (clonedDocument: Document) => void;
    offlineEnabled?: boolean;
    removeContainer?: boolean;
    retryDelay?: number;
    taintRetry?: number;
    useCORS?: boolean;
    scale?: number;
    width?: number;
    height?: number;
    elementContainer?: Element;
  }

  export default function html2canvas(
    element: Element | HTMLElement,
    options?: Html2CanvasOptions,
  ): Promise<HTMLCanvasElement>;
}
