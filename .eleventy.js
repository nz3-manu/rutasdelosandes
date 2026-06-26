const Image = require("@11ty/eleventy-img");
const cheerio = require("cheerio");

function copyAttributes($, from, to, excluded = []) {
  const attrs = from.attribs || {};
  Object.keys(attrs).forEach((name) => {
    if (!excluded.includes(name)) {
      to.attr(name, attrs[name]);
    }
  });
}

module.exports = function (eleventyConfig) {
  // --- TUS CONFIGURACIONES EXISTENTES ---
  eleventyConfig.addLayoutAlias("article", "layouts/article.html");
  eleventyConfig.addLayoutAlias("basic", "layouts/basic.html");
  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("trail", "layouts/trail.html");

  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    root: ["_includes", "."],
  });

  // Extrae departamento de la URL: /rutas/colombia/DEPT/slug → DEPT
  eleventyConfig.addFilter("deptFromUrl", (url) => {
    const parts = (url || "").replace("/amp", "").split("/").filter(Boolean);
    const colIdx = parts.indexOf("colombia");
    return colIdx !== -1 && parts[colIdx + 1] ? parts[colIdx + 1] : "";
  });

  // --- NUEVA CONFIGURACIÓN: FILTRO DE FECHA PARA SITEMAP ---
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // Si ya es un objeto Date, lo usamos; si no, intentamos crearlo
    const date = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    
    // Si la fecha es válida, devolvemos ISO, sino devolvemos la fecha actual
    return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
  });

  // --- COLECCIONES ---
  eleventyConfig.addCollection("rutas", (collection) => {
    return collection.getFilteredByGlob("rutas/**/*.md");
  });

  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("blog/**/*.md");
  });

  // --- CONFIGURACIÓN DE IMÁGENES ---
  eleventyConfig.addAsyncShortcode("image", async function(src, alt) {
    if(alt === undefined) {
      throw new Error(`Falta el atributo alt: ${src}`);
    }
    
    let stats = await Image(src, {
      widths: [300, 600, 1000],
      formats: ["jpeg", "webp"],
      outputDir: "./_site/img/"
    });
    
    return Image.generateHTML(stats, {
      alt,
      loading: "lazy",
      sizes: "(max-width: 600px) 300px, 1000px"
    });
  });

  eleventyConfig.addTransform("replaceAmpComponents", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    const $ = cheerio.load(content, { decodeEntities: false });

    $("html[amp]").removeAttr("amp");
    $("amp-install-serviceworker").remove();

    $("amp-img").each((_, element) => {
      const $element = $(element);
      const image = $("<img>");
      copyAttributes($, element, image, [
        "amp-fx",
        "data-parallax-factor",
        "layout",
      ]);
      image.attr("loading", $element.attr("loading") || "lazy");
      image.attr("decoding", "async");
      image.addClass($element.attr("class") || "");
      $element.replaceWith(image);
    });

    $("amp-iframe").each((_, element) => {
      const $element = $(element);
      const iframe = $("<iframe>");
      copyAttributes($, element, iframe, ["layout"]);
      iframe.attr("loading", "lazy");
      iframe.attr("allowfullscreen", "allowfullscreen");
      iframe.addClass(`rda-embed ${$element.attr("class") || ""}`.trim());
      $element.replaceWith(iframe);
    });

    $("amp-youtube").each((_, element) => {
      const $element = $(element);
      const videoId = $element.attr("data-videoid");
      const iframe = $("<iframe>");
      iframe.attr("src", `https://www.youtube.com/embed/${videoId}`);
      iframe.attr("title", "Video de Rutas de los Andes");
      iframe.attr("loading", "lazy");
      iframe.attr("allowfullscreen", "allowfullscreen");
      iframe.attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.attr("width", $element.attr("width") || "480");
      iframe.attr("height", $element.attr("height") || "270");
      iframe.addClass("rda-embed");
      $element.replaceWith(iframe);
    });

    $("amp-video").each((_, element) => {
      const $element = $(element);
      const video = $("<video>");
      copyAttributes($, element, video, ["layout"]);
      video.attr("playsinline", "playsinline");
      if (!$element.attr("controls")) {
        video.attr("controls", "controls");
      }
      video.append($element.contents());
      $element.replaceWith(video);
    });

    $("amp-instagram").each((_, element) => {
      const $element = $(element);
      const shortcode = $element.attr("data-shortcode");
      const wrapper = $('<figure class="rda-instagram"></figure>');
      const iframe = $("<iframe>");
      iframe.attr("src", `https://www.instagram.com/p/${shortcode}/embed`);
      iframe.attr("title", "Publicacion de Instagram");
      iframe.attr("loading", "lazy");
      iframe.attr("allowtransparency", "true");
      iframe.attr("allowfullscreen", "allowfullscreen");
      iframe.attr("width", $element.attr("width") || "480");
      iframe.attr("height", $element.attr("height") || "600");
      wrapper.append(iframe);
      wrapper.append(`<figcaption><a href="https://www.instagram.com/p/${shortcode}/" target="_blank" rel="noopener">Ver publicacion en Instagram</a></figcaption>`);
      $element.replaceWith(wrapper);
    });

    $("amp-carousel").each((_, element) => {
      const $element = $(element);
      const carousel = $('<div class="rda-carousel" data-carousel></div>');
      const track = $('<div class="rda-carousel__track"></div>');
      const controls = $(`
        <div class="rda-carousel__controls">
          <button class="rda-button rda-button--icon" type="button" data-carousel-prev aria-label="Imagen anterior">‹</button>
          <button class="rda-button rda-button--icon" type="button" data-carousel-next aria-label="Imagen siguiente">›</button>
        </div>
      `);
      track.append($element.contents());
      carousel.append(track);
      carousel.append(controls);
      $element.replaceWith(carousel);
    });

    $("amp-accordion").each((_, element) => {
      const accordion = $('<div class="rda-accordion"></div>');
      $(element).children("section").each((index, section) => {
        const details = $("<details>");
        if (index === 0) {
          details.attr("open", "open");
        }
        const heading = $(section).children("h1,h2,h3,h4,h5,h6").first();
        const summary = $("<summary>");
        summary.html(heading.html() || "Detalle");
        details.append(summary);
        heading.remove();
        details.append($(section).contents());
        accordion.append(details);
      });
      $(element).replaceWith(accordion);
    });

    $("amp-social-share").remove();

    return $.html();
  });

  // --- ARCHIVOS PASSTHROUGH ---
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("javascript");

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
    passthroughFileCopy: true,
  };
};
