import {
  isMainBranch,
  getEventContext,
  executeCommand,
} from '../github-context';
import { context } from '@actions/github';
import path from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

const mockPath = path.join(__dirname, '/../__mocks__');

describe('github-context', () => {
  describe('isMainBranch', () => {
    it('should return true when ref is master', () => {
      context.ref = 'refs/heads/main';
      expect(isMainBranch()).toBeTruthy();
    });

    it('should return false when ref is something else', () => {
      context.ref = 'refs/heads/master';
      expect(isMainBranch()).toBeFalsy();
      context.ref = '';
      expect(isMainBranch()).toBeFalsy();
    });
  });

  describe('getEventContext', () => {
    it('should read the event json file from disk and return a json', async () => {
      process.env.GITHUB_EVENT_PATH = `${mockPath}/event.json`;

      const data = await getEventContext();

      expect(data).toBeDefined();
      expect(data.hello).toEqual('foo');
    });

    it('should call setFailed when JSON.parse fails cause of malformed data', async () => {
      const spy = jest.spyOn(core, 'setFailed').mockReturnValue();

      process.env.GITHUB_EVENT_PATH = `${mockPath}/event.text`;
      await getEventContext();
      expect(spy).toHaveBeenCalled();

      process.env.GITHUB_EVENT_PATH = `${mockPath}/malformed-event.json`;
      await getEventContext();
      expect(spy).toHaveBeenCalled();
    });

    it('should call setFailed when file is not found', async () => {
      process.env.GITHUB_EVENT_PATH = '';

      const spy = jest.spyOn(core, 'setFailed').mockReturnValue();

      await getEventContext();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('executeCommand', () => {
    it('should execute given command without args', async () => {
      const spy = jest.spyOn(exec, 'exec').mockResolvedValue(0);

      await executeCommand('echo hello');

      expect(spy).toHaveBeenCalledWith(
        'echo hello',
        undefined,
        expect.anything(),
      );
    });

    it('should execute given command with args', async () => {
      const spy = jest.spyOn(exec, 'exec').mockResolvedValue(0);

      await executeCommand('echo', ['hello']);

      expect(spy).toHaveBeenCalledWith('echo', ['hello'], expect.anything());
    });
  });
});
