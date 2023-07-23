const wait = require('./wait');
const process = require('process');
const cp = require('child_process');
const path = require('path');
const core = require("@actions/core");

test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait(510);
  const end = new Date();
  var delta = Math.abs(end - start);
  expect(delta).toBeGreaterThanOrEqual(500);
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  if ( process.env.GITHUB_ACTIONS) {
    console.log(`GITHUB_ACTIONS is ${process.env.GITHUB_ACTIONS} and pass test`);
    return;
  }
  process.env['INPUT_RELEASE-REF-REGEXP'] = `.*release\\-(\\w.*)`;
  process.env['INPUT_TAG-PREFIX'] = `v`;
  process.env['INPUT_DRY-RUN'] = 'true';
  process.env['INPUT_RELEASE-BY-REF'] = 'refs/head/release-1.0.0';
  const ip = path.join(__dirname, 'index.js');
  const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
})

test('test core getInput', () => {
  process.env['INPUT_RELEASE-AS'] = '1.1.0';
  process.env['INPUT_DRY-RUN'] = 'true';
  process.env['INPUT_RELEASE-REF-REGEXP'] = `release\\-(\\w.*)`;
  process.env['INPUT_TAG-PREFIX'] = `v`;
  process.env['INPUT_RELEASE-BY-REF'] = 'refs/head/release-1.0.0';

  if (core.getInput('dry-run') === 'true') {
    console.log(`dry-run: ${core.getInput('dry-run')}`);
  } else {
    console.log(`dry-run: ${core.getInput('dry-run')}`);
  }
  console.log(`release-ref-regexp: ${core.getInput('release-ref-regexp')}`);
  console.log(`tag-prefix: ${core.getInput('tag-prefix')}`);
  console.log(`release-by-ref: ${core.getInput('release-by-ref')}`);
  console.log(`release-as: ${core.getInput('release-as')}`);
})