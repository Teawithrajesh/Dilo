"""Builds the DILO logo SVGs from the founder's concept (docs/brand/reference-concept.png).

Text is converted to outlines, so the SVGs look the same on every device without fonts.
Needs: pip install fonttools brotli, and the Plus Jakarta Sans woff2 files from
@fontsource/plus-jakarta-sans (pass their folder as the first argument).

Usage: python3 scripts/brand/build_logos.py <fontsource files dir> <output dir>
"""
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONT_DIR, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

NAVY, PINK, VIOLET, ORANGE, GOLD, WHITE, BLACK = (
    "#0A1440", "#FD216E", "#3A1ECF", "#FE8F02", "#FFB000", "#FFFFFF", "#000000")
TAGLINE = "Together, We Make Dreams Come True."


def font(weight):
    return TTFont(FONT_DIR / f"plus-jakarta-sans-latin-{weight}-normal.woff2")


def text_path(text, weight, size, x=0.0, baseline=0.0, tracking=0.0):
    """Returns (svg path d, width, per-glyph boxes) for text set at `size` px."""
    f = font(weight)
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    s = size / f["head"].unitsPerEm
    pen, cursor, boxes = SVGPathPen(gs), x, []
    for ch in text:
        name = cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, cursor, baseline))
        gs[name].draw(tp)
        bp = BoundsPen(gs)
        gs[name].draw(bp)
        if bp.bounds:
            x0, y0, x1, y1 = bp.bounds
            boxes.append((ch, cursor + x0 * s, baseline - y1 * s, cursor + x1 * s, baseline - y0 * s))
        cursor += hmtx[name][0] * s + tracking
    return pen.getCommands(), cursor - x - tracking, boxes


def sparkle(cx, cy, r, fill):
    k = r * 0.16
    return (f'<path fill="{fill}" d="M{cx},{cy - r} C{cx + k},{cy - k} {cx + k},{cy - k} {cx + r},{cy} '
            f'C{cx + k},{cy + k} {cx + k},{cy + k} {cx},{cy + r} C{cx - k},{cy + k} {cx - k},{cy + k} {cx - r},{cy} '
            f'C{cx - k},{cy - k} {cx - k},{cy - k} {cx},{cy - r} Z"/>')


# --- Symbol: infinity loop + two people (dots) + sparkle. Box 240 x 160. ---
SYMBOL_W, SYMBOL_H = 240, 160
INFINITY = ("M120,105 C140,75 158,66 174,66 C198,66 214,84 214,105 C214,126 198,144 174,144 "
            "C158,144 140,135 120,105 C100,75 82,66 66,66 C42,66 26,84 26,105 C26,126 42,144 66,144 "
            "C82,144 100,135 120,105 Z")


def symbol(uid, mono=None, dx=0.0, dy=0.0, scale=1.0):
    if mono:
        stroke, left, right, star, defs = mono, mono, mono, mono, ""
    else:
        stroke, left, right, star = f"url(#{uid}-g)", PINK, ORANGE, GOLD
        defs = (f'<defs><linearGradient id="{uid}-g" x1="26" y1="150" x2="214" y2="60" gradientUnits="userSpaceOnUse">'
                f'<stop offset="0" stop-color="{VIOLET}"/><stop offset="0.38" stop-color="{PINK}"/>'
                f'<stop offset="0.72" stop-color="#FF4E1A"/><stop offset="1" stop-color="{ORANGE}"/>'
                f'</linearGradient></defs>')
    return (f'{defs}<g transform="translate({dx},{dy}) scale({scale})">'
            f'<path d="{INFINITY}" fill="none" stroke="{stroke}" stroke-width="30" stroke-linejoin="round"/>'
            f'<circle cx="82" cy="27" r="18" fill="{left}"/><circle cx="158" cy="27" r="18" fill="{right}"/>'
            f'{sparkle(120, 20, 15, star)}</g>')


def wordmark(x, baseline, size, color, star_color):
    d, w, boxes = text_path("DILO", 800, size, x, baseline, tracking=size * 0.01)
    _, x0, y0, x1, y1 = [b for b in boxes if b[0] == "O"][0]
    star = sparkle((x0 + x1) / 2, (y0 + y1) / 2, (y1 - y0) * 0.2, star_color)
    return f'<path fill="{color}" d="{d}"/>{star}', w, y1 - y0


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


def write(name, content):
    (OUT / name).write_text(content)
    print("wrote", name)


# Colour schemes: (wordmark colour, symbol mono colour or None, sparkle-in-O colour, tagline colour)
SCHEMES = {
    "light": (NAVY, None, GOLD, NAVY),      # on white / light backgrounds
    "dark": (WHITE, None, GOLD, WHITE),     # on navy / dark backgrounds
    "mono-black": (BLACK, BLACK, BLACK, BLACK),
    "mono-white": (WHITE, WHITE, WHITE, WHITE),
}

for scheme, (wcol, mono, ocol, tcol) in SCHEMES.items():
    uid = f"dilo-{scheme}"
    # Symbol only
    write(f"symbol-{scheme}.svg" if scheme != "light" else "symbol.svg",
          svg(SYMBOL_W, SYMBOL_H, symbol(uid, mono), "DILO"))

    # Horizontal: symbol left of wordmark
    cap = 100
    s = 1.0
    wm, ww, wh = wordmark(SYMBOL_W + 36, 130, cap / 0.72, wcol, ocol)  # cap height is ~72% of size
    write(f"logo-horizontal-{scheme}.svg",
          svg(SYMBOL_W + 36 + ww + 8, SYMBOL_H + 4, symbol(uid, mono) + wm, "DILO"))

    # Primary: symbol above wordmark above tagline
    size = 120 / 0.72
    _, ww, _ = text_path("DILO", 800, size, tracking=size * 0.01)
    td, tw, _ = text_path(TAGLINE, 600, 38)
    W = max(ww, tw, SYMBOL_W * 1.4) + 40
    sym_scale = 1.4
    sym = symbol(uid, mono, (W - SYMBOL_W * sym_scale) / 2, 10, sym_scale)
    base_w = 10 + SYMBOL_H * sym_scale + 30 + 120
    wm, _, _ = wordmark((W - ww) / 2, base_w, size, wcol, ocol)
    _, tw2, _ = text_path(TAGLINE, 600, 38)
    tag, _, _ = text_path(TAGLINE, 600, 38, (W - tw2) / 2, base_w + 70)
    write(f"logo-primary-{scheme}.svg",
          svg(W, base_w + 90, sym + wm + f'<path fill="{tcol}" d="{tag}"/>', "DILO — " + TAGLINE))

# App icon (navy rounded square, symbol + DILO in white), as in the concept.
def app_icon(size_px, maskable):
    S = 512
    pad = 0.2 if maskable else 0.12           # maskable keeps everything inside the 80% safe zone
    inner = S * (1 - 2 * pad)
    sym_scale = inner / SYMBOL_W * 0.86
    sym_h = SYMBOL_H * sym_scale
    wsize = inner * 0.36
    _, ww, _ = text_path("DILO", 800, wsize, tracking=wsize * 0.01)
    total_h = sym_h + inner * 0.06 + wsize * 0.72
    top = (S - total_h) / 2
    sym = symbol(f"dilo-icon-{int(maskable)}", None, (S - SYMBOL_W * sym_scale) / 2, top, sym_scale)
    wm, _, _ = wordmark((S - ww) / 2, top + sym_h + inner * 0.06 + wsize * 0.72, wsize, WHITE, GOLD)
    rx = 0 if maskable else 112
    body = f'<rect width="{S}" height="{S}" rx="{rx}" fill="{NAVY}"/>' + sym + wm
    return svg(S, S, body, "DILO app icon")


write("app-icon.svg", app_icon(512, False))
write("app-icon-maskable.svg", app_icon(512, True))
