class JestReporter {
  onTestResult(test, testResult) {
    testResult.testResults.forEach((result) => {
      console.log(`Test: ${result.title} - Duration: ${result.duration}ms`);
    });
  }
}

module.exports = JestReporter;
