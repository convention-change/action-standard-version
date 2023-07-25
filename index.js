const core = require('@actions/core');
const exec = require('@actions/exec');
// const github = require('@actions/github');
// const {getConfiguration} = require('standard-version/lib/configuration');
const standardVersion = require('standard-version');
const cli = require("standard-version/command");

// most @actions toolkit packages have async methods
async function run() {
  try {
    // let configuration = getConfiguration();
    // configuration.dryRun = true
    let targetBranch = core.getInput('target-branch');
    if (targetBranch === '') {
      targetBranch = process.env.GITHUB_REF;
    }

    const tagPrefix = core.getInput('tag-prefix');
    core.debug(`tagPrefix: ${tagPrefix}`);

    // change releaseAs
    let releaseAs = core.getInput('release-as');
    const releaseReg = core.getInput('release-ref-regexp')
    if (!releaseReg || releaseReg === '') {
      core.setFailed('release-ref-regexp is empty');
      return;
    }
    if (releaseAs === '') {
      let releaseByRef = core.getInput('release-by-ref');
      if (!releaseByRef || releaseByRef === '') {
        core.error(`release-by-ref is empty`);
        core.setFailed(`release-by-ref is empty`)
        return;
      }
      core.info(`release-by-ref: ${releaseByRef}`);
      const match = releaseByRef.match(releaseReg);
      if (!match) {
        core.error('release-by-ref not match release-ref-regexp');
        core.setFailed(`release-by-ref not match release-ref-regexp ${releaseReg} from ${releaseByRef}`)
        return;
      }
      releaseAs = match[1].trim()
    }
    core.debug(`releaseAs: ${releaseAs}`);

    if (core.getBooleanInput('dry-run')) {
      cli.parse(`standard-version --dry-run --tag-prefix '${tagPrefix}' --release-as ${releaseAs}`);
      await standardVersion(cli.argv);
      // await exec.exec('git', ['status'], {
      //   env: {
      //     ...process.env,
      //   }
      // });
    } else {
      cli.parse(`standard-version --tag-prefix '${tagPrefix}' --release-as ${releaseAs}`);
      await standardVersion(cli.argv);
      core.info(`targetBranch: ${targetBranch}`);

      if (core.getBooleanInput('push-changes-and-tag')) {
        // https://github.com/actions/toolkit/tree/main/packages/exec
        await exec.exec('git', ['push', '--follow-tags', 'origin', targetBranch], {
          env: {
            ...process.env,
          }
        });
      }
    }
    core.setOutput('release-tag-short', releaseAs);
    core.setOutput('release-tag-name', `${tagPrefix}${releaseAs}`);
    let releaseTagNameEnv = core.getInput('release-tag-name-env');
    core.debug(`releaseTagNameEnv: ${releaseTagNameEnv}`)
    core.exportVariable(releaseTagNameEnv, `${tagPrefix}${releaseAs}`);

  } catch (error) {
    console.error(error.stack);
    core.setFailed(error.message);
  }
}

run();
