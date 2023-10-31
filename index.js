const pluginName = 'CspHtmlLinterWebpackPlugin';
const cspHtmlLinter = require('csp-html-linter');
class CspHtmlLinterWebpackPlugin {

    constructor(options = {}) {
        this.options = options;
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
                        const extensions = this.options.extensions || [];

                        function stringContainsArrayItem(str, arr) {
                            for (let i = 0; i < arr.length; i++) {
                                if (str.includes(arr[i])) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        if (stringContainsArrayItem(filePath, extensions)) {
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

function mapViolations(messages, filePath) {
    let violations = [];
    messages.forEach((v) => {
        violations.push({ file: filePath, violation: v });
    });

    return violations;
}

module.exports = CspHtmlLinterWebpackPlugin;