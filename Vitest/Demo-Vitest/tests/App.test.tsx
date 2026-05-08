import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { Provider } from 'react-redux';
import { createAppStore } from '../src/redux/app/store';

const renderWithRedux = (component: React.ReactElement) => {
  const store = createAppStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe("App component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should render App component with Login page by default", () => {
    renderWithRedux(<App />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
