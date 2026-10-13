# 作品集评审后的修改记录

## 已完成

1. **公开完成度**：Bubble Bloom 改为未发布；首页、详情和下一项目循环不再显示它。所有已发布项目移除未知的项目时长，清除可见的占位描述和待填反思。
2. **求职定位**：首页、About、网页 CV、下载 PDF 与联系区统一为 RMIT Digital Design 学生、寻找 UI/UX 或产品设计入门岗位。首页改为具体的 planning / exploring / playing 主题。
3. **首页层级**：缩短大标题，降低字级，收紧空白和联系区；保留米白、深紫与双字体风格。项目卡增加具体能力线索。
4. **作品选编**：精选区保留 DoItNow、Mapped in Memory、Watching the Wait；Food Court Icons 和 Lucky Scratch 放在实验区。
5. **快速阅读**：每个已发布项目开头都有三项摘要和项目状态；新增章节跳转，并把焦点移到对应章节以支持键盘使用。
6. **DoItNow**：按可编辑计划、活动反馈、进度提示三项决定组织。保留真实前后图；把实际点击范围、复测和减少拖延的效果明确列为未验证事项。
7. **团队与叙事项目**：Mapped in Memory 优先说明本人贡献，并精简概念流程；Watching the Wait 删除重复状态图和重复限制说明，突出界面状态与声音的关系。
8. **媒体分工**：整张课程幻灯片变成可展开的补充来源；图库提供原图链接；产品案例先讲决策，短视频与完整视频分层提供。
9. **互动演示**：Food Icons 保留原图状态与点击音效；Lucky Scratch 新增直接嵌入原始线上网站，保留原站背景、卡片比例、文字和翻卡刮擦音效。已按用户要求移除 ChatGPT 做图的说明，保留音效来源说明。
10. **简历和验收**：修订下载 PDF 与预览，嵌入字体并保留可点击链接；新增公开占位、草稿导航和媒体资源检查，测试计数随精选项目数量变化。

## 不能通过编辑网站替代的工作

- 真实复测、观众反馈、研究参与者信息，需要实际执行和记录；这次没有伪造研究或用户结果。
- 实际设计中触控范围和颜色对比的验证，需要原型或源设计文件。这次修正了作品集的相关表述，没有把改文案当成已改善原产品。
- 个人反思必须来自本人。当前用明确的后续验证方向替代待填区，没有冒充新的个人经历。
- 网站的真实招聘阅读效果，还需要请目标读者完成“找到一个决定、识别本人贡献、找到联系方式”的任务。
- 修改保存于本地，不代表已发布到线上。

## 后续编辑

- 项目内容：`src/data/siteData.js`。
- 页面组件和互动：`main.js`。
- 视觉与响应式样式：`style.css`。
- PDF 简历生成：`scripts/build-cv.py`；需要运行时内的 reportlab，生成文件同步到 `public/documents/iris-luo-cv.pdf`。
- 可见页面不再要求时长；新项目请完成摘要、说明和素材后再设置 `published: true`。


### Lucky Scratch component integration
- Replaced the full-site iframe with a scoped native card preview in the shared case-study layout.
- Preserved the original 250 × 350 dimensions, cover/reveal artwork, dark frame, three background colours, messages, Sour Gummy type, flip motion, silver coating and 40% scratch threshold.
- Added card selection, replay, sound toggle and a keyboard-accessible reveal option.
- Verified actual drag-to-reveal, card switching and reset in the browser, plus desktop/mobile layout. Lint, all 10 tests and production build passed.


### Positioning and copy review
- Homepage now leads with “I design it. Then I make it work.” and states the combination of visual design, interaction and front-end code.
- Practice, About and web CV use concrete project evidence instead of repeating the career introduction.
- Reviewed all five published project pages; made headings specific, separated design decisions from implementation details, and removed duplicated explanations.
- Kept Figma simulation and AR concept limits explicit. No new experience, outcome or user-research claims were added.
- Replaced generic footer copy and updated search description. Downloadable CV was not regenerated; its existing project descriptions already document design and development.
- Checked desktop and 390px homepage layout and rendered About content. Lint, 10 data checks and production build passed.


### Colour, depth and interactive presentation
- Added violet accents, pale section colours and layered card shadows with restrained hover elevation.
- Homepage includes a working three-icon preview with original images, sound and pause controls.
- Rebalanced the selected-work grid and gave Watching the Wait a wide feature card.
- Gave visual comparisons their own coloured surfaces, and added real interface examples to About.
- Verified desktop and mobile layouts, homepage audio feedback and project comparison rendering. Reduced-motion handling remains in place.


### Revised palette and card material
- Replaced portfolio violet accents with small orange-red, cobalt and green details; text uses charcoal.
- Added a 32-second low-saturation background gradient transition, disabled for reduced-motion preferences.
- Neutral card surfaces use a local grain texture, inner highlights, fine borders and layered shadows. Original project artwork remains intact.
- Browser confirmed the active gradient animation and desktop presentation. Lint, all 10 tests and build passed.


### Print and coordinate-grid visual direction
- Warm paper, fine edge grids, a sulphur-yellow label, ink-blue type and vermilion halftone mark replace the generic pastel treatment.
- Cards have stacked paper edges and subtle texture; the central reading area avoids grid detail.
- Added a working pause/resume background control, stronger keyboard focus, and forced-colour decoration removal.
- Checked five new foreground colours against eight surface/gradient endpoints: minimum ratio 5.23:1. This is a scoped palette check, not full-site WCAG certification.
- Browser verified background pause and 320px reflow without horizontal overflow.


### Personal navigation
- Replaced the full-width navigation strip with a separate Iris Luo typographic wordmark and numbered navigation index.
- Added clear current-page styling, subtle arrow/type hover feedback, and preserved semantic links and keyboard focus.
- Removed the yellow hard-shadow introduction label; the short line now reads “Visual ideas. Working code.”
- Verified About current-page state, keyboard movement and 44px targets at 320px without horizontal overflow. Lint, 10 checks and build passed.

### Bottom floating navigation
- Moved Work / About / CV / Contact into a compact fixed bottom dock; removed navigation numbers and arrows.
- Kept the Iris Luo wordmark at the top, with quiet pale neutral surfaces and a clear current-page state.
- Preserved keyboard focus, 44px touch targets, safe-area spacing and page-end clearance; checked desktop and 320px mobile layouts.
- Lint, all 10 tests and production build passed.

### About in Iris’s own voice
- Removed the repeated project-image gallery and case-study summaries.
- Rewrote the introduction around Iris’s stated preference for colour, simplicity and useful design.
- Added her actual journey from coding to learning design, and her interests in photography and films.
- Verified rendered content; lint, 10 tests and build passed.

### CV page for recruitment scanning
- Replaced oversized display heading with a compact name, role and prominent PDF download link.
- Grouped profile/contact, education, project contributions, skills and languages into responsive cards.
- Rewrote project entries around verified individual contributions, without invented results.
- Omitted unconfirmed education dates on the webpage. Downloadable PDF has not been revised in this pass.
- Checked desktop and 320px mobile without horizontal overflow; lint, 10 tests and build passed.

### UI/UX-first homepage
- Compressed the opening introduction and made DoItNow the first featured case study.
- Displayed original before/after planning screens with verified contribution and feedback-driven changes; stated prototype limits.
- Ordered supporting work as Watching the Wait then Mapped in Memory; moved playable icons after the experiments section.
- Kept semantic project links and responsive layout. Checked 320px reflow and icon audio status; lint, 10 tests and build passed.

### Homepage work filters
- Replaced section labels with All work, UI/UX, Interactive web and Visual experiments buttons.
- Filters show matching project cards, hide empty sections and announce the visible project count.
- Confirmed all four filters, reset to all, and 44px buttons without overflow at 320px; lint, tests and build passed.

### Curated homepage with reference palette
- Added slate, off-white, peach, yellow and coral accents based on the supplied reference.
- Made DoItNow a dark featured card, with differently sized and offset before/after screens and a bright case-study link.
- Gave supporting projects unequal widths and staggered positions; smaller experiments follow as a lighter group.
- Moved the duplicate icon demonstration into an expandable panel, preserving audio and category filtering.
- Verified 320px reflow, all category filtering, disclosure and sound. New small-text pairings meet 4.5:1 contrast; this is not a complete accessibility audit.
- Lint, 10 tests and production build passed.

### Palette shared across the website
- Removed the isolated dark DoItNow block and project-specific accent stripes; hierarchy still uses scale and staggered placement.
- Shared paper/slate foundations, yellow action/selection states, peach heading details and coral markers across Home, About and CV.
- Applied the colour atmosphere to the full page background and unified card surfaces. Original project artwork and downloadable CV remain intact.
- Verified Home, About and CV desktop presentation and 320px CV reflow; lint and build passed.

### Typography without yellow highlights
- Removed the homepage marker-highlight markup and serif italic second line; used expressive sans-serif weight contrast and a dark coral accent.
- Replaced yellow website buttons and selection states with slate; removed yellow from the background atmosphere.
- Updated project-card and case-page titles to Bricolage Grotesque with stronger weight and tighter spacing. Source project artwork remains original.
- Browser confirmed project title font/weight and 320px reflow; lint and build passed.

### Technical background beneath the creative work
- Added edge pixel grids, decorative line numbers and pixel accents across the site.
- Used the actual scratch-card flip CSS as a small code fragment in the top margin; it fades after scrolling.
- Kept the central reading column clear and decoration non-interactive/hidden from assistive technology.
- Mobile hides the code fragment; confirmed no horizontal overflow at 320px. Lint and build passed.

### A more relaxed site-wide type system
- Locally bundled open-source Karla and applied it to website headings, body copy, navigation and controls.
- Removed serif/italic styling from the wordmark and About notes; eased heavy title weights and tight tracking.
- Replaced all-caps display treatment in small labels with natural casing. Original artwork and supplied CV PDF remain unchanged.
- Verified font loading, Home/About presentation and 320px CV reflow; lint and build passed.

### Icons with explicit labels
- Added matching inline SVG icons to Work, About, CV and Contact navigation links.
- Added mail, LinkedIn and document icons to footer contacts, retaining the visible address and labels.
- Mobile stacks each icon over its label, with 52px targets; checked 320px with back-to-top visible and no overflow.
- Decorative SVGs are hidden from assistive technology. Lint and build passed.

## Recruitment-focused refinement

- Replaced repeated homepage slogans with a brief introduction linking UI/UX, coding and actual project interactions.
- DoItNow now leads with editable planning rather than the secondary progress-display iteration. Its Figma and simulated-planning scope remain explicit.
- Removed decorative pixel overlays and universal card wrappers on Home and About; retained restrained cool atmosphere, shared coral accents and image elevation.
- Work navigation targets the filters. Back-to-top sits outside the dock, so its appearance does not move navigation items.
- Filtered layouts close gaps and show category-specific headings. Removed obsolete hidden project counts.
- Removed the generic camera illustration and repeated About prose. Personal photography awaits actual assets.
- Consolidated global CSS tokens and removed 259 superseded declarations. Disabled redundant cursor-following previews for the image-led homepage.
- Validation: lint, 10 data tests and production build pass. Browser checks covered desktop navigation width before/after back-to-top (371.21px), all category filters, 320px overflow and 44px filter controls, CV PDF link, and Lucky Scratch flip/reveal alternative. This is not a complete accessibility certification.
