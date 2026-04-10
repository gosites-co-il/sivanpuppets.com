"""
Download remote images into images/_remote/ and rewrite HTML/CSS/JS references.
Handles percent-encoded URLs in JSON (data-settings) and non-ASCII paths.
"""
from __future__ import annotations

import hashlib
import html as html_module
import os
import re
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "images", "_remote")
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

IMAGE_EXT_GROUP = r"(?:jpg|jpeg|png|gif|jfif|webp|svg|ico|bmp)"
# Match image URLs to closing quote; paths may contain spaces (Hebrew filenames)
PLAIN_RE = re.compile(
    rf"https?://(?:cdna|cdnw|app)\.wobily\.com[^\"']+?\.{IMAGE_EXT_GROUP}(?:\?[^\"']*)?",
    re.I,
)
# Percent-encoded https://cdna.wobily.com/...file.ext
ENC_RE = re.compile(
    rf"https%3A%2F%2F(?:cdna|cdnw|app)\.wobily\.com(?:%2F|%2f)(?:[^\"']|%(?:2[fF]|[0-9A-Fa-f]{{2}}))+?\.{IMAGE_EXT_GROUP}(?:%3[fF][^\"']*)?",
    re.I,
)
ENC_RE_FB = re.compile(
    r"https%3A%2F%2Fstatic\.xx\.fbcdn\.net(?:%2F|%2f)(?:[^\"']|%(?:2[fF]|[0-9A-Fa-f]{2}))+?\.png(?:%3[fF][^\"']*)?",
    re.I,
)
PLAIN_FB = re.compile(
    r"https?://static\.xx\.fbcdn\.net[^\"']+?\.png(?:\?[^\"']*)?",
    re.I,
)


def host_ok(hostname: str) -> bool:
    h = (hostname or "").lower()
    if h in ("www.wobily.com", "wobily.com"):
        return False
    return (
        h.endswith("cdna.wobily.com")
        or h.endswith("cdnw.wobily.com")
        or h.endswith("app.wobily.com")
        or "fbcdn.net" in h
    )


def looks_like_image_url(url: str) -> bool:
    u = url.split("?", 1)[0].lower().rstrip(".,;)")
    return bool(
        re.search(rf"\.{IMAGE_EXT_GROUP}$", u, re.I)
        or "/images/" in u
        or "/media-gallery/" in u
        or "emoji.php" in u
        or "/plugins/smiley/images/" in u
    )


def request_url_from_canonical(url: str) -> str:
    """Encode non-ASCII path for urllib (IRI -> URI). Keep = in gallery keys unencoded."""
    p = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(p.path), safe="/=")
    return urllib.parse.urlunsplit((p.scheme, p.netloc, path, p.query, p.fragment))


def url_extension(url: str) -> str:
    path = urllib.parse.urlsplit(url).path.lower()
    for ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".jfif", ".bmp"):
        if path.endswith(ext):
            return ext
    m = re.search(r"\.(" + IMAGE_EXT_GROUP + r")(?:\?|$)", url, re.I)
    return "." + (m.group(1).lower() if m else "bin")


def stable_name(url: str) -> str:
    ext = url_extension(url)
    h = hashlib.sha256(url.encode("utf-8", errors="replace")).hexdigest()[:24]
    return f"{h}{ext}"


def peel_to_canonical(frag: str) -> str:
    """HTML-unescape + repeated URI decoding (handles triple-encoded data-settings)."""
    s = frag.replace("&#37;", "%").replace("&amp;#37;", "%")
    s = html_module.unescape(s)
    s = re.sub(r"%26(?:apos|APOS)%3[Bb]", "'", s)
    s = s.replace("&apos;", "'")
    for _ in range(12):
        try:
            s2 = urllib.parse.unquote(s)
        except Exception:
            break
        if s2 == s:
            break
        s = s2
    return s


def find_fragments(text: str) -> list[tuple[str, str]]:
    """Return list of (exact_fragment_in_file, canonical_https_url)."""
    out: list[tuple[str, str]] = []
    seen_spans: set[tuple[int, int]] = set()

    def add_span(frag: str, canon: str, start: int, end: int) -> None:
        span = (start, end)
        if span in seen_spans:
            return
        if any(c in canon for c in '"{}') or "Image" in canon or "OpenInNewWindow" in canon:
            return
        if not host_ok(urllib.parse.urlsplit(canon).hostname or ""):
            return
        if not looks_like_image_url(canon):
            return
        seen_spans.add(span)
        out.append((frag, canon))

    for rx in (PLAIN_RE, PLAIN_FB):
        for m in rx.finditer(text):
            frag = m.group(0)
            canon = peel_to_canonical(frag)
            add_span(frag, canon, m.start(), m.end())

    for rx in (ENC_RE, ENC_RE_FB):
        for m in rx.finditer(text):
            frag = m.group(0)
            canon = peel_to_canonical(frag)
            add_span(frag, canon, m.start(), m.end())

    # Triple-encoded: https%253A%252F%252Fcdna.wobily.com%252F...
    triple = re.compile(
        rf"https(?:%25)+3A(?:%25)+2F(?:%25)+2F(?:cdna|cdnw|app)\.wobily\.com(?:%25)+2F[^\"']+?\.{IMAGE_EXT_GROUP}(?:\?[^\"']*)?",
        re.I,
    )
    for m in triple.finditer(text):
        frag = m.group(0)
        canon = peel_to_canonical(frag)
        add_span(frag, canon, m.start(), m.end())

    return out


def iter_source_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_base = os.path.relpath(dirpath, ROOT)
        if rel_base.startswith("images"):
            dirnames[:] = [d for d in dirnames if d != "_remote"]
            if "_remote" in rel_base:
                continue
        dirnames[:] = [d for d in dirnames if d != ".git"]
        if rel_base == "scripts" or rel_base.startswith("scripts" + os.sep):
            continue
        if rel_base == "images" or rel_base.startswith("images" + os.sep):
            continue
        for name in filenames:
            path = os.path.join(dirpath, name)
            low = name.lower()
            if low.endswith((".html", ".css", ".js")) or name.startswith("8134"):
                yield path


def download(url: str, dest: str) -> bool:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    fetch_url = request_url_from_canonical(url)
    req = urllib.request.Request(fetch_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = resp.read()
        ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        if dest.endswith(".bin") and ctype.startswith("image/"):
            sub = ctype.split("/")[-1]
            if sub == "jpeg":
                sub = "jpg"
            dest = dest[:-4] + "." + sub
        with open(dest, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print("FAIL", fetch_url[:100], e)
        return False


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    canon_to_rel: dict[str, str] = {}
    fragment_to_rel: dict[str, str] = {}

    for path in iter_source_files():
        try:
            text = open(path, "r", encoding="utf-8", errors="surrogateescape").read()
        except OSError:
            continue
        for frag, canon in find_fragments(text):
            if canon not in canon_to_rel:
                rel = "images/_remote/" + stable_name(canon)
                dest = os.path.join(ROOT, rel.replace("/", os.sep))
                if not os.path.isfile(dest):
                    print("GET", canon[:95])
                    if download(canon, dest):
                        time.sleep(0.1)
                if os.path.isfile(dest):
                    canon_to_rel[canon] = rel
            if canon in canon_to_rel:
                fragment_to_rel[frag] = canon_to_rel[canon]

    # Replace longest fragments first (avoid partial overlaps)
    frags = sorted(fragment_to_rel.keys(), key=len, reverse=True)

    n_files = 0
    for path in iter_source_files():
        try:
            data = open(path, "r", encoding="utf-8", errors="surrogateescape").read()
        except OSError:
            continue
        orig = data
        for frag in frags:
            if frag in data:
                data = data.replace(frag, fragment_to_rel[frag])
        if data != orig:
            open(path, "w", encoding="utf-8", errors="surrogateescape").write(data)
            n_files += 1

    print("Canonical URLs:", len(canon_to_rel))
    print("Fragment replacements:", len(fragment_to_rel))
    print("Files rewritten:", n_files)


if __name__ == "__main__":
    main()
