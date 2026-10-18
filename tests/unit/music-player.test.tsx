import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { MusicPlayer } from "@/components/music-player";

it("switches a single embedded player when selecting a song without navigation", async () => {
  const user = userEvent.setup();
  const { container } = render(<MusicPlayer songs={[
    { id: "one", name: "First song", artist: "First artist", url: "https://open.spotify.com/track/one" },
    { id: "two", name: "Second song", artist: "Second artist", url: "https://open.spotify.com/track/two" },
  ]} />);
  expect(screen.getByTitle("Spotify player: First song by First artist")).toHaveAttribute("src", "https://open.spotify.com/embed/track/one?utm_source=generator");
  await user.click(screen.getByRole("button", { name: "Select Second song by Second artist" }));
  expect(container.querySelectorAll("iframe")).toHaveLength(1);
  expect(screen.getByTitle("Spotify player: Second song by Second artist")).toHaveAttribute("allow", expect.stringContaining("encrypted-media"));
  expect(screen.getByRole("button", { name: "Select Second song by Second artist" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("link", { name: "Open Second song on Spotify" })).toHaveAttribute("target", "_blank");
});

it("renders no player for an empty selection", () => {
  const { container } = render(<MusicPlayer songs={[]} />);
  expect(container).toBeEmptyDOMElement();
});
