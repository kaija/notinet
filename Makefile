MOCHA=mocha
NODE=node
OPT= -G
TESTS=test/*.test.js
test:
	$(MOCHA) $(OPT) $(TESTS)
clean:
	$(NODE) test/clear.js
.PHONY:test
