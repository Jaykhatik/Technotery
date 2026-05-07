import { createAppStore } from "../../src/redux/app/store";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../../src/redux/Features/counter/counterSlice";

describe("Redux Store", () => {
  it("should have initial state", () => {
    const store = createAppStore();
    const state = store.getState();
    expect(state.counter.value).toBe(0);
  });

  it("should increment counter", () => {
    const store = createAppStore();
    store.dispatch(increment());
    expect(store.getState().counter.value).toBe(1);
  });

  it("should decrement counter", () => {
    const store = createAppStore();
    store.dispatch(decrement());
    expect(store.getState().counter.value).toBe(-1);
  });

  it("should increment by amount", () => {
    const store = createAppStore();
    store.dispatch(incrementByAmount(5));
    expect(store.getState().counter.value).toBe(5);
  });
});
