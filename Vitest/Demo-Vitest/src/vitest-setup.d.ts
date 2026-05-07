
/* eslint-disable
@typescript-eslint/no-explicit-any,
@typescript-eslint/no-empty-object-type
*/
import 'vitest';
import '@testing-library/jest-dom';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
}
