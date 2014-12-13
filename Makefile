test:
	@NODE_ENV="test" \
	./node_modules/.bin/mocha --reporter spec -u tdd "tests/**/test.*.js"

cover:
	@NODE_ENV="test" \
	./node_modules/.bin/istanbul \
	cover --dir ./reports/coverage ./node_modules/.bin/_mocha -- -u exports -R \
	spec "tests/**/test.*.js"

lint:
	./node_modules/gulp/bin/gulp.js lint

jscs:
	./node_modules/gulp/bin/gulp.js jscs

.PHONY: test
