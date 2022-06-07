import { info } from '@actions/core';
import { getMainDiffTarget, isMainBranch } from './lib';
import { promises as fsp } from 'fs';

export const run = async (): void => {
  const isMain = isMainBranch();
  const githubEvent = await fsp.readFile(
    process.env.GITHUB_EVENT_PATH ?? '',
    'utf8',
  );

  if (isMain) {
    runForMain(githubEvent);
  }
};

function runForMain(githubEvent: string) {
  const mainDiffTarget = getMainDiffTarget(githubEvent);
  info(mainDiffTarget);
}
