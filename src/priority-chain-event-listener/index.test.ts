import { describe, expect, mock, test } from "bun:test";
import { PriorityChainEventListener } from ".";

type Stop = () => void;

type SimpleEventMap = {
	test: (stop: Stop, a: number, b: string) => void;
};

describe("PriorityChainEventListener", () => {
	test("set and event and call it", () => {
		const listener = mock();
		const eventEmitter = new PriorityChainEventListener<SimpleEventMap>();
		eventEmitter.on("test", listener);
		eventEmitter.emit("test", 1, "test");
		expect(listener).toBeCalledTimes(1);
		expect(listener).toBeCalledWith(expect.any(Function), 1, "test");
	});

	test("remove an event listener", () => {
		const listener = mock();
		const eventEmitter = new PriorityChainEventListener<SimpleEventMap>();
		eventEmitter.on("test", listener);
		eventEmitter.off("test", listener);
		eventEmitter.emit("test", 1, "test");
		expect(listener).toBeCalledTimes(0);
	});
});
