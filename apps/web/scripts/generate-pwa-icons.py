#!/usr/bin/env python3
"""Generate StatusPass PWA / Expo PNG icons without extra deps."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

NAVY = (0x1E, 0x3A, 0x5F, 255)
CREAM = (0xF7, 0xF4, 0xEE, 255)
TEAL = (0x2A, 0x9D, 0x8F, 255)
WHITE = (255, 255, 255, 255)


def write_png(path: Path, width: int, height: int, pixels: list[tuple[int, int, int, int]]) -> None:
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        start = y * width
        for r, g, b, a in pixels[start : start + width]:
            raw.extend((r, g, b, a))

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def fill(size: int, color: tuple[int, int, int, int]) -> list[tuple[int, int, int, int]]:
    return [color] * (size * size)


def rect(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    color: tuple[int, int, int, int],
) -> None:
    for y in range(max(0, y0), min(size, y1)):
        row = y * size
        for x in range(max(0, x0), min(size, x1)):
            pixels[row + x] = color


def rounded_rect(
    pixels: list[tuple[int, int, int, int]],
    size: int,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    radius: int,
    color: tuple[int, int, int, int],
) -> None:
    for y in range(max(0, y0), min(size, y1)):
        for x in range(max(0, x0), min(size, x1)):
            cx = x0 + radius if x < x0 + radius else x1 - radius - 1 if x >= x1 - radius else x
            cy = y0 + radius if y < y0 + radius else y1 - radius - 1 if y >= y1 - radius else y
            if x < x0 + radius and y < y0 + radius:
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    continue
            elif x >= x1 - radius and y < y0 + radius:
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    continue
            elif x < x0 + radius and y >= y1 - radius:
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    continue
            elif x >= x1 - radius and y >= y1 - radius:
                if (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2:
                    continue
            pixels[y * size + x] = color


def draw_s(pixels: list[tuple[int, int, int, int]], size: int, inset: float, color: tuple[int, int, int, int]) -> None:
    """Block-letter S scaled to the canvas."""
    left = int(size * (0.28 + inset * 0.08))
    right = int(size * (0.72 - inset * 0.08))
    top = int(size * (0.22 + inset * 0.06))
    bot = int(size * (0.78 - inset * 0.06))
    mid = (top + bot) // 2
    thick = max(6, size // 9)
    rect(pixels, size, left, top, right, top + thick, color)
    rect(pixels, size, left, mid - thick // 2, right, mid + thick // 2 + 1, color)
    rect(pixels, size, left, bot - thick, right, bot, color)
    rect(pixels, size, left, top, left + thick, mid + thick // 2 + 1, color)
    rect(pixels, size, right - thick, mid - thick // 2, right, bot, color)


def make_icon(size: int, *, maskable: bool = False) -> list[tuple[int, int, int, int]]:
    pixels = fill(size, (0, 0, 0, 0) if maskable else NAVY)
    pad = int(size * 0.18) if maskable else 0
    if maskable:
        rounded_rect(pixels, size, pad, pad, size - pad, size - pad, size // 6, NAVY)
        # Teal accent bar at bottom of the inner tile
        accent_h = max(4, size // 28)
        inner = pad + int(size * 0.04)
        rect(pixels, size, inner, size - pad - accent_h - inner // 4, size - inner, size - pad - inner // 4, TEAL)
        draw_s(pixels, size, 0.35, CREAM)
    else:
        draw_s(pixels, size, 0.0, CREAM)
        accent_h = max(4, size // 32)
        rect(pixels, size, 0, size - accent_h, size, size, TEAL)
    return pixels


def main() -> None:
    web = Path(__file__).resolve().parents[1] / "public" / "icons"
    mobile = Path(__file__).resolve().parents[2] / "mobile" / "assets"
    specs = [
        (web / "icon-192.png", 192, False),
        (web / "icon-512.png", 512, False),
        (web / "icon-512-maskable.png", 512, True),
        (web / "apple-touch-icon.png", 180, False),
        (mobile / "icon.png", 1024, False),
        (mobile / "adaptive-icon.png", 1024, True),
        (mobile / "splash-icon.png", 256, False),
        (mobile / "favicon.png", 48, False),
    ]
    for path, size, maskable in specs:
        write_png(path, size, size, make_icon(size, maskable=maskable))
        print(f"wrote {path} ({size}x{size})")


if __name__ == "__main__":
    main()
