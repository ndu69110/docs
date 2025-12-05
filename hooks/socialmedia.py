from textwrap import dedent
import urllib.parse

x_intent = "https://x.com/intent/tweet"

def on_page_markdown(markdown, **kwargs):
    page = kwargs['page']
    config = kwargs['config']

    page_url = config.site_url + page.url
    page_title = urllib.parse.quote(page.title + " ")

    return markdown + dedent(f"""
    ---
    [:simple-x: Partager sur X]({x_intent}?text={page_title}&url={page_url}){{ .md-button target=_blank }}
    """)