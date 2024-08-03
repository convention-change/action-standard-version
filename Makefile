.PHONY: test check clean build dist all

# each tag change this
ENV_DIST_VERSION := 1.1.0

ENV_ROOT ?= $(shell pwd)
ENV_DIST_PATH ?= ./dist
ENV_MODULE_FOLDER ?= ${ENV_ROOT}
ENV_MODULE_MAKE_FILE ?= ${ENV_MODULE_FOLDER}/Makefile
ENV_MODULE_MANIFEST = ${ENV_MODULE_FOLDER}/package.json
ENV_MODULE_CHANGELOG = ${ENV_MODULE_FOLDER}/CHANGELOG.md
ENV_COVERAGE_OUT_FOLDER = ${ENV_ROOT}/coverage/
ENV_NODE_MODULES_FOLDER = ${ENV_ROOT}/node_modules/
ENV_NODE_MODULES_LOCK_FILE = ${ENV_ROOT}/package-lock.json

.PHONY: utils
utils:
	node -v
	npm -v
	npm install -g commitizen cz-conventional-changelog conventional-changelog-cli npm-check-updates

.PHONY: versionHelp
versionHelp:
	@git fetch --tags
	@echo "project base info"
	@echo " module folder path   : ${ENV_MODULE_FOLDER}"
	@echo ""
	@echo "=> please check to change version, now is [ ${ENV_DIST_VERSION} ]"
	@echo "-> check at: ${ENV_MODULE_MAKE_FILE}:4"
	@echo " $(shell head -n 4 ${ENV_MODULE_MAKE_FILE} | tail -n 1)"
	@echo "-> check at: ${ENV_MODULE_MANIFEST}:3"
	@echo " $(shell head -n 3 ${ENV_MODULE_MANIFEST} | tail -n 1)"

.PHONY: tagBefore
tagBefore: versionHelp
	@cd ${ENV_MODULE_FOLDER} && conventional-changelog -i ${ENV_MODULE_CHANGELOG} -s --skip-unstable
	@echo ""
	@echo "=> new CHANGELOG.md at: ${ENV_MODULE_CHANGELOG}"
	@echo "place check all file, then can add tag like this!"
	@echo "$$ git tag -a '${ENV_DIST_VERSION}' -m 'message for this tag'"

.PHONY: cleanCoverageOut
cleanCoverageOut:
	@$(RM) -r ${ENV_COVERAGE_OUT_FOLDER}
	$(info ~> has cleaned ${ENV_COVERAGE_OUT_FOLDER})

.PHONY: cleanNpmCache
cleanNpmCache:
	@$(RM) -r ${ENV_NODE_MODULES_FOLDER}
	$(info ~> has cleaned ${ENV_NODE_MODULES_FOLDER})
	@$(RM) ${ENV_NODE_MODULES_LOCK_FILE}
	$(info ~> has cleaned ${ENV_NODE_MODULES_LOCK_FILE})

.PHONY: cleanAll
cleanAll: cleanCoverageOut cleanNpmCache
	@echo "=> clean all finish"

.PHONY: installGlobal
installGlobal:
	npm install codecov --global

.PHONY: install
install:
	npm install
	npm run clean:lockfile

.PHONY: depPrune
depPrune:
	npm prune

.PHONY: dep
dep: install

.PHONY: depReInstall
depReInstall: cleanNpmCache dep

.PHONY: installCi
installCi:
	npm ci

.PHONY: upCheckUpgrade
upCheckUpgrade:
	npx npm-check-updates

.PHONY: upDoNpmCheckUpgrade
upDoNpmCheckUpgrade:
	npx npm-check-updates --doctor -u
	npm install

.PHONY: upNoInteractive
upNoInteractive: upCheckUpgrade upDoNpmCheckUpgrade

.PHONY: up
up:
	npx npm-check-updates --interactive --doctor --format group

.PHONY: format
format:
	npm run format

.PHONY: prepare
prepare:
	npm run prepare

.PHONY: lint
lint:
	npm run lint

.PHONY: test
test: export GITHUB_ACTIONS=true
test:
	npm run test

.PHONY: testCICoverage
testCoverage:
	npm run jest:collectCoverage

.PHONY: ci
ci: export GITHUB_ACTIONS=true
ci: installCi test prepare

.PHONY: ciAll
ciAll: export GITHUB_ACTIONS=true
ciAll: installCi lint test prepare

.PHONY: nodemon
nodemon:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: run
run:
	npm run start

.PHONY: help
help:
	@echo "node module makefile template"
	@echo ""
	@echo " tips: can install node and install utils as"
	@echo "$$ make utils               ~> npm install git cz"
	@echo "  1. then write git commit log, can replace [ git commit -m ] to [ git cz ]"
	@echo "  2. generate CHANGELOG.md doc: https://github.com/commitizen/cz-cli#conventional-commit-messages-as-a-global-utility"
	@echo ""
	@echo "  then you can generate CHANGELOG.md as"
	@echo "$$ make versionHelp         ~> print version when make tageBefore will print again"
	@echo "$$ make tagBefore           ~> generate CHANGELOG.md and copy to module folder"
	@echo ""
	@echo " module folder path   : ${ENV_MODULE_FOLDER}"
	@echo ""
	@echo "Warning: must install node and install module as"
	@echo "$$ make installGlobal       ~> install must tools at global"
	@echo "$$ make install             ~> install project"
	@echo "$$ make upgradeAll          ~> upgrade node_module and reinstall"
	@echo "$$ make installAll          ~> install all include global utils and node_module"
	@echo "$$ make lint                ~> run eslint"
	@echo "$$ make ci                  ~> run ci"
	@echo " unit test as"
	@echo "$$ make test                ~> only run unit test as change"
	@echo "$$ make testAll             ~> run full unit test"
	@echo "$$ make testCoverage        ~> run full unit test and show coverage"
	@echo "$$ make testCICoverage      ~> run full unit test CI coverage"