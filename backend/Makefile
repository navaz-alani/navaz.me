EXEC=navaz.me_backend

.PHONY: load-test clean

$(EXEC):
	go build -o $(EXEC)

load-test: $(EXEC)
	chmod +x ./test/api/test.sh
	./test/api/test.sh ${EXEC}
	rm -rf ${EXEC}

clean:
	rm -rf ${EXEC}
