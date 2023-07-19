import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import App from "./App";
jest.mock("axios");

const mock = new MockAdapter(axios);

describe("App", () => {
  const fakeCountries = [
    { name: { common: "Country A" }, population: 1000000 },
    { name: { common: "Country B" }, population: 2000000 },
  ];

  beforeEach(() => {
    mock.onGet("https://restcountries.com/v3.1/all").reply(200, fakeCountries);
    render(<App />);
  });

  afterEach(() => {
    mock.reset();
  });

  test("should render the App component", async () => {
    await waitFor(() => {
      expect(screen.getByText("Country A")).toBeInTheDocument();
      expect(screen.getByText("Country B")).toBeInTheDocument();
    });
  });

  test("should filter and display countries based on name", async () => {
    fireEvent.change(screen.getByLabelText("Filter by name:"), {
      target: { value: "Country A" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Country A")).toBeInTheDocument();
      expect(screen.queryByText("Country B")).not.toBeInTheDocument();
    });
  });

  test("should filter and display countries based on population", async () => {
    fireEvent.change(screen.getByLabelText("Filter by population:"), {
      target: { value: "1500000" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Country A")).toBeInTheDocument();
      expect(screen.queryByText("Country B")).not.toBeInTheDocument();
    });
  });


  test("should sort countries in ascending order", async () => {
    fireEvent.change(screen.getByLabelText("Sort:"), {
      target: { value: "ascend" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      const countryNames = screen.getAllByRole("cell", { name: /country/i }).map((el) => el.textContent);
      expect(countryNames).toEqual(["Country A", "Country B"]);
    });
  });

  test("should sort countries in descending order", async () => {
    fireEvent.change(screen.getByLabelText("Sort:"), {
      target: { value: "descend" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      const countryNames = screen.getAllByRole("cell", { name: /country/i }).map((el) => el.textContent);
      expect(countryNames).toEqual(["Country B", "Country A"]);
    });
  });

  test("should paginate countries", async () => {
    fireEvent.change(screen.getByLabelText("Pagination:"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.queryByText("Country A")).not.toBeInTheDocument();
      expect(screen.getByText("Country B")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Country A")).toBeInTheDocument();
      expect(screen.queryByText("Country B")).not.toBeInTheDocument();
    });
  });
});

