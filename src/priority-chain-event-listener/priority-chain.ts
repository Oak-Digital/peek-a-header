export class PriorityChain<
	Func extends (stop: () => void, ...args: any[]) => void,
> {
	private listeners: { p: number; l: Func }[] = [];

	public insert(listener: Func, priority: number = 0) {
		const indexToInsert = this.listeners.findIndex((item) => item.p < priority);
		if (indexToInsert === -1) {
			this.listeners.push({ l: listener, p: priority });
		} else {
			this.listeners.splice(indexToInsert, 0, { l: listener, p: priority });
		}
	}

	public remove(listener: Func) {
		this.listeners = this.listeners.filter((item) => item.l !== listener);
	}

	/**
	 * Runs all functions in the chain in order of priority.
	 * Stopping if one of the functions calls the stop function.
	 * @returns true if all functions were called.
	 */
	public run(
		...args: Parameters<Func> extends [any, ...infer Rest] ? Rest : never
	): boolean {
		let isStopCalled = false;
		const stop = () => {
			isStopCalled = true;
		};
		for (const { l: listener } of this.listeners) {
			isStopCalled = false;
			listener(stop, ...args);
			if (isStopCalled) {
				return false;
			}
		}

		return true;
	}
}
