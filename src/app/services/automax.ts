import { Service, signal } from '@angular/core';
import { Categoria } from '../interfaces/categoria';
import { Vehiculo } from '../interfaces/vehiculo';
import { Promocion } from '../interfaces/promocion';
import { Resena } from '../interfaces/resena';

@Service()
export class Automax {
  private siguienteId = 5;

  private readonly categorias: Categoria[] = [
    { id: 'sedan', nombre: 'Sedanes' },
    { id: 'suv', nombre: 'SUV' },
    { id: 'camioneta', nombre: 'Camionetas' },
    { id: 'deportivo', nombre: 'Deportivos' }
  ];

  // Datos ficticios para la demostración académica.
  // Las fotografías son referenciales.
  private readonly vehiculos = signal<Vehiculo[]>([
    {
      id: 1,
      nombre: 'Sedán Urbano',
      imagen:
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
      precio: 65000,
      marca: 'Nova',
      modelo: 'City',
      anio: 2025,
      categoriaId: 'sedan',
      descripcion:
        'Una alternativa cómoda para los recorridos diarios y los viajes en familia.',
      caracteristicas: [
        'Transmisión automática',
        'Cinco asientos',
        'Aire acondicionado'
      ]
    },
    {
      id: 2,
      nombre: 'SUV Aventura',
      imagen:
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
      precio: 98000,
      marca: 'Atlas',
      modelo: 'Explorer',
      anio: 2026,
      categoriaId: 'suv',
      descripcion:
        'Espacio y comodidad para disfrutar de nuevos destinos.',
      caracteristicas: [
        'Cámara de retroceso',
        'Cinco asientos',
        'Amplia maletera'
      ]
    },
    {
      id: 3,
      nombre: 'Camioneta Trabajo',
      imagen:
        'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=900&q=80',
      precio: 112000,
      marca: 'Terra',
      modelo: 'Work',
      anio: 2025,
      categoriaId: 'camioneta',
      descripcion:
        'Una propuesta versátil para transportar equipos y realizar actividades diarias.',
      caracteristicas: [
        'Doble cabina',
        'Tracción 4x4',
        'Transmisión manual'
      ]
    },
    {
      id: 4,
      nombre: 'Deportivo Sport',
      imagen:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      precio: 185000,
      marca: 'Veloce',
      modelo: 'Sport',
      anio: 2026,
      categoriaId: 'deportivo',
      descripcion:
        'Diseño deportivo y una experiencia de conducción para los amantes de los autos.',
      caracteristicas: [
        'Transmisión automática',
        'Modo deportivo',
        'Asientos deportivos'
      ]
    }
  ]);

  private readonly promociones: Promocion[] = [
    {
      id: 1,
      vehiculoId: 1,
      titulo: 'Tu primer auto',
      descripcion: 'Descuento de demostración sobre el precio del catálogo.',
      descuentoPorcentaje: 5,
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31'
    },
    {
      id: 2,
      vehiculoId: 2,
      titulo: 'Viaja en familia',
      descripcion: 'Oferta de demostración para nuestra SUV Aventura.',
      descuentoPorcentaje: 8,
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31'
    }
  ];

  private readonly resenas: Resena[] = [
    {
      id: 1,
      vehiculoId: 1,
      cliente: 'Ana — cliente de ejemplo',
      comentario:
        'Me resultó sencillo revisar las características y comparar el precio.',
      valoracion: 5
    },
    {
      id: 2,
      vehiculoId: 2,
      cliente: 'Carlos — cliente de ejemplo',
      comentario:
        'La información del catálogo me ayudó a conocer las opciones para mi familia.',
      valoracion: 4
    },
    {
      id: 3,
      vehiculoId: 3,
      cliente: 'Lucía — cliente de ejemplo',
      comentario:
        'Encontré rápidamente la categoría de vehículo que estaba buscando.',
      valoracion: 5
    }
  ];

  guardar(datos: Omit<Vehiculo, 'id'>): Vehiculo {
    const nuevoVehiculo: Vehiculo = {
      ...datos,
      caracteristicas: [...datos.caracteristicas],
      id: this.siguienteId++
    };

    this.vehiculos.update((lista) => [...lista, nuevoVehiculo]);

    return nuevoVehiculo;
  }

  mostrar() {
    return this.vehiculos.asReadonly();
  }

  mostrarCategorias(): Categoria[] {
    return this.categorias.map((categoria) => ({ ...categoria }));
  }

  mostrarPromociones(): Promocion[] {
    return this.promociones.map((promocion) => ({ ...promocion }));
  }

  mostrarResenas(): Resena[] {
    return this.resenas.map((resena) => ({ ...resena }));
  }
}