import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import axios from "axios";

describe("App component", () => {
  //describe method is used to group related test cases together. The first argument is a string that describes the group of tests, and the second argument is a function that contains the actual test cases.
  it.skip("should render App component", () => {
    //it method is used to define a test case. The first argument is a string that describes the test case, and the second argument is a function that contains the actual test code.

    render(<App />);
    //render function is used to render the App component in a virtual DOM environment provided by the testing library. This allows us to interact with the component and test its behavior without needing a real browser environment.

    screen.debug(undefined, 1000000);
    //the undefined value is used to indicate that we want to see the full output without any truncation.
    //screen.debug() is a method provided by the testing library that allows us to print the current state of the virtual DOM to the console. This can be useful for debugging purposes, as it shows us the structure of the rendered component and its children.
  });




  it.skip("should render App component with name prop", () => {
    //only method is used to run only this test case and skip all other test cases in the file. This is useful when you want to focus on a specific test case during development or debugging.

    render(<App name="John Doe" />);
    const heading = screen.getByText("John Doe");
    screen.debug(undefined, 1000000);
    expect(heading).toBeDefined();
    //expect function is used to make assertions about the expected behavior of the component. In this case, we are asserting that the heading element with the text "John Doe" is defined, which means it was successfully rendered by the App component when we passed the name prop.
  });



  it.skip("should increment count when button is clicked", async () => {
    render(<App />);
    const initialCount = screen.getByRole("heading", { name: "0" });
    expect(initialCount).toBeDefined();
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDefined();
    fireEvent.click(button);
    //await userEvent.click(button);
    const updatedCount = await screen.getByRole("heading", { name: "1" });
    expect(updatedCount).toBeDefined();
  });



  //fetch api test case
  vi.mock("axios");//Replace the real axios module with a mock version.
  it.skip("should fetch user data when button is clicked", async () => {
    // Mock axios.get
    (axios.get as any).mockResolvedValue({//use mockResolvedValue Because axios.get() is async (returns a Promise), we use mockResolvedValue to specify the value that should be returned when the Promise resolves. In this case, we are simulating a successful API response with a user object that has a name property.
      data: { name: "Leanne Graham" },
    });

    render(<App />);
    const fetchButton = screen.getByRole("button", { name: "Fetch User" });
    expect(fetchButton).toBeDefined();
    await userEvent.click(fetchButton);
    const userName = await screen.findByRole("heading", {
      name: "Leanne Graham",
    });
    expect(userName).toBeDefined();
  });
   // ✅ Loading Test
  it('shows loading initially', () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ name: 'Jay' }),
    } as Response);

    render(<App />);

    expect(screen.getByText('Loading...')).toBeDefined();
  });

   // ✅ Success Test
  it('displays user after API success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ name: 'Jay' }),
    } as Response);

    render(<App />);

    const user = await screen.findByText('Welcome Jay');

    expect(user).toBeDefined();
  });
  // ❌ Error Test
  it('shows error when API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('API error'));

    render(<App />);

    const error = await screen.findByText('Failed to load');

    expect(error).toBeDefined();
  });
});