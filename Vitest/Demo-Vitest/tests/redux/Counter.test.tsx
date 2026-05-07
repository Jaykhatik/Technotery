import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { CounterComponent } from "../../src/redux/Features/counter/Counter";
import { createAppStore } from "../../src/redux/app/store";

const renderWithRedux = (component: React.ReactElement) => {
  const store = createAppStore();
  return render(<Provider store={store}>{component}</Provider>);
};

describe("CounterComponent", () => {
  it("renders initial count", () => {
    renderWithRedux(<CounterComponent />);
    expect(screen.getByText("Redux Counter")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("increments counter", async () => {
    renderWithRedux(<CounterComponent />);
    const incrementButton = screen.getByRole("button",{name:/increment/i,});
    await userEvent.click(incrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("decrements counter", async () => {
    renderWithRedux(<CounterComponent />);
    const decrementButton = screen.getByRole("button",{name:/decrement/i,});
    await userEvent.click(decrementButton);
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("increments by amount", async () => {
    renderWithRedux(<CounterComponent />);
    const incrementBy5Button = screen.getByText("+ 5");
    await userEvent.click(incrementBy5Button);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
