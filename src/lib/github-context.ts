import { context } from '@actions/github';
import { exec } from '@actions/exec';
import { promises as fsp } from 'fs';
import { setFailed } from '@actions/core';

export const isMainBranch = (): boolean => {
  return (
    context.ref === 'refs/heads/main' || context.ref === 'refs/heads/master'
  );
};

export async function getEventContext() {
  try {
    const data = await fsp.readFile(
      process.env.GITHUB_EVENT_PATH ?? '',
      'utf-8',
    );
    return JSON.parse(data);
  } catch (e: any) {
    setFailed(`Could not read data from GITHUB_EVENT_PATH: ${e.message}`);
  }
}

export async function executeCommand(
  command: string,
  args?: string[],
): Promise<{ data: string; error: any }> {
  let output = '';
  let error = '';

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        error += data.toString();
      },
    },
  };

  await exec(command, args, options);
  return { data: output, error };
}
