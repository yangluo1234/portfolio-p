import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { projects, site, withProjectDefaults, resolveHomeSections, homeSections, nextPublishedProject, publishedProjects } from "../src/data/siteData.js";
test("every project has a unique route and a valid next project", () => {
  assert.equal(new Set(projects.map((p) => p.slug)).size, projects.length);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  for (const p of projects) assert.ok(nextPublishedProject(p, projects).published);
});
test("published projects have complete visible content and no public draft placeholders", () => {
  for (const p of publishedProjects(projects)) {
    for (const value of [p.title, p.subtitle, p.year, p.status, p.proof, p.thumbnail, p.sections.introduction, p.sections.role, p.sections.team, p.sections.tools, p.sections.interaction, p.sections.demonstration]) {
      assert.ok(value, `${p.slug}: missing visible content`);
      assert.ok(!value.includes("[Add"), `${p.slug}: visible placeholder`);
    }
    assert.equal(p.sections.duration, "");
    assert.equal(p.summary.length, 3);
    assert.ok(!JSON.stringify(p.sections.contentBlocks).includes("[Add"), `${p.slug}: draft narrative`);
    assert.ok(p.sections.contentBlocks.length > 0);
  }
  assert.ok(!publishedProjects(projects).some(p => p.id === "bubble-bloom"));
  for (const p of publishedProjects(projects)) assert.notEqual(nextPublishedProject(p, projects).id, "bubble-bloom");
});
test("published local covers, videos and narrative evidence exist", async () => {
  for (const p of publishedProjects(projects)) {
    const paths = [p.thumbnail, p.previewVideo, p.sections.prototypeVideo, p.sections.prototypePoster];
    for (const block of p.sections.contentBlocks || []) {
      paths.push(block.image, block.supportingMedia?.image, block.comparison?.before, block.comparison?.after);
      for (const stage of block.stages || []) paths.push(stage.image);
      for (const image of block.gallery || []) paths.push(image.src);
    }
    for (const path of paths.filter(Boolean)) if (path.startsWith("public/")) await access(path);
  }
});
test("contact placeholders are intentional", () => {
  assert.equal(typeof site.cv, "string");
  assert.equal(typeof site.email, "string");
});

test("project-specific content and media overrides survive defaults", () => {
  const item = {
    slug: "custom",
    title: "Custom",
    thumbnail: "custom.webp",
    thumbnailAlt: "Custom alt",
    previewVideo: "preview.mp4",
    sections: { introduction: "Custom summary", prototypeVideo: "prototype.mp4" },
  };
  const result = withProjectDefaults(item, 0, [item]);
  assert.equal(result.thumbnail, "custom.webp");
  assert.equal(result.thumbnailAlt, "Custom alt");
  assert.equal(result.previewVideo, "preview.mp4");
  assert.equal(result.sections.introduction, "Custom summary");
  assert.equal(result.sections.prototypeVideo, "prototype.mp4");
  assert.ok(result.sections.context);
  assert.equal(nextPublishedProject(result, [result]).slug, "custom");
});


test("an additional selected project appears without component changes; sorting and counts follow data", () => {
  const fifth = withProjectDefaults({ id: "fifth", slug: "fifth", title: "Fifth", order: 15 }, 4, []);
  const list = [...projects, fifth];
  const work = resolveHomeSections(list).find(s => s.id === "work");
  assert.equal(work.projects.length, resolveHomeSections(projects).find(s => s.id === "work").projects.length + 1);
  assert.equal(work.projects[1].id, "fifth");
  assert.equal(nextPublishedProject(work.projects[0], list).id, "fifth");
});
test("section toggles, order, featured and publication filters are independent", () => {
  const config = homeSections.map(s => ({ ...s, visible: s.id !== "play", order: -s.order }));
  assert.deepEqual(resolveHomeSections(projects, config).map(s => s.id), ["photography", "work"]);
  const items = projects.map(p => ({ ...p, published: p.id !== "doitnow", featured: p.id !== "mapped-in-memory" }));
  assert.equal(resolveHomeSections(items).find(s => s.id === "work").projects.length, 1);
  assert.ok(!publishedProjects(items).some(p => p.id === "doitnow"));
  assert.ok(publishedProjects(items).some(p => p.id === "mapped-in-memory"));
  assert.notEqual(nextPublishedProject(items[items.length - 1], items).id, "doitnow");
});


test("food icon demo has all nine original state pairs and sound files", async () => {
  const project = projects.find(p => p.id === "food-court-icons");
  assert.equal(project.sections.iconDemo.length, 9);
  for (const [i, icon] of project.sections.iconDemo.entries()) {
    await access(`public/images/projects/food-court-icons/before/${i + 1}.png`);
    await access(`public/images/projects/food-court-icons/after/${(i + 1) * 11}.png`);
    await access(`public/audio/food-court-icons/${icon.sound}.mp3`);
  }
});


test("DoItNow presents three decisions and two visual revisions without claiming measured touch improvement", () => {
  const p = projects.find(p => p.id === "doitnow");
  assert.equal(p.sections.contentBlocks.filter(b => ["Editable plans", "Activity feedback", "Progress cues"].includes(b.navLabel)).length, 3);
  const heatmap = p.sections.contentBlocks.find(b => b.comparison);
  assert.ok(/follow-up test.*touch targets/i.test(heatmap.copy.join(" ")));
  assert.ok(p.sections.contentBlocks.at(-1).copy.join(" ").includes("has not established a reduction"));
});
test("Lucky Scratch preview has original artwork and all sound assets", async () => {
  assert.equal(projects.find(p => p.id === "lucky-scratch").sections.scratchDemo, true);
  for (const file of ["public/images/projects/lucky-scratch/reveal-1.webp", "public/images/projects/lucky-scratch/card-cover.webp", ...["flip", "scratch", "reveal"].map(sound => `public/audio/lucky-scratch/${sound}.mp3`)]) await access(file);
});
