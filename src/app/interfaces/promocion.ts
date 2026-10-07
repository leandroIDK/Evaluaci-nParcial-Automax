export interface Promocion {
  id: number;
  vehiculoId: number;
  titulo: string;
  descripcion: string;
  descuentoPorcentaje: number;
  fechaInicio: string;
  fechaFin: string;
}