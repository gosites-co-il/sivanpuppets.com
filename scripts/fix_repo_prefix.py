import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAIRS = [
    ("/sivan/", "/sivanpuppets.com/"),
    ("'/sivan'", "'/sivanpuppets.com'"),
    ('"/sivan"', '"/sivanpuppets.com"'),
]
TEXT_EXT = {".html", ".htm", ".css", ".js", ".json", ".xml", ".svg"}


def is_text_file(path: str) -> bool:
    base = os.path.basename(path)
    if base.startswith("8134"):
        return True
    return os.path.splitext(base)[1].lower() in TEXT_EXT


def main() -> None:
    n = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d != ".git"]
        for name in filenames:
            path = os.path.join(dirpath, name)
            if not is_text_file(path):
                continue
            try:
                data = open(path, "r", encoding="utf-8", errors="surrogateescape").read()
            except OSError:
                continue
            orig = data
            for a, b in PAIRS:
                data = data.replace(a, b)
            if data != orig:
                open(path, "w", encoding="utf-8", errors="surrogateescape").write(data)
                n += 1
    print(f"Updated {n} files")


if __name__ == "__main__":
    main()
