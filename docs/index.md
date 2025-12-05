# S2I MkDocs Example - Example 1

An `index.md` file is mandatory for those who don't want to use the plugin i18n, and hence their documentation will be in one language. More information on how to configure a single language site [here](https://how-to.docs.cern.ch/advanced/single_language/){target=_blank}.

For those who want to have multilanguage sites or simply want to configure their single language sites through the i18n plugin, this file has to be removed, since the use of the i18n plugin requires following the file name convection `filename.<language>.md`. You can see more information on how to configure a multilanguage site [here](https://how-to.docs.cern.ch/advanced/multi_language/){target=_blank}.

More information on how this page was created is available at [S2I MkDocs Container GitLab repository](https://gitlab.cern.ch/authoring/documentation/s2i-mkdocs-container){target=_blank}.

## Source files - Example 1

The source files for this example can be found in the [MkDocs Example GitLab repository](https://gitlab.cern.ch/authoring/documentation/s2i-mkdocs-example){target=_blank}.

## Theme - Example 1

This example is using the [Material theme for MkDocs](https://squidfunk.github.io/mkdocs-material/){target=_blank}. To use this theme yourself all you have to do is add the following in your MkDocs configuration file ([`mkdocs.yml`](https://gitlab.cern.ch/authoring/documentation/s2i-mkdocs-example/blob/master/mkdocs.yml){target=_blank}):
```yaml
theme:
    name: material
```

On your left you'll find the content structure of the entire site and on your right the table of conents of this specific page.
