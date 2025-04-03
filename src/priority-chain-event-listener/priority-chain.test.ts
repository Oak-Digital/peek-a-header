import { describe, expect, test, mock } from "bun:test";
import { PriorityChain } from "./priority-chain";

describe("PriorityChain", () => {
	test("run single function", () => {
		const listener = mock();
		const chain = new PriorityChain<typeof listener>();
		chain.insert(listener);
		chain.run();
		expect(listener).toBeCalledTimes(1);
	});

	test("run the same function twice", () => {
		const listener = mock();
		const chain = new PriorityChain<typeof listener>();
		chain.insert(listener);
		chain.insert(listener);
		chain.run();
		expect(listener).toBeCalledTimes(2);
	});

	test("run multiple functions", () => {
		const listener1 = mock();
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener1);
		chain.insert(listener2);
		chain.run();
		expect(listener1).toBeCalledTimes(1);
		expect(listener2).toBeCalledTimes(1);
	});

	test("run multiple functions with different priorities", () => {
		const listener1 = mock();
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener1, 10);
		chain.insert(listener2, 1);
		chain.run();
		expect(listener1).toBeCalledTimes(1);
		expect(listener2).toBeCalledTimes(1);
		// check that listener1 was called before listener2 since it has a higher priority
		expect(listener1.mock.invocationCallOrder[0]).toBeLessThan(
			listener2.mock.invocationCallOrder[0]!,
		);
	});

	test("run multiple functions with different priorities inserted in different order", () => {
		const listener1 = mock();
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener2, 1);
		chain.insert(listener1, 10);
		chain.run();
		expect(listener1).toBeCalledTimes(1);
		expect(listener2).toBeCalledTimes(1);
		// check that listener1 was called before listener2 since it has a higher priority
		expect(listener1.mock.invocationCallOrder[0]).toBeLessThan(
			listener2.mock.invocationCallOrder[0]!,
		);
	});

	test("run multiple functions but stop on the first one", () => {
		const listener1 = mock((stop: () => void) => stop());
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener1);
		chain.insert(listener2);
		chain.run();
		expect(listener1).toBeCalledTimes(1);
		expect(listener2).toBeCalledTimes(0);
	});

	test("run multiple functions with args", () => {
		type func = (stop: () => void, arg1: number) => void;
		const listener1 = mock<func>((stop, arg1) => {});
		const listener2 = mock<func>((stop, arg1) => {});
		const chain = new PriorityChain<typeof listener1, [number]>();
		chain.insert(listener1);
		chain.insert(listener2);
		chain.run(1);
		expect(listener1).toBeCalledTimes(1);
		expect(listener2).toBeCalledTimes(1);
		expect(listener1).toBeCalledWith(expect.any(Function), 1);
		expect(listener2).toBeCalledWith(expect.any(Function), 1);
	});

	test("Returns true if all functions were called", () => {
		const listener1 = mock();
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener1);
		chain.insert(listener2);
		const result = chain.run();
		expect(result).toBe(true);
	});

	test("Returns false if one of the functions called stop", () => {
		const listener1 = mock((stop: () => void) => stop());
		const listener2 = mock();
		const chain = new PriorityChain<typeof listener1>();
		chain.insert(listener1);
		chain.insert(listener2);
		const result = chain.run();
		expect(result).toBe(false);
	});
});
