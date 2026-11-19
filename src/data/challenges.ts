import { Challenge } from '../types/game';

export const challenges: Challenge[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Print "Hello, World!" to the console.',
    difficulty: 'beginner',
    starterCode: '# Write your code here\nprint("Hello, World!")',
    testCases: [
      {
        expectedOutput: 'Hello, World!',
        description: 'Should print Hello, World!',
      },
    ],
    hints: ['Use the print() function', 'Remember to use quotation marks'],
  },
  {
    id: 'sum-numbers',
    title: 'Sum Two Numbers',
    description: 'Create variables a and b, then print their sum.',
    difficulty: 'beginner',
    starterCode: `# Create two variables
a = 5
b = 3
# Print their sum
print(a + b)`,
    testCases: [
      {
        expectedOutput: '8',
        description: 'Should print 8',
      },
    ],
    hints: ['Variables store values', 'Use the + operator to add'],
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    description:
      'Print numbers 1-20, but print "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both.',
    difficulty: 'intermediate',
    starterCode: `# FizzBuzz implementation
for i in range(1, 21):
    output = ""
    if i % 3 == 0:
        output += "Fizz"
    if i % 5 == 0:
        output += "Buzz"
    if output == "":
        output = str(i)
    print(output)`,
    testCases: [
      {
        expectedOutput: `1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz`,
        description: 'Should print correct FizzBuzz sequence',
      },
    ],
    hints: ['Use a for loop', 'Use modulo operator %', 'Check conditions with if statements'],
  },
  {
    id: 'factorial',
    title: 'Calculate Factorial',
    description: 'Write a function that calculates the factorial of a number.',
    difficulty: 'intermediate',
    starterCode: `def factorial(n):
    """Calculate factorial of n"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    testCases: [
      {
        expectedOutput: '120',
        description: 'Factorial of 5 should be 120',
      },
    ],
    rules: ['docstring'],
    hints: ['Use recursion', 'Base case is when n <= 1', 'Each function needs a docstring'],
  },
  {
    id: 'list-operations',
    title: 'List Operations',
    description: 'Perform various operations on a list of numbers.',
    difficulty: 'beginner',
    starterCode: `numbers = [1, 2, 3, 4, 5]
# Print the list
print(numbers)
# Print the sum
print(sum(numbers))
# Print the length
print(len(numbers))`,
    testCases: [
      {
        expectedOutput: `[1, 2, 3, 4, 5]
15
5`,
        description: 'Should print list, sum, and length',
      },
    ],
    hints: ['Use sum() to sum a list', 'Use len() to get the length'],
  },
];
