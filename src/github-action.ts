import { getInput, info, setFailed, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { executeCommand, getEventContext, isMainBranch } from './lib';
import { filterAffectedPackages } from './lib/filter-affected-packages';

export const run = async (): Promise<void> => {
  const isMain = isMainBranch();
  const eventContext = await getEventContext();

  info(JSON.stringify(eventContext, undefined, 2));

  // TODO: It doesn't handle workflow_dispatch for main branch at the moment since it doesn't expose
  // github.event.before so we don't know what to compare with.
  const changedPackages = await getChangedPackages(
    isMain && context.eventName !== 'workflow_dispatch'
      ? eventContext.before
      : 'origin/main',
  );

  info(JSON.stringify(changedPackages));

  setOutput('changedPackages', changedPackages);
};

async function getChangedPackages(diffTarget: string) {
  info(diffTarget);

  if (!diffTarget) {
    // this only happens when the branch is main and eventContext.before is undefined since
    // for pull requests the diffTarget is hard coded to 'origin/main'
    setFailed(`No base sha found`);
  }

  const { data, error } = await executeCommand(
    `npx turbo run build --filter=...[${diffTarget}] --dry=json`,
  );

  if (error) {
    setFailed(error);
  }

  return filterAffectedPackages(JSON.parse(data), getInput('filterPath'));
}
