import { Eta, type EtaConfig, EtaFileResolutionError } from "eta";
import { default as MarkdownIt, type Options as MarkdownItOptions } from "markdown-it";
import { readFileSync } from "node:fs";

interface ExtendedEtaConfig extends Partial<EtaConfig> {
  markdownItConfig?: MarkdownItOptions;
}

class EtaExtended extends Eta {
  markdownIt: MarkdownIt;
  constructor(customConfig?: ExtendedEtaConfig) {
    const { markdownItConfig = {}, ...etaConfig } = customConfig || {};
    super(etaConfig);
    this.markdownIt = new MarkdownIt("default", markdownItConfig);
  }

  override readFile = (path: string): string => {
    let res = "";
    try {
      res = readFileSync(path, "utf8");
    } catch (err) {
      // @ts-expect-error: Inherits the original code
      if (err?.code === "ENOENT") {
        throw new EtaFileResolutionError(`Could not find template: ${path}`);
      }

      throw err;
    }

    if (/\.md$/i.test(path)) {
      return this.markdownIt.render(res);
    }

    return res;
  };
}

export default EtaExtended;
