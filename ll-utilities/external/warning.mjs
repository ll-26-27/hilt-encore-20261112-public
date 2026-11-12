// warning.mjs: the data warning every external script shows, kept in one place.
//
// "External" means anything that is not a HUIT gateway: fal, OpenRouter, and the rest.
// Every external script puts EXTERNAL_HELP in its --help and calls warn() before it sends anything.
// WARNING is interim wording, pending Marlon's decision on where Harvard draws the line
// (see _context/data-security/); changing it here changes every script.

export const WARNING = 'External tools (fal, OpenRouter) are not Harvard-approved: send them only public (Level 1) material, never confidential data. Use the HUIT APIs for anything sensitive.'

export const EXTERNAL_HELP = `!! EXTERNAL SERVICE, OUTSIDE HARVARD !!
${WARNING}
HUIT scripts: ll-utilities/huit/. Harvard's data levels: _context/data-security/`

export function warn(service, what) {
  console.error(`\n!! EXTERNAL: sending ${what} to ${service}, outside Harvard (not a HUIT gateway).\n!! ${WARNING}\n`)
}
