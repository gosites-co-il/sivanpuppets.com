#!/usr/bin/env python3
"""Emit sitemap.xml at repo root from *.html in same directory as this script's parent."""
from __future__ import annotations

import os
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

REPO_ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.sivanpuppets.com"
EXCLUDE = {
    "Login.html",
    "SignUp.html",
    "ForgotPassword.html",
    "index_1.html",
}


def main() -> None:
    html_files = sorted(
        p.name
        for p in REPO_ROOT.glob("*.html")
        if p.is_file() and p.name not in EXCLUDE
    )
    lastmod = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    urlset = ET.Element(
        "urlset",
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9",
    )

    def add_url(loc: str) -> None:
        u = ET.SubElement(urlset, "url")
        ET.SubElement(u, "loc").text = loc
        ET.SubElement(u, "lastmod").text = lastmod

    add_url(f"{BASE}/")

    for name in html_files:
        if name == "index.html":
            continue
        enc = quote(name, safe="")
        add_url(f"{BASE}/{enc}")

    tree = ET.ElementTree(urlset)
    out = REPO_ROOT / "sitemap.xml"
    ET.indent(tree, space="  ")
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(f"Wrote {out} ({len(html_files)} pages + home)")


if __name__ == "__main__":
    main()
