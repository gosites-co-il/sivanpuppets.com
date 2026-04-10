"""Rewrite mirrored absolute URLs for a GitHub Pages *project* site (/<repo>/...).

When you later use a custom domain at the site root, replace the path prefix
(e.g. /sivan/) with / across the tree (or re-run with GITHUB_PAGES_REPO empty
and adjust logic) so links are not under /repo/.
"""
import os
import sys

REPO = os.environ.get("GITHUB_PAGES_REPO", "sivan")
PREFIX = f"/{REPO.strip('/')}/"
REPLACEMENTS = [
    ("https://www.sivanpuppets.com/", PREFIX),
    ("http://www.sivanpuppets.com/", PREFIX),
    ("https://sivanpuppets.com/", PREFIX),
    ("http://sivanpuppets.com/", PREFIX),
    # Bare host (after the above)
    ("https://www.sivanpuppets.com", PREFIX.rstrip("/")),
    ("http://www.sivanpuppets.com", PREFIX.rstrip("/")),
    ("https://sivanpuppets.com", PREFIX.rstrip("/")),
    ("http://sivanpuppets.com", PREFIX.rstrip("/")),
    # Broken preconnect without scheme
    ('href="www.sivanpuppets.com"', f'href="{PREFIX.rstrip("/")}"'),
    ("href='www.sivanpuppets.com'", f"href='{PREFIX.rstrip('/')}'"),
]

TEXT_EXT = {".html", ".htm", ".css", ".js", ".json", ".xml", ".svg"}
SKIP_NAMES = {".nojekyll", ".gitignore"}


def maybe_text(path: str) -> bool:
    low = path.lower()
    if any(low.endswith(e) for e in TEXT_EXT):
        return True
    base = os.path.basename(path)
    if base in SKIP_NAMES or base.startswith("."):
        return False
    # Extensionless numeric bundles from this mirror
    if base.startswith("8134"):
        return True
    return False


def main(root: str) -> None:
    root = os.path.abspath(root)
    n = 0
    for dirpath, _, files in os.walk(root):
        if os.path.basename(dirpath) == "scripts":
            continue
        for name in files:
            path = os.path.join(dirpath, name)
            if not maybe_text(path):
                continue
            try:
                data = open(path, "r", encoding="utf-8", errors="surrogateescape").read()
            except OSError:
                continue
            orig = data
            for a, b in REPLACEMENTS:
                data = data.replace(a, b)
            if data != orig:
                open(path, "w", encoding="utf-8", errors="surrogateescape").write(data)
                n += 1
    print(f"Rewrote {n} files under {root} with prefix {PREFIX!r}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
