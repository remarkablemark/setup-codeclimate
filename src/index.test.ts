import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';

import { run } from '.';
import { CLI_NAME, VERSION } from './constants';
import * as utils from './utils';

jest.mock('@actions/core');
jest.mock('@actions/exec');
jest.mock('@actions/tool-cache');
jest.mock('./utils');

const mockedCore = jest.mocked(core);
const mockedExec = jest.mocked(exec);
const mockedTc = jest.mocked(tc);
const mockedUtils = jest.mocked(utils);

beforeEach(() => {
  jest.resetAllMocks();
});

const download = {
  binPath: '/binPath',
  dest: '/binPath/cc-test-reporter',
  url: 'https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-arm64',
};

describe('action', () => {
  it('downloads and adds CLI to PATH', async () => {
    const version = '1.2.3';
    const name = 'cli-name';
    const pathToDownloadDirectory = 'path/to';
    const pathToDownload = `${pathToDownloadDirectory}/download`;

    mockedCore.getInput.mockImplementation((name) => {
      switch (name) {
        case 'codeclimate-version':
          return version;
        case 'cli-name':
          return name;
        default:
          return '';
      }
    });
    mockedUtils.getDownloadObject.mockReturnValueOnce(download);
    mockedTc.downloadTool.mockResolvedValueOnce(pathToDownload);
    mockedUtils.getVersion.mockResolvedValueOnce(version);

    await run();

    expect(mockedUtils.getDownloadObject).toBeCalledWith(version, name);
    expect(mockedTc.downloadTool).toBeCalledWith(download.url, download.dest);
    expect(mockedExec.exec).toBeCalledWith('chmod', ['+x', pathToDownload]);
    expect(mockedTc.cacheFile).toBeCalledWith(
      pathToDownload,
      name,
      name,
      version
    );
    expect(mockedCore.addPath).toBeCalledWith(download.binPath);
  });
});

describe('error', () => {
  it('throws error', async () => {
    mockedUtils.getDownloadObject.mockReturnValueOnce(download);
    const message = 'error';
    mockedTc.downloadTool.mockImplementationOnce(() => {
      throw new Error(message);
    });
    await run();
    expect(mockedUtils.getDownloadObject).toBeCalledWith(VERSION, CLI_NAME);
    expect(mockedCore.setFailed).toBeCalledWith(message);
  });
});
