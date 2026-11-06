import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Agendas from "../Agendas";
import { profesoresService } from "../../../services/profesoresService";

vi.mock("../../../services/profesoresService", () => ({
  profesoresService: {
    getAll: vi.fn(),
    getAdminAgenda: vi.fn(),
  },
}));

vi.mock("../../../components/agenda/ReadOnlyWeeklyAgendaBoard", () => ({
  default: ({ title, error, onNextWeek, onPrevWeek }) => (
    <div>
      <div>{title}</div>
      {error ? <div>{error}</div> : null}
      <button type="button" onClick={onPrevWeek}>
        Semana anterior
      </button>
      <button type="button" onClick={onNextWeek}>
        Semana siguiente
      </button>
    </div>
  ),
}));

describe("Agendas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga profesores activos y consulta la agenda del primer profesor activo", async () => {
    profesoresService.getAll.mockResolvedValue([
      {
        id: "prof-inactivo",
        activo: false,
        usuario: { nombre: "Profesor inactivo" },
      },
      {
        id: "prof-activo",
        activo: true,
        usuario: { nombre: "Ane Activa" },
      },
    ]);
    profesoresService.getAdminAgenda.mockResolvedValue({ items: [] });

    render(<Agendas />);

    await waitFor(() => {
      expect(profesoresService.getAdminAgenda).toHaveBeenCalledWith(
        "prof-activo",
        { weekOffset: 0 },
      );
    });

    expect(
      screen.getByText("Agenda semanal · Ane Activa"),
    ).toBeInTheDocument();
  });

  it("actualiza la agenda al cambiar de semana", async () => {
    profesoresService.getAll.mockResolvedValue([
      {
        id: "prof-1",
        activo: true,
        usuario: { nombre: "Profesor Uno" },
      },
    ]);
    profesoresService.getAdminAgenda.mockResolvedValue({ items: [] });
    const user = userEvent.setup();

    render(<Agendas />);

    await waitFor(() => {
      expect(profesoresService.getAdminAgenda).toHaveBeenCalledWith("prof-1", {
        weekOffset: 0,
      });
    });

    await user.click(screen.getByRole("button", { name: /semana siguiente/i }));

    await waitFor(() => {
      expect(profesoresService.getAdminAgenda).toHaveBeenLastCalledWith(
        "prof-1",
        { weekOffset: 1 },
      );
    });
  });

  it("muestra error cuando falla la carga de agenda del profesor", async () => {
    profesoresService.getAll.mockResolvedValue([
      {
        id: "prof-2",
        activo: true,
        usuario: { nombre: "Profesor Dos" },
      },
    ]);
    profesoresService.getAdminAgenda.mockRejectedValue({
      response: {
        data: {
          message: "No se pudo recuperar la agenda semanal",
        },
      },
    });

    render(<Agendas />);

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo recuperar la agenda semanal"),
      ).toBeInTheDocument();
    });
  });
});
