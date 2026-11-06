import { render, screen } from "@testing-library/react";

import TemarioHero from "../TemarioHero";

describe("TemarioHero", () => {
  it("renderiza el hero del módulo de temarios", () => {
    render(<TemarioHero mode="student" />);

    expect(screen.getByText("TEMARIOS PERMISO DE CONDUCIR")).toBeInTheDocument();
    expect(
      screen.getByText(/La teoría se irá desarrollando por tema/i),
    ).toBeInTheDocument();
  });
});
