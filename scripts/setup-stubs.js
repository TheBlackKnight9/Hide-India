const fs = require('fs');
const path = require('path');

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log('Created stub:', p);
}

write('src/shaders/sylva-living-world/sources/inner-green-3d.html', '');
write('src/shaders/sylva-living-world/SylvaLivingWorldScene.ts', `
export const MAPLE_AUTUMN_STYLE = '';
export const SAKURA_SUNSET_STYLE = '';
export const SEQUOIA_MIST_STYLE = '';
export const applyMapleAutumnVariant = (s: string) => s;
export const applySakuraSunsetVariant = (s: string) => s;
export const applySequoiaMistVariant = (s: string) => s;
`);
write('src/shaders/tidecrest-hero/tidecrestDocument.js', 'export const buildTidecrestDocument = () => "";');
write('src/shaders/meridian-landing-page/meridianDocument.js', 'export const buildMeridianDocument = () => "";');
write('src/shaders/ascii-field/asciiFieldDocuments.js', 'export const buildAsciiFieldDocument = () => "";');
write('src/shaders/betawise-globe/betawiseGlobeDocument.js', 'export const buildBetawiseGlobeDocument = () => "";');
write('src/shaders/axonis-field/axonis-arbor.html', '');
write('src/shaders/axonis-field/axonis-vortex.html', '');
write('src/shaders/axonis-field/axonis-tide.html', '');
write('src/shaders/axonis-field/axonis-dune.html', '');
write('src/shaders/nocturne-hero/NocturneScene.ts', `
export const NOCTURNE_TITLES: Record<string, string> = {};
export const NOCTURNE_VARIANTS = ['midnight'] as const;
export type NocturneVariant = 'midnight';
export const buildNocturneDocument = () => '';
`);
write('src/shaders/landing-pages/sandboxedPageDocument.ts', 'export const buildSandboxedPageDocument = (s: string, opts?: any) => s;');
