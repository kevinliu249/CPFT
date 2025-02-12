import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Survey from "../survey"; // Adjust the path based on your file structure
import { BrowserRouter } from "react-router-dom";

// ✅ Mock react-router-dom to track navigation
jest.mock("react-router-dom", async () => {
    const actual = await import("react-router-dom");
    return {
      ...actual,
      useNavigate: jest.fn(),
    };
  });
  

describe("Survey Component", () => {
  test("renders the survey form correctly", () => {
    render(
      <BrowserRouter>
        <Survey />
      </BrowserRouter>
    );

    // Check if the heading and form elements are present
    expect(screen.getByText(/Training Plan Survey/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exercise Type\/Goal:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Equipment Preference:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fitness Level:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Survey/i })).toBeInTheDocument();
  });

  test("allows user to select options and submit the form", async () => {
    const mockNavigate = jest.fn();
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Survey submitted successfully" }),
      })
    );

    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <Survey />
      </BrowserRouter>
    );

    // Select values from dropdowns
    fireEvent.change(screen.getByLabelText(/Exercise Type\/Goal:/i), {
      target: { value: "muscle_mass" },
    });
    fireEvent.change(screen.getByLabelText(/Equipment Preference:/i), {
      target: { value: "weights" },
    });
    fireEvent.change(screen.getByLabelText(/Fitness Level:/i), {
      target: { value: "intermediate" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Submit Survey/i }));

    // ✅ Verify fetch was called correctly
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // ✅ Verify the API request payload
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:5000/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: "test_user",
        fitness_goal: "muscle_mass",
        fitness_level: "intermediate",
        equipment_preference: "weights",
      }),
    });
  });
});
