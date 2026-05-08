import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import Login from "../src/pages/Login";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("stores token after login", async () => {
    const user = userEvent.setup();

    mockedAxios.post.mockResolvedValue({
      data: {
        token: "fake_token_123",
        firstName: "Emily",
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText("Enter username");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    await user.type(usernameInput, "emilys");
    await user.type(passwordInput, "emilyspass");
    await user.click(loginButton);

    // Wait for the async action to complete (localStorage should be set)
    await vi.waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake_token_123");
    });
  });
});
