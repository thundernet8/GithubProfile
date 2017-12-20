export PATH := $(shell pwd)/node_modules/.bin:$(PATH)
.PHONY: init aly dev build clean publish start stop genRoutes

TASKCOUNT = $(shell yarn tasklist | grep -ci "ssr/index.js")

init:
	yarn

aly:
	yarn analyze

dev:
	yarn dev

build:
	yarn build

clean:
	rm -rf dist
	rm -rf ssr/*.js
	rm -rf ssr/*.ejs
	rm -rf src/shared/api/**/*.js
	rm -rf src/shared/common/**/*.js
	rm -rf src/shared/enum/**/*.js
	rm -rf src/shared/interface/**/*.js
	rm -rf src/shared/utils/*.js
	rm -rf src/shared/utils/**/*.js
	rm -rf env.js

publish:
	# TODO

start:
# Makefile中，当 ifeq, else 和 endif 没有缩进时，make会正确识别它们，将其作为分支选择的标识
# 当 ifeq, else 和 endif 有缩进时，make将它们当做普通的shell script
ifeq ($(TASKCOUNT), 0)
	yarn start:o
else
	yarn restart
endif

stop:
ifeq ($(TASKCOUNT), 0)
	yarn stop
endif

genRoutes:
	node ./tool/genRoutes.js