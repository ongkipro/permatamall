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
  return `<iframe id="${id}" data-adsbook-form src="${url}" title="${title}" width="100%" height="1000" loading="${loading}" referrerpolicy="strict-origin-when-cross-origin" style="display:block;width:100%;max-width:100%;min-height:720px;border:0"></iframe>`;
}

function buildParentListener(id: string, origin: string) {
  return `<script>
(function(){
var frameId="${id}";
var origin="${origin}";
var trackingKeys=["gclid","gbraid","wbraid","_fbp","_fbc","fbclid","ttclid","utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
function getTrackingParams(){
var params={};
try{
var searchParams=new URLSearchParams(window.location.search);
trackingKeys.forEach(function(k){
var v=searchParams.get(k);
if(v)params[k]=v;
});
if(!params._fbp){
var mFbp=document.cookie.match(/(?:^|;\\s*)_fbp=([^;]+)/);
if(mFbp)params._fbp=decodeURIComponent(mFbp[1]);
}
if(!params._fbc){
var mFbc=document.cookie.match(/(?:^|;\\s*)_fbc=([^;]+)/);
if(mFbc)params._fbc=decodeURIComponent(mFbc[1]);
}
}catch(e){}
return params;
}
function syncFrameTracking(){
var frame=document.getElementById(frameId);
if(!frame)return;
try{
var frameUrl=new URL(frame.src);
var params=getTrackingParams();
var changed=false;
Object.keys(params).forEach(function(k){
if(!frameUrl.searchParams.has(k)){
frameUrl.searchParams.set(k,params[k]);
changed=true;
}
});
if(changed)frame.src=frameUrl.toString();
}catch(e){}
}
if(document.readyState==="loading"){
window.addEventListener("DOMContentLoaded",syncFrameTracking);
}else{
syncFrameTracking();
}
window.addEventListener("message",function(event){
var frame=document.getElementById(frameId);
if(!frame||event.origin!==origin||event.source!==frame.contentWindow||!event.data)return;
if(event.data.type==="adsbook:embed-resize"){
var height=Number(event.data.height);
if(Number.isFinite(height))frame.style.height=Math.max(480,Math.min(12000,height))+"px";
return;
}
if(event.data.type!=="adsbook:checkout-redirect"||!event.data.url)return;
try{
var target=new URL(String(event.data.url),origin);
if(target.origin===origin&&(target.pathname==="/payment"||target.pathname==="/thanks")){
window.location.assign(target.toString());
}
}catch(e){}
});
})();
</script>`;
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
    widget: `<adsbook-form-widget product-id="${productId}"${variantAttribute} mode="${input.mode}" base-url="${origin}">\n${eagerIframe}\n</adsbook-form-widget>\n<script async src="${origin}/adsbook-form-widget.js"></script>`,
  };
}
