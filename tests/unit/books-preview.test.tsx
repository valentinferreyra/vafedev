import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { BooksPreview } from "@/components/books-preview";

it("shows only confirmed reads and preserves empty reading states", async () => {
  const user = userEvent.setup();
  render(<BooksPreview />);
  expect(screen.queryByText(/fictional examples/)).not.toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  expect(screen.getByText("No books in progress right now.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Backlog 0" }));
  expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  expect(screen.getByText("No books on the backlog yet.")).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Reading books" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Backlog 0" })).toHaveAttribute("aria-pressed", "true");
  await user.click(screen.getByRole("button", { name: "All 2" }));
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
});
