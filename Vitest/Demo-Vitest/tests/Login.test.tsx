import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import Login from "../src/pages/Login";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

describe("Login Component", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it("stores token after login", async () => {

    mockedAxios.post.mockResolvedValue({
      data: {
        token: "fake_token_123",
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Login Success"))
      .toBeInTheDocument();

    expect(localStorage.getItem("token"))
      .toBe("fake_token_123");
  });
});