import { Challenge, ExecutionResult, TestCase } from '../types/game';

declare global {
  interface Window {
    brython: (options?: any) => void;
    __BRYTHON__?: any;
  }
}

export class BrythonExecutor {
  private outputBuffer: string[] = [];
  private errorBuffer: string[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    if (window.__BRYTHON__) {
      this.isInitialized = true;
      return;
    }

    try {
      window.brython?.({ debug: 0, stdout: this.captureOutput });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Brython:', error);
    }
  }

  private captureOutput = (text: string): void => {
    if (text) {
      this.outputBuffer.push(text);
    }
  };

  public async executeCode(
    code: string,
    challenge: Challenge
  ): Promise<ExecutionResult> {
    this.outputBuffer = [];
    this.errorBuffer = [];
    const startTime = performance.now();

    try {
      // Create an isolated scope for execution
      const pythonCode = this.wrapCodeWithCapture(code);

      // Execute using Brython
      const result = await this.runBrythonCode(pythonCode);
      const output = this.outputBuffer.join('');
      const executionTime = performance.now() - startTime;

      if (challenge.expectedOutput) {
        const success = this.compareOutput(output.trim(), challenge.expectedOutput.trim());
        return {
          success,
          output,
          passed: success ? 1 : 0,
          total: 1,
          executionTime,
        };
      }

      if (challenge.testCases && challenge.testCases.length > 0) {
        const results = await this.runTestCases(code, challenge.testCases);
        return {
          success: results.passed === results.total,
          output,
          passed: results.passed,
          total: results.total,
          executionTime,
        };
      }

      return {
        success: true,
        output,
        passed: 1,
        total: 1,
        executionTime,
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        output: this.outputBuffer.join(''),
        error: errorMsg,
        passed: 0,
        total: 1,
        executionTime,
      };
    }
  }

  private wrapCodeWithCapture(code: string): string {
    return `
import sys
from io import StringIO

_old_stdout = sys.stdout
sys.stdout = StringIO()

try:
${code
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
finally:
    _output = sys.stdout.getvalue()
    sys.stdout = _old_stdout
    print(_output, end='')
`;
  }

  private async runBrythonCode(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create a script element for Brython
        const script = document.createElement('script');
        script.type = 'text/python';
        script.textContent = code;

        // Capture output by redirecting print
        const originalConsoleLog = console.log;
        const originalPrint = (window as any).print;

        (window as any).print = (...args: any[]) => {
          this.outputBuffer.push(
            args.map((arg) => String(arg)).join(' ') + '\n'
          );
        };

        const tempDiv = document.createElement('div');
        tempDiv.appendChild(script);
        document.body.appendChild(tempDiv);

        try {
          window.brython?.();
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          document.body.removeChild(tempDiv);
          if (originalPrint) {
            (window as any).print = originalPrint;
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async runTestCases(
    code: string,
    testCases: TestCase[]
  ): Promise<{ passed: number; total: number }> {
    let passed = 0;

    for (const testCase of testCases) {
      try {
        this.outputBuffer = [];

        // Run code for each test case
        await this.runBrythonCode(code);
        const output = this.outputBuffer.join('').trim();

        if (this.compareOutput(output, testCase.expectedOutput.trim())) {
          passed++;
        }
      } catch (error) {
        // Test case failed
        continue;
      }
    }

    return { passed, total: testCases.length };
  }

  private compareOutput(actual: string, expected: string): boolean {
    const normalize = (str: string) =>
      str
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line)
        .join('\n');

    const actualNorm = normalize(actual);
    const expectedNorm = normalize(expected);

    return actualNorm === expectedNorm;
  }

  public validateRules(code: string, activeRules: string[]): {
    valid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    for (const rule of activeRules) {
      if (rule.includes('no-hardcoding')) {
        if (this.hasHardcodedValues(code)) {
          violations.push(
            'Rule violation: No hardcoding values allowed! Use variables instead.'
          );
        }
      }

      if (rule.includes('docstring')) {
        if (code.includes('def ') && !code.includes('"""')) {
          violations.push(
            'Rule violation: Functions must have docstrings! Add """documentation""" to your functions.'
          );
        }
      }

      if (rule.includes('no-global')) {
        if (code.match(/^[a-zA-Z_]\w*\s*=/m)) {
          violations.push(
            'Rule violation: No global variables allowed! Keep variables local to functions.'
          );
        }
      }

      if (rule.includes('no-builtin-sort')) {
        if (code.includes('.sort(') || code.includes('sorted(')) {
          violations.push(
            'Rule violation: No built-in sort functions allowed! Implement your own sorting algorithm.'
          );
        }
      }

      if (rule.includes('functional-only')) {
        if (code.includes('for ') && code.includes(' in ')) {
          violations.push(
            'Rule violation: No for-loops allowed! Use functional programming with map(), filter(), and lambda.'
          );
        }
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  private hasHardcodedValues(code: string): boolean {
    const printRegex = /print\(\s*\d+\s*\)/;
    const stringRegex = /print\(\s*["'][^"']*["']\s*\)/;
    return printRegex.test(code) || stringRegex.test(code);
  }
}
