---
layout: page
title: Regiones
permalink: /regiones/
images_url: /images/regiones
---
<!-- Get the tag name for every tag on the site and set them
to the `site_tags` variable. -->
{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}

<!-- `tag_words` is a sorted array of the tag names. -->
{% assign tag_words = site_tags | split:',' | sort %}

<!-- List of all tags -->
<ul class="tags">
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <li>
      <a href="#{{ this_word | cgi_escape }}" class="tag">{{ this_word }}
        <span>({{ site.tags[this_word].size }})</span>
      </a>
    </li>
  {% endunless %}{% endfor %}
</ul>

<!-- Posts by Tag -->
<div>
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <h2 id="{{ this_word | cgi_escape }}">{{ this_word }}</h2>
     <div class="tag_container">
      {% for post in site.tags[this_word] %}
          {% if post.title != null %} 
          <a class="tag_post" href="{{ post.url }}">
            <div class="post-thumbnail">
              <amp-img  src="{{site.url}}{{post.images_url}}/featuredThumbnail.jpg" 
                        layout="responsive"
                        alt="{{post.thumbnail_alt}}" 
                        height="370" 
                        width="700"/>
            </div>
            <div>
            <amp-fit-text min-font-size="9"  max-font-size="52" height="15" layout="fixed-height" >
              {{ post.title }}
            </amp-fit-text>
            </div>
          </a>   
      {% endif %}{% endfor %}
    </div>
  {% endunless %}{% endfor %}
</div>