import { getExecOutput } from '@actions/exec';
import os from 'os';
import path from 'path';
import semver from 'semver';

const architecture = {
  arm64: 'arm64',
  x64: 'amd64',
} as const;

/**
 * Gets the operating system CPU architecture.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_arch}
 *
 * @param arch - Arch in [arm64, x64...]
 * @returns - Return value in [amd64, amd64]
 */
function getArch(arch: NodeJS.Architecture) {
  return architecture[arch as keyof typeof architecture] || architecture.x64;
}

const platform = {
  darwin: 'darwin',
  linux: 'linux',
  win32: 'windows',
} as const;

/**
 * Gets a string identifying the operating system platform.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_platform}
 *
 * @param os - OS in [darwin, linux, win32...]
 * @returns - Return value in [darwin, linux, windows]
 */
function getOS(os: NodeJS.Platform) {
  return platform[os as keyof typeof platform];
}

/**
 * Gets download object.
 *
 * @see {@link https://docs.codeclimate.com/docs/configuring-test-coverage#section-locations-of-pre-built-binaries}
 *
 * @param version - CLI version
 * @param name - CLI name
 * @returns - URL, download destination, and binary path
 */
export function getDownloadObject(version: string, name: string) {
  const platform = os.platform();
  const arch = os.arch() as NodeJS.Architecture;

  // https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
  const binPath = process.env.RUNNER_TEMP || os.tmpdir();

  return {
    binPath,
    // join instead of resolve or else path will be broken on windows
    dest: path.join(binPath, name + (platform === 'win32' ? '.exe' : '')),
    url: `https://codeclimate.com/downloads/test-reporter/test-reporter-${version}-${getOS(
      platform,
    )}-${getArch(arch)}`,
  };
}

/**
 * Gets the Code Climate test reporter version.
 *
 * @param binaryPath - Binary path
 * @returns - Semver (Linux/Windows) or hash (Mac)
 */
export async function getVersion(binaryPath: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (await getExecOutput(binaryPath, ['--version'])).stdout
    .replace('(', '')
    .split(' ')
    .find((text) => semver.valid(text) || /^[0-9a-f]{32,}$/.test(text))!;
}
