import { Eta, type EtaConfig } from "eta";
import { default as MarkdownIt, type Options as MarkdownItOptions } from "markdown-it";
interface ExtendedEtaConfig extends Partial<EtaConfig> {
    markdownItConfig?: MarkdownItOptions;
}
declare class EtaMarkdownLoader extends Eta {
    markdownit: MarkdownIt;
    constructor(customConfig?: ExtendedEtaConfig);
    readFile: (path: string) => string;
}
export default EtaMarkdownLoader;
