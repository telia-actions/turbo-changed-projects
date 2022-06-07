import { getInput, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { executeCommand, isMainBranch } from './lib';

export const run = async (): Promise<void> => {
  const isMain = isMainBranch();
  const eventInput = getInput('githubEvent');
  info(eventInput);
  info(JSON.stringify(context, undefined, 2));
  const eventContext = JSON.parse(eventInput);

  await getChangedPackages(isMain ? eventContext.before : 'origin/main');
};

async function getChangedPackages(diffTarget: string) {
  info(diffTarget);

  if (!diffTarget) {
    setFailed(`No base sha found`);
  }

  const { data, error } = await executeCommand(
    `npx turbo run build --filter=...[${diffTarget}] --dry=json`,
  );

  if (error) {
    setFailed(error);
  }

  info(data);
}
