---
title: Tutorials
permalink: /tutorials/
---

This page lists tutorials found in the tutorials/ directory and in blog posts tagged as tutorials (category: tutorial).

<h2>Tutorial pages</h2>
<ul>
{% for p in site.pages %}
  {% if p.path contains "tutorials/" and p.path != "tutorials/index.md" %}
    <li><a href="{{ p.url | relative_url }}">{{ p.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>

<h2>Tutorial posts</h2>
<ul>
{% for post in site.posts %}
  {% if post.categories contains "tutorial" %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%Y-%m-%d" }}</li>
  {% endif %}
{% endfor %}
</ul>
