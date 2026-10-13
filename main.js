import { site, projects, publishedProjects, resolveHomeSections, nextPublishedProject } from "./src/data/siteData.js";
const $ = (s, root = document) => root.querySelector(s);
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1000px)");
let cleanup = () => {},
  navigationId = 0;
const projectHref = (p) => `#/project/${p.slug}`;
const arrow = '<span aria-hidden="true">↗</span>';
// Keep the exact accent for graphic details; darken small text only when needed for contrast.
function accentForText(accent, background) {
  const channels = (hex) =>
    hex
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16));
  const luminance = (rgb) =>
    rgb
      .map((v) => v / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const base = channels(accent),
    ink = channels("#3B3046"),
    bg = luminance(channels(background));
  for (let mix = 0; mix <= 1; mix += 0.05) {
    const rgb = base.map((v, i) => Math.round(v * (1 - mix) + ink[i] * mix));
    if ((bg + 0.05) / (luminance(rgb) + 0.05) >= 4.5)
      return "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  return "#3B3046";
}
function placeholder(label, extra = "") {
  return `<div class="media-placeholder ${extra}"><span class="placeholder-cross" aria-hidden="true">+</span><span>${escape(label)}</span><small>PROJECT MEDIA / PLACEHOLDER</small></div>`;
}
function media(src, alt, label, extra = "") {
  return src
    ? `<div class="media ${extra}"><img src="${escape(src)}" alt="${escape(alt)}" loading="lazy" decoding="async" width="1600" height="1000" data-fallback="${escape(label)}"></div>`
    : placeholder(label, extra);
}
function uiIcon(name) {
  const paths = {
    Home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    Work: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    About: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    CV: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/>',
    Contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    LinkedIn: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5v6M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5"/><circle cx="7.5" cy="7.5" r=".7" fill="currentColor" stroke="none"/>'
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.Contact}</svg>`;
}
function contactLinks() {
  return `<div class="contact-links">${site.email ? `<a href="mailto:${escape(site.email)}">${uiIcon("Contact")}<span>${escape(site.email)}</span></a>` : "<span>Email <small>[Add email address]</small></span>"}${site.linkedin ? `<a href="${escape(site.linkedin)}" target="_blank" rel="noopener noreferrer">${uiIcon("LinkedIn")}<span>LinkedIn</span></a>` : "<span>LinkedIn <small>[Add profile link]</small></span>"}<a href="#/cv">${uiIcon("CV")}<span>CV / Résumé</span></a></div>`;
}
function frame(route) {
  $("#header").innerHTML =
    `<a class="brand personal-wordmark" href="#/" aria-label="Iris Luo home"><img class="iris-pixel-avatar" src="public/images/about/iris-pixel-silhouette-site.png" alt="" width="64" height="64"><span class="wordmark-name"><span class="wordmark-first">Iris</span><span class="wordmark-last">Luo</span></span></a><nav class="personal-nav" aria-label="Main navigation">${site.nav.map(n => `<a href="${n.href}" ${route === n.href.slice(1) || n.label === "Work" && (route.startsWith("/work") || route.startsWith("/project/")) ? 'aria-current="page"' : ""}>${uiIcon(n.label)}<span class="nav-name">${escape(n.label)}</span></a>`).join("")}</nav><button class="back-to-top" type="button" aria-label="Back to top" hidden><span aria-hidden="true">↑</span></button>`;
  $("#footer").innerHTML =
    `<section class="contact section-shell ${route === "/contact" || route === "/" ? "contact-footer-compact" : ""}" id="contact"><div class="eyebrow"><span class="accent-dot"></span>${escape(site.labels.contact)}</div><h2>Let’s make something together.</h2><a class="intro-work-link" href="#/contact">Say hello ${arrow}</a><div class="footer-bottom"><span>${escape(site.name)} © ${new Date().getFullYear()}</span><span>${escape(site.location)}</span><a href="#/about">Interfaces, prototypes & interactive websites. ${arrow}</a></div></section>`;

}
function contactPage() {
  return `<section class="contact-page section-shell"><div class="contact-page-copy"><p class="eyebrow">Get in touch</p><h1>Say hello.</h1><p>A project, an opportunity, or just a hello.<br>I’d love to hear from you.</p>${contactLinks()}</div><form class="contact-form" name="portfolio-contact" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="portfolio-contact"><p hidden><label>Leave this empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p><label for="contact-email">Email<input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="Where can I reach you?"></label><label for="contact-subject">Subject<input id="contact-subject" name="subject" required maxlength="200" placeholder="What’s it about?"></label><label for="contact-message">Message<textarea id="contact-message" name="message" rows="4" required maxlength="5000" placeholder="Tell me a little about it."></textarea></label><button type="submit">Send message <span aria-hidden="true">↗</span></button><p class="contact-form-status" role="status" aria-live="polite"></p></form></section>`;
}

function homeInteraction() {
  const icons = projects.find(project => project.id === "food-court-icons").sections.iconDemo;
  return `<div class="food-card-preview" aria-label="Food Icons interactive cover">${iconDemonstration(icons)}</div>`;
}
function workCategory(p) {
  return p.type === "product" ? "uiux" : p.id === "food-court-icons" ? "visual" : "web";
}
function home() {
  return `<div class="home-curated landing-page"><section class="hero section-shell home-recruitment-hero home-identity-hero"><div class="intro-canvas"><div class="home-identity-portrait"><img class="heatmap-portrait" src="public/images/about/iris-heatmap-portrait.svg" alt="Heatmap squares gather into my pixel portrait, with short hair and coral glasses" width="352" height="152" decoding="async" fetchpriority="high"></div><div class="home-identity-copy"><h1>Hi, I’m Iris.</h1><p class="intro-welcome">I’m a UI/UX designer based in Melbourne.<br>I design interfaces and build interactive websites.</p><a class="intro-work-link" href="#/work">View my work <span aria-hidden="true">↗</span></a></div></div></section></div>`;
}
function workPage() {
  const sections = resolveHomeSections(projects);
  return `<div class="home-curated work-page" data-filter="all"><header class="work-page-heading section-shell"><h1>Work.</h1></header><div id="work-index" class="work-filters section-shell" role="group" aria-label="Filter projects">${[["all","All projects"],["uiux","UI/UX Design"],["web","Web Development"],["visual","Graphic Design"]].map(([category,label]) => `<button type="button" data-work-filter="${category}" aria-pressed="${category === "all"}" aria-controls="work play">${label}</button>`).join("")}</div>${sections.map(homeSection).join("")}</div>`;
}

function luckyScratchCover() {
  const poster = "public/images/projects/lucky-scratch/real-interaction-poster.webp";
  const animation = "public/images/projects/lucky-scratch/real-interaction-natural.gif";
  return `<div class="lucky-real-cover inline-thumbnail"><img data-scratch-recording src="${reduced.matches ? poster : animation}" alt="Actual Lucky Scratch website: the centre card flips and its silver coating is scratched away to reveal an illustration and message." width="800" height="474" loading="lazy"></div>`;
}

function showreelMedia(p) {
  return p.previewVideo
    ? `<div class="media inline-thumbnail showreel-media"><video class="showreel-video" data-showreel src="${escape(p.previewVideo)}" poster="${escape(p.thumbnail)}" muted loop playsinline controls preload="metadata" aria-label="${escape(p.title)} motion preview"></video></div>`
    : media(p.thumbnail, p.thumbnailAlt, `${p.title} cover`, "inline-thumbnail");
}
function projectToolLabels(p) {
  const labels = (p.sections.tools || "").split(/\s*[·,]\s*|\s+and\s+/).filter(Boolean);
  return `<ul class="project-tool-labels" aria-label="Tools used">${labels.map((label, i) => `<li data-tone="${({Figma:"coral",HTML:"peach",CSS:"blue",JavaScript:"mint",Netlify:"cyan"})[label] || ["cyan","mint","blue"][i % 3]}">${escape(label)}</li>`).join("")}</ul>`;
}

function leadProduct(p) {
  return `<article class="lead-product showcase-feature" data-card="doitnow" data-work-category="uiux"><div class="product-cover-composition"><div class="product-motion-window"><video class="showreel-video" data-showreel src="public/videos/doitnow-home-detail.mp4" poster="public/images/projects/doitnow/home-detail-poster.webp" muted loop playsinline controls preload="metadata" aria-label="DoItNow prototype: complete steps and see progress update"></video></div><figure class="product-still-window"><img src="public/images/projects/doitnow/heatmap-after.webp" alt="DoItNow activity tracker showing completed tasks across eight weeks" width="237" height="512" loading="lazy"></figure></div><div class="showcase-caption"><div><div class="lead-product-topline"><span>UI/UX · ${escape(p.year)}</span></div><h3>${escape(p.title)}</h3><p>A task-planning app that breaks big tasks into smaller, editable steps.</p></div><a class="text-link" href="${projectHref(p)}">View case study ${arrow}</a></div>${projectToolLabels(p)}</article>`;
}
// Shared home renderers keep project markup independent of project count.
function projectTile(p, i) {
  return `<article class="project-row ${p.id === "watching-the-wait" ? "featured-build" : ""}" data-card="${escape(p.id)}" data-work-category="${workCategory(p)}" style="--media-fit:${p.mediaFit || "cover"}">${showreelMedia(p)}<a class="showcase-project-link" href="${projectHref(p)}" aria-label="View ${escape(p.title)} project"><div class="project-info"><h3>${escape(p.title)}</h3><p>${escape(p.subtitle)}</p></div><span class="project-arrow" aria-hidden="true">↗</span></a><span class="project-year">${escape(p.year)}</span>${projectToolLabels(p)}</article>`;
}
function liveLink(p) {
  return p.liveUrl ? `<a class="text-link" href="${escape(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Try it live ${arrow}</a>` : p.videoUrl ? `<a class="text-link" href="${escape(p.videoUrl)}" target="_blank" rel="noopener noreferrer">Watch on YouTube ${arrow}</a>` : '<span class="live-placeholder">Try it live — [Add live demo URL]</span>';
}
function homeSection(section) {
  const items = section.id === "work" ? section.projects.slice().sort((a,b) => ({"doitnow":0,"watching-the-wait":1,"mapped-in-memory":2}[a.id] ?? 3) - ({"doitnow":0,"watching-the-wait":1,"mapped-in-memory":2}[b.id] ?? 3)) : section.projects;
  return `<section id="${escape(section.id)}" class="home-section work section-shell"><div class="curated-section-heading"><h2>${section.id === "work" ? "Work" : "Graphics & creative coding"}</h2><p>${section.id === "work" ? "Interface prototypes and a coded web narrative." : "Built for the browser. Try the live projects or explore how they work."}</p></div>${section.layout === "editorial" ? `${section.id === "work" && items.some(p => p.id === "doitnow") ? leadProduct(items.find(p => p.id === "doitnow")) : ""}<div class="project-list supporting-projects">${items.filter(p => section.id !== "work" || p.id !== "doitnow").map(projectTile).join("")}</div>` : `<div class="collection-grid ${section.layout === "photography" ? "photo-collection" : ""}">${items.map(p => `<article class="collection-card" data-card="${escape(p.id)}" data-work-category="${workCategory(p)}" style="--project-accent:${p.accent};--project-tint:${p.background}">${p.id === "food-court-icons" ? homeInteraction() : ""}<a href="${projectHref(p)}" data-project="${p.slug}">${p.id === "food-court-icons" ? "" : p.id === "lucky-scratch" ? luckyScratchCover() : media(p.thumbnail, p.thumbnailAlt, `${p.title} — [Add cover image or video poster]`, "inline-thumbnail")}<div class="collection-heading"><h3>${escape(p.title)}</h3>${arrow}</div><p>${escape(p.subtitle)}</p><span class="collection-proof">${escape(p.proof || "")}</span></a><div class="collection-meta"><span>${escape(p.year)}</span>${p.type === "interactive" ? liveLink(p) : '<span>View series ↗</span>'}</div>${projectToolLabels(p)}</article>`).join("")}</div>`}${items.length ? "" : '<p class="empty-section">Projects will appear here when published.</p>'}</section>`;
}
function projectFacts(s) {
  const keys = ["role", "team", "tools"];
  return `<dl class="facts">${keys.filter(key => s[key] && !s[key].includes("[Add")).map(key => `<div><dt>${key === "role" ? "My role" : key}</dt><dd>${escape(s[key])}</dd></div>`).join("")}</dl>`;
}
function projectSummary(p) {
  return p.summary?.length ? `<div class="project-summary" aria-label="Project at a glance">${p.summary.map(item => `<div><h2>${escape(item.label)}</h2><p>${escape(item.text)}</p></div>`).join("")}</div>` : "";
}
function projectContents(p) {
  const blocks = p.sections.contentBlocks || [];
  if (!blocks.length) return "";
  return `<nav class="case-contents" aria-label="On this page"><span>Jump to</span><button type="button" data-section-target="case-demo">${p.type === "product" ? "Walkthrough" : "Try / watch"}</button>${blocks.map((block,i) => `<button type="button" data-section-target="case-block-${i}">${escape(block.navLabel || block.title)}</button>`).join("")}</nav>`;
}
function nextProjectLink(next) {
  return `<a class="next-project" href="${projectHref(next)}" data-project="${next.slug}"><img class="next-project-image" src="${escape(next.thumbnail)}" alt="" width="160" height="100" loading="lazy" decoding="async"><span class="next-project-copy"><span class="eyebrow">Next project</span><span class="next-project-title">${escape(next.title)}</span></span>${arrow}</a>`;
}

function projectPage(p) {
  if (p.type === "product" && !p.sections.contentBlocks?.length) return caseStudy(p);
  const s = p.sections;
  const next = nextPublishedProject(p, projects);
  return `<article class="case-study ${p.type}-detail"><header class="case-header section-shell"><a href="#/work" class="text-link">← All work</a><p class="project-status">${escape(p.status || p.tags.join(" / "))}</p><div class="case-heading"><div><h1>${escape(p.title)}</h1><p class="case-subtitle">${escape(p.subtitle)}</p></div><span class="case-year">${escape(p.year)}</span></div>${projectSummary(p)}<div class="case-header-actions">${p.liveUrl || p.videoUrl ? liveLink(p) : ""}</div></header><div class="case-cover" style="--media-fit:${p.mediaFit || "contain"};--cover-ratio:${p.coverRatio || "1.6"}">${media(p.thumbnail, p.thumbnailAlt, `${p.title} — Cover`)}</div><div class="section-shell">${projectContents(p)}<section class="case-section">${sectionHead("01", p.detailLabel || "Project overview")}<div><p class="large-copy">${escape(s.introduction)}</p>${projectFacts(s)}</div></section>${p.type === "photography" ? photoGallery(s.gallery) : interactiveContent(p)}${nextProjectLink(next)}</div></article>`;
}
function photoGallery(images) {
  return `<section aria-label="Photograph gallery" class="photo-gallery">${images.map(g => `<figure>${g.src ? `<div class="photo-original"><img src="${escape(g.src)}" alt="${escape(g.alt)}" ${g.width && g.height ? `width="${Number(g.width)}" height="${Number(g.height)}"` : ""} loading="lazy" decoding="async" data-fallback="[Add photograph here]"></div>` : `<div style="aspect-ratio:${g.width || 3}/${g.height || 2}">${placeholder("[Add photograph here]")}</div>`}<figcaption>${escape(g.caption)} <a class="media-zoom" href="${escape(g.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(g.alt || g.caption)} at full size">View full size ↗</a></figcaption></figure>`).join("")}</section>`;
}
function iconDemonstration(icons) {
  return `<div class="icon-demo ${reduced.matches ? "is-paused" : ""}"><div class="icon-demo-toolbar"><span>Hover to transform · Tap to hear ↗</span></div><div class="icon-demo-grid">${icons.map((icon, i) => `<button class="icon-demo-item" type="button" style="--icon-delay:${i * 0.35}s" data-icon-sound="public/audio/food-court-icons/${escape(icon.sound)}.mp3" data-icon-label="${escape(icon.label)}" aria-label="Play ${escape(icon.label)} sound"><span class="icon-demo-art"><img class="icon-before" src="public/images/projects/food-court-icons/before/${i + 1}.png" alt=""><img class="icon-after" src="public/images/projects/food-court-icons/after/${(i + 1) * 11}.png" alt=""></span><span>${escape(icon.label)} <span aria-hidden="true">♫</span></span></button>`).join("")}</div><p class="icon-demo-status" role="status">Sound on tap — choose an icon to listen.</p></div>`;
}
function scratchDemonstration() {
  const messages = ["You did great today!", "Take a breath — you’ve got this.", "Small steps, big wins."];
  return `<div class="scratch-preview"><div class="scratch-cards">${messages.map((message,i) => `<div class="scratch-card" data-card="${i}" ${i ? "hidden" : ""}><button type="button" class="scratch-front scratch-face" aria-label="Flip card ${i + 1}"><img src="public/images/projects/lucky-scratch/card-cover.webp" alt="Lucky Scratch star cover" draggable="false"></button><div class="scratch-back scratch-face"><div class="scratch-stage"><div class="scratch-answer" style="background:${["#ff6f91","#ff9671","#ffc75f"][i]}"><img src="public/images/projects/lucky-scratch/reveal-${i + 1}.webp" alt="" draggable="false"><p>${message}</p></div><canvas class="scratch-coat" aria-label="Drag to scratch away the silver coating"></canvas></div></div></div>`).join("")}</div><div class="scratch-controls"><div class="scratch-choices" aria-label="Choose a card">${messages.map((_,i) => `<button type="button" data-scratch-choice="${i}" aria-pressed="${i === 0}">Card ${i + 1}</button>`).join("")}</div><button type="button" class="scratch-reset">Start again ↻</button><button type="button" class="scratch-sound" aria-pressed="true">Sound on ♫</button><button type="button" class="scratch-reveal">Reveal without scratching</button><p class="scratch-status" role="status">Flip the card, then drag to scratch.</p></div>${["flip","scratch","reveal"].map(name => `<audio data-scratch-audio="${name}" src="public/audio/lucky-scratch/${name}.mp3" preload="none" ${name === "scratch" ? "loop" : ""}></audio>`).join("")}</div>`;
}
function interactiveContent(p) {
  const s = p.sections, product = p.type === "product";
  const video = s.prototypeVideo || p.previewVideo;
  const narrative = s.contentBlocks?.length ? narrativeBlocks(s.contentBlocks, product ? 2 : 3) : "";
  const demoNumber = product ? (s.contentBlocks?.length || 0) + 2 : 2;
  const demo = `<section id="case-demo" tabindex="-1" class="case-section">${sectionHead(String(demoNumber).padStart(2,"0"), product ? p.demoHeading || "Prototype walkthrough" : s.iconDemo || s.scratchDemo ? "Try the interaction" : "See it in motion")}<div><div class="prototype ${s.videoOrientation === "portrait" ? "portrait" : ""}">${s.iconDemo ? iconDemonstration(s.iconDemo) : s.scratchDemo ? scratchDemonstration() : video ? `<video src="${escape(video)}" ${s.prototypePoster || p.thumbnail ? `poster="${escape(s.prototypePoster || p.thumbnail)}"` : ""} controls playsinline preload="none" aria-label="${escape(p.title)} demonstration"></video><p class="video-error" hidden>Video unavailable. ${p.liveUrl ? "Open the live project below." : "Please try again later."}</p>` : media(s.prototypePoster,s.prototypePosterAlt,"Project demonstration")}</div><p class="demo-caption">${escape(s.demonstration)}</p>${s.prototypeVideo && video !== s.prototypeVideo ? `<details class="full-walkthrough"><summary>Watch the complete walkthrough</summary><video controls playsinline preload="none" src="${escape(s.prototypeVideo)}" aria-label="${escape(p.title)} complete walkthrough"></video><p>${escape(s.demonstration)}</p></details>` : ""}<details class="interaction-instructions"><summary>${product ? "About this prototype" : "How to interact"}</summary><p>${escape(s.interaction)}</p></details>${p.liveUrl ? `<div class="demo-live-link">${liveLink(p)}</div>` : ""}</div></section>`;
  return product ? narrative + demo : demo + narrative;
}
function comparisonMedia(comparison) {
  if (comparison.layout === "side-by-side") return `<div class="comparison-pair"><figure><h3>Before <span>Original layout</span></h3>${media(comparison.before, comparison.beforeAlt, "[Add original design here]")}</figure><figure><h3>After <span>Revised layout</span></h3>${media(comparison.after, comparison.afterAlt, "[Add revised design here]")}</figure></div>`;
  return `<div class="comparison" data-view="before"><p class="comparison-status" role="status">Before — original design</p><div class="comparison-stage"><div class="comparison-before">${media(comparison.before, comparison.beforeAlt, "[Add original design here]")}</div><div class="comparison-after">${media(comparison.after, comparison.afterAlt, "[Add revised design here]")}</div><div class="comparison-line" aria-hidden="true"><span>↔</span></div></div><div class="comparison-controls"><button type="button" data-compare="0" aria-pressed="true">Before</button><label for="compare-range" class="sr-only">Compare designs: move right toward After</label><input id="compare-range" type="range" min="0" max="100" value="0" aria-valuetext="Before — original design"><button type="button" data-compare="100" aria-pressed="false">After</button></div></div>`;
}
function narrativeBlocks(blocks, start = 4) {
  return blocks.map((block, i) => `<section id="case-block-${i}" tabindex="-1" class="case-section narrative-section ${block.comparison || block.gallery?.length > 1 ? "visual-evidence-section" : ""}">${sectionHead(String(i + start).padStart(2, "0"), escape(block.title))}<div>${block.copy.map(text => `<p class="narrative-copy">${escape(text)}</p>`).join("")}${block.image ? `<figure class="narrative-image">${media(block.image, block.alt, "[Add project image]")}<figcaption>${escape(block.caption)} <a class="media-zoom" href="${escape(block.image)}" target="_blank" rel="noopener noreferrer">View full size ↗</a></figcaption></figure>` : ""}${block.stages ? `<ol class="narrative-stages">${block.stages.map((stage, index) => `<li><div class="stage-heading"><span class="eyebrow">0${index + 1}</span><h3>${escape(stage.title)}</h3><p>${escape(stage.copy)}</p></div>${media(stage.image, stage.alt, "[Add narrative state image]")}</li>`).join("")}</ol>` : ""}${block.audio ? `<div class="sound-samples">${block.audio.map(track => `<figure><figcaption><strong>${escape(track.title)}</strong><br>${escape(track.credit)}</figcaption><audio controls preload="none" aria-label="${escape(track.title)} sound effect" src="${escape(track.src)}">Your browser does not support audio playback.</audio></figure>`).join("")}</div>` : ""}${block.comparison ? comparisonMedia(block.comparison) : ""}${block.insightDecisionEvidence ? `<div class="ide">${Object.entries(block.insightDecisionEvidence).map(([key,value]) => `<div><h3>${escape(key)}</h3><p>${escape(value)}</p></div>`).join("")}</div>` : ""}${block.gallery ? `<div class="gallery screen-gallery">${block.gallery.map(g => `<figure>${media(g.src,g.alt,"[Add design screen]")}<figcaption>${escape(g.caption)} <a class="media-zoom" href="${escape(g.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(g.alt || g.caption)} at full size">View full size ↗</a></figcaption></figure>`).join("")}</div>` : ""}${block.supportingMedia ? `<details class="supporting-evidence"><summary>View original supporting material</summary><figure>${media(block.supportingMedia.image,block.supportingMedia.alt,"Supporting material")}<figcaption>${escape(block.supportingMedia.caption)} <a class="text-link" href="${escape(block.supportingMedia.image)}" target="_blank" rel="noopener noreferrer">Open full size ${arrow}</a></figcaption></figure></details>` : ""}${block.credits ? `<details class="project-credits"><summary>Sound credits</summary>${block.credits.map(text => `<p>${escape(text)}</p>`).join("")}</details>` : ""}</div></section>`).join("");
}
function sectionHead(num, title) {
  return `<div class="section-kicker"><span>${num}</span><h2>${title}</h2></div>`;
}
function caseStudy(p) {
  const s = p.sections,
    next = nextPublishedProject(p, projects);
  return `<article class="case-study"><header class="case-header section-shell"><a href="#/work" class="text-link">← All work</a><div class="case-heading"><div><p class="eyebrow">${p.tags.map(escape).join(" / ")}</p><h1>${escape(p.title)}</h1><p class="case-subtitle">${escape(p.subtitle)}</p></div><span class="case-year">${escape(p.year)}</span></div><div class="case-links">${p.liveUrl ? `<a class="text-link" href="${escape(p.liveUrl)}" target="_blank" rel="noopener noreferrer">${escape(site.labels.liveProject)} ${arrow}</a>` : ""}<p class="draft-note">${escape(site.labels.caseStatus)}</p></div></header><div class="case-cover" style="--project-tint:${p.background};--project-accent:${p.accent}">${media(p.thumbnail, p.thumbnailAlt, `${p.title} — Cover image, 1600 × 1000`)}</div><div class="section-shell"><section class="case-intro case-section">${sectionHead("01", "Project introduction")}<div><p class="large-copy">${escape(s.introduction)}</p><dl class="facts">${["role", "team", "tools"].map((k) => `<div><dt>${k === "role" ? "My role" : k}</dt><dd>${escape(s[k])}</dd></div>`).join("")}</dl></div></section><section class="case-section split-text">${sectionHead("02", "Setting the scene")}<div class="two-column"><div><h3>Context</h3><p>${escape(s.context)}</p></div><div><h3>Problem</h3><p>${escape(s.problem)}</p></div></div></section><section class="case-section">${sectionHead("03", "Research")}<div><p>${escape(s.research)}</p>${media(s.researchImage, "[Describe the research artefact]", "[Add research image here]")}<blockquote>${escape(s.quote)}<cite>${escape(s.quoteAttribution)}</cite></blockquote></div></section><section class="case-section">${sectionHead("04", "Key insights")}<ol class="insight-list">${s.insights.map((t) => `<li>${escape(t)}</li>`).join("")}</ol></section><section class="case-section story-section">${sectionHead("05", "Design process")}<div><p>${escape(s.process)}</p><div class="story-layout"><div class="sticky-media" data-story-media>${media(s.story[0].image, "[Describe the design process]", "[Add design process image here]")}</div><div class="story-captions">${s.story.map((t, i) => `<div class="story-step" data-story="${i}"><span class="eyebrow">0${i + 1}</span><h3>${escape(t.title)}</h3><p>${escape(t.caption)}</p></div>`).join("")}</div></div></div></section><section class="case-section">${sectionHead("06", "Wireframes")}<div><p>${escape(s.wireframes)}</p><div class="gallery">${s.gallery.map((g) => `<figure>${media(g.src, g.alt, "[Add wireframe image here]")}<figcaption>${escape(g.caption)} <a class="media-zoom" href="${escape(g.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(g.alt || g.caption)} at full size">View full size ↗</a></figcaption></figure>`).join("")}</div></div></section><section class="case-section">${sectionHead("07", "Iterations")}<div><p>${escape(s.iterations)}</p>${comparisonMedia(s.comparison)}<div class="ide">${Object.entries(
    s.insightDecisionEvidence,
  )
    .map(([key, value]) => `<div><h3>${key}</h3><p>${escape(value)}</p></div>`)
    .join(
      "",
    )}</div></div></section><section class="case-section">${sectionHead("08", "Usability testing")}<p>${escape(s.testing)}</p></section><section class="case-section">${sectionHead("09", "Final solution")}<div><p>${escape(s.solution)}</p><div class="annotated">${media(s.solutionImage, "[Describe the final interface]", "[Add final solution image here]")}${s.hotspots.map((h, i) => `<button class="hotspot" style="left:${h.x}%;top:${h.y}%" aria-expanded="false" aria-controls="annotation-${i}" aria-label="Show design annotation ${i + 1}">${escape(h.label)}</button>`).join("")}</div><div class="annotations">${s.hotspots.map((h, i) => `<p id="annotation-${i}" hidden><strong>${escape(h.label)}</strong> ${escape(h.text)}</p>`).join("")}</div><div class="prototype">${s.prototypeVideo ? `<video playsinline preload="none" ${s.prototypePoster ? `poster="${escape(s.prototypePoster)}"` : ""} src="${escape(s.prototypeVideo)}" aria-label="${escape(p.title)} final prototype" controls></video><button class="video-toggle" type="button">Play prototype</button><p class="video-error" hidden>Video unavailable. Add a valid video file to the project data.</p>` : `${media(s.prototypePoster, "[Describe prototype poster]", "[Add final prototype video here]")}<div class="prototype-fallback"><span class="play-icon" aria-hidden="true">▷</span><p>Prototype video not added yet.<br><small>Add an MP4 path in the project data.</small></p></div>`}</div></div></section><section class="case-section">${sectionHead("10", "Outcome & reflection")}<div class="two-column"><div><h3>Outcome</h3><p>${escape(s.outcome)}</p></div><div><h3>Reflection</h3><p>${escape(s.reflection)}</p></div></div></section>${nextProjectLink(next)}</div></article>`;
}
function about() {
  return `<article class="about-page section-shell about-refresh about-separated"><header class="about-refresh-heading"><h1>A little about me.</h1></header><div class="about-introduction-grid"><section class="about-note about-bio"><p class="about-note-kicker">Hi, I’m Iris.</p><h2>I like colour, simple design, and things that work.</h2><p>I’m a UI/UX designer based in Melbourne. I enjoy choosing colours and arranging a screen, then building what happens when someone clicks, taps or changes something.</p></section><section class="about-note about-building"><h2>How I got here.</h2><p>I first got into coding because turning a need into something that worked felt really satisfying. But I wanted it to look better too. That’s what brought me to design.</p><p>Now I enjoy both: figuring out the design, then building it so someone can try it.</p><a class="intro-work-link" href="#/cv">A bit more in my CV ${arrow}</a></section></div><section class="about-photography" aria-labelledby="about-photography-heading"><header class="about-photography-heading"><h2 id="about-photography-heading">A little photography, too.</h2><p>Outside of design and coding, I enjoy photographing everyday places.</p></header><div class="about-photography-pair"><figure><a href="public/images/about/everyday-passage.jpg" target="_blank" rel="noopener noreferrer" aria-label="View my photograph of a sunlit passage at full size"><img src="public/images/about/everyday-passage.jpg" alt="Sunlight cuts across a white wall beside red tiles, with green bins at the end of the passage" width="1600" height="1067" loading="lazy" decoding="async"></a></figure><figure><a href="public/images/about/everyday-construction.jpg" target="_blank" rel="noopener noreferrer" aria-label="View my photograph of houses under construction at full size"><img src="public/images/about/everyday-construction.jpg" alt="Timber roof frames of houses under construction beneath a wide blue sky" width="1600" height="1067" loading="lazy" decoding="async"></a></figure></div></section></article>`;
}

function cv() {
  const r = site.resume;
  const education = site.about.journey[0];
  const experience = r.projectIds.map(id => projects.find(p => p.id === id)).filter(p => p && p.published);
  return `<article class="cv-page section-shell cv-cards"><header class="cv-compact-header"><div><p class="eyebrow">CV / Résumé</p><h1>${escape(r.heading)}</h1><p>${escape(r.role)} · ${escape(r.location)}</p></div>${site.cv ? `<a class="cv-download" href="${escape(site.cv)}" download="Iris-Luo-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>` : ""}</header><div class="cv-card-grid"><section class="cv-card cv-profile"><h2>${escape(r.profileTitle)}</h2><p>${escape(r.profile)}</p><div class="cv-contact-links"><a href="tel:${r.phone.replace(/[^+0-9]/g, "")}">${escape(r.phone)}</a>${site.email ? `<a href="mailto:${escape(site.email)}">${escape(site.email)} ${arrow}</a>` : ""}${site.linkedin ? `<a href="${escape(site.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a>` : ""}</div></section><section class="cv-card cv-education"><h2>Education</h2><h3>${escape(education.title)}</h3><p>${escape(education.copy)}</p></section><section class="cv-card cv-experience"><h2>${escape(r.projectsTitle)}</h2>${experience.map(p => `<article class="cv-project-entry"><div class="cv-project-meta"><h3><a href="${projectHref(p)}">${escape(r.projectTitles[p.id] || p.title)} ${arrow}</a></h3></div><p class="cv-project-detail">${escape(r.projectDetails[p.id])}${p.liveUrl ? ` | <a href="${escape(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Live site</a>` : ""}</p><p>${escape(r.contributions[p.id] || p.sections.role)}</p></article>`).join("")}</section><section class="cv-card cv-skills"><h2>Skills</h2>${site.about.skillGroups.map(group => `<div class="cv-skill-group"><h3>${escape(group.title === "Front-end development" ? "Technical" : group.title)}</h3><ul>${group.items.map(item => `<li>${escape(item)}</li>`).join("")}</ul></div>`).join("")}</section><section class="cv-card cv-languages"><h2>Languages</h2><p>${site.about.languages.map(escape).join(" · ")}</p></section></div></article>`;
}

function bind(root, p) {
  const controller = new AbortController(),
    options = { signal: controller.signal };
  const observers = [];
  let raf = 0;
  const on = (el, type, fn) => el?.addEventListener(type, fn, options);
  const fallbackImages = () =>
    root.querySelectorAll("img[data-fallback]").forEach((img) =>
      on(img, "error", () => {
        img.parentElement.innerHTML = placeholder(img.dataset.fallback);
      }),
    );
  fallbackImages();
  const reels = [...root.querySelectorAll("[data-showreel]")];
  if (reels.length) {
    const reelObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && !reduced.matches) entry.target.play().catch(() => {});
      else entry.target.pause();
    }), { threshold: .35 });
    reels.forEach(reel => reelObserver.observe(reel));
    observers.push(reelObserver);
    on(reduced, "change", () => reels.forEach(reel => reel.pause()));
  }
  on(reduced, "change", () => root.querySelectorAll("[data-scratch-recording]").forEach(img => {
    img.src = `public/images/projects/lucky-scratch/real-interaction${reduced.matches ? "-poster.webp" : "-natural.gif"}`;
  }));
  const contactForm = root.querySelector(".contact-form");
  if (contactForm) on(contactForm, "submit", async event => {
    event.preventDefault();
    const status = contactForm.querySelector(".contact-form-status");
    const submit = contactForm.querySelector('[type="submit"]');
    if (["localhost", "127.0.0.1", "::1"].includes(location.hostname)) {
      status.textContent = "This preview can’t send messages yet. You can email me directly instead.";
      return;
    }
    submit.disabled = true;
    status.textContent = "Sending your hello…";
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(contactForm)).toString(),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Submission failed");
      contactForm.reset();
      status.textContent = "Thanks for saying hello! Your message has been sent.";
    } catch (error) {
      if (error.name !== "AbortError") status.textContent = "That didn’t go through. Please try again, or email me directly.";
    } finally { submit.disabled = false; }
  });
  const backToTop = $(".back-to-top");
  const updateBackToTop = () => { backToTop.hidden = window.scrollY < 300; };
  on(window, "scroll", updateBackToTop);
  on(backToTop, "click", () => {
    window.scrollTo({ top: 0, behavior: reduced.matches ? "instant" : "smooth" });
    $(".personal-wordmark").focus({ preventScroll: true });
  });
  requestAnimationFrame(updateBackToTop);
  const iconDemo = $(".icon-demo", root);
  let iconAudio = null;
  const applyWorkCategory = category => {
    if (!$(".work-page", root)) return;
    $(".home-curated", root).dataset.filter = category;
    const cards = [...root.querySelectorAll("[data-work-category]")];
    cards.forEach(card => { card.hidden = category !== "all" && card.dataset.workCategory !== category; });
    root.querySelectorAll(".home-section").forEach(section => {
      section.hidden = ![...section.querySelectorAll("[data-work-category]")].some(card => !card.hidden);
    });
    const headings = {
      all: ["Work", "Interface prototypes and a coded web narrative."],
      uiux: ["UI/UX Design", "Interface prototypes: task planning and place-based stories."],
      web: ["Web Development", "Coded experiences that respond to scrolling and touch."],
      visual: ["Graphic Design", "Illustration brought to life with motion and sound."]
    };
    root.querySelectorAll("[data-work-filter]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.workFilter === category)));
    const heading = $("#work .curated-section-heading", root);
    if (heading) {
      $("h2", heading).textContent = headings[category][0];
      $("p", heading).textContent = headings[category][1];
    }
    const playHeading = $("#play .curated-section-heading", root);
    if (playHeading) {
      $("h2", playHeading).textContent = category === "web" ? "Try it in the browser" : category === "visual" ? "Graphic Design" : "Graphics & creative coding";
      $("p", playHeading).textContent = category === "visual" ? "Illustration brought to life with motion and sound." : "Built for the browser. Try the live projects or explore how they work.";
    }
    if (category !== "all" && category !== "visual") iconAudio?.pause();
  };
  root.querySelectorAll("[data-work-filter]").forEach(button => on(button, "click", () => {
    applyWorkCategory(button.dataset.workFilter);
    root.querySelectorAll("[data-card] video").forEach(video => { if (video.closest("[data-card]").hidden) video.pause(); });
  }));
  const routeCategory = location.hash.split("/")[2];
  applyWorkCategory(["uiux", "web", "visual"].includes(routeCategory) ? routeCategory : "all");

  root.querySelectorAll("[data-icon-sound]").forEach(button => {
    on(button, "click", async () => {
      iconAudio?.pause();
    root.querySelectorAll("video, audio").forEach(media => media.pause());
      root.querySelectorAll(".icon-demo-item").forEach(item => item.classList.remove("is-playing"));
      const audio = new Audio(button.dataset.iconSound);
      iconAudio = audio;
      const status = $(".icon-demo-status", root);
      button.classList.add("is-playing");
      on(audio, "ended", () => {
        button.classList.remove("is-playing");
        status.textContent = "Sound on tap — choose another icon to listen.";
      });
      try {
        await audio.play();
        if (iconAudio === audio && !controller.signal.aborted) status.textContent = `Playing ${button.dataset.iconLabel} ♫`;
      } catch {
        if (iconAudio === audio && !controller.signal.aborted) {
          button.classList.remove("is-playing");
          status.textContent = "Sound unavailable. Try another icon or open the live website.";
        }
      }
    });
  });
  root.querySelectorAll("[data-section-target]").forEach(button => on(button, "click", () => {
    const section = document.getElementById(button.dataset.sectionTarget);
    section?.scrollIntoView({behavior: reduced.matches ? "instant" : "smooth", block:"start"});
    section?.focus({preventScroll:true});
  }));
  const scratchPreview = $(".scratch-preview", root);
  if (scratchPreview) {
    const cards = [...scratchPreview.querySelectorAll(".scratch-card")];
    const status = $(".scratch-status", scratchPreview);
    const sounds = Object.fromEntries([...scratchPreview.querySelectorAll("audio")].map(audio => [audio.dataset.scratchAudio,audio]));
    let soundOn = true;
    const stopSounds = () => Object.values(sounds).forEach(audio => audio.pause());
    const play = name => {
      if (!soundOn) return;
      sounds[name].currentTime = 0;
      sounds[name].play().catch(() => { status.textContent = "Sound unavailable — you can still flip and scratch."; });
    };
    cards.forEach(card => {
      const canvas = $("canvas",card), ctx = canvas.getContext("2d");
      canvas.width = 250; canvas.height = 350;
      let drawing = false, previous = null, revealed = false;
      const reset = () => {
        drawing = false; previous = null; revealed = false;
        card.classList.remove("is-flipped");
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#c6cbd3"; ctx.fillRect(0,0,250,350);
        ctx.globalCompositeOperation = "destination-out";
        canvas.style.opacity = "1"; canvas.style.pointerEvents = "auto";
      };
      const reveal = () => {
        if (revealed) return;
        revealed = true; drawing = false; sounds.scratch.pause();
        ctx.clearRect(0,0,250,350); canvas.style.opacity = "0"; canvas.style.pointerEvents = "none";
        status.textContent = $(".scratch-answer p",card).textContent;
        play("reveal");
      };
      card.resetScratch = reset; card.revealScratch = reveal; reset();
      on($(".scratch-front",card),"click",() => {
        card.classList.add("is-flipped"); play("flip");
        status.textContent = "Drag across the silver layer to reveal your message.";
      });
      const point = event => {
        const rect = canvas.getBoundingClientRect();
        return {x:(event.clientX-rect.left)*250/rect.width,y:(event.clientY-rect.top)*350/rect.height};
      };
      const erase = point => { ctx.beginPath(); ctx.arc(point.x,point.y,15,0,Math.PI*2); ctx.fill(); };
      on(canvas,"pointerdown",event => {
        if (revealed || !card.classList.contains("is-flipped")) return;
        event.preventDefault(); drawing = true; previous = point(event);
        canvas.setPointerCapture(event.pointerId); erase(previous); play("scratch");
      });
      on(canvas,"pointermove",event => {
        if (!drawing) return;
        const next = point(event), steps = Math.max(1,Math.ceil(Math.hypot(next.x-previous.x,next.y-previous.y)/5));
        for(let i=1;i<=steps;i++) erase({x:previous.x+(next.x-previous.x)*i/steps,y:previous.y+(next.y-previous.y)*i/steps});
        previous = next;
      });
      const finish = () => {
        if (!drawing) return;
        drawing = false; sounds.scratch.pause();
        const pixels = ctx.getImageData(0,0,250,350).data;
        let cleared = 0;
        for(let i=3;i<pixels.length;i+=4) if(pixels[i] === 0) cleared++;
        if(cleared/(250*350)>=.4) reveal();
      };
      on(canvas,"pointerup",finish); on(canvas,"pointercancel",finish); on(canvas,"lostpointercapture",finish);
    });
    scratchPreview.querySelectorAll("[data-scratch-choice]").forEach(button => on(button,"click",() => {
      stopSounds();
      cards.forEach((card,i) => {card.hidden = i !== Number(button.dataset.scratchChoice);card.resetScratch();});
      scratchPreview.querySelectorAll("[data-scratch-choice]").forEach(choice => choice.setAttribute("aria-pressed",String(choice === button)));
      status.textContent = "Flip the card, then drag to scratch.";
    }));
    on($(".scratch-reset",scratchPreview),"click",() => {
      stopSounds(); cards.forEach(card => card.resetScratch()); status.textContent = "Flip the card, then drag to scratch.";
    });
    on($(".scratch-sound",scratchPreview),"click",event => {
      soundOn = !soundOn; stopSounds(); event.currentTarget.setAttribute("aria-pressed",String(soundOn));
      event.currentTarget.textContent = soundOn ? "Sound on ♫" : "Sound off";
    });
    on($(".scratch-reveal",scratchPreview),"click",() => {
      const card = cards.find(card => !card.hidden); card.classList.add("is-flipped"); card.revealScratch();
    });
  }
  const range = $("#compare-range", root);
  const compare = (value) => {
    range.value = value;
    const amount = Number(value);
    const comparison = $(".comparison", root);
    const status = amount === 0 ? "Before — original design" : amount === 100 ? "After — revised design" : `Comparison — ${amount}% After revealed from the left`;
    range.setAttribute("aria-valuetext", status);
    comparison.style.setProperty("--split", `${amount}%`);
    comparison.dataset.view = amount === 0 ? "before" : amount === 100 ? "after" : "mixed";
    $(".comparison-status", comparison).textContent = status;
    comparison.querySelectorAll("[data-compare]").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.compare) === amount)));
  };
  on(range, "input", () => compare(range.value));
  root
    .querySelectorAll("[data-compare]")
    .forEach((b) => on(b, "click", () => compare(b.dataset.compare)));
  root.querySelectorAll(".hotspot").forEach((b) =>
    on(b, "click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", open);
      document.getElementById(b.getAttribute("aria-controls")).hidden = !open;
    }),
  );
  root.querySelectorAll(".full-walkthrough").forEach(details => on(details,"toggle",() => {
    if (!details.open) details.querySelector("video")?.pause();
  }));
  on(reduced,"change",() => {
    if (!reduced.matches || !iconDemo) return;
    iconDemo.classList.add("is-paused");

  });
  const video = $(".prototype video", root),
    toggle = $(".video-toggle", root);
  if (video) {
    on(toggle, "click", async () => {
      if (video.paused) {
        try {
          await video.play();
        } catch {
          $(".video-error", root).hidden = false;
        }
      } else video.pause();
    });
    on(video, "play", () => { if (toggle) toggle.textContent = "Pause prototype"; });
    on(video, "pause", () => { if (toggle) toggle.textContent = "Play prototype"; });
    on(video, "error", () => {
      $(".video-error", root).hidden = false;
      if (toggle) toggle.disabled = true;
    });
  }
  root.querySelectorAll("[data-process]").forEach((b) => {
    const activate = () => {
      root
        .querySelectorAll("[data-process]")
        .forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
      $("#process-description", root).innerHTML =
        `<span>0${+b.dataset.process + 1}</span><p>${escape(site.about.processes[b.dataset.process].copy)}</p>`;
    };
    on(b, "pointerenter", activate);
    on(b, "focus", activate);
    on(b, "click", activate);
  });
  const marquee = $(".marquee", root),
    pause = $(".marquee-toggle", root);
  on(pause, "click", () => {
    const paused = pause.getAttribute("aria-pressed") !== "true";
    pause.setAttribute("aria-pressed", paused);
    pause.textContent = paused ? "Resume movement" : "Pause movement";
    marquee.classList.toggle("paused", paused);
  });
  if (p) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = p.sections.story[entry.target.dataset.story];
            $(".sticky-media", root).innerHTML = media(
              step.image,
              "[Describe design process image]",
              `[Add image: ${step.title}]`,
            );
            root
              .querySelectorAll(".story-step")
              .forEach((s) => s.classList.toggle("active", s === entry.target));
            fallbackImages();
          }
        });
      },
      { rootMargin: "-30% 0px -35%", threshold: 0 },
    );
    root.querySelectorAll(".story-step").forEach((el) => observer.observe(el));
    observers.push(observer);
  }
  const preview = $("#preview"),
    list = $(".project-list", root);
  let x = 0,
    y = 0,
    tx = 0,
    ty = 0,
    active = false,
    current = "";
  function move() {
    x += (tx - x) * 0.1;
    y += (ty - y) * 0.1;
    preview.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (active && Math.abs(tx - x) + Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(move);
    else raf = 0;
  }
  function point(e) {
    if (!finePointer.matches || reduced.matches) return;
    tx = innerWidth * 0.43 + (e.clientX / innerWidth - 0.5) * 44;
    const mediaHeight = preview.offsetWidth / 1.6;
    ty = Math.max(96, Math.min(innerHeight - mediaHeight - 48, e.clientY - mediaHeight * 0.48));
    if (reduced.matches) {
      x = tx;
      y = ty;
      preview.style.transform = `translate(${x}px,${y}px)`;
    } else if (!raf) raf = requestAnimationFrame(move);
  }
  function hide() {
    active = false;
    current = "";
    preview.classList.remove("visible");
    list?.classList.remove("interacting");
    root.querySelectorAll(".project-row").forEach((row) => row.classList.remove("active"));
    preview.querySelector("video")?.pause();
    document.body.classList.remove("project-hover");
    document.body.style.removeProperty("--page-bg");
    document.body.style.removeProperty("--project-accent");
    document.body.style.removeProperty("--project-accent-text");
  }
  root.querySelectorAll(".project-row[data-project]").forEach((row) => {
    const show = (e) => {
      if (!finePointer.matches || reduced.matches) return;
      const project = projects.find((p) => p.slug === row.dataset.project);
      const first = !active;
      active = true;
      list.classList.add("interacting");
      root
        .querySelectorAll(".project-row")
        .forEach((el) => el.classList.toggle("active", el === row));
      document.body.style.setProperty("--page-bg", project.background);
      document.body.style.setProperty("--project-accent", project.accent);
      document.body.style.setProperty(
        "--project-accent-text",
        accentForText(project.accent, project.background),
      );
      document.body.classList.add("project-hover");
      if (current !== project.slug) {
        current = project.slug;
        preview.innerHTML = `<div class="preview-window">${project.previewVideo ? `<video muted loop playsinline poster="${escape(project.thumbnail)}" src="${escape(project.previewVideo)}"></video>` : media(project.thumbnail, project.thumbnailAlt, `${project.title} — Homepage preview`)}</div><div class="preview-caption"><span>${escape(project.role)}</span><span>↗</span></div>`;
        preview.querySelector("img")?.addEventListener(
          "error",
          () => {
            $(".preview-window", preview).innerHTML = placeholder(`${project.title} — Preview`);
          },
          { once: true },
        );
        const v = preview.querySelector("video");
        if (v) {
          v.addEventListener(
            "error",
            () => {
              $(".preview-window", preview).innerHTML = media(
                project.thumbnail,
                project.thumbnailAlt,
                "Project preview unavailable",
              );
            },
            { once: true },
          );
          if (!reduced.matches) v.play().catch(() => {});
        }
      }
      point(e);
      if (first) {
        x = tx;
        y = ty;
        preview.style.transform = `translate3d(${x}px,${y}px,0)`;
      }
      preview.classList.add("visible");
    };
    on(row, "pointerenter", show);
    on(row, "pointermove", (e) => {
      if (!active) show(e);
      else point(e);
    });
    on(row, "pointerleave", () => {
      if (document.activeElement !== row) hide();
    });
    on(row, "focus", () => {
      const rect = row.getBoundingClientRect();
      show({ clientX: innerWidth * 0.65, clientY: rect.top + rect.height * 0.5 });
    });
    on(row, "blur", hide);
  });
  let parallaxFrame = 0;
  const coverImage = (p?.type === "photography" || p?.mediaFit === "contain") ? null : $(".case-cover img", root);
  on(window, "scroll", () => {
    const focusedRow = root.querySelector(".project-row:focus");
    if (focusedRow) {
      const rect = focusedRow.getBoundingClientRect();
      if (rect.bottom > 88 && rect.top < innerHeight)
        point({ clientX: innerWidth * 0.65, clientY: rect.top + rect.height * 0.5 });
      else hide();
    } else hide();
    if (coverImage && !reduced.matches && !parallaxFrame)
      parallaxFrame = requestAnimationFrame(() => {
        const rect = coverImage.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight)
          coverImage.style.transform = `translateY(${Math.max(-10, Math.min(10, rect.top * 0.025))}px) scale(1.03)`;
        parallaxFrame = 0;
      });
  });
  on(finePointer, "change", hide);
  on(reduced, "change", () => {
    hide();
    if (coverImage) coverImage.style.transform = "";
    document.querySelectorAll("[data-magnetic]").forEach((el) => (el.style.transform = ""));
  });
  document.querySelectorAll("[data-magnetic]").forEach((link) => {
    on(link, "pointermove", (e) => {
      if (reduced.matches || !finePointer.matches) return;
      const r = link.getBoundingClientRect();
      link.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.04}px,${(e.clientY - r.top - r.height / 2) * 0.08}px)`;
    });
    on(link, "pointerleave", () => (link.style.transform = ""));
  });
  return () => {
    controller.abort();
    observers.forEach((o) => o.disconnect());
    cancelAnimationFrame(raf);
    cancelAnimationFrame(parallaxFrame);
    hide();
    preview.innerHTML = "";
    video?.pause();
    iconAudio?.pause();
    root.querySelectorAll("video, audio").forEach(media => media.pause());
  };
}
function render() {
  stopProjectOpening();
  cleanup();
  const hash = location.hash || "#/",
    route = hash.slice(1),
    main = $("#main");
  document.body.dataset.page = route === "/" ? "home" : route.startsWith("/work") ? "work" : "other";
  frame(route);
  let p;
  if (route.startsWith("/project/")) {
    p = publishedProjects(projects).find((p) => p.slug === route.slice(9));
    main.innerHTML = p
      ? projectPage(p)
      : '<section class="cv-page section-shell"><h1>Project not found.</h1><a href="#/">Back to selected work ↗</a></section>';
  } else main.innerHTML = route === "/about" ? about() : route === "/cv" ? cv() : route === "/contact" ? contactPage() : route.startsWith("/work") || hash === "#work" ? workPage() : home();
  document.title = p ? `${p.title} — IrisLuo` : route === "/about" ? "About — IrisLuo" : route === "/cv" ? "CV — IrisLuo" : route === "/contact" ? "Contact — Iris Luo" : route.startsWith("/work") ? "Work — Iris Luo" : "Iris Luo — UI/UX Designer";
  cleanup = bind(main, p);
  window.scrollTo({ top: 0, behavior: "instant" });
  if (navigationId) {
    main.focus({ preventScroll: true });
  }
  navigationId++;
  if (pendingProjectTransition?.hash === hash && p) startProjectOpening();
  else pendingProjectTransition = null;
}
let pendingProjectTransition = null;
let openingAnimation = null;
function stopProjectOpening() {
  openingAnimation?.cancel();
  openingAnimation = null;
  document.body.classList.remove("project-opening");
  const cover = $("#transition-cover");
  cover.style.display = "none";
  cover.replaceChildren();
}
function startProjectOpening() {
  const { rect, markup } = pendingProjectTransition;
  pendingProjectTransition = null;
  if (reduced.matches || !finePointer.matches) return;
  const cover = $("#transition-cover");
  const target = $(".case-cover").getBoundingClientRect();
  cover.innerHTML = markup;
  cover.style.cssText = `display:block;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
  document.body.classList.add("project-opening");
  const duration = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--project-open"),
  );
  openingAnimation = cover.animate(
    [
      {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
      {
        left: `${target.left}px`,
        top: `${target.top}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
      },
    ],
    { duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
  );
  openingAnimation.finished.then(stopProjectOpening).catch(() => {});
}
// A route change happens immediately; the media overlay bridges the two real rectangles.
// Resizing, reduced motion or a new navigation cancels the overlay without delaying content.
window.addEventListener("resize", stopProjectOpening);
reduced.addEventListener("change", stopProjectOpening);
document.addEventListener("click", (e) => {
  if (e.target.closest(".skip-link")) {
    e.preventDefault();
    $("#main").focus({ preventScroll: true });
    $("#main").scrollIntoView({ behavior: "instant" });
    return;
  }
  const link = e.target.closest("a[data-project]");
  if (
    !link ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0 ||
    reduced.matches ||
    !finePointer.matches
  )
    return;
  const p = projects.find((p) => p.slug === link.dataset.project);
  if (!p) return;
  e.preventDefault();
  const preview = $("#preview");
  const visibleMedia = preview.classList.contains("visible") ? $(".preview-window", preview) : null;
  const thumbnail = $(".inline-thumbnail", link);
  const source = visibleMedia || (thumbnail?.getBoundingClientRect().width ? thumbnail : link);
  const rect = source.getBoundingClientRect();
  // Use the actual displayed image (including fallback), not a second differently cropped card.
  const displayed = visibleMedia?.querySelector(".media, .media-placeholder");
  pendingProjectTransition = {
    hash: link.hash,
    rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    markup: displayed?.outerHTML || media(p.thumbnail, p.thumbnailAlt, `${p.title} — Cover`),
  };
  location.hash = link.hash;
});
window.addEventListener("hashchange", render);
render();
