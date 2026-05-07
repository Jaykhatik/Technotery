import { render, screen } from "@testing-library/react";
import axios from "axios";

vi.mock("axios");

import Photos from "../src/Components/Photos";

describe("Photos Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    const mockedAxios = vi.mocked(axios);
    mockedAxios.get.mockReturnValue(new Promise(() => {}));

    render(<Photos />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders photos after API success", async () => {
    const mockedAxios = vi.mocked(axios);
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, title: "Photo 1" },
        { id: 2, title: "Photo 2" },
      ],
    });

    render(<Photos />);

    expect(await screen.findByText("Photo 1")).toBeInTheDocument();
    expect(await screen.findByText("Photo 2")).toBeInTheDocument();
  });

  it("shows 'No Users' when API returns empty array", async () => {
    const mockedAxios = vi.mocked(axios);
    mockedAxios.get.mockResolvedValue({
      data: [],
    });

    render(<Photos />);

    expect(await screen.findByText("No Photos found")).toBeInTheDocument();
  });

  it("shows an error message when API fails", async () => {
    const mockedAxios = vi.mocked(axios);
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    render(<Photos />);

    expect(await screen.findByText("Failed to load")).toBeInTheDocument();
  });
});
