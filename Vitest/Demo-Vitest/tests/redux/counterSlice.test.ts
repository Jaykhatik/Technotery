import reducer, { decrement, increment, incrementByAmount } from "../../src/redux/Features/counter/counterSlice";
describe("counterSlice", () => {

  it("should return the initial state", () => {
    expect(
      reducer(undefined, { type: "" })
    ).toEqual({
      value: 0,
    });

  });
  it("should increment the value by 1", () => {

    const initialState = {
      value: 0,
    };

    const newState = reducer(
      initialState,
      increment()
    );

    expect(newState.value).toBe(1);

  });

  it("should decrement the value by 1", () => {

    const initialState = {
      value: 5,
    };

    const newState = reducer(
      initialState,
      decrement()
    );

    expect(newState.value).toBe(4);

  });

  it("should increment by payload amount", () => {

    const initialState = {
      value: 10,
    };

    const newState = reducer(
      initialState,
      incrementByAmount(5)
    );

    expect(newState.value).toBe(15);

  });

  it("should work with negative payload", () => {

    const initialState = {
      value: 10,
    };

    const newState = reducer(
      initialState,
      incrementByAmount(-3)
    );

    expect(newState.value).toBe(7);

  });

});