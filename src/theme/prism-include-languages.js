import siteConfig from '@generated/docusaurus.config';

export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages } = prism;

  // Temporarily assign Prism instance to globalThis
  globalThis.Prism = PrismObject;

  additionalLanguages.forEach((lang) => {
    if (lang === 'php') {
      // Add templating support for PHP
      require('prismjs/components/prism-markup-templating.js');
    }
    // Load the Prism language components dynamically
    try {
      require(`prismjs/components/prism-${lang}`);
    } catch (error) {
      console.error(`Prism language not found: ${lang}`, error);
    }
  });

  // Clean up global Prism instance
  delete globalThis.Prism;
}
