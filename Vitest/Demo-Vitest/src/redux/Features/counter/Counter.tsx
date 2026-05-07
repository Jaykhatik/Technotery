import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "./counterSlice";
import type { RootState } from "../../app/store";

export function CounterComponent() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="card counter">
      <h2>Redux Counter</h2>
      <div className="counter__value-container">
        <div className="counter__value">{count}</div>
      </div>
      <div className="counter__controls">
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <button className="btn--primary" onClick={() => dispatch(incrementByAmount(5))}>+ 5</button>
      </div>
    </div>
  );
}
