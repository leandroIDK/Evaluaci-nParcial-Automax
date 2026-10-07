export interface Vehiculo {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  marca: string;
  modelo: string;
  anio: number;
  categoriaId: string;
  descripcion: string;
  caracteristicas: string[];
}

export interface VehiculoFormulario {
  nombre: string;
  imagen: string;
  precio: number;
  marca: string;
  modelo: string;
  anio: number;
  categoriaId: string;
  descripcion: string;
  caracteristicas: string;
}