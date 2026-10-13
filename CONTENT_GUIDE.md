> 2026-10-08 更新：当前公开页面已移除项目时长和占位内容，Bubble Bloom 保持未发布；Food Icons 移至实验区。旧文档中关于公开占位的说明不再适用。最新结构和修改边界见 [PORTFOLIO_REVIEW_CHANGES.md](PORTFOLIO_REVIEW_CHANGES.md)。

# Editing Iris’s portfolio

Run `npm run dev` and open http://127.0.0.1:8081. There are no runtime dependencies. `npm run build` creates a static site in `dist/`; publish that directory on any static host. Hash routes work without hosting rewrites. The original `idex.html` entry point remains supported.

## Text and links
Edit **src/data/siteData.js**. `site` contains the introduction, navigation, About copy, process stages, contact details and CV. `projectData` contains titles, subtitles, years, tags, roles, colours and media. The `sections()` function supplies explicitly labelled case-study placeholders. For unique project content, edit that project's `sections` object. For example, set `introduction: 'Your summary'` and `research: 'Your research description'`. Unspecified fields retain their labelled defaults. Never publish unverified outcomes or metrics.

Set `site.email` to a plain email address, `site.linkedin` to the full profile URL and `site.cv` to `public/documents/iris-luo-cv.pdf`. Empty contact links remain clearly labelled. A missing CV shows a dedicated placeholder page.

## Current personal content

The current copy is adapted from Iris’s supplied CV. `site.email`, `site.linkedin`, `site.cv`, `site.cvPreview`, `site.about` and the four project summaries are populated. The CV lists RMIT study as July 2024–Present, DoItNow as 2025 and Watching the Wait as 2026. No employment history or project performance metrics have been inferred. LinkedIn is connected as a link; its page content was not accessible.

The website CV has its phone number removed and is stored at `public/documents/iris-luo-cv.pdf`; its one-page rendered preview is `public/documents/iris-luo-cv-preview.png`. Replace both when updating the CV. The two documented live project links are in each project's `liveUrl` field. Unsupported case-study evidence, project media and personal interests remain explicit placeholders.

## Images
Use each project's folder in `public/images/projects/`. Set `thumbnail`, `thumbnailAlt` and section image paths in the data file. Use your own project screenshots and artefacts, not advertising mockups. Recommended cover/preview size: **1600 × 1000**; gallery images: **1200 × 750**. Prefer compressed WebP or AVIF, ideally under 250 KB per image. Retain meaningful alt text. Missing paths render a neutral labelled fallback. Existing SVGs are deliberately labelled placeholders, not claimed project work.

`sections.gallery` stores image paths, alt text and captions. `sections.story` stores sticky storytelling images and captions. `sections.comparison` supplies before/after images. `sections.hotspots` stores labels, text and percentage coordinates. For custom ratios, crop source media thoughtfully; the standard slots reserve a 16:10 ratio to prevent layout shift.

## Video
Place files in `public/videos/`. Use H.264 MP4, 720p or 1080p, with a short **5–12 second** compressed loop (preferably under 3 MB). Set `previewVideo` for the desktop hover loop; it plays muted only while hovered and stops under reduced motion. Set `sections.prototypeVideo` and `sections.prototypePoster` for a user-controlled case-study video. Supply captions in the video if any speech conveys essential information. The prototype does not autoplay. Without a video, an honest placeholder appears instead of a broken play button.

## Add a project
Add an object to the `projectData` array, following the existing fields, with a unique URL-safe `slug`. Add its asset folder. The homepage, case-study route and next-project cycle update automatically. All pages use the same reusable renderer; no component markup needs duplication. Override any section content in that object's `sections` property. Set `nextProject` to a slug to override the default cycle.

## Project interaction styling

Each project has separate `background` and `accent` values in `src/data/siteData.js`. The soft `background` colours the page on hover; `accent` colours underlines and small details. Small accent text is darkened only when necessary to meet 4.5:1 contrast. Previews use `--preview-surface: #F8F5EF` and a thin `--preview-border`. The local SVG placeholders share this neutral surface, with project-coloured linework and labels. Real images and videos retain their original colours without an overlay.

The motion tokens at the top of `style.css` control preview width (`52vw`), title movement (`32px`), inactive-row opacity (`0.22`), the diagonal reveal (`550ms`) and opening into the actual case-study cover (`600ms`). Keyboard focus gets the same desktop treatment. Touch layouts and reduced-motion mode use inline media without cursor overlap or expansion transitions.

## Typography and work layout

The work index shows media by default in a staggered desktop composition; mobile uses a single column with small offsets. Project names, descriptions, image paths and video paths still come from `src/data/siteData.js`.

`style.css` defines the typography and colour tokens: `--display-font` (Bricolage Grotesque), `--accent-font` (Fraunces italic), `--sans` (DM Sans), `--ink` (ink purple) and `--accent-text` (muted plum). Compressed Latin WOFF2 fonts and their SIL Open Font Licenses are stored in `public/fonts/`; no external font request is needed at runtime. Other scripts use the system font fallback. The final “Personal typography” section contains the asymmetric project layout and mobile rules.

## Verification
`npm run lint`, `npm test`, `npm run build`. Review `#/`, `#/about`, `#/cv`, `#/contact` and `#/project/<slug>` at desktop and mobile sizes. Use Tab/Enter for projects, arrow keys for the comparison slider, and buttons to show the entire before or after state. OS reduced-motion settings disable decorative movement.


## 持续添加项目与首页区域

只需编辑 `src/data/siteData.js`：

- `projectData`：原始项目列表。`id` 是稳定身份，不随显示名称变化；`slug` 是详情页 URL，尽量保持不变。`title` 名称、`subtitle` 简介、`year` 年份、`tags` 标签。
- `category`：`work`、`play` 或 `photography`，决定首页归属。`type`：`product`（UX 案例）、`interactive`（演示与交互说明）、`photography`（原比例图库），与首页归属独立。
- `order`：数字越小越靠前，也决定默认下一项目顺序。`featured`：是否精选；默认 Selected Work 只展示精选项目。`published: false`：从所有列表与详情路由隐藏（静态源码仍包含该记录，不要存放机密草稿）。
- `thumbnail` / `thumbnailAlt`：封面路径和描述；`previewVideo`：可选预览视频；`liveUrl`：可选在线项目链接。空字符串显示明确占位。
- `sections`：详情内容。原有产品案例字段不变；互动项目使用 `introduction`、`role`、`team`、`duration`、`tools`、`interaction`、`demonstration`、`prototypeVideo`、`prototypePoster`、`context`、`process`、`solution`、`outcome`、`reflection`；摄影使用 `introduction` 与 `gallery`。
- `homeSections`：每个区域的 `title`、`description`、`order`、`visible`、`category`、`featuredOnly` 与 `layout`。布局可选 `editorial`、`compact`、`photography`。数量自动计算；隐藏区域不会撤下其中已发布项目的详情。

添加第五个 Selected Work 项目：复制一条项目记录，使用唯一 `id` / `slug`，设置 `category: "work"`、`featured: true`、`published: true`，再设置 `order`。错位网格每四项循环，可容纳奇数，不需要添加项目专属 CSS。

Bubble Bloom、Lucky Scratch 和摄影系列的素材目录已预留在 `public/images/projects/` 下。视频放 `public/videos/`。此版本不生成新演示或摄影作品。新项目的空封面直接显示占位块。

摄影 `gallery` 每项格式为 `{ src, alt, caption, width, height }`，宽高填写照片原始尺寸以减少加载位移；不裁切图片。没有照片时保留空 `src` 与明确占位文案。上传真实照片后补充准确 alt 和 caption。视频保留原生播放控件，不自动播放有声内容。

共用渲染器在 `main.js`：`homeSection` / `projectTile` 管理首页，`projectPage` 根据类型分派，`caseStudy`、`interactiveContent`、`photoGallery` 管理详情。增添项目无需修改这些函数。


## Watching the Wait 素材与内容

该项目已使用提供的项目报告和真实线上界面补充内容。`public/images/projects/watching-the-wait/cover.webp` 为封面；编号 WebP 为真实网页状态截图；`public/videos/watching-the-wait-preview.mp4` 为 11.8 秒静音转场动画（真实界面截图编辑序列，并非连续录屏）。首页悬停使用 `previewVideo`，详情页通过 `sections.prototypeVideo` 播放；两者可独立替换。

`sections.contentBlocks` 控制叙事章节，可包含 `title`、`copy` 段落数组、可选 `image` / `alt` / `caption`、`stages` 阶段数组、`credits`。其他互动项目不提供该字段时继续使用原有简洁模板。`mediaFit: "contain"` 与 `coverRatio` 可保持封面完整。项目时长及未提供的评价证据仍为明确占位，不代表已验证的用户研究结论。

## Mapped in Memory

该项目的封面和内容来自提供的 AT4 演示稿与本地 mockup 视频。`public/images/projects/mapped-in-memory/cover.webp` 是封面；`welcome-flow.webp`、`ar-flow.webp`、`identity-flow.webp`、`checkpoint-plan.webp` 为原演示页，其他 WebP 为视频帧。所有原始桌面文件保持不变。

- `public/videos/mapped-in-memory-preview.mp4`：约 11.3 秒静音剪辑，供首页悬停使用。
- `public/videos/mapped-in-memory-walkthrough.mp4`：完整约 80 秒视频，保留原音轨，仅用户主动播放；`preload="none"` 避免自动下载完整视频。
- `videoUrl`：YouTube 演示链接，与 `liveUrl` 分开，避免把演示误标为可操作的 Live demo。
- `sections.contentBlocks`：项目叙事与团队分工。产品类型设置这些章节后可以用已提供的资料组织详情，而不是强制显示空白研究模板。
- 实际项目时长、个人反思与未提供的评价证据仍待填写。演示稿中的十周计划和预算为提案，不能当作实际完成记录。

## DoItNow

已依据 AT4_DoItNow_Presentation.pdf 和 Demo_Video.mov 填写内容：访谈样本为一位大学生；测试记录没有给出完整参与者总数，因此不推断人数或量化效果。

- 封面及研究、测试、修改前后图：`public/images/projects/doitnow/`。
- 首页静音预览：`public/videos/doitnow-preview.mp4`，约 11.3 秒，来自原视频的规划、任务完成和追踪片段。
- 完整演示：`public/videos/doitnow-walkthrough.mp4`，约 2 分 13 秒，保留竖屏比例；通过 `sections.videoOrientation: "portrait"` 使用适合竖屏的视频布局。
- `sections.contentBlocks` 中的 `comparison` 使用已有的可访问前后对比组件，`insightDecisionEvidence` 存放发现、决策和证据，`gallery` 展示原始竖屏界面。
- 实际项目时长仍需补充。浅色模式、团队分享与个性化按演示稿列为未来方向；界面中的任务数量为原型示例数据。
