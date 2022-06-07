import { debug } from '@actions/core';
import { getMainDiffTarget, isMainBranch } from './lib';

export const run = (): void => {
  const isMain = isMainBranch();

  if (isMain) {
    runForMain();
  }
};

function runForMain() {
  const mainDiffTarget = getMainDiffTarget();
  debug(mainDiffTarget);
}
