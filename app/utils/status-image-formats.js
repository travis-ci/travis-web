import { ccXml as ccXmlUrl, statusImage as statusImageUrl } from 'travis/utils/urls';
var asciidocStatusImage, ccxmlStatusUrl, format, markdownStatusImage,
    podStatusImage, rdocStatusImage, rstStatusImage, textileStatusImage, urlRepo;

urlRepo = (function(slug) {
  return "https://" + location.host + "/" + slug;
});

markdownStatusImage = (function(url, slug, branch) {
  return "[![Build Status](" + (statusImageUrl(slug, branch)) + ")](" + url + ")";
});

textileStatusImage = (function(url, slug, branch) {
  return "!" + (statusImageUrl(slug, branch)) + "!:" + url;
});

rdocStatusImage = (function(url, slug, branch) {
  return "{<img src=\"" + (statusImageUrl(slug, branch)) + "\" alt=\"Build Status\" />}[" + url + "]";
});

asciidocStatusImage = (function(url, slug, branch) {
  return "image:" + (statusImageUrl(slug, branch)) + "[\"Build Status\", link=\"" + url + "\"]";
});

rstStatusImage = (function(url, slug, branch) {
  return ".. image:: " + (statusImageUrl(slug, branch)) + "\n    :target: " + url;
});

podStatusImage = (function(url, slug, branch) {
  return "=for html <a href=\"" + url + "\"><img src=\"" + (statusImageUrl(slug, branch)) + "\"></a>";
});

ccxmlStatusUrl = (function(slug, branch) {
  return ccXmlUrl(slug, branch);
});

format = function(version, slug, branch) {
  var url;
  url = urlRepo(slug);
  switch (version) {
    case 'Image URL':
      return statusImageUrl(slug, branch);
    case 'Markdown':
      return markdownStatusImage(url, slug, branch);
    case 'Textile':
      return textileStatusImage(url, slug, branch);
    case 'Rdoc':
      return rdocStatusImage(url, slug, branch);
    case 'AsciiDoc':
      return asciidocStatusImage(url, slug, branch);
    case 'RST':
      return rstStatusImage(url, slug, branch);
    case 'Pod':
      return podStatusImage(url, slug, branch);
    case 'CCTray':
      return ccxmlStatusUrl(slug, branch);
  }
};

export { format };
export default format;
