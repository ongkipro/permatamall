import type { FormMode } from "./form-mode";

export type EmbedMarkupInput = {
  origin: string;
  embedUrl: string;
  elementId: string;
  title: string;
  productId: string;
  variantId?: string;
  mode: FormMode;
};

function escapeHtmlAttribute(value: string) {
  return value.replace(
    /[&"'<>]/g,
    (character) =>
      ({
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;",
      })[character] || character,
  );
}

function buildIframe(id: string, url: string, title: string, loading: "eager" | "lazy") {
  return `<iframe id="${id}" data-cmsads-form src="${url}" title="${title}" width="100%" height="1000" loading="${loading}" referrerpolicy="strict-origin-when-cross-origin" style="display:block;width:100%;max-width:100%;min-height:720px;border:0"></iframe>`;
}

function buildParentListener(id: string, origin: string) {
  return `<script>\n(function(){\nvar frameId="${id}";var origin="${origin}";var trackingKeys=["gclid","gbraid","wbraid","_fbp","_fbc","fbclid","ttclid","utm_source","utm_medium","utm_campaign","utm_content","utm_term"];\nfunction getTrackingParams(){\nvar params={};\ntry{\nvar searchParams=new URLSearchParams(window.location.search);\ntrackingKeys.forEach(function(k){\nvar v=searchParams.get(k);\nif(v)params[k]=v;\n});\nif(!params._fbp){\nvar mFbp=document.cookie.match(/(?:^|;\\s*)_fbp=([^;]+)/);\nif(mFbp)params._fbp=decodeURIComponent(mFbp[1]);\n}\nif(!params._fbc){\nvar mFbc=document.cookie.match(/(?:^|;\\s*)_fbc=([^;]+)/);\nif(mFbc)params._fbc=decodeURIComponent(mFbc[1]);\n}\n}catch(e){}\nreturn params;\n}\nfunction syncFrameTracking(){\nvar frame=document.getElementById(frameId);\nif(!frame)return;\ntry{\nvar frameUrl=new URL(frame.src);\nvar params=getTrackingParams();\nvar changed=false;\nObject.keys(params).forEach(function(k){\nif(!frameUrl.searchParams.has(k)){\nframeUrl.searchParams.set(k,params[k]);\nchanged=true;\n}\n});\nif(changed)frame.src=frameUrl.toString();\n}catch(e){}\n}\nif(document.readyState==="loading"){window.addEventListener("DOMContentLoaded",syncFrameTracking);}else{syncFrameTracking();}\nwindow.addEventListener("message",function(event){\nvar frame=document.getElementById(frameId);\nif(!frame||event.origin!=="${origin}"||event.source!==frame.contentWindow||!event.data)return;\nif(event.data.type==="cmsads:embed-resize"){\nvar height=Number(event.data.height);\nif(Number.isFinite(height))frame.style.height=Math.max(480,Math.min(12000,height))+"px";\nreturn;\n}\nif(event.data.type==="cmsads:checkout-redirect"||event.data.type==="cmsads:order-complete"){\ntry{\nvar payload=event.data;\nif(payload.total&&Number(payload.total)>0){\nif(typeof window.fbq==="function"){\nwindow.fbq("track","Purchase",{value:Number(payload.total),currency:"IDR"});\n}\nif(typeof window.gtag==="function"){\nwindow.gtag("event","conversion",{value:Number(payload.total),currency:"IDR",transaction_id:String(payload.orderId||"")});\n}\nif(typeof window.ttq==="object"&&typeof window.ttq.track==="function"){\nwindow.ttq.track("CompletePayment",{value:Number(payload.total),currency:"IDR"});\n}\n}\nif(payload.type==="cmsads:checkout-redirect"&&payload.url){\nvar target=new URL(String(payload.url),"${origin}");\nif(target.origin==="${origin}"&&(target.pathname==="/payment"||target.pathname==="/thanks")){\nvar params=getTrackingParams();\nObject.keys(params).forEach(function(k){\nif(!target.searchParams.has(k))target.searchParams.set(k,params[k]);\n});\nwindow.location.assign(target.toString());\n}\n}\n}catch(e){}\n}\n});\n})();\n</script>`;
}

export function buildEmbedMarkup(input: EmbedMarkupInput) {
  const id = escapeHtmlAttribute(input.elementId);
  const origin = escapeHtmlAttribute(input.origin);
  const embedUrl = escapeHtmlAttribute(input.embedUrl);
  const title = escapeHtmlAttribute(input.title);
  const productId = escapeHtmlAttribute(input.productId);
  const variantAttribute = input.variantId
    ? ` variant-id="${escapeHtmlAttribute(input.variantId)}"`
    : "";
  const plainIframe = buildIframe(id, embedUrl, title, "lazy");
  const eagerIframe = buildIframe(id, embedUrl, title, "eager");

  return {
    plainIframe,
    autoHeightIframe: `${plainIframe}\n${buildParentListener(id, origin)}`,
    widget: `<cmsads-form-widget product-id="${productId}"${variantAttribute} mode="${input.mode}" base-url="${origin}">\n${eagerIframe}\n</cmsads-form-widget>\n<script async src="${origin}/cmsads-form-widget.js"></script>`,
  };
}
