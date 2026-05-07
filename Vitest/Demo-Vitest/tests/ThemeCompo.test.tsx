import { ThemeProvider } from "../src/context/ThemeProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeComponent } from "../src/Components/ThemeCompo";

it("updates context value", async () => {
  render(
    <ThemeProvider>
      <ThemeComponent />
    </ThemeProvider>
  );

  expect(screen.getByText(/light/i)).toBeInTheDocument();

  await userEvent.click(screen.getByText("Toggle Theme"));

  expect(screen.getByText(/dark/i)).toBeInTheDocument();
});
