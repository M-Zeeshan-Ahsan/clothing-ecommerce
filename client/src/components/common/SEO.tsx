import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Eshani";
const BASE_URL = "https://eshanishop.com";
const DEFAULT_IMAGE = `${BASE_URL}/favicon-512.png`;

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

    const canonicalUrl = `${BASE_URL}${path}`;
    const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";

    document.title = fullTitle;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    setMeta('meta[name="description"]', "name", "description", description);

    setMeta('meta[name="robots"]', "name", "robots", robotsContent);

    setMeta('meta[property="og:type"]', "property", "og:type", "website");

    setMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      SITE_NAME,
    );

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);

    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );

    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);

    setMeta('meta[property="og:image"]', "property", "og:image", image);

    setMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image",
    );

    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);

    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );

    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;
  }, [title, description, path, image, noIndex]);

  return null;
};

export default SEO;
