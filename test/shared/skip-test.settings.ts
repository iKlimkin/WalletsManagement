export enum e2eTestNamesEnum {
  WALLET = 'wallet',
  CLIENT = 'client',
}

type TestSettings = {
  [key in e2eTestNamesEnum]: boolean;
} & {
  run_all_tests: boolean;
  for: (testName: e2eTestNamesEnum) => boolean;
  enableTest: (testName: e2eTestNamesEnum) => void;
  disableTest: (testName: e2eTestNamesEnum) => void;
  toggleRunAllTests: () => void;
};

const skip = true;
const run = false;

export const skipSettings: TestSettings = {
  run_all_tests: skip,
  wallet: run,
  client: skip,

  for(testName: e2eTestNamesEnum): boolean {
    if (!this.run_all_tests) return false;
    return this[testName] ?? skip;
  },

  enableTest(testName: e2eTestNamesEnum): void {
    this[testName] = true;
  },

  disableTest(testName: e2eTestNamesEnum): void {
    this[testName] = false;
  },

  toggleRunAllTests(): void {
    this.run_all_tests = !this.run_all_tests;
  },
};
