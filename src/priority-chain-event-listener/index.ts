//
// The interface is inspired from [tseep](https://github.com/Morglod/tseep)
//

import { PriorityChain } from "./priority-chain";

export type Listener = (
	stop: () => void,
	...args: any[]
) => Promise<any> | void;
export type DefaultEventMap = {
	[event in string | symbol]: Listener;
} & {
	/**
	 * __proto__ key not allowed due to implementation
	 * add prefix, if you want to use this keyword
	 */
	__proto__?: never;
};

export interface IEventEmitter<
	EventMap extends DefaultEventMap = DefaultEventMap,
> {
	emit<EventKey extends keyof EventMap>(
		event: EventKey,
		// All args except the first one
		...args: Parameters<EventMap[EventKey]> extends [any, ...infer Rest]
			? Rest
			: never
	): boolean;

	on<EventKey extends keyof EventMap = string>(
		event: EventKey,
		listener: EventMap[EventKey],
		priority?: number,
	): this;
	off<EventKey extends keyof EventMap = string>(
		event: EventKey,
		listener: EventMap[EventKey],
	): this;
	// removeAllListeners<EventKey extends keyof EventMap = string>(event?: EventKey): this;
	// setMaxListeners(n: number): this;
	// getMaxListeners(): number;
	// listeners<EventKey extends keyof EventMap = string>(event: EventKey): EventMap[EventKey][];
	// rawListeners<EventKey extends keyof EventMap = string>(event: EventKey): EventMap[EventKey][];
	// eventNames(): (string | symbol)[];
	// listenerCount<EventKey extends keyof EventMap = string>(type: EventKey): number;
}

export class PriorityChainEventListener<
	EventMap extends DefaultEventMap = DefaultEventMap,
> implements IEventEmitter<EventMap>
{
	private events: {
		[K in keyof EventMap]?: PriorityChain<EventMap[K]>;
	} = {};

	on<EventKey extends keyof EventMap = string>(
		event: EventKey,
		listener: EventMap[EventKey],
		priority: number = 0,
	): this {
		if (!this.events[event]) {
			this.events[event] = new PriorityChain<EventMap[EventKey]>();
		}
		this.events[event]?.insert(listener, priority);
		return this;
	}

	off<EventKey extends keyof EventMap = string>(
		event: EventKey,
		listener: EventMap[EventKey],
	): this {
		this.events[event]?.remove(listener);
		return this;
	}

	emit<EventKey extends keyof EventMap>(
		event: EventKey,
		...args: Parameters<EventMap[EventKey]> extends [any, ...infer Rest]
			? Rest
			: never
	): boolean {
		if (!this.events[event]) {
			return false;
		}
		return this.events[event].run(...args);
	}
}
