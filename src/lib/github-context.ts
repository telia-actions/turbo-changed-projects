import { info, setFailed } from "@actions/core";
import { context } from "@actions/github"

export const isMainBranch = (): boolean => {
  return context.ref === 'refs/heads/main';
};

export const getMainDiffTarget = (): string => {
  const event = JSON.parse(process.env.GITHUB_EVENT_PATH ?? '{}');
  info(`${process.env.GITHUB_EVENT_PATH}`)
  if (!event) {
    setFailed('Could not parse GITHUB_EVENT_PATH');
  }

  return event.before;
};