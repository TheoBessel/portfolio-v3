import os
import mistletoe as md
from mistletoe.contrib.pygments_renderer import PygmentsRenderer


ARTICLES_DIR = "../articles/"
POSTS_DIR = os.path.join(ARTICLES_DIR, "blog")
PROJECTS_DIR = os.path.join(ARTICLES_DIR, "project")
OUTPUT_DIR = "../site/articles"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def parse_markdown_file(filepath):
    """Retourne (slug, meta_dict, html_content)"""
    with open(filepath, "r", encoding="utf-8") as f:
        raw = f.read()

    # extraire meta
    meta_start = "<!-- *META -->"
    meta_end   = "<!-- !META -->"
    content_start = "<!-- *CONTENT -->"
    content_end   = "<!-- !CONTENT -->"

    meta = ""
    content = ""

    if meta_start in raw and meta_end in raw:
        s = raw.find(meta_start) + len(meta_start)
        e = raw.find(meta_end, s)
        meta = raw[s:e].strip()

    if content_start in raw and content_end in raw:
        s = raw.find(content_start) + len(content_start)
        e = raw.find(content_end, s)
        content = raw[s:e].strip()

    html_meta = md.markdown(meta, PygmentsRenderer)
    html_content = md.markdown(content, PygmentsRenderer)
    return os.path.basename(filepath)[:-3], html_meta, html_content

def write_article_output(output_root, category, slug, html_meta, html_content):
    dest_dir = os.path.join(output_root, category, slug)
    ensure_dir(dest_dir)

    # index.html
    with open(os.path.join(dest_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(f"<div class=\"article-content\">\n{html_content}\n</div>")

    with open(os.path.join(dest_dir, "meta.html"), "w", encoding="utf-8") as f:
        f.write(f"<div class=\"article-meta\">\n{html_meta}\n</div>")

def write_articles_js(output_root, posts_slugs, projects_slugs):
    ensure_dir(output_root)
    lines = [
        "/* articles.js",
        " * Centralized articles (posts and projects) definitions",
        " */\n",
        "export const posts = {",
        *[f'    "{slug}": "articles/posts/{slug}",' for slug in posts_slugs],
        "};\n",
        "export const projects = {",
        *[f'    "{slug}": "articles/projects/{slug}",' for slug in projects_slugs],
        "};\n"
    ]
    with open(os.path.join(output_root, "articles.js"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def load_markdown_files(directory):
    return [
        parse_markdown_file(os.path.join(directory, fn))
        for fn in os.listdir(directory) if fn.endswith(".md")
    ]

if __name__ == "__main__":
    # Clean output directory
    if os.path.exists(OUTPUT_DIR):
        os.system(f"rm -rf {OUTPUT_DIR}")

    posts = load_markdown_files(POSTS_DIR)
    projects = load_markdown_files(PROJECTS_DIR)

    posts_slugs = []
    for slug, meta, html in posts:
        write_article_output(OUTPUT_DIR, "posts", slug, meta, html)
        posts_slugs.append(slug)

    projects_slugs = []
    for slug, meta, html in projects:
        write_article_output(OUTPUT_DIR, "projects", slug, meta, html)
        projects_slugs.append(slug)

    write_articles_js(OUTPUT_DIR, posts_slugs, projects_slugs)
