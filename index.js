const pluginName = 'CspHtmlLinterWebpackPlugin';
const cspHtmlLinter = require('csp-html-linter');

let defaultOptions = {
    extensions: ['.html'],
};
class CspHtmlLinterWebpackPlugin {

    constructor(options = {}) {
        this.options = { ...defaultOptions, ...options };
    }

    apply(compiler) {
        let violations = [];

        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            compilation.hooks.additionalAssets.tapAsync(pluginName, (callback) => {

                // Iterate through the original files
                compilation.modules.forEach((module) => {

                    if (module.resource) {
                        // Get the source code of the original file
                        const sourceCode = module.originalSource().source();

                        // You can access the module's resource path with module.resource
                        const filePath = module.resource;
                        // const extensions = this.options.extensions || [];

                        //if (stringContainsArrayItem(filePath, extensions) && filterExclusion(filePath, this.options.exclude) && filterInclusion(filePath, this.options.include)) {
                        if (filterFilePath(filePath, this.options)) {
                            let result = cspHtmlLinter.parse(sourceCode, this.options);
                            if (result.length > 0) {
                                violations = violations.concat(mapViolations(result, filePath));
                            }
                        }
                    }
                });

                callback();
            });
        });

        compiler.hooks.done.tap(pluginName, (compilation) => {
            if (violations.length > 0) {
                let result = (violations.map(v => `${v.violation}\n${v.file}`)).join('\n');
                throw Error(`CSP Violations were found. \n${result} \n\n`);
            }
        });
    }
}

function filterFilePath(filePath, options) {
    function filterExclusion(filePath, exclusions) {
        if (exclusions) {
            for (let i = 0; i < exclusions.length; i++) {
                if (filePath.includes(exclusions[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    function filterFilePathWithArray(filePath, items) {
        if (!items) { return true };
        for (let i = 0; i < items.length; i++) {
            if (filePath.includes(items[i])) {
                return true;
            }
        }
        return false;
    }

    const result = filterFilePathWithArray(filePath, options.extensions) && filterExclusion(filePath, options.exclude) && filterFilePathWithArray(filePath, options.include);
    return result;
}

function mapViolations(messages, filePath) {
    let violations = [];
    messages.forEach((v) => {
        violations.push({ file: filePath, violation: v });
    });

    return violations;
}

module.exports = CspHtmlLinterWebpackPlugin;