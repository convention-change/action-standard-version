const core = require('@actions/core');
// const github = require('@actions/github');
// const {getConfiguration} = require('standard-version/lib/configuration');
const standardVersion = require('standard-version');
const cli = require("standard-version/command");


// most @actions toolkit packages have async methods
async function run() {
  try {
    // let configuration = getConfiguration();
    // configuration.dryRun = true
    let tagPrefix = core.getInput('tag-prefix');
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

    if (core.getInput('dry-run') === 'true') {
      cli.parse(`standard-version --dry-run --tag-prefix '${tagPrefix}' --release-as ${releaseAs}`);
      await standardVersion(cli.argv);
    } else {
      cli.parse(`standard-version --tag-prefix '${tagPrefix}' --release-as ${releaseAs}`);
      await standardVersion(cli.argv);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
