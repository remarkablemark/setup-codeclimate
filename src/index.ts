import { addPath, getInput, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { cacheFile, downloadTool } from '@actions/tool-cache';

import { CLI_NAME, VERSION } from './constants';
import { getDownloadObject, getVersion } from './utils';

export async function run() {
  try {
    // Get version of tool to be installed
    const version = getInput('codeclimate-version') || VERSION;
    const name = getInput('cli-name') || CLI_NAME;

    // Download the specific version of the tool
    const download = getDownloadObject(version, name);
    const pathToCLI = await downloadTool(download.url, download.dest);

    // Make binary executable
    await exec('chmod', ['+x', pathToCLI]);

    // Cache tool
    await cacheFile(pathToCLI, name, name, await getVersion(pathToCLI));

    // Expose the tool by adding it to the PATH
    addPath(download.binPath);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
