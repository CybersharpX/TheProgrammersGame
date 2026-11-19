export interface TestCase {
  input?: string;
  expectedOutput: string;
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starterCode: string;
  testCases: TestCase[];
  expectedOutput?: string;
  rules?: string[];
  hints?: string[];
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  passed: number;
  total: number;
  executionTime?: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  attempts: number;
  bestTime?: number;
  submittedCode?: string;
}
