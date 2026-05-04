import { useState, useEffect } from 'react';
import '../styles/ImageConverter.css';
import Accordion from './Accordion';

const detectCSSErrors = (css) => {
  const errors = [];
  const lines = css.split('\n');
  let braceCount = 0;
  let inComment = false;

  lines.forEach((line, lineNum) => {
    const lineNumber = lineNum + 1;
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Handle multi-line comments
    if (inComment) {
      if (trimmed.includes('*/')) {
        inComment = false;
      }
      return;
    }

    if (trimmed.includes('/*')) {
      inComment = true;
      if (!trimmed.includes('*/')) return;
      inComment = false;
    }

    // Skip single-line comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

    // Count braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    braceCount += openBraces - closeBraces;

    // Check for unmatched braces
    if (braceCount < 0) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('}'),
        message: 'Unexpected closing brace }',
        type: 'error',
      });
      braceCount = 0;
    }

    // Check for missing semicolons in declarations (more intelligent check)
    if (trimmed.includes(':') && !trimmed.startsWith('@') && !trimmed.includes('{') && !trimmed.includes('}')) {
      // Check if there's a semicolon anywhere in the line (before any closing brace)
      const beforeBrace = trimmed.split('}')[0];
      const hasSemicolon = beforeBrace.includes(';');
      if (!hasSemicolon && !trimmed.endsWith('{') && !trimmed.endsWith(',')) {
        errors.push({
          line: lineNumber,
          column: line.length,
          message: 'Missing semicolon after property declaration',
          type: 'warning',
        });
      }
    }

    // Check for missing semicolons when closing brace is on same line as property
    if (trimmed.includes(':') && trimmed.includes('}') && !trimmed.startsWith('@')) {
      const beforeBrace = trimmed.split('}')[0];
      if (beforeBrace.includes(':') && !beforeBrace.includes(';')) {
        errors.push({
          line: lineNumber,
          column: trimmed.indexOf('}'),
          message: 'Missing semicolon before closing brace',
          type: 'warning',
        });
      }
    }

    // Check for empty selectors
    if (trimmed.endsWith('{') && trimmed.trim() === '{') {
      errors.push({
        line: lineNumber,
        column: 0,
        message: 'Empty selector',
        type: 'error',
      });
    }

    // Removed problematic check for missing opening brace - handled by brace counting
  });

  // Check for unclosed braces at end
  if (braceCount > 0) {
    errors.push({
      line: lines.length,
      column: 0,
      message: `${braceCount} unclosed brace(s)`,
      type: 'error',
    });
  }

  return errors;
};

const beautifyCSS = (css) => {
  const lines = css.split('\n');
  const formatted = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Handle selectors (lines ending with {)
    if (trimmed.endsWith('{')) {
      formatted.push(trimmed);
      return;
    }

    // Handle property declarations
    if (trimmed.includes(':') && !trimmed.startsWith('@')) {
      // Check if line has both property and closing brace
      if (trimmed.includes('}') && trimmed.includes(';')) {
        // Split property and closing brace
        const parts = trimmed.split('}');
        const propertyPart = parts[0].trim();
        if (propertyPart && !propertyPart.endsWith(';')) {
          // Add semicolon if missing
          formatted.push(`  ${propertyPart};`);
        } else {
          formatted.push(`  ${propertyPart}`);
        }
        formatted.push('}');
        return;
      }

      // Handle closing braces on separate lines
      if (trimmed === '}') {
        formatted.push('}');
        return;
      }

      // Regular property declaration
      if (!trimmed.endsWith(';') && !trimmed.endsWith(',')) {
        formatted.push(`  ${trimmed};`);
      } else {
        formatted.push(`  ${trimmed}`);
      }
      return;
    }

    // Handle @rules and other special cases
    formatted.push(trimmed);
  });

  return formatted.join('\n');
};

const minifyCSS = (css) => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/, '}')
    .trim();
};

const fixCSSErrors = (css) => {
  const lines = css.split('\n');
  const fixed = [];

  lines.forEach((line, index) => {
    let trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      fixed.push(line);
      return;
    }

    // Handle lines with both property and closing brace
    if (trimmed.includes(':') && trimmed.includes('}') && !trimmed.startsWith('@')) {
      const beforeBrace = trimmed.split('}')[0];
      if (beforeBrace.includes(':') && !beforeBrace.includes(';')) {
        // Add missing semicolon before closing brace
        trimmed = trimmed.replace('}', '; }');
      }
    }

    // Handle regular property declarations missing semicolons
    if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('}') && !trimmed.startsWith('@')) {
      if (!trimmed.endsWith(';') && !trimmed.endsWith(',')) {
        trimmed += ';';
      }
    }

    fixed.push(line.replace(line.trim(), trimmed));
  });

  let result = fixed.join('\n');

  // Balance braces
  const openCount = (result.match(/{/g) || []).length;
  const closeCount = (result.match(/}/g) || []).length;
  const diff = openCount - closeCount;

  if (diff > 0) {
    result += '\n' + '}'.repeat(diff);
  }

  return result;
};

export default function CSSBeautifier() {
  const [input, setInput] = useState('.container {\n  display: flex;\n  gap: 20px; }');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState([]);
  const [mode, setMode] = useState('beautify');
  const [errorLines, setErrorLines] = useState(new Set());

  useEffect(() => {
    const detectedErrors = detectCSSErrors(input);
    setErrors(detectedErrors);
    setErrorLines(new Set(detectedErrors.map(e => e.line)));

    if (mode === 'beautify') {
      setOutput(beautifyCSS(input));
    } else if (mode === 'minify') {
      setOutput(minifyCSS(input));
    } else if (mode === 'fix') {
      setOutput(fixCSSErrors(input));
    }
  }, [input, mode]);

  const handleCheckCSS = () => {
    const detectedErrors = detectCSSErrors(input);
    setErrors(detectedErrors);
    setErrorLines(new Set(detectedErrors.map(e => e.line)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadCSS = () => {
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `style-${mode}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const errorCount = errors.filter((e) => e.type === 'error').length;
  const warningCount = errors.filter((e) => e.type === 'warning').length;

  return (
    <div id="css-beautify" className="page-wrap">
      <main className="main-col">
        <article className="tool-hero">
          <div className="tool-hero-head">
            <h1>✏️ CSS Beautifier & Minifier with Error Detection</h1>
            <p>Format, beautify, minify, and fix CSS code with real-time error detection and line-by-line error reporting.</p>
            <div className="tool-badges">
              <span className="badge">✓ Error Detection</span>
              <span className="badge">✓ Beautify & Minify</span>
              <span className="badge">✓ Auto-Fix Errors</span>
              <span className="badge">✓ Line Numbers</span>
              <span className="badge">✓ Live Preview</span>
            </div>
          </div>

          <div className="tool-body">
            <div className="format-group">
              <label htmlFor="mode-select">Mode</label>
              <div className="split-mode-group">
                <button
                  type="button"
                  className={`format-chip ${mode === 'beautify' ? 'selected' : ''}`}
                  onClick={() => setMode('beautify')}
                  aria-pressed={mode === 'beautify'}
                >
                  ✨ Beautify
                </button>
                <button
                  type="button"
                  className={`format-chip ${mode === 'minify' ? 'selected' : ''}`}
                  onClick={() => setMode('minify')}
                  aria-pressed={mode === 'minify'}
                >
                  📦 Minify
                </button>
                <button
                  type="button"
                  className={`format-chip ${mode === 'fix' ? 'selected' : ''}`}
                  onClick={() => setMode('fix')}
                  aria-pressed={mode === 'fix'}
                >
                  🔧 Fix Errors
                </button>
              </div>
            </div>

            <div className="editor-split-layout">
              <div className="editor-left-panel">
                <div className="editor-header">
                  <h3>✏️ Input CSS</h3>
                  <button
                    type="button"
                    className="btn-check-css"
                    onClick={handleCheckCSS}
                    title="Check CSS for errors (auto-checks on input)"
                    aria-label="Check CSS for errors"
                  >
                    ✓ Check CSS
                  </button>
                </div>
                <div className="editor-wrapper">
                  <div className="line-numbers">
                    {input.split('\n').map((_, i) => (
                      <div
                        key={i}
                        className={`line-number ${errorLines.has(i + 1) ? 'error-line' : ''}`}
                        title={errorLines.has(i + 1) ? `Error on line ${i + 1}` : ''}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your CSS code here or start typing to check for errors in real-time..."
                    aria-label="CSS input editor with real-time error detection"
                    spellCheck="false"
                    className="code-input-main"
                  />
                </div>
              </div>

              <div className="errors-right-panel" role="status" aria-live="polite">
                <div className="errors-header">
                  <h3>🔍 Errors & Warnings</h3>
                  {errorCount > 0 && <span className="error-count-badge">{errorCount}</span>}
                </div>
                {errors.length === 0 ? (
                  <div className="no-errors">
                    <p>✅ No errors detected!</p>
                    <p className="text-small">Your CSS looks perfect.</p>
                  </div>
                ) : (
                  <>
                    <div className="error-summary">
                      <span className="summary-item error-item-type">
                        🔴 {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                      </span>
                      <span className="summary-item warning-item-type">
                        ⚠️ {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
                      </span>
                    </div>
                    <div className="error-list-compact">
                      {errors.map((error, idx) => (
                        <div key={idx} className={`error-compact error-${error.type}`}>
                          <div className="error-line-badge">Line {error.line}</div>
                          <div className="error-content">
                            <div className="error-msg">{error.message}</div>
                            <div className="error-type-label">{error.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="editor-bottom-section">
              <div className="actions-row">
                <button
                  type="button"
                  className="btn-convert"
                  onClick={copyToClipboard}
                  title="Copy output to clipboard"
                  aria-label={`Copy ${mode} CSS to clipboard`}
                >
                  📋 Copy Result
                </button>
                <button
                  type="button"
                  className="btn-convert"
                  onClick={downloadCSS}
                  title="Download as CSS file"
                  aria-label={`Download ${mode} CSS file`}
                >
                  ⬇️ Download CSS
                </button>
                <button
                  type="button"
                  className="btn-clear"
                  onClick={() => setInput('')}
                  title="Clear the input field"
                  aria-label="Clear CSS input"
                >
                  🗑️ Clear
                </button>
              </div>

              <div className="output-preview-section">
                <h3>📤 {mode.charAt(0).toUpperCase() + mode.slice(1)} Output</h3>
                <div className="code-output-container">
                  <pre className="code-output" aria-label={`${mode} CSS output`}>
                    <code>{output}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="tool-info">
          <Accordion
            title="Why use CSS Beautifier?"
            isOpen={false}
            content={
              <div>
                <p>Keep your CSS maintainable, optimized, and error-free:</p>
                <ul>
                  <li>Detect syntax errors before deployment</li>
                  <li>Format code for better readability and collaboration</li>
                  <li>Minify CSS to reduce file size and improve page load speed</li>
                  <li>Auto-fix common errors like missing semicolons</li>
                  <li>Identify potential issues with line-by-line reporting</li>
                </ul>
              </div>
            }
          />

          <Accordion
            title="How to use CSS Beautifier"
            isOpen={false}
            content={
              <div>
                <ol>
                  <li>Paste your CSS code into the input field.</li>
                  <li>Choose your desired mode: Beautify, Minify, or Fix Errors.</li>
                  <li>Check the Errors tab to see any detected issues with line numbers.</li>
                  <li>View the formatted output in the Output CSS tab.</li>
                  <li>Copy or download your formatted CSS.</li>
                </ol>
                <p>
                  <strong>Tip:</strong> Start with the Fix Errors mode to clean up syntax issues, then beautify for readability or minify for
                  production.
                </p>
              </div>
            }
          />

          <Accordion
            title="Error Types Detected"
            isOpen={false}
            content={
              <div>
                <h4>Common Errors</h4>
                <ul>
                  <li>
                    <strong>Missing Semicolons:</strong> CSS properties must end with semicolons for consistency
                  </li>
                  <li>
                    <strong>Unclosed Braces:</strong> Every opening brace must have a matching closing brace
                  </li>
                  <li>
                    <strong>Unexpected Braces:</strong> Extra closing braces or braces in wrong locations
                  </li>
                  <li>
                    <strong>Empty Selectors:</strong> Selectors without any properties
                  </li>
                  <li>
                    <strong>Missing Properties:</strong> Incomplete CSS rules or declarations
                  </li>
                </ul>
              </div>
            }
          />

          <Accordion
            title="FAQ"
            isOpen={false}
            content={
              <div>
                <div className="faq-item">
                  <h4>Can this tool fix all CSS errors?</h4>
                  <p>It can fix common errors like missing semicolons and balance braces. Complex logic errors may require manual review.</p>
                </div>
                <div className="faq-item">
                  <h4>Does minification preserve CSS functionality?</h4>
                  <p>Yes. Minification only removes whitespace and comments while maintaining all CSS rules and properties.</p>
                </div>
                <div className="faq-item">
                  <h4>Is my CSS data stored anywhere?</h4>
                  <p>No. All processing happens in your browser. Your CSS is never uploaded or stored on any server.</p>
                </div>
                <div className="faq-item">
                  <h4>What CSS features are supported?</h4>
                  <p>Standard CSS 3 including selectors, properties, at-rules, and media queries are all supported.</p>
                </div>
              </div>
            }
          />
        </section>
      </main>
    </div>
  );
}
