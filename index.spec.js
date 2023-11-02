const CspHtmlLinterWebpackPlugin = require('webpack-csp-html-linter');

describe('CspHtmlLinterWebpackPlugin', () => {

  it('should throw an error if CSP violations are found', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      include: ['**/*.html']
    });

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: '/abc/file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);

    jest.spyOn(require('glob'), 'sync').mockReturnValue(['/abc/file1.html']);


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
      exclude: ['node_modules'],
      include: ['/demo/*.html']
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
          resource: '/demo/file2.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);
    jest.spyOn(require('glob'), 'sync').mockReturnValue(['/demo/file2.html']);

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


  it('should not show violations for paths not included', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      exclude: ['node_modules'],
      include: ['src/**/*.html']
    });

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: '/src/node_modules/file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
        {
          resource: '/test/file3.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
        {
          resource: '/src/file2.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);
    jest.spyOn(require('glob'), 'sync').mockReturnValue(['/src/file2.html']);

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
    expect(error.message).not.toContain('file1.html');
    expect(error.message).not.toContain('file3.html');
    expect(error.message).toContain('file2.html');
  });

  it('should throw error based on default extension', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({});

    const compilation = {
      hooks: {
        additionalAssets: {
          tapAsync: jest.fn((name, callback) => callback(() => { })),
        }
      },
      modules: [
        {
          resource: '/file1.html',
          originalSource: () => ({
            source: () => '<script src="https://example.com"></script>',
          }),
        },
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);
    jest.spyOn(require('glob'), 'sync').mockReturnValue(['/file1.html']);

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


  it('should not throw an error if no CSP violations are found', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({});

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



  it('should not throw error if globs dont match', () => {
    const plugin = new CspHtmlLinterWebpackPlugin({
      include: ['src/**/*.html']
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
        }
      ],
    };

    // Mock the cspHtmlLinter module to return violations
    jest.spyOn(require('csp-html-linter'), 'parse').mockReturnValue(['CSP violation']);
    jest.spyOn(require('glob'), 'sync').mockReturnValue(['/src/file2.html']);

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
