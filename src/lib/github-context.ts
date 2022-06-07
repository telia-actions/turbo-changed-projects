import { info, setFailed } from "@actions/core";
import { context } from "@actions/github"

export const isMainBranch = (): boolean => {
  return context.ref === 'refs/heads/main';
};

export const getMainDiffTarget = (githubEvent: string): string => {
  info(githubEvent)
  const event = JSON.parse(githubEvent ?? '{}');
  if (!event) {
    setFailed('Could not parse GITHUB_EVENT_PATH');
  }

  return event.before;
};