import { Eta, EtaFileResolutionError } from "eta";
import { default as MarkdownIt } from "markdown-it";
import { readFileSync } from "node:fs";
class EtaExtended extends Eta {
    markdownIt;
    constructor(customConfig) {
        const { markdownItConfig = {}, ...etaConfig } = customConfig || {};
        super(etaConfig);
        this.markdownIt = new MarkdownIt("default", markdownItConfig);
    }
    readFile = (path) => {
        let res = "";
        try {
            res = readFileSync(path, "utf8");
        }
        catch (err) {
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
