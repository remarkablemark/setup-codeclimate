import * as exec from '@actions/exec';
import os from 'os';

import { CLI_NAME, VERSION } from './constants';
import { getDownloadObject, getVersion } from './utils';

jest.mock('@actions/exec');
jest.mock('os');

const mockedOs = jest.mocked(os);
const mockedExec = jest.mocked(exec);

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getDownloadObject', () => {
  const platforms = ['darwin', 'linux', 'win32'];
  const architectures = ['arm', 'arm64', 'x32', 'x64'];

  const table = platforms.reduce(
    (testSuites, os) => [
      ...testSuites,
      ...architectures.map((arch) => [os, arch] as [string, string]),
    ],
    [] as [string, string][]
  );

  describe.each(table)('when OS is %p and arch is %p', (os, arch) => {
    const { RUNNER_TEMP } = process.env;
    const version = '0.11.1';

    beforeAll(() => {
      process.env.RUNNER_TEMP = '';
    });

    afterAll(() => {
      process.env.RUNNER_TEMP = RUNNER_TEMP;
    });

    beforeEach(() => {
      mockedOs.platform.mockReturnValueOnce(os as NodeJS.Platform);
      mockedOs.arch.mockReturnValueOnce(arch);
      mockedOs.tmpdir.mockReturnValueOnce('/var/folders/1/tmp/T');
    });

    it('gets download object', () => {
      expect(getDownloadObject(version, CLI_NAME)).toMatchSnapshot();
    });
  });

  describe('process.env.RUNNER_TEMP', () => {
    const { RUNNER_TEMP } = process.env;

    beforeAll(() => {
      process.env.RUNNER_TEMP = '/home/runner/work/_temp';
    });

    afterAll(() => {
      process.env.RUNNER_TEMP = RUNNER_TEMP;
    });

    it('gets download object', () => {
      mockedOs.platform.mockReturnValueOnce('linux');
      mockedOs.arch.mockReturnValueOnce('arm64');
      expect(getDownloadObject(VERSION, CLI_NAME)).toMatchInlineSnapshot(`
      {
        "binPath": "/home/runner/work/_temp",
        "dest": "/home/runner/work/_temp/cc-test-reporter",
        "url": "https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-arm64",
      }
    `);
    });
  });
});

describe('getVersion', () => {
  it.each([
    [
      'Code Climate Test Reporter 0.11.1 (451e193d33d2fbd30d8067e197999c0224d8200b @ 2023-03-27T16:19:00+0000)',
      '0.11.1',
    ],
    [
      'Code Climate Test Reporter latest (451e193d33d2fbd30d8067e197999c0224d8200b @ 2023-03-27T16:19:00+0000)',
      '451e193d33d2fbd30d8067e197999c0224d8200b',
    ],
  ])('gets version', async (stdout, version) => {
    mockedExec.getExecOutput.mockResolvedValueOnce({
      exitCode: 0,
      stderr: '',
      stdout,
    });
    expect(await getVersion('')).toBe(version);
  });
});
