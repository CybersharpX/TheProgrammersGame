import React, { useState } from 'react';
import { Challenge, ExecutionResult } from '../types/game';
import { BrythonExecutor } from '../utils/brythonExecutor';
import '../styles/CodeEditor.css';

interface CodeEditorProps {
  challenge: Challenge;
  onSubmit?: (result: ExecutionResult) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  challenge,
  onSubmit,
}) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const executor = new BrythonExecutor();

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const ruleValidation = executor.validateRules(
        code,
        challenge.rules || []
      );

      if (!ruleValidation.valid) {
        setResult({
          success: false,
          output: '',
          error: ruleValidation.violations.join('\n'),
          passed: 0,
          total: 1,
        });
        setIsExecuting(false);
        return;
      }

      const execResult = await executor.executeCode(code, challenge);
      setResult(execResult);

      if (onSubmit) {
        onSubmit(execResult);
      }
    } catch (error) {
      setResult({
        success: false,
        output: '',
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        passed: 0,
        total: 1,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setResult(null);
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <h2>{challenge.title}</h2>
        <p>{challenge.description}</p>
      </div>

      <div className="editor-container">
        <div className="editor-section">
          <label htmlFor="code-input">Code:</label>
          <textarea
            id="code-input"
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your Python code here..."
            spellCheck="false"
          />
        </div>

        <div className="controls">
          <button
            className="btn btn-primary"
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Run Code'}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          {challenge.hints && challenge.hints.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
          )}
        </div>

        {showHints && challenge.hints && challenge.hints.length > 0 && (
          <div className="hints">
            <h4>Hints:</h4>
            <ul>
              {challenge.hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          <div className="result-header">
            <h3>
              {result.success ? '✓ Success' : '✗ Failed'}
            </h3>
            {result.executionTime && (
              <span className="execution-time">
                {result.executionTime.toFixed(0)}ms
              </span>
            )}
          </div>

          {result.output && (
            <div className="output">
              <h4>Output:</h4>
              <pre>{result.output}</pre>
            </div>
          )}

          {result.error && (
            <div className="error-message">
              <h4>Error:</h4>
              <pre>{result.error}</pre>
            </div>
          )}

          <div className="test-results">
            <h4>
              Tests Passed: {result.passed}/{result.total}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};
