import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';

import { run } from '.';
import { BINARY_NAME } from './constants';
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

describe('action', () => {
  const download = {
    binPath: '/binPath',
    dest: '/binPath/cc-test-reporter',
    url: 'https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-arm64',
  };

  it('downloads and adds CLI to PATH', async () => {
    const version = '0.11.1';
    const pathToDownloadDirectory = 'path/to';
    const pathToDownload = `${pathToDownloadDirectory}/download`;

    mockedCore.getInput.mockImplementationOnce((name) =>
      name === 'codeclimate-version' ? 'latest' : ''
    );
    mockedUtils.getDownloadObject.mockReturnValueOnce(download);
    mockedTc.downloadTool.mockResolvedValueOnce(pathToDownload);
    mockedUtils.getVersion.mockResolvedValueOnce(version);

    await run();

    expect(mockedTc.downloadTool).toBeCalledWith(download.url, download.dest);
    expect(mockedExec.exec).toBeCalledWith('chmod', ['+x', pathToDownload]);
    expect(mockedTc.cacheFile).toBeCalledWith(
      pathToDownload,
      BINARY_NAME,
      BINARY_NAME,
      version
    );
    expect(mockedCore.addPath).toBeCalledWith(download.binPath);
  });
});

describe('error', () => {
  it('throws error', async () => {
    const message = 'error';
    mockedCore.getInput.mockImplementationOnce(() => {
      throw new Error(message);
    });
    await run();
    expect(mockedCore.setFailed).toBeCalledWith(message);
  });
});
