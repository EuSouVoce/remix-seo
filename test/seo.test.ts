import { initSeo as _initSeo } from "../src/index";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

let initSeo = _initSeo;
if (import.meta.env.TEST_BUILD) {
  try {
    initSeo = require("../dist/index").initSeo;
  } catch (_) {
    initSeo = _initSeo;
  }
}

describe("init without default options", () => {
  let { getSeo, getSeoLinks, getSeoMeta } = initSeo();

  describe("getSeo", () => {
    describe("without an SEO config", () => {
      it("returns meta with *only* directives for bots", () => {
        let [meta] = getSeo();
        meta.sort();
        console.log(meta);
        expect(meta.sort()).toEqual(
          [
            { name: "robots", content: "index,follow" },
            {
              name: "googlebot",
              content: "index,follow",
            },
          ].sort()
        );
      });
      it("returns no links", () => {
        let [, links] = getSeo();
        expect(links).toEqual([].sort());
      });
    });

    it("fucks", () => {
      let seo = getSeo({
        title: "Best website ever",
        description: "This is a really great website ya dork",
        titleTemplate: "%s | Cool",
        twitter: {
          image: {
            url: "https://somewhere.com/fake-path.jpg",
            alt: "fake!",
          },
        },
        bypassTemplate: false,
        robots: {
          noIndex: true,
          noFollow: true,
        },
        canonical: "https://somewhere.com",
        facebook: {
          appId: "12345",
        },
        openGraph: {
          siteName: "Best website ever, yeah!",
          url: "https://somewhere.com",
          images: [
            {
              url: "https://somewhere.com/fake-path.jpg",
              alt: "fake!",
              height: 200,
              type: "jpg",
            },
          ],
        },
      });

      // meta
      expect(seo[0]).toMatchInlineSnapshot(`
        [
          {
            "title": "Best website ever | Cool",
          },
          {
            "content": "This is a really great website ya dork",
            "name": "description",
          },
          {
            "content": "noindex,nofollow",
            "name": "robots",
          },
          {
            "content": "noindex,nofollow",
            "name": "googlebot",
          },
          {
            "content": "Best website ever | Cool",
            "property": "twitter:title",
          },
          {
            "content": "This is a really great website ya dork",
            "property": "twitter:description",
          },
          {
            "content": "https://somewhere.com/fake-path.jpg",
            "property": "twitter:image",
          },
          {
            "content": "fake!",
            "property": "twitter:image:alt",
          },
          {
            "content": "summary",
            "property": "twitter:card",
          },
          {
            "content": "12345",
            "name": "fb:app_id",
          },
          {
            "content": "Best website ever | Cool",
            "property": "og:title",
          },
          {
            "content": "This is a really great website ya dork",
            "property": "og:description",
          },
          {
            "content": "https://somewhere.com",
            "property": "og:url",
          },
          {
            "content": "https://somewhere.com/fake-path.jpg",
            "property": "og:image",
          },
          {
            "content": "fake!",
            "property": "og:image:alt",
          },
          {
            "content": "jpg",
            "property": "og:image:type",
          },
          {
            "content": "200",
            "property": "og:image:height",
          },
          {
            "content": "Best website ever, yeah!",
            "property": "og:site_name",
          },
        ]
      `);

      // links
      expect(seo[1]).toMatchInlineSnapshot(`
			[
			  {
			    "href": "https://somewhere.com",
			    "rel": "canonical",
			  },
			]
		`);
    });
  });

  describe("getSeoMeta", () => {
    describe("without an SEO config", () => {
      it("returns an object with *only* directives for bots", () => {
        let meta = getSeoMeta();
        meta.sort();
        expect(meta.sort()).toEqual(
          [
            { name: "robots", content: "index,follow" },
            {
              name: "googlebot",
              content: "index,follow",
            },
          ].sort()
        );
      });
    });
  });

  describe("getSeoLinks", () => {
    describe("without an SEO config", () => {
      it("returns an empty array", () => {
        let links = getSeoLinks();
        expect(links).toEqual([].sort());
      });
    });
  });
});

describe("init with default options", () => {
  let { getSeo, getSeoMeta, getSeoLinks } = initSeo({
    title: "Cheese and Crackers",
    description: "A great website about eating delicious cheese and crackers.",
    titleTemplate: "%s | Cheese and Crackers",
    canonical: "https://somewhere-a.com",
  });

  describe("getSeo", () => {
    describe("without an SEO config", () => {
      let [meta, links] = getSeo();

      it("returns links based on default config", () => {
        expect(links).toEqual(
          [
            {
              rel: "canonical",
              href: "https://somewhere-a.com",
            },
          ].sort()
        );
      });
    });
  });

  describe("getSeoLinks", () => {
    describe("without an SEO config", () => {
      let links = getSeoLinks();
      it("returns links based on default config", () => {
        expect(links).toEqual(
          [
            {
              rel: "canonical",
              href: "https://somewhere-a.com",
            },
          ].sort()
        );
      });
    });

    it("overrides the default canonical link", () => {
      let links = getSeoLinks({ canonical: "https://somewhere-b.com" });
      expect(links).toEqual(
        [
          {
            rel: "canonical",
            href: "https://somewhere-b.com",
          },
        ].sort()
      );
    });
  });
});

describe("init with default options based on route data", () => {
  let { getSeo, getSeoMeta, getSeoLinks } = initSeo({
    title: "Cheese and Crackers",
    description: "A great website about eating delicious cheese and crackers.",
    titleTemplate: "%s | Cheese and Crackers",
    canonical: "https://somewhere-a.com",
  });

  describe("getSeo", () => {
    describe("without an SEO config", () => {
      let [, links] = getSeo();

      it("returns links based on default config", () => {
        expect(links).toEqual(
          [
            {
              rel: "canonical",
              href: "https://somewhere-a.com",
            },
          ].sort()
        );
      });
    });
  });

  describe("getSeoLinks", () => {
    describe("without an SEO config", () => {
      let links = getSeoLinks();
      it("returns links based on default config", () => {
        expect(links).toEqual(
          [
            {
              rel: "canonical",
              href: "https://somewhere-a.com",
            },
          ].sort()
        );
      });
    });

    it("overrides the default canonical link", () => {
      let links = getSeoLinks({ canonical: "https://somewhere-b.com" });
      expect(links).toEqual(
        [
          {
            rel: "canonical",
            href: "https://somewhere-b.com",
          },
        ].sort()
      );
    });
  });
});

describe("twitter config", () => {
  let warn = console.warn;
  beforeEach(() => {
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.warn = warn;
  });

  let { getSeo } = initSeo({
    title: "Cheese and Crackers",
    description: "A great website about eating delicious cheese and crackers.",
  });

  it("warns when an invalid URL is provided to twitter:image", () => {
    getSeo({
      twitter: {
        image: {
          url: "/fake-path.jpg",
          alt: "fake!",
        },
      },
    });
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("warns when alt text isn't provided to twitter:image", () => {
    getSeo({
      twitter: {
        // @ts-expect-error
        image: {
          url: "https://somewhere.com/fake-path.jpg",
        },
      },
    });
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("does not warn when a valid URL is provided to twitter:image", () => {
    getSeo({
      twitter: {
        image: {
          url: "https://somewhere.com/fake-path.jpg",
          alt: "fake!",
        },
      },
    });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("warns when an invalid card type is passed", () => {
    getSeo({
      twitter: {
        // @ts-expect-error
        card: "poop",
      },
    });
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  describe("when card is set to 'app'", () => {
    it("warns when image meta is provided", () => {
      getSeo({
        twitter: {
          card: "app",
          app: {
            name: "Hello",
            url: {
              iPhone: "https://a.com",
              iPad: "https://b.com",
              googlePlay: "https://c.com",
            },
            id: {
              iPhone: "1",
              iPad: "2",
              googlePlay: "3",
            },
          },
          image: {
            url: "https://somewhere.com/fake-path.jpg",
            alt: "fake!",
          },
        },
      });
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("warns when player meta is provided", () => {
      getSeo({
        twitter: {
          card: "app",
          app: {
            name: "Hello",
            url: {
              iPhone: "https://a.com",
              iPad: "https://b.com",
              googlePlay: "https://c.com",
            },
            id: {
              iPhone: "1",
              iPad: "2",
              googlePlay: "3",
            },
          },
          player: {
            url: "https://somewhere.com/fake-path.jpg",
          },
        },
      });
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("ignores image meta", () => {
      let [meta] = getSeo({
        twitter: {
          card: "app",
          app: {
            name: "Hello",
            url: {
              iPhone: "https://a.com",
              iPad: "https://b.com",
              googlePlay: "https://c.com",
            },
            id: {
              iPhone: "1",
              iPad: "2",
              googlePlay: "3",
            },
          },
          image: {
            url: "https://somewhere.com/fake-path.jpg",
            alt: "fake!",
          },
        },
      });
      // @ts-ignore
      expect(meta["twitter:image"]).toBe(undefined);
    });

    it("ignores player meta", () => {
      let [meta] = getSeo({
        twitter: {
          card: "app",
          app: {
            name: "Hello",
            url: {
              iPhone: "https://a.com",
              iPad: "https://b.com",
              googlePlay: "https://c.com",
            },
            id: {
              iPhone: "1",
              iPad: "2",
              googlePlay: "3",
            },
          },
          player: {
            url: "https://somewhere.com/fake-path.jpg",
          },
        },
      });
      // @ts-ignore
      expect(meta["twitter:player"]).toBe(undefined);
    });
  });

  describe("when player metadata is provided", () => {
    it("warns on invalid card type", () => {
      getSeo({
        twitter: {
          card: "summary",
          player: {
            url: "https://somewhere.com/fake-path.mp4",
          },
        },
      });
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
});
