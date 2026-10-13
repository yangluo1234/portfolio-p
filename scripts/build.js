import { mkdir, copyFile, cp } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const file of ["index.html", "idex.html", "main.js", "style.css"])
  await copyFile(file, `dist/${file}`);
for (const dir of ["src", "public"]) await cp(dir, `dist/${dir}`, { recursive: true });
console.log("Static production build created in dist/");
