import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { BooksPreview } from "@/components/books-preview";

it("labels sample content and filters reading states without navigation", async () => {
  const user = userEvent.setup();
  render(<BooksPreview />);
  expect(screen.getByText(/fictional examples/)).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  await user.click(screen.getByRole("button", { name: "Backlog 2" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  expect(screen.queryByRole("region", { name: "Reading books" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Backlog 2" })).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "All 5" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
});
