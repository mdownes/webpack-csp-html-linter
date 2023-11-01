const CspHtmlLinterWebpackPlugin = require('webpack-csp-html-linter');

describe('CspHtmlLinterWebpackPlugin', () => {

  it('should throw an error if CSP violations are found', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      extensions: ['.html']
    });

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: 'file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);


    // Create a mock compiler
    const compiler = {
      hooks: {
        done: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
        compilation: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
      },
    };

    // Use try-catch to capture the thrown error
    let error;
    try {
      plugin.apply(compiler);
    } catch (e) {
      error = e;
    }

    // Verify that the error was thrown
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('CSP Violations were found');
    expect(error.message).toContain('CSP violation');
    expect(error.message).toContain('file1.html');
  });


  it('should not show violations for excluded files', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      extensions: ['.html'],
      exclusions:['node_modules']
    });

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: '/node_modules/file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
        {
          resource: '/test/file2.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);


    // Create a mock compiler
    const compiler = {
      hooks: {
        done: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
        compilation: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
      },
    };

    // Use try-catch to capture the thrown error
    let error;
    try {
      plugin.apply(compiler);
    } catch (e) {
      error = e;
    }

    // Verify that the error was thrown
    expect(error).toBeInstanceOf(Error);
    console.log(error.message)
    expect(error.message).toContain('CSP Violations were found');
    expect(error.message).toContain('CSP violation');
    expect(error.message).not.toContain('file1.html');
    expect(error.message).toContain('file2.html');
  });

  it('should not throw an error if no CSP violations are found', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      extensions: ['.html']
    });

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: 'file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return no violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue([]);


    // Create a mock compiler
    const compiler = {
      hooks: {
        done: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
        compilation: {
          tap: jest.fn((name, callback) => callback(compilation)),
        },
      },
    };

    // Use try-catch to capture the thrown error
    let error;
    try {
      plugin.apply(compiler);
    } catch (e) {
      error = e;
    }

    // Verify that the error was thrown
    expect(error).not.toBe.defined;
  });
});
