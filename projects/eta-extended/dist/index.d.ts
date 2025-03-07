import { Eta, type EtaConfig } from "eta";
import { default as MarkdownIt, type Options as MarkdownItOptions } from "markdown-it";
interface EtaExtendedConfig extends Partial<EtaConfig> {
    markdownItConfig?: MarkdownItOptions;
}
declare class EtaExtended extends Eta {
    markdownIt: MarkdownIt;
    constructor(config?: EtaExtendedConfig);
    readFile: (path: string) => string;
}
export { type EtaExtendedConfig };
export default EtaExtended;
