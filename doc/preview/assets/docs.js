const pages = [
  ["index.html", "Gambaran Sistem"],
  ["arsitektur.html", "Arsitektur"],
  ["operasi.html", "Modul Operasi"],
  ["alur-order.html", "Alur Order"],
  ["tenant-cloudflare.html", "Tenant & Cloudflare"],
  ["setup-release.html", "Setup & Release"],
  ["frontend.html", "Frontend"],
  ["form.html", "Form"],
  ["tracking.html", "Tracking"],
  ["ai-agent.html", "AI Agent"],
];

const current = document.body.dataset.page || "index.html";
const navItems = pages
  .map(([href, label]) => `<a class="nav-link" href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a>`)
  .join("");

const logo = `
  <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
    <rect x="1" y="1" width="30" height="30" rx="9" fill="#1d4ed8"/>
    <path d="M9 10.5h14M9 16h9M9 21.5h14" fill="none" stroke="#f8fbff" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;

const header = document.querySelector("#site-header");
if (header) {
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip-link" href="#konten">Lewati ke konten</a>
    <div class="mx-auto flex min-h-[72px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <a href="index.html" class="flex min-h-11 items-center gap-3 no-underline" aria-label="CMSAds System Guide">
        ${logo}
        <span><strong class="block text-sm tracking-tight">CMSAds</strong><span class="block text-[11px] font-semibold text-slate-500">System Guide</span></span>
      </a>
      <nav class="hidden items-center gap-1 xl:flex" aria-label="Navigasi dokumentasi">${navItems}</nav>
      <button id="menu-toggle" class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-800 xl:hidden" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Buka navigasi">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <nav id="mobile-nav" class="mobile-nav hidden bg-slate-50 px-4 py-3 xl:hidden" aria-label="Navigasi dokumentasi mobile">
      <div class="mx-auto grid max-w-[1480px] grid-cols-1 gap-1 sm:grid-cols-2">${navItems}</div>
    </nav>`;

  const toggle = document.querySelector("#menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Buka navigasi" : "Tutup navigasi");
    mobileNav?.classList.toggle("hidden", open);
  });
}

const footer = document.querySelector("#site-footer");
if (footer) {
  footer.innerHTML = `
    <div class="mx-auto grid max-w-[1480px] gap-5 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
      <div>
        <div class="flex items-center gap-3">${logo}<strong class="tracking-tight">CMSAds System Guide</strong></div>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Visualisasi ini merangkum kontrak repository. PRD, STATUS, specification, dan source code tetap menjadi sumber kebenaran.</p>
      </div>
      <div class="text-sm text-slate-600 md:text-right">
        <a class="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4" href="../../README.md">Buka README utama</a>
        <p class="mt-2">Diperbarui 11 Agustus 2026</p>
      </div>
    </div>`;
}

for (const pre of document.querySelectorAll("pre[data-copy]")) {
  const wrapper = document.createElement("div");
  wrapper.className = "code-wrap relative";
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button absolute right-3 top-3";
  button.textContent = "Salin";
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(pre.innerText);
    button.textContent = "Tersalin";
    window.setTimeout(() => { button.textContent = "Salin"; }, 1400);
  });
  wrapper.appendChild(button);
}

const tocLinks = [...document.querySelectorAll(".page-toc a")];
if (tocLinks.length) {
  const sections = tocLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    for (const link of tocLinks) link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
  }, { rootMargin: "-20% 0px -65%", threshold: [0, .25, .6] });
  for (const section of sections) observer.observe(section);
}
