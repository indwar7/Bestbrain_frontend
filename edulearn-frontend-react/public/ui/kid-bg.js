/* ============================================================
   BESTBRAIN - AMBER OS · BACKGROUND + DESIGN TOKENS
   ------------------------------------------------------------
   Local preview only. Nothing is written to the repo.

   ONE seamless animated background for the whole product:
     · #050505 base, never a panel or a seam
     · slow mesh-gradient blobs in the orange family
     · an aurora sweep, a noise grain, drifting particles
     · a neural-network line field
     · floating AI glyphs
   Everything animates on transform/opacity only, so it stays on
   the compositor at 60fps.

   Typography is WHITE by spec (#FFF / .8 / .6) with orange used
   for accents only, orange text on near-black fails contrast at
   body sizes, so it never carries copy.

   Two mechanisms keep the canvas seamless under a light-only app:
     1. token flip, vivid.css's !important rules read var(--u-*),
        so re-pointing the variables turns the whole platform dark
     2. slab strip, pages wrap content in an opaque white box;
        it is made transparent (not restyled) so the background
        flows unbroken behind every screen
   ============================================================ */
(function () {
  'use strict';

  /* privacy/terms: the aurora and the drifting formulas ran straight across
     the paragraphs of a legal document. sync() drops the `kidbg` class for
     anything listed here, and `html:not(.kidbg) .kb-sky{display:none}` below
     takes the decoration with it, while start()'s __kidReveal still fires,
     so the page is not left holding at opacity 0. */
  var SKIP = ['demo-pal-slides', 'privacy', 'terms'];

  function pageKey() {
    var last = (location.pathname.split('/').pop() || '').toLowerCase();
    if (!last) return 'index';
    return last.replace(/\.html$/, '') || 'index';
  }
  function allowed() { return SKIP.indexOf(pageKey()) === -1; }

  /* ---------------------------------------------------------
     AI glyphs, currentColor, so one sprite serves any tint
     --------------------------------------------------------- */
  var S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  /* ------------------------------------------------------------------
     Icons - Lucide v1.37.0 (ISC), used verbatim.

     These were hand-drawn on a 48x48 grid at stroke-width 1.6, each one
     its own idea of weight, corner radius and optical size; side by side
     in the feature grid they read as a set of unrelated drawings. Lucide
     is one family on a 24x24 grid, so the strokes line up and the icons
     sit on the same optical size.

     The KEYS are unchanged. kid-home's FEATURES/WHY/ROLES, its orbit
     ring, kid-ui's NAV_ICON and kid-bg's own GLYPHS all address icons by
     these names, so swapping the artwork underneath touches nothing else.
     Regenerate with scratchpad/genicons.py against lucide-static.

     S still supplies fill/stroke/linecap. Lucide ships stroke-width 2 on
     a 24 grid; S says 1.6, which at this scale is the same optical weight
     as the old 1.6 on a 48 grid was NOT, the old set drew at half the
     relative weight. Keeping S means every icon on the site, old callers
     included, still inherits one stroke setting from one place.
     ------------------------------------------------------------------ */
  var ICON = {
    /* lucide "sparkle", not "sparkles": the plural carries a second star and a
       dot, which at 20px in the logo tile, and as ic()'s fallback, is noise. */
    spark: '<svg viewBox="0 0 24 24" ' + S + '><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>',
    brain: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 18V5"/> <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/> <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/> <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/> <path d="M18 18a4 4 0 0 0 2-7.464"/> <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/> <path d="M6 18a4 4 0 0 1-2-7.464"/> <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>',
    robot: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 8V4H8"/> <rect width="16" height="12" x="4" y="8" rx="2"/> <path d="M2 14h2"/> <path d="M20 14h2"/> <path d="M15 13v2"/> <path d="M9 13v2"/></svg>',
    chip: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 20v2"/> <path d="M12 2v2"/> <path d="M17 20v2"/> <path d="M17 2v2"/> <path d="M2 12h2"/> <path d="M2 17h2"/> <path d="M2 7h2"/> <path d="M20 12h2"/> <path d="M20 17h2"/> <path d="M20 7h2"/> <path d="M7 20v2"/> <path d="M7 2v2"/> <rect x="4" y="4" width="16" height="16" rx="2"/> <rect x="8" y="8" width="8" height="8" rx="1"/></svg>',
    wave: '<svg viewBox="0 0 24 24" ' + S + '><path d="M2 10v3"/> <path d="M6 6v11"/> <path d="M10 3v18"/> <path d="M14 8v7"/> <path d="M18 5v13"/> <path d="M22 10v3"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/> <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/> <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/> <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/></svg>',
    target: '<svg viewBox="0 0 24 24" ' + S + '><circle cx="12" cy="12" r="10"/> <circle cx="12" cy="12" r="6"/> <circle cx="12" cy="12" r="2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" ' + S + '><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/></svg>',
    book: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 5v16"/> <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/></svg>',
    code: '<svg viewBox="0 0 24 24" ' + S + '><path d="m18 16 4-4-4-4"/> <path d="m6 8-4 4 4 4"/> <path d="m14.5 4-5 16"/></svg>',
    shield: '<svg viewBox="0 0 24 24" ' + S + '><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/> <path d="m9 12 2 2 4-4"/></svg>',
    cap: '<svg viewBox="0 0 24 24" ' + S + '><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/> <path d="M22 10v6"/> <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" ' + S + '><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" ' + S + '><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"/> <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"/> <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"/> <path d="M4 22h16"/> <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/> <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"/></svg>',
    users: '<svg viewBox="0 0 24 24" ' + S + '><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/> <path d="M16 3.128a4 4 0 0 1 0 7.744"/> <path d="M22 21v-2a4 4 0 0 0-3-3.87"/> <circle cx="9" cy="7" r="4"/></svg>',
    wand: '<svg viewBox="0 0 24 24" ' + S + '><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/> <path d="m14 7 3 3"/> <path d="M5 6v4"/> <path d="M19 14v4"/> <path d="M10 2v2"/> <path d="M7 8H3"/> <path d="M21 16h-4"/> <path d="M11 3H9"/></svg>',
    graph: '<svg viewBox="0 0 24 24" ' + S + '><path d="M3 3v16a2 2 0 0 0 2 2h16"/> <path d="M18 17V9"/> <path d="M13 17V5"/> <path d="M8 17v-3"/></svg>',
    mic: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 19v3"/> <path d="M19 10v2a7 7 0 0 1-14 0v-2"/> <rect x="9" y="2" width="6" height="13" rx="3"/></svg>',
    video: '<svg viewBox="0 0 24 24" ' + S + '><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/> <rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" ' + S + '><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/> <circle cx="12" cy="12" r="3"/></svg>',
    flask: '<svg viewBox="0 0 24 24" ' + S + '><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/> <path d="M6.453 15h11.094"/> <path d="M8.5 2h7"/></svg>',
    tube: '<svg viewBox="0 0 24 24" ' + S + '><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/> <path d="M8.5 2h7"/> <path d="M14.5 16h-5"/></svg>',
    atom: '<svg viewBox="0 0 24 24" ' + S + '><circle cx="12" cy="12" r="1"/> <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/> <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>',
    molecule: '<svg viewBox="0 0 24 24" ' + S + '><path d="m10.586 5.414-5.172 5.172"/> <path d="m18.586 13.414-5.172 5.172"/> <path d="M6 12h12"/> <circle cx="12" cy="20" r="2"/> <circle cx="12" cy="4" r="2"/> <circle cx="20" cy="12" r="2"/> <circle cx="4" cy="12" r="2"/></svg>',
    dna: '<svg viewBox="0 0 24 24" ' + S + '><path d="m10 16 1.5 1.5"/> <path d="m14 8-1.5-1.5"/> <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/> <path d="m16.5 10.5 1 1"/> <path d="m17 6-2.891-2.891"/> <path d="M2 15c6.667-6 13.333 0 20-6"/> <path d="m20 9 .891.891"/> <path d="M3.109 14.109 4 15"/> <path d="m6.5 12.5 1 1"/> <path d="m7 18 2.891 2.891"/> <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/></svg>',
    magnet: '<svg viewBox="0 0 24 24" ' + S + '><path d="m12 15 4 4"/> <path d="M2.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.029-6.029a1 1 0 1 1 3 3l-6.029 6.029a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.365-6.367A1 1 0 0 0 8.716 4.282z"/> <path d="m5 8 4 4"/></svg>',
    prism: '<svg viewBox="0 0 24 24" ' + S + '><path d="M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z"/> <path d="M12 2v20"/></svg>',
    telescope: '<svg viewBox="0 0 24 24" ' + S + '><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"/> <path d="m13.56 11.747 4.332-.924"/> <path d="m16 21-3.105-6.21"/> <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"/> <path d="m6.158 8.633 1.114 4.456"/> <path d="m8 21 3.105-6.21"/> <circle cx="12" cy="13" r="2"/></svg>',
    microscope: '<svg viewBox="0 0 24 24" ' + S + '><path d="M6 18h8"/> <path d="M3 22h18"/> <path d="M14 22a7 7 0 1 0 0-14h-1"/> <path d="M9 14h2"/> <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/> <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" ' + S + '><path d="M11 10.27 7 3.34"/> <path d="m11 13.73-4 6.93"/> <path d="M12 22v-2"/> <path d="M12 2v2"/> <path d="M14 12h8"/> <path d="m17 20.66-1-1.73"/> <path d="m17 3.34-1 1.73"/> <path d="M2 12h2"/> <path d="m20.66 17-1.73-1"/> <path d="m20.66 7-1.73 1"/> <path d="m3.34 17 1.73-1"/> <path d="m3.34 7 1.73 1"/> <circle cx="12" cy="12" r="2"/> <circle cx="12" cy="12" r="8"/></svg>',
    comet: '<svg viewBox="0 0 24 24" ' + S + '><path d="m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5"/> <path d="M16.5 7.5 19 5"/> <path d="m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5"/> <path d="M9 21a6 6 0 0 0-6-6"/> <path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" ' + S + '><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/> <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" ' + S + '><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/> <path d="M9 18h6"/> <path d="M10 22h4"/></svg>',
    globe: '<svg viewBox="0 0 24 24" ' + S + '><circle cx="12" cy="12" r="10"/> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/> <path d="M2 12h20"/></svg>',
    planet: '<svg viewBox="0 0 24 24" ' + S + '><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/> <path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/> <circle cx="12" cy="12" r="3"/> <circle cx="19" cy="5" r="2"/> <circle cx="5" cy="19" r="2"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" ' + S + '><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/> <path d="m14.5 12.5 2-2"/> <path d="m11.5 9.5 2-2"/> <path d="m8.5 6.5 2-2"/> <path d="m17.5 15.5 2-2"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" ' + S + '><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/> <path d="m15 5 4 4"/></svg>',
    apple: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 6.528V3a1 1 0 0 1 1-1h0"/> <path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21"/></svg>',
    smiley: '<svg viewBox="0 0 24 24" ' + S + '><path d="M15 10V9"/> <path d="M16.472 15a6 6 0 01-8.943 0"/> <path d="M9 10V9"/> <circle cx="12" cy="12" r="10"/></svg>',
    kite: '<svg viewBox="0 0 24 24" ' + S + '><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>'
  };

  /* Chemistry and maths the way a Class 6 notebook has it, these ride in the
     background as TEXT, not icons, because a formula that is drawn stops
     being a formula. */
  var FORMULAS = [
    { t: 'H₂O',      x: 7,  y: 26, s: 26, o: .20, d: 13, t0: .4 },
    { t: 'CO₂',      x: 90, y: 18, s: 24, o: .18, d: 15, t0: 1.1 },
    { t: 'E = mc²',  x: 15, y: 68, s: 25, o: .19, d: 16, t0: 2.0 },
    { t: 'Fe',       x: 3,  y: 44, s: 30, o: .22, d: 11, t0: .8 },
    { t: 'Cu',       x: 96, y: 42, s: 28, o: .21, d: 12, t0: 1.7 },
    { t: 'Au',       x: 85, y: 62, s: 27, o: .20, d: 14, t0: .2 },
    { t: 'Al',       x: 11, y: 88, s: 26, o: .19, d: 13, t0: 2.4 },
    { t: 'Zn',       x: 78, y: 8,  s: 24, o: .18, d: 15, t0: 1.4 },
    { t: 'Ag',       x: 93, y: 76, s: 26, o: .20, d: 12, t0: .6 },
    { t: 'NaCl',     x: 5,  y: 12, s: 23, o: .18, d: 16, t0: 1.9 },
    { t: 'a² + b² = c²', x: 66, y: 92, s: 21, o: .15, d: 17, t0: .9, mid: true },
    { t: '√144 = 12', x: 30, y: 14, s: 21, o: .15, d: 14, t0: 2.2, mid: true },
    { t: 'π = 3.14', x: 44, y: 84, s: 22, o: .16, d: 15, t0: .3, mid: true },
    { t: '2 + 2 = 4', x: 58, y: 18, s: 21, o: .14, d: 16, t0: 1.6, mid: true },
    { t: 'Σ',        x: 72, y: 34, s: 34, o: .16, d: 12, t0: 2.7, mid: true },
    { t: 'Δ',        x: 36, y: 46, s: 32, o: .14, d: 13, t0: .5, mid: true },
    { t: '½ + ¼',    x: 20, y: 36, s: 22, o: .15, d: 15, t0: 1.2, mid: true },
    { t: 'A B C',    x: 52, y: 62, s: 22, o: .13, d: 17, t0: 2.5, mid: true },
    { t: '7 × 8 = 56', x: 55, y: 70, s: 22, o: .15, d: 14, t0: 1.1, mid: true },
    { t: '60%',      x: 40, y: 22, s: 26, o: .16, d: 13, t0: 2.8, mid: true },
    { t: '90°',      x: 76, y: 66, s: 26, o: .16, d: 15, t0: .7,  mid: true },
    { t: 'CO₂',      x: 48, y: 96, s: 24, o: .16, d: 12, t0: 1.5, mid: true },
    { t: 'O₂',       x: 26, y: 6,  s: 24, o: .17, d: 14, t0: 2.3 },
    { t: 'CH₄',      x: 92, y: 88, s: 23, o: .17, d: 16, t0: .9  },
    { t: '3 × 4 = 12', x: 18, y: 52, s: 21, o: .14, d: 15, t0: 1.8, mid: true },
    { t: 'x + y',    x: 62, y: 48, s: 24, o: .13, d: 17, t0: 2.6, mid: true },
    { t: 'H₂SO₄',    x: 8,  y: 96, s: 22, o: .17, d: 13, t0: .1  },
    { t: 'Mg',       x: 70, y: 4,  s: 27, o: .19, d: 12, t0: 2.0 },
    { t: 'Ca',       x: 2,  y: 66, s: 27, o: .19, d: 14, t0: 1.3 }
  ];

  /* A deterministic star field, no Math.random, so the sky is identical on
     every page and switching tabs does not reshuffle it. */
  var STARS = (function () {
    var out = [], seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    for (var i = 0; i < 64; i++) {
      out.push({
        x: +(rnd() * 100).toFixed(2),
        y: +(rnd() * 100).toFixed(2),
        s: +(1.4 + rnd() * 2.4).toFixed(2),
        o: +(0.25 + rnd() * 0.5).toFixed(2),
        d: +(2.4 + rnd() * 4).toFixed(2),
        t: +(rnd() * 5).toFixed(2)
      });
    }
    return out;
  })();

  /* A full playground palette, not just the brand orange. The sky is what
     makes the product read as "for kids", one hue makes it read as a texture.
     Navy and indigo are deliberately absent: every colour here sits outside
     the de-blue arc, so nothing in the sky can drift back toward the old blue
     product even as the passes run. */
  var TINT = [
    '#FF7A00', /* orange   */
    '#34D399', /* mint     */
    '#FF4D8D', /* pink     */
    '#FFD166', /* gold     */
    '#A855F7', /* violet   */
    '#22D3EE', /* cyan     */
    '#FF5A5F', /* coral    */
    '#8BE04E', /* leaf     */
    '#FFB347', /* amber    */
    '#F472B6'  /* blossom  */
  ];

  /* Floating glyph field. x/y are viewport %, s is px.
     `mid` = sits over the content column; hidden on phones. */
  /* The field was authored faint so it could never fight the copy. Measured
     against the reference it just disappeared, and an invisible background is
     no background at all, so every glyph is lifted by a single factor rather
     than re-tuning forty numbers by hand. */
  var BOOST = 2.6;

  var GLYPHS = [
    { i: 'spark',  x: 4,  y: 12, s: 46, o: .22, d: 11, t: 0   },
    { i: 'robot',  x: 10, y: 34, s: 62, o: .16, d: 14, t: 1.2 },
    { i: 'brain',  x: 3,  y: 58, s: 54, o: .15, d: 16, t: .5  },
    { i: 'chip',   x: 12, y: 78, s: 48, o: .15, d: 13, t: 2.1 },
    { i: 'bolt',   x: 6,  y: 90, s: 34, o: .2,  d: 9,  t: 1.6 },
    { i: 'cap',    x: 17, y: 20, s: 40, o: .14, d: 15, t: .8  },
    { i: 'rocket', x: 92, y: 10, s: 58, o: .18, d: 12, t: .3  },
    { i: 'target', x: 87, y: 34, s: 46, o: .15, d: 17, t: 1.4 },
    { i: 'wave',   x: 95, y: 52, s: 40, o: .2,  d: 10, t: .9  },
    { i: 'graph',  x: 88, y: 70, s: 50, o: .14, d: 15, t: 2.3 },
    { i: 'trophy', x: 94, y: 86, s: 42, o: .16, d: 12, t: 1.1 },
    { i: 'shield', x: 82, y: 20, s: 38, o: .13, d: 18, t: 2.6 },
    { i: 'chat',   x: 33, y: 8,  s: 42, o: .1,  d: 16, t: .6,  mid: true },
    { i: 'code',   x: 62, y: 88, s: 44, o: .1,  d: 14, t: 2.2, mid: true },
    { i: 'wand',   x: 71, y: 44, s: 38, o: .09, d: 13, t: 1.5, mid: true },
    { i: 'users',  x: 45, y: 72, s: 40, o: .09, d: 17, t: .4,  mid: true },
    { i: 'book',   x: 55, y: 26, s: 36, o: .09, d: 15, t: 1.9, mid: true },
    { i: 'mic',    x: 25, y: 62, s: 34, o: .1,  d: 12, t: 2.8, mid: true },

    /* ---- the science bench, spread across the whole field ---- */
    { i: 'flask',      x: 2,  y: 20, s: 44, o: .19, d: 14, t: 1.3 },
    { i: 'atom',       x: 8,  y: 50, s: 52, o: .17, d: 18, t: 2.4 },
    { i: 'magnet',     x: 14, y: 6,  s: 38, o: .18, d: 12, t: .7  },
    { i: 'tube',       x: 5,  y: 74, s: 36, o: .18, d: 13, t: 1.8 },
    { i: 'bulb',       x: 20, y: 94, s: 40, o: .17, d: 15, t: .2  },
    { i: 'leaf',       x: 22, y: 44, s: 34, o: .12, d: 16, t: 2.9, mid: true },
    { i: 'molecule',   x: 97, y: 30, s: 44, o: .18, d: 15, t: 1.0 },
    { i: 'dna',        x: 90, y: 48, s: 42, o: .16, d: 17, t: 2.1 },
    { i: 'planet',     x: 84, y: 4,  s: 46, o: .17, d: 19, t: .5  },
    { i: 'telescope',  x: 97, y: 66, s: 40, o: .16, d: 13, t: 1.6 },
    { i: 'microscope', x: 86, y: 92, s: 40, o: .17, d: 14, t: 2.7 },
    { i: 'gear',       x: 76, y: 76, s: 34, o: .13, d: 16, t: .9,  mid: true },
    { i: 'globe',      x: 40, y: 6,  s: 38, o: .11, d: 18, t: 1.5, mid: true },
    { i: 'prism',      x: 68, y: 58, s: 34, o: .11, d: 15, t: 2.3, mid: true },
    { i: 'comet',      x: 50, y: 34, s: 40, o: .10, d: 13, t: .8,  mid: true },
    { i: 'ruler',      x: 30, y: 78, s: 36, o: .11, d: 14, t: 2.0, mid: true },
    { i: 'pencil',     x: 62, y: 12, s: 32, o: .11, d: 16, t: 1.2, mid: true },
    { i: 'apple',      x: 38, y: 92, s: 34, o: .12, d: 12, t: 2.6, mid: true },
    { i: 'smiley',     x: 74, y: 26, s: 32, o: .10, d: 17, t: .4,  mid: true },
    { i: 'kite',       x: 46, y: 52, s: 34, o: .10, d: 15, t: 1.9, mid: true },

    /* ---- the middle band: the reference had glyphs over the content, not
       only around it, and that is what makes the page feel alive ---- */
    { i: 'rocket',     x: 60, y: 40, s: 36, o: .13, d: 14, t: .6,  mid: true },
    { i: 'flask',      x: 34, y: 26, s: 34, o: .13, d: 16, t: 1.4, mid: true },
    { i: 'atom',       x: 48, y: 76, s: 36, o: .12, d: 18, t: 2.1, mid: true },
    { i: 'trophy',     x: 66, y: 68, s: 30, o: .12, d: 13, t: .9,  mid: true },
    { i: 'bulb',       x: 28, y: 58, s: 30, o: .12, d: 15, t: 2.5, mid: true },
    { i: 'cap',        x: 26, y: 30, s: 32, o: .12, d: 17, t: 1.1, mid: true },
    { i: 'magnet',     x: 56, y: 8,  s: 28, o: .11, d: 12, t: 2.8, mid: true },
    { i: 'planet',     x: 42, y: 14, s: 32, o: .11, d: 19, t: .3,  mid: true },
    { i: 'molecule',   x: 70, y: 84, s: 32, o: .12, d: 15, t: 1.7, mid: true },
    { i: 'spark',      x: 38, y: 68, s: 26, o: .14, d: 11, t: 2.3, mid: true },
    { i: 'shield',     x: 78, y: 50, s: 28, o: .11, d: 16, t: .7,  mid: true },
    { i: 'chip',       x: 52, y: 92, s: 30, o: .11, d: 14, t: 1.5, mid: true },
    { i: 'graph',      x: 32, y: 88, s: 30, o: .11, d: 17, t: 2.6, mid: true },
    { i: 'tube',       x: 64, y: 24, s: 28, o: .12, d: 13, t: .4,  mid: true },
    { i: 'leaf',       x: 44, y: 40, s: 28, o: .10, d: 16, t: 1.8, mid: true },
    { i: 'smiley',     x: 58, y: 56, s: 26, o: .10, d: 15, t: 2.9, mid: true },
    { i: 'apple',      x: 22, y: 12, s: 28, o: .12, d: 12, t: 1.0, mid: true },
    { i: 'comet',      x: 82, y: 36, s: 30, o: .12, d: 14, t: 2.2, mid: true },
    { i: 'globe',      x: 16, y: 74, s: 30, o: .12, d: 18, t: .8,  mid: true },
    { i: 'prism',      x: 74, y: 14, s: 28, o: .11, d: 15, t: 1.6, mid: true },
    { i: 'dna',        x: 12, y: 60, s: 30, o: .12, d: 17, t: 2.4, mid: true },
    { i: 'gear',       x: 88, y: 58, s: 26, o: .12, d: 13, t: .5,  mid: true },
    { i: 'wave',       x: 36, y: 4,  s: 28, o: .13, d: 11, t: 1.3, mid: true },
    { i: 'book',       x: 68, y: 96, s: 28, o: .11, d: 16, t: 2.7, mid: true }
  ];

  /* grain: one inline SVG turbulence, no network request */
  var NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

  var CSS =
  /* ---------- the canvas: one flat base, everything else floats ---------- */
  'html.kidbg{background:#050505!important;background-image:none!important;}' +
  'html.kidbg body{background-color:transparent!important;background-image:none!important;}' +

  '.kb-sky{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;contain:strict;}' +
  'html:not(.kidbg) .kb-sky{display:none;}' +

  /* mesh blobs, the primary light source */
  '.kb-blob{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform;}' +
  '.kb-b1{width:820px;height:820px;left:-16%;top:-24%;background:radial-gradient(circle,rgba(255,122,0,.42),transparent 66%);animation:kb-d1 34s ease-in-out infinite;}' +
  '.kb-b2{width:760px;height:760px;right:-14%;top:-10%;background:radial-gradient(circle,rgba(255,167,38,.3),transparent 68%);animation:kb-d2 42s ease-in-out infinite;}' +
  '.kb-b3{width:900px;height:900px;left:26%;bottom:-40%;background:radial-gradient(circle,rgba(255,140,66,.26),transparent 68%);animation:kb-d3 38s ease-in-out infinite;}' +
  '.kb-b4{width:560px;height:560px;right:6%;bottom:-18%;background:radial-gradient(circle,rgba(168,85,247,.16),transparent 70%);animation:kb-d2 46s ease-in-out 3s infinite;}' +
  '@keyframes kb-d1{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(90px,60px,0) scale(1.14)}}' +
  '@keyframes kb-d2{0%,100%{transform:translate3d(0,0,0) scale(1.06)}50%{transform:translate3d(-80px,70px,0) scale(.94)}}' +
  '@keyframes kb-d3{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(70px,-60px,0) scale(1.1)}}' +

  /* aurora sweep */
  '.kb-aurora{position:absolute;inset:-30% -10%;opacity:.5;' +
    'background:conic-gradient(from 210deg at 50% 40%,transparent 0deg,rgba(255,122,0,.16) 70deg,transparent 150deg,rgba(255,179,71,.12) 250deg,transparent 340deg);' +
    'filter:blur(46px);animation:kb-spin 60s linear infinite;will-change:transform;}' +
  '@keyframes kb-spin{to{transform:rotate(360deg)}}' +

  /* neural mesh + particles */
  '.kb-net{position:absolute;inset:0;opacity:.5;}' +
  '.kb-net line{stroke:rgba(255,150,60,.16);stroke-width:1;}' +
  '.kb-net circle{fill:rgba(255,170,90,.5);}' +
  '.kb-net .pulse{animation:kb-pulse 4s ease-in-out infinite;}' +
  '@keyframes kb-pulse{0%,100%{opacity:.25}50%{opacity:1}}' +
  '.kb-dots{position:absolute;inset:-25%;opacity:.5;' +
    'background-image:radial-gradient(1.6px 1.6px at 12% 22%,rgba(255,190,120,.7),transparent),' +
      'radial-gradient(1.4px 1.4px at 68% 12%,rgba(255,255,255,.5),transparent),' +
      'radial-gradient(1.8px 1.8px at 38% 62%,rgba(255,150,60,.6),transparent),' +
      'radial-gradient(1.4px 1.4px at 86% 48%,rgba(255,210,160,.55),transparent),' +
      'radial-gradient(1.6px 1.6px at 26% 88%,rgba(255,255,255,.4),transparent),' +
      'radial-gradient(1.8px 1.8px at 92% 82%,rgba(255,170,90,.6),transparent);' +
    'background-size:420px 420px;animation:kb-drift 150s linear infinite;}' +
  '@keyframes kb-drift{to{transform:translate3d(-420px,-420px,0)}}' +

  /* grain, the layer that makes gradients feel like film, not CSS */
  '.kb-noise{position:absolute;inset:0;opacity:.05;mix-blend-mode:overlay;background-image:' + NOISE + ';background-size:200px 200px;}' +

  /* floating AI glyphs */
  /* ---------- stars ---------- */
  '.kb-star{position:absolute;border-radius:50%;background:#FFE7C2;' +
    'box-shadow:0 0 8px 1px rgba(255,214,160,.85);will-change:opacity,transform;' +
    'animation:kb-twinkle 3s ease-in-out infinite;}' +
  '@keyframes kb-twinkle{0%,100%{opacity:var(--o,.4);transform:scale(1)}' +
    '50%{opacity:calc(var(--o,.4) * .25);transform:scale(.6)}}' +

  /* ---------- formulas: background text, so it stays selectable-looking ---------- */
  '.kb-f{position:absolute;display:block;white-space:nowrap;font-weight:800;' +
    'letter-spacing:.02em;will-change:transform;text-shadow:0 0 18px currentColor;' +
    'animation:kb-float 15s ease-in-out infinite;}' +

  '.kb-i{position:absolute;display:block;will-change:transform;filter:drop-shadow(0 0 10px currentColor);}' +
  '.kb-i svg{display:block;width:100%;height:100%;}' +
  '@keyframes kb-float{0%,100%{transform:translate3d(0,0,0) rotate(0)}50%{transform:translate3d(0,-26px,0) rotate(6deg)}}' +

  /* ---------- typography + tokens: white copy, orange accents ---------- */
  'html.kid-dark{--u-canvas:#050505!important;--u-surface:rgba(255,255,255,.06)!important;' +
    '--u-border:rgba(255,255,255,.15)!important;--u-border-light:rgba(255,255,255,.08)!important;' +
    '--u-input-bg:rgba(255,255,255,.05)!important;--u-gold-tint:rgba(255,122,0,.14)!important;' +
    '--u-text:#FFFFFF!important;--u-text-2:rgba(255,255,255,.8)!important;--u-text-3:rgba(255,255,255,.6)!important;' +
    '--u-cta:#FF7A00!important;--u-cta-bright:#FFA726!important;--on-accent:#0A0A0A!important;' +
    '--aurora:linear-gradient(115deg,#FF7A00 0%,#FFA726 50%,#FFB347 100%)!important;' +
    '--u-shadow:0 1px 2px rgba(0,0,0,.4),0 12px 28px rgba(0,0,0,.45)!important;' +
    '--u-shadow-lg:0 2px 4px rgba(0,0,0,.45),0 24px 56px rgba(0,0,0,.55)!important;}' +
  'html.kid-dark body{color:rgba(255,255,255,.8)!important;}' +
  'html.kid-dark h1,html.kid-dark h2,html.kid-dark h3,html.kid-dark h4,html.kid-dark .serif{color:#FFFFFF!important;}' +
  /* Scoped to .kidbg, like the .kb-sky rule above, so it lifts on the pages
     that opt out of the skin. It is decoration, and still the retired amber,
     which is why an orange halo was sitting behind "Privacy Policy". */
  'html.kidbg.kid-dark h1{text-shadow:0 0 44px rgba(255,122,0,.35)!important;}' +
  /* vivid.css hard-codes #000 on these, same selectors, later, light values */
  'html.kid-dark .chip,html.kid-dark .tag,html.kid-dark .pill,html.kid-dark .fchip,' +
  'html.kid-dark .modchip,html.kid-dark .dchip,html.kid-dark .wchip,html.kid-dark .tagchip,' +
  'html.kid-dark .handchip,html.kid-dark .streakchip,html.kid-dark .lvlpill,html.kid-dark .badge,' +
  'html.kid-dark .rolebadge,html.kid-dark .cls-chip,html.kid-dark .rc-tag,html.kid-dark .weak-chip,' +
  'html.kid-dark .sub-pill,html.kid-dark .subjtag{color:#FFFFFF!important;' +
    'border-color:rgba(255,255,255,.18)!important;background:rgba(255,255,255,.07)!important;}' +
  /* the account sheet ships as an opaque white card, too small for the
     seamless sweep to catch, so it is named */
  'html.kid-dark .acct-panel,html.kid-dark .acct-fab,html.kid-dark .acct-sec,' +
  'html.kid-dark .acct-row,html.kid-dark .am-hd{' +
    'background:rgba(14,11,9,.74)!important;border-color:rgba(255,255,255,.14)!important;' +
    'backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);}' +
  'html.kid-dark .acct-overlay{background:rgba(0,0,0,.6)!important;}' +
  'html.kid-dark .acct-field{background:rgba(255,255,255,.06)!important;' +
    'border-color:rgba(255,255,255,.16)!important;}' +
  'html.kid-dark th,html.kid-dark td{border-color:rgba(255,255,255,.14)!important;color:rgba(255,255,255,.85)!important;}' +
  'html.kid-dark input::placeholder,html.kid-dark textarea::placeholder{color:rgba(255,255,255,.45)!important;}' +
  'html.kid-dark .btn-primary,html.kid-dark .btn,html.kid-dark .btn-ghost,html.kid-dark .social-btn,' +
  'html.kid-dark .btn-fix,html.kid-dark .btn-book,html.kid-dark .btn-join,html.kid-dark .btn-new,' +
  'html.kid-dark .btn-resume{border-color:rgba(255,255,255,.18)!important;}' +

  /* ---------- the ink law: every glyph is white ----------
     vivid.css ships `body,p,li,span,div,a,td,th,label,h1..h6{color:#000!important}`.
     An !important tie is settled by specificity, so the very same element
     selectors are restated behind `html.kid-dark`, one extra class is all it
     takes to win. -webkit-text-fill-color must be restated alongside `color`
     because it outranks it, and vivid.css sets both. */
  'html.kid-dark body,html.kid-dark p,html.kid-dark li,html.kid-dark span,html.kid-dark div,' +
  'html.kid-dark a,html.kid-dark td,html.kid-dark th,html.kid-dark label,html.kid-dark small,' +
  'html.kid-dark strong,html.kid-dark b,html.kid-dark em,html.kid-dark i,html.kid-dark u,' +
  'html.kid-dark dt,html.kid-dark dd,html.kid-dark figcaption,html.kid-dark blockquote,' +
  'html.kid-dark button,html.kid-dark summary,html.kid-dark legend,html.kid-dark caption,' +
  'html.kid-dark input,html.kid-dark select,html.kid-dark textarea,html.kid-dark option,' +
  'html.kid-dark h1,html.kid-dark h2,html.kid-dark h3,html.kid-dark h4,html.kid-dark h5,html.kid-dark h6{' +
    'color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;}' +

  /* ...with one principled exception: a bright solid orange surface needs dark
     ink, because white on #FF7A00 is the one place white stops being readable.
     Each of these carries two classes or an id, so it outranks the law above
     no matter what order the sheets land in. */
  'html.kid-dark .btn-primary,html.kid-dark .btn-cta,html.kid-dark button.primary,' +
  'html.kid-dark .kh-btn.p,html.kid-dark .kh-btn.p *,' +
  'html.kid-dark .kh-logo .m,html.kid-dark .kh-tag,html.kid-dark .kh-step .n,' +
  'html.kid-dark .kh-who .av,html.kid-dark #kid-hello .av,html.kid-dark .knew,' +
  'html.kid-dark #kid-rail .nav__link.is-current,html.kid-dark #kid-rail .nav__link.is-current *,' +
  'html.kid-dark .ka-btn.p,html.kid-dark .ka-btn.p *{' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +

  /* ---------- seamless: the page's own white slab just disappears ---------- */
  '.kid-seam{background:transparent!important;background-image:none!important;' +
    'border:0!important;box-shadow:none!important;}' +

  '@media(max-width:820px){.kb-i.mid,.kb-f.mid{display:none}.kb-i{transform:scale(.72)}' +
    '.kb-f{font-size:.8em}}' +
  '@media(prefers-reduced-motion:reduce){.kb-blob,.kb-aurora,.kb-dots,.kb-i,.kb-f,.kb-star,' +
    '.kb-net .pulse{animation:none!important}}';

  /* ---------------------------------------------------------
     BUILD
     --------------------------------------------------------- */
  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function neuralSvg() {
    /* deterministic lattice, no Math.random, so it never flickers between
       reloads and reads as a designed constellation rather than noise */
    var pts = [], i, x, y;
    for (i = 0; i < 26; i++) {
      x = ((i * 37) % 100);
      y = ((i * 61) % 100);
      pts.push([x, y]);
    }
    var svg = '<svg class="kb-net" viewBox="0 0 100 100" preserveAspectRatio="none">';
    for (i = 0; i < pts.length; i++) {
      var a = pts[i], b = pts[(i + 5) % pts.length];
      var dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]);
      if (dx < 34 && dy < 34) {
        svg += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      }
    }
    for (i = 0; i < pts.length; i++) {
      svg += '<circle class="pulse" cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (i % 4 === 0 ? .55 : .3) +
             '" style="animation-delay:' + (i * .18).toFixed(2) + 's"/>';
    }
    return svg + '</svg>';
  }

  function build() {
    if (!document.getElementById('kb-css')) {
      var style = el('style');
      style.id = 'kb-css';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    if (document.querySelector('body > .kb-sky')) return;

    var sky = el('div', 'kb-sky');
    sky.setAttribute('aria-hidden', 'true');
    ['kb-blob kb-b1', 'kb-blob kb-b2', 'kb-blob kb-b3', 'kb-blob kb-b4',
     'kb-aurora', 'kb-dots', 'kb-noise'].forEach(function (c) {
      sky.appendChild(el('div', c));
    });
    sky.insertAdjacentHTML('beforeend', neuralSvg());

    /* stars first, they sit furthest back */
    STARS.forEach(function (st) {
      var d = el('div', 'kb-star');
      d.style.cssText =
        'left:' + st.x + '%;top:' + st.y + '%;width:' + st.s + 'px;height:' + st.s + 'px;' +
        '--o:' + st.o + ';opacity:' + st.o + ';' +
        'animation-duration:' + st.d + 's;animation-delay:' + st.t + 's;';
      sky.appendChild(d);
    });

    GLYPHS.forEach(function (g, n) {
      var s = el('span', 'kb-i' + (g.mid ? ' mid' : ''));
      s.style.cssText =
        'left:' + g.x + '%;top:' + g.y + '%;width:' + g.s + 'px;height:' + g.s + 'px;' +
        'opacity:' + Math.min(.62, g.o * BOOST) + ';' +
        'animation:kb-float ' + g.d + 's ease-in-out ' + g.t + 's infinite;';
      s.style.setProperty('color', TINT[n % TINT.length], 'important');
      s.innerHTML = ICON[g.i];
      sky.appendChild(s);
    });

    FORMULAS.forEach(function (f, n) {
      var s = el('span', 'kb-f' + (f.mid ? ' mid' : ''));
      s.style.cssText =
        'left:' + f.x + '%;top:' + f.y + '%;font-size:' + f.s + 'px;' +
        'opacity:' + Math.min(.62, f.o * BOOST) + ';' +
        'animation-duration:' + f.d + 's;animation-delay:' + f.t0 + 's;';
      /* Both properties, both !important: the ink law paints every span white,
         and -webkit-text-fill-color outranks color, set only one and the
         formulas come out as white smudges instead of coloured chalk. */
      var tint = TINT[(n + 2) % TINT.length];
      s.style.setProperty('color', tint, 'important');
      s.style.setProperty('-webkit-text-fill-color', tint, 'important');
      s.textContent = f.t;
      sky.appendChild(s);
    });

    document.body.appendChild(sky);
  }

  /* ---------------------------------------------------------
     SEAMLESS SWEEP, strip the page's opaque white slabs
     --------------------------------------------------------- */
  function rgbaOf(str) {
    var n = (str || '').match(/[\d.]+/g);
    if (!n || n.length < 3) return null;
    var f = str.indexOf('color(srgb') === 0 ? 255 : 1;
    return { r: n[0] * f, g: n[1] * f, b: n[2] * f, a: n.length > 3 ? parseFloat(n[3]) : 1 };
  }

  /* A hex literal is a colour too, inline custom properties are written
     that way, and those are exactly where the old blue hides. */
  function parseColour(str) {
    if (!str) return null;
    str = String(str).trim();
    var m = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m) return rgbaOf(str);
    var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16),
             b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  function toHsl(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    var h = 0, s = 0, l = (mx + mn) / 2;
    if (d) {
      s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s, l: l, a: c.a };
  }

  /* ---------------------------------------------------------
     DE-BLUE, cyan through magenta is the whole cold arc, and it
     is squeezed into the warm amber band. Lightness and alpha are
     left untouched, so a pale tile stays pale and glass stays
     glass; only the hue moves. Surfaces only, never text, or the
     page's own dark ink would turn brown instead of being fixed
     by the ink pass below.
     --------------------------------------------------------- */
  function warm(str) {
    var c = parseColour(str);
    if (!c || c.a === 0) return null;
    var x = toHsl(c);
    if (x.s < .12) return null;                  // grey has no hue to rotate
    /* Only the genuine blues, sky through indigo. The arc is kept deliberately
       narrow so mint, teal, pink and violet survive: the brief was no blue, not
       no colour, and those accents are what make the tiles read as playful. */
    if (x.h < 195 || x.h >= 265) return null;
    x.h = 18 + ((x.h - 195) / 70) * 30;          // → 18°..48°, the amber band
    return 'hsla(' + Math.round(x.h) + ',' + Math.round(Math.min(1, x.s * 1.05) * 100) + '%,' +
      Math.round(x.l * 100) + '%,' + x.a + ')';
  }
  function warmAll(str) {
    if (!str) return null;
    var hit = false;
    var out = String(str).replace(/rgba?\([^)]+\)|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, function (m) {
      var w = warm(m);
      if (w) { hit = true; return w; }
      return m;
    });
    return hit ? out : null;
  }

  /* What does this element itself paint? A light surface is not always a light
     background-COLOR: a sticky header can be a white gradient over a transparent
     colour, which a colour-only test walks straight past, that is exactly how
     the React nav stayed white while the audit reported a clean page. Gradients
     are averaged over the stops opaque enough to actually show. */
  function gradientPaint(bi) {
    if (!bi || bi.indexOf('gradient') === -1) return null;
    var stops = bi.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g);
    if (!stops) return null;
    var total = 0, n = 0, maxA = 0;
    for (var i = 0; i < stops.length; i++) {
      var c = parseColour(stops[i]);
      if (!c) continue;
      if (c.a > maxA) maxA = c.a;
      if (c.a >= .5) { total += lum('rgb(' + c.r + ',' + c.g + ',' + c.b + ')'); n++; }
    }
    return n ? { lum: total / n, a: maxA } : null;
  }

  function ownPaint(cs) {
    var c = rgbaOf(cs.backgroundColor);
    if (c && c.a >= .4) return { lum: lum(cs.backgroundColor), a: c.a };
    return gradientPaint(cs.backgroundImage);
  }

  var SIDES = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];

  /* how many full passes may re-derive an element before its colour is final */
  var SETTLE = 4;
  var derivePass = 0;

  /* Element-level de-blueing cannot reach a colour that is never written on an
     element: `border-top:3px solid var(--ac)` resolves through a token defined
     on :root, and only the token is blue. So collect every custom property any
     stylesheet declares, read what it resolves to, and re-point the blue ones
     at the root, every var() reference downstream follows. */
  function warmTokens() {
    /* re-scan for the first few passes, since sibling preview sheets and any
       late stylesheet can introduce tokens after the first run; an already
       warmed value is hsla(), which the rgb/hex matcher leaves alone */
    if (derivePass > 3) return;
    var names = {}, sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      var rules;
      try { rules = sheets[i].cssRules; } catch (e) { continue; }
      if (!rules) continue;
      (function walk(rs) {
        for (var j = 0; j < rs.length; j++) {
          var r = rs[j];
          if (r.style && r.selectorText) {
            for (var k = 0; k < r.style.length; k++) {
              var p = r.style[k];
              if (p.indexOf('--') === 0) names[p] = 1;
            }
          }
          if (r.cssRules && r.cssRules.length) walk(r.cssRules);
        }
      })(rules);
    }
    var root = document.documentElement, cs = getComputedStyle(root);
    for (var n in names) {
      var v = (cs.getPropertyValue(n) || '').trim();
      if (!v) continue;
      var w = warmAll(v);
      if (w) root.style.setProperty(n, w, 'important');
    }
  }

  function deBlue() {
    derivePass++;
    warmTokens();
    /* getComputedStyle is a forced style recalc, and running it over every
       node on every mutation is what made scrolling crawl. Once the early
       passes have settled, the selector engine filters to nodes we have never
       touched, which on a stable page is none of them, so a mutation costs
       almost nothing. */
    var all = derivePass > SETTLE
      ? document.body.querySelectorAll('*:not([data-kid-warm])')
      : document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var n = all[i], v;
      if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') continue;
      /* the quiz options are styled explicitly by kid-quiz, an inline warm
         background written here would outrank that stylesheet and put them
         back to brown-on-brown */
      if (n.closest && n.closest('.kb-sky,#kh-root,#ka-root,#kq-player,#optGrid,.role-tabs,.mods')) {
        /* Mark it even though we are leaving it alone: the settled-pass filter
           keys off this attribute, and a skipped subtree that stays unmarked is
           re-queried and re-measured on every mutation for the life of the page
          , which on the homepage was most of the DOM. */
        n.setAttribute('data-kid-warm', 'skip');
        continue;
      }
      /* A stripped slab has already been decided on. deBlue clears inline
         background to re-derive, which would wipe that transparency straight
         back to the page's own white. */
      if (n.classList.contains('kid-seam')) continue;

      /* Drop whatever this pass wrote last time before measuring. kid-bg runs
         before kid-ui and kid-home have injected their sheets, so a first-pass
         reading captures the page's *original* palette, freezing that inline
         would lock the old light-blue tiles in place for good. Re-deriving
         from the live cascade is what lets the later sheets win.

         It stops once the sheets have all landed, though: removing a property
         and setting it straight back restarts any CSS transition on it, and an
         element re-derived forever never settles, it just keeps sliding back
         toward the light value it was transitioning from. */
      if (n.hasAttribute('data-kid-warm')) {
        /* If the value on screen is still the one this pass wrote, there is
           nothing to redo, skipping keeps the transition from restarting.
           The moment the page restyles the element (late data, a state class,
           a script rewriting the style attribute) the two stop matching and it
           gets derived again, so nothing stays stale. */
        if (derivePass > SETTLE &&
            n.getAttribute('data-kid-bg') === getComputedStyle(n).backgroundColor) continue;
        n.style.removeProperty('background-color');
        n.style.removeProperty('background-image');
        for (var d = 0; d < SIDES.length; d++) n.style.removeProperty(SIDES[d]);
        n.style.removeProperty('fill');
        n.style.removeProperty('stroke');
      }

      var cs = getComputedStyle(n);

      /* A near-white opaque chip is a light-theme leftover: too small for the
         seamless sweep, but big enough to punch a hole in the canvas. Turn it
         into the same glass the rest of the shell uses. Saturated fills are
         left alone, those are deliberate accents, not stray white. */
      var glassed = false;
      var FORM = n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT';
      /* a form control filled with 68%-white still reads as a light slab, so
         it earns a lower bar than decorative surfaces do */
      var minA = FORM ? .4 : .82;
      /* Judge "is this a light surface" by luminance, not per channel. A pastel
         like color(srgb .983 .928 .86) reads as near-white to the eye but has
         one channel well under any flat cut-off, which is exactly how the week
         tiles slipped through. .85 keeps saturated accents (an orange chip sits
         near .78) out of it. ownPaint() also sees a light GRADIENT, which is
         how the sticky header stayed white while the audit read clean. */
      var paint = ownPaint(cs);
      if (paint && paint.a >= minA && paint.lum >= .85) {
        n.style.setProperty('background-color', 'rgba(255,255,255,.07)', 'important');
        if (cs.backgroundImage !== 'none') n.style.setProperty('background-image', 'none', 'important');
        for (var g = 0; g < SIDES.length; g++) {
          n.style.setProperty(SIDES[g], 'rgba(255,255,255,.16)', 'important');
        }
        glassed = true;
      }

      if (!glassed) {
        if ((v = warm(cs.backgroundColor))) n.style.setProperty('background-color', v, 'important');
        if (cs.backgroundImage !== 'none' && (v = warmAll(cs.backgroundImage)))
          n.style.setProperty('background-image', v, 'important');
        for (var s = 0; s < SIDES.length; s++) {
          if ((v = warm(cs.getPropertyValue(SIDES[s])))) n.style.setProperty(SIDES[s], v, 'important');
        }
      }
      if (n.namespaceURI === 'http://www.w3.org/2000/svg') {
        if ((v = warm(cs.fill))) n.style.setProperty('fill', v, 'important');
        if ((v = warm(cs.stroke))) n.style.setProperty('stroke', v, 'important');
      }
      /* the accent that a ::after reads out of style="--sa:#7C9BFF" is
         invisible to a computed-style scan, so rewrite the literal */
      var st = n.getAttribute && n.getAttribute('style');
      if (st && st.indexOf('--') !== -1) {
        var next = st.replace(/(--[\w-]+\s*:\s*)([^;]+)/g, function (m, k, val) {
          var w = warmAll(val.trim());
          return w ? k + w : m;
        });
        if (next !== st) n.setAttribute('style', next);
      }
      n.setAttribute('data-kid-warm', '1');
      /* remember what we left on screen, so the next pass can tell our own
         work apart from a restyle by the page */
      n.setAttribute('data-kid-bg', getComputedStyle(n).backgroundColor);
    }
  }

  /* Form controls get their style attribute rewritten by page scripts, an
     auto-growing composer sets style.height and can clear what we wrote, so
     their glass is re-asserted on every pass rather than once. Writing an
     unchanged value is a no-op, so this restarts no transitions. */
  function glassFields() {
    var f = document.querySelectorAll('input:not([data-kid-fld]),textarea:not([data-kid-fld]),select:not([data-kid-fld])');
    for (var i = 0; i < f.length; i++) {
      var n = f[i], t = (n.type || '').toLowerCase();
      if (t === 'checkbox' || t === 'radio' || t === 'range' || t === 'color') continue;
      if (n.closest('#ka-root,#kq-player')) continue;   // these dress their own
      var fcs = getComputedStyle(n);
      var c = rgbaOf(fcs.backgroundColor);
      if (!c || c.a < .4 || lum(fcs.backgroundColor) < .75) continue;
      n.style.setProperty('background-color', 'rgba(255,255,255,.06)', 'important');
      n.style.setProperty('border-color', 'rgba(255,255,255,.16)', 'important');
      n.setAttribute('data-kid-fld', '1');
    }
  }

  /* ---------------------------------------------------------
     SEAMLESS, the page's own full-bleed slab is what hides the
     sky. Judge it by SHAPE, not by colour: once the page's dark
     tokens are armed the slab is black, not white, and a colour
     test would sail straight past it.
     --------------------------------------------------------- */
  function seamless() {
    var vw = window.innerWidth, vh = window.innerHeight, list = [];
    (function collect(node, depth) {
      if (depth > 4) return;
      for (var i = 0; i < node.children.length; i++) {
        var c = node.children[i];
        if (c.hasAttribute('data-kid-seam')) continue;
        if (c.classList.contains('kb-sky') || c.id === 'pal-mascot' ||
            c.id === 'kid-rail' || c.id === 'kid-top' ||
            c.id === 'kh-root' || c.id === 'ka-root' || c.id === 'kq-player') continue;
        list.push(c);
        collect(c, depth + 1);
      }
    })(document.body, 1);

    list.forEach(function (n) {
      if (n.hasAttribute('data-kid-seam')) return;
      var r = n.getBoundingClientRect();
      /* A panel does not have to be full-bleed to blot out the page. The
         tutor's stage is 53% of the viewport beside its transcript column ,
         under the old 55% bar it was never a "slab", and it painted a white
         sheet over the whole call. Judge it on area instead of on either
         edge alone. */
      if (r.width < vw * 0.4 || r.height < vh * 0.4) return;
      if ((r.width * r.height) < (vw * vh) * 0.28) return;
      var cs = getComputedStyle(n);
      /* An overlay is not the page's slab.
         This pass exists to punch a hole in the sheet a PAGE paints over the
         sky. A drawer or a modal is the opposite: it sits on top, and it is
         opaque precisely so its own content can be read. Stripping it left
         the feature panel completely transparent, the homepage headline
         showing through its text, and took the dim off its scrim, so the
         page behind stayed at full brightness too.

         Position plus stacking separates the two cleanly, measured on the
         live pages: the real targets (.hero-inner, .stats, .showcase-inner)
         are static or relative at z-index auto, while #efp sits at 99999 and
         #efp-ov at 99998, both fixed. Nothing that needs seaming is a fixed
         element parked above the whole interface. */
      if (cs.position === 'fixed' && (parseInt(cs.zIndex, 10) || 0) >= 1000) return;
      var c = rgbaOf(cs.backgroundColor);
      var covers = (c && c.a >= .5) || cs.backgroundImage !== 'none';
      if (!covers) return;
      n.classList.add('kid-seam');
      /* Inline, not just the class. `.kid-seam` is a CLASS selector, and a page
         that styles its stage as `#stage{background:#fff}` beats it on
         specificity no matter how many !importants the class carries, which
         is exactly how the tutor kept painting a white sheet over the call.
         An inline !important outranks every selector there is. */
      n.style.setProperty('background', 'transparent', 'important');
      n.style.setProperty('background-color', 'transparent', 'important');
      n.style.setProperty('background-image', 'none', 'important');
      n.setAttribute('data-kid-seam', '1');
    });
  }

  /* ---------------------------------------------------------
     CONTRAST, measure, don't guess. Any dark text left on the
     dark canvas is lifted to white; dark ink on its own light
     chip is correct and stays.
     --------------------------------------------------------- */
  function lum(str) {
    var n = (str || '').match(/[\d.]+/g);
    if (!n || n.length < 3) return null;
    var f = str.indexOf('color(srgb') === 0 ? 255 : 1;
    if (n.length > 3 && parseFloat(n[3]) === 0) return null;
    return (0.2126 * n[0] * f + 0.7152 * n[1] * f + 0.0722 * n[2] * f) / 255;
  }
  function ownsText(n) {
    for (var i = 0; i < n.childNodes.length; i++) {
      if (n.childNodes[i].nodeType === 3 && n.childNodes[i].nodeValue.trim()) return true;
    }
    return false;
  }
  /* What is actually painted behind this text? Walk out until something
     opaque enough to hide the canvas is found. A gradient counts: average
     the stops that are opaque, which is what makes an orange CTA report
     itself as bright and earn dark ink. */
  function surfaceLum(n, cs) {
    var w = n, hops = 0;
    while (w && w !== document.documentElement && hops < 10) {
      var wcs = w === n ? cs : getComputedStyle(w);
      if (!w.classList.contains('kid-seam')) {
        /* A surface the warming pass has just recoloured reports its OLD
           colour for as long as its CSS transition runs (.opt has one), so an
           answer option was judged bright and given black text on what is a
           dark card. What we wrote inline is where it is going: judge that. */
        var bgc = w.style.getPropertyValue('background-color') || wcs.backgroundColor;
        var c = rgbaOf(bgc);
        if (c && c.a >= .5) return lum(bgc);
        var bi = w.style.getPropertyValue('background-image') || wcs.backgroundImage;
        if (bi && bi.indexOf('gradient') !== -1) {
          var stops = bi.match(/rgba?\([^)]+\)/g);
          if (stops) {
            var t = 0, k = 0;
            for (var q = 0; q < stops.length; q++) {
              var sc = rgbaOf(stops[q]);
              if (sc && sc.a >= .5) { t += lum(stops[q]); k++; }
            }
            if (k) return t / k;
          }
        }
      }
      w = w.parentElement; hops++;
    }
    return null;                       // nothing opaque, it sits on the sky
  }

  /* THE INK PASS, two-way. Text on the dark canvas goes white; text on a
     genuinely bright surface goes dark. Measured per element, so a pastel
     subject tile and a black card both come out readable without either
     being named in a selector. */
  var inkPass = 0;
  function inkFix() {
    inkPass++;
    var gaveDark = false;
    var all = inkPass > SETTLE
      ? document.body.querySelectorAll('*:not([data-kid-ink])')
      : document.body.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var n = all[i];
      /* Mark these too. An element the pass will never act on still costs a
         query and a style read on every mutation if it stays unmarked, and
         SVG nodes alone are most of the sky. */
      if (n.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
        if (n.setAttribute) n.setAttribute('data-kid-ink', 'svg');
        continue;
      }
      if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') {
        n.setAttribute('data-kid-ink', 'skip');
        continue;
      }
      /* #kh-root and #ka-root style every glyph inside them explicitly (see
         the landing page and the auth screens), same reasoning the "warm"
         pass above already applies to this exact pair of roots. Without this
         exclusion this pass still ran inside them, and since it writes color
         via inline style + 'important' it doesn't lose a cascade fight so
         much as unconditionally overwrite whatever the page's own stylesheet
         set a moment later, a gradient-clipped accent word (background-clip:
         text) reads to surfaceLum() as a bright surface the text sits ON
         rather than the text's own fill, so it "corrected" both the hero's
         accent word and the homepage stat suffixes to flat ink, silently
         discarding their intended colour every time. */
      if (n.closest('.kb-sky,#kh-root,#ka-root,#kq-player,.mods')) { n.setAttribute('data-kid-ink', 'skip'); continue; }
      if (!ownsText(n)) { n.setAttribute('data-kid-ink', 'notext'); continue; }
      var cs = getComputedStyle(n);
      var s = surfaceLum(n, cs);
      if (s === null) s = .02;                       // nothing opaque: the canvas
      /* Pick the ink that actually wins, rather than trusting a threshold, a
         mid-tone orange pill sits on the wrong side of any fixed cut-off, and
         white on it reads at barely 2:1. */
      var onWhite = 1.05 / (s + .05);
      var onBlack = (s + .05) / (.0392 + .05);       // #0A0A0A
      var want = onBlack > onWhite ? '#0A0A0A' : '#FFFFFF';
      if (n.getAttribute('data-kid-ink') === want) continue;
      n.style.setProperty('color', want, 'important');
      /* text-fill outranks color, setting one without the other leaves the
         glyph exactly as it was */
      n.style.setProperty('-webkit-text-fill-color', want, 'important');
      n.setAttribute('data-kid-ink', want);
      if (want === '#0A0A0A') gaveDark = true;
    }
    rejudgeDark();
    /* and once more after any transition on the surface has finished */
    if (gaveDark) {
      clearTimeout(rejudgeTimer);
      rejudgeTimer = setTimeout(rejudgeDark, 600);
    }
  }

  /* Dark ink is a judgment about the surface behind the text, and that
     surface changes after we look: the warming pass recolours it, and while a
     CSS transition runs the browser still reports the OLD colour. An answer
     option judged in that moment kept black text on a dark card for good.
     Dark ink is rare, so every element that has it is judged again; white ink
     on the dark canvas is the safe default and is left alone. */
  var rejudgeTimer = 0;
  function rejudgeDark() {
    var dark = document.body.querySelectorAll('[data-kid-ink="#0A0A0A"]');
    for (var i = 0; i < dark.length; i++) {
      var n = dark[i];
      var s = surfaceLum(n, getComputedStyle(n));
      if (s === null) s = .02;
      if ((s + .05) / (.0392 + .05) > 1.05 / (s + .05)) continue;   // still bright
      n.style.setProperty('color', '#FFFFFF', 'important');
      n.style.setProperty('-webkit-text-fill-color', '#FFFFFF', 'important');
      n.setAttribute('data-kid-ink', '#FFFFFF');
    }
  }

  function sync() {
    var on = allowed();
    document.documentElement.classList.toggle('kidbg', on);
    if (!on) return;
    /* every page ships a retired html.dark-mode token set; re-arm it, then
       our own overrides land on top */
    document.documentElement.classList.add('kid-dark');
    document.documentElement.classList.add('dark-mode');
    document.documentElement.classList.remove('light-mode');
    /* order matters: clear the slab, warm the surfaces, then judge ink
       against the surfaces those two passes actually left behind */
    deBlue();
    glassFields();
    seamless();      // last: nothing after it can put the slab back
    inkFix();
  }

  function start() {
    build();
    sync();
    /* the sibling preview sheets inject during this same tick, one frame
       later the cascade is complete, so re-derive against the real palette */
    requestAnimationFrame(function () {
      sync();
      /* The content has now been restyled at least once, so it is safe to
         show. boot.js hid it precisely to cover this window, the product's
         own screens render first and would otherwise be visible in their
         pre-redesign form while this ran. */
      if (window.__kidReveal) window.__kidReveal();
    });
    setTimeout(sync, 400);
    setTimeout(sync, 1400);
    /* Late, direct passes. The mutation-driven work waits for idle time, and
       idle can be a long way off on a busy page, or never arrive under an
       automated browser. A slab that only appears once the route has finished
       laying out must not depend on it. */
    setTimeout(sync, 2600);
    setTimeout(sync, 4200);
    window.addEventListener('resize', seamless);

    /* Pages fetch their real content after first paint, chapter rows, class
       cards, chat replies. Anything that arrives later has to be measured too,
       or it lands with the page's own black ink on the dark canvas. */
    var pending = 0;
    var mo = new MutationObserver(function (recs) {
      /* A class change is how a page says "this element looks different now" ,
         an active tab, a selected option, a current nav item. Our warmed colour
         is pinned inline with !important, so it would survive that change and
         leave the highlight stuck on whatever was selected first. Forget what
         we wrote for those elements so the next pass derives them again. */
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r.type !== 'attributes' || r.attributeName !== 'class') continue;
        var t = r.target;
        if (!t.hasAttribute || !t.hasAttribute('data-kid-warm')) continue;
        t.removeAttribute('data-kid-warm');
        t.removeAttribute('data-kid-bg');
        t.removeAttribute('data-kid-ink');
        t.style.removeProperty('background-color');
        t.style.removeProperty('background-image');
        for (var d = 0; d < SIDES.length; d++) t.style.removeProperty(SIDES[d]);
      }
      clearTimeout(pending);
      /* Idle time, not the next tick: a burst of nodes during a scroll should
         not put four full passes in front of the frame the user is waiting on. */
      pending = setTimeout(function () {
        /* allowed(), same as sync(). Only sync() used to ask, so on a SKIPped
           page the four passes still ran from here the moment React mounted
           anything, which is how /privacy ended up with every paragraph
           carrying an inline `color:#FFF!important` and data-kid-ink, pinned
           by a pass the page had opted out of. An inline !important outranks
           any stylesheet, so the page could not restyle its own text. */
        if (!allowed()) return;
        var run = function () { deBlue(); glassFields(); seamless(); inkFix(); };
        if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 600 });
        else run();
      }, 260);
    });
    mo.observe(document.body, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  /* A route change, not routine content arriving, react on the same close
     schedule start() already uses (sync, next frame, 400ms) without calling
     start() itself, which would bolt on another MutationObserver and another
     resize listener every single navigation and never remove the old ones.

     Called by React from the commit that changes the route (src/lib/useKidSkin),
     which is the only moment the new page's DOM exists and nothing has been
     painted yet. This used to hang off a patched history.pushState instead,
     and the two are far apart: the router navigates inside a transition, so
     the URL changes first and the page commits perhaps ninety milliseconds
     later. All three passes here ran against the outgoing page, and the new
     one was left wearing the raw cascade until the 400ms fallback below.

     That was visible, because the cascade underneath is the pre-redesign look
    , vivid.css paints .brand-panel a flat #FFFFFF !important and this file's
     warming pass is what turns it back into a dark surface. Signup's left half
     spent about 370ms as a white rectangle (with white text on it) after every
     click from the homepage. */
  function restyle() {
    sync();
    /* Layout that settles a frame later, then a backstop for anything the
       page fetches on mount. Longer-lived arrivals are the observer's job. */
    requestAnimationFrame(function () { sync(); });
    setTimeout(sync, 400);
  }

  window.KidBg = { restyle: restyle };

  window.KidTheme = { ICON: ICON, TINT: TINT };
})();
