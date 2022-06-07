import { getInput, info, setFailed } from '@actions/core';
import { executeCommand, isMainBranch } from './lib';

export const run = async (): Promise<void> => {
  const isMain = isMainBranch();
  const eventContext = JSON.parse(getInput('githubEvent'));

  await getChangedPackages(isMain ? eventContext.before : 'origin/main');
};

async function getChangedPackages(diffTarget: string) {
  info(diffTarget);
  const { data, error } = await executeCommand(
    `npx turbo run build --filter=...[${diffTarget}] --dry=json`,
  );

  if (error) {
    setFailed(error);
  }

  info(data);
}
