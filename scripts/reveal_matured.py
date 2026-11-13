"""Publish Indian notes whose 12-month horizon has ended.

The full Indian notes (rating, price target, write-up, file names) are kept outside this
repository in PRIVATE/india-notes.json. On the public site each one shows only as a
valuation note with `access: "private"` and a `revealAfter` date. Run this script any
time after a note's date has passed:

    python3 scripts/reveal_matured.py ../PRIVATE/india-notes.json            # show what would change
    python3 scripts/reveal_matured.py ../PRIVATE/india-notes.json --write    # change js/data.js
    python3 scripts/reveal_matured.py NOTES.json --write --copy-from FILES_DIR   # also copy the PDFs/models in

The daily GitHub Action (.github/workflows/india-reveal.yml) runs the last form
automatically, using the encrypted copy of the private folder in private/.

For each matured note it puts the rating, target, full write-up and file links back into
js/data.js and marks it `access: "matured"`, which the site shows as a historical
"Matured call". It then lists the PDF and Excel files to copy from
PRIVATE/India Research Pack/files/ into assets/files/. Run `node --check js/data.js`
afterwards. Ledger shows the matured call's record by itself (it publishes Indian calls
once they are a year old).
"""
import datetime, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "js", "data.js")
FILES = os.path.join(HERE, "..", "assets", "files")


def js(v):
    return json.dumps(v, ensure_ascii=False)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    private = json.load(open(sys.argv[1]))
    write = "--write" in sys.argv
    today = datetime.date.today().isoformat()
    s = open(DATA).read()
    files, done = [], []
    for n in private["notes"]:
        if n.get("revealAfter", "9999") > today:
            continue
        marker = "      title: " + js(n["title"])
        if marker not in s:
            print("not found on the site, skipped:", n["title"]); continue
        t0 = s.index(marker)
        a = s.rindex("    {", 0, t0); b = s.index("\n    }", t0) + len("\n    }")
        block = s[a:b]
        if 'access: "private"' not in block:
            continue                                   # already published
        new = block
        for key in ("rating", "targetPrice", "fileUrl", "fileUrl2", "thesis"):
            new = re.sub(r'      ' + key + r': "[^"]*",', '      ' + key + ': ' + js(n.get(key, "")) + ',', new, count=1)
        new = re.sub(r'      detail: ".*?",\n', lambda m: '      detail: ' + js(n["detail"]) + ',\n', new, count=1, flags=re.S)
        new = new.replace('access: "private",              /* full note in PRIVATE/india-notes.json */',
                          'access: "matured",              /* horizon ended: published in full */')
        s = s[:a] + new + s[b:]
        done.append(n["title"])
        files += [os.path.basename(n[k]) for k in ("fileUrl", "fileUrl2") if n.get(k)]
    if not done:
        print("Nothing to publish yet. Next dates:", ", ".join(sorted({n["revealAfter"] for n in private["notes"] if n.get("revealAfter", "") > today})[:3]))
        return
    print(("Published" if write else "Would publish") + ":\n  " + "\n  ".join(done))
    print("Copy these from 'PRIVATE/India Research Pack/files/' into assets/files/:\n  " + "\n  ".join(files))
    if write:
        open(DATA, "w").write(s)
        if "--copy-from" in sys.argv:
            src = sys.argv[sys.argv.index("--copy-from") + 1]
            for f in files:
                shutil.copy2(os.path.join(src, f), os.path.join(FILES, f))
            print("Copied the files into assets/files/.")
    else:
        print("\n(dry run: add --write to change js/data.js)")


if __name__ == "__main__":
    main()
