import { cp, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url)) + '/..';
const dist = join(root, 'dist');
await mkdir(dist, { recursive: true });
// Static site is root — copy key files for GitHub Pages
const files = ['index.html', 'styles.css', 'src', 'package.json'];
for (const f of files) {
  await cp(join(root, f), join(dist, f), { recursive: true });
}
console.log('Prepared dist/ for GitHub Pages');