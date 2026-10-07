import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import {
  form,
  required,
  min,
  max,
  pattern,
  FormField
} from '@angular/forms/signals';

import { Automax } from '../../services/automax';

import {
  Vehiculo,
  VehiculoFormulario
} from '../../interfaces/vehiculo';

import { Promocion } from '../../interfaces/promocion';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormField, CurrencyPipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  private readonly automax = inject(Automax);

  readonly vehiculos = this.automax.mostrar();
  readonly categorias = this.automax.mostrarCategorias();
  readonly resenas = this.automax.mostrarResenas();

  readonly anioMaximo = new Date().getFullYear() + 1;

  readonly categoriaSeleccionada = signal('');
  readonly intentoGuardar = signal(false);
  readonly procesando = signal(false);

  readonly modelo = signal<VehiculoFormulario>(
    this.crearFormularioVacio()
  );

  readonly formulario = form(this.modelo, (campo) => {
    required(campo.nombre, {
      message: 'El nombre es obligatorio.'
    });

    pattern(campo.nombre, /\S/, {
      message: 'El nombre no puede contener solo espacios.'
    });

    required(campo.imagen, {
      message: 'La URL de la imagen es obligatoria.'
    });

    pattern(campo.imagen, /^https:\/\/[^\s]+$/i, {
      message: 'La imagen debe tener una URL HTTPS sin espacios.'
    });

    required(campo.precio, {
      message: 'El precio es obligatorio.'
    });

    min(campo.precio, 0.01, {
      message: 'El precio debe ser mayor que cero.'
    });

    required(campo.marca, {
      message: 'La marca es obligatoria.'
    });

    pattern(campo.marca, /\S/, {
      message: 'La marca no puede contener solo espacios.'
    });

    required(campo.modelo, {
      message: 'El modelo es obligatorio.'
    });

    pattern(campo.modelo, /\S/, {
      message: 'El modelo no puede contener solo espacios.'
    });

    required(campo.anio, {
      message: 'El año es obligatorio.'
    });

    min(campo.anio, 1900, {
      message: 'El año mínimo es 1900.'
    });

    max(campo.anio, this.anioMaximo, {
      message: `El año máximo es ${this.anioMaximo}.`
    });

    required(campo.categoriaId, {
      message: 'Selecciona una categoría.'
    });

    required(campo.descripcion, {
      message: 'La descripción es obligatoria.'
    });

    pattern(campo.descripcion, /\S/, {
      message: 'La descripción no puede contener solo espacios.'
    });

    required(campo.caracteristicas, {
      message: 'Ingresa al menos una característica.'
    });

    pattern(campo.caracteristicas, /[^,\s]/, {
      message: 'Escribe características, no solo comas o espacios.'
    });
  });

  readonly vehiculosFiltrados = computed(() => {
    const categoriaId = this.categoriaSeleccionada();

    if (!categoriaId) {
      return this.vehiculos();
    }

    return this.vehiculos().filter(
      (vehiculo) => vehiculo.categoriaId === categoriaId
    );
  });

  // Las fechas se comparan en formato YYYY-MM-DD.
  readonly promocionesVigentes = this.automax
    .mostrarPromociones()
    .filter((promocion) => {
      const hoy = new Date().toISOString().slice(0, 10);

      return (
        promocion.fechaInicio <= hoy &&
        promocion.fechaFin >= hoy
      );
    });

  readonly promedioValoraciones =
    this.resenas.length === 0
      ? '0.0'
      : (
          this.resenas.reduce(
            (total, resena) => total + resena.valoracion,
            0
          ) / this.resenas.length
        ).toFixed(1);

  private crearFormularioVacio(): VehiculoFormulario {
    return {
      nombre: '',
      imagen: '',
      precio: 0,
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      categoriaId: '',
      descripcion: '',
      caracteristicas: ''
    };
  }

  filtrarCategoria(categoriaId: string): void {
    this.categoriaSeleccionada.set(categoriaId);
  }

  nombreCategoria(categoriaId: string): string {
    return (
      this.categorias.find(
        (categoria) => categoria.id === categoriaId
      )?.nombre ?? 'Sin categoría'
    );
  }

  buscarVehiculo(id: number): Vehiculo | undefined {
    return this.vehiculos().find(
      (vehiculo) => vehiculo.id === id
    );
  }

  precioPromocional(promocion: Promocion): number {
    const vehiculo = this.buscarVehiculo(promocion.vehiculoId);

    if (!vehiculo) {
      return 0;
    }

    return (
      vehiculo.precio *
      (1 - promocion.descuentoPorcentaje / 100)
    );
  }

  estrellas(valoracion: number): string {
    const cantidad = Math.max(
      0,
      Math.min(5, Math.round(valoracion))
    );

    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }

  imagenNoDisponible(evento: Event): void {
    const imagen = evento.target as HTMLImageElement;

    // Evita repetir el cambio si también falla el recurso de respaldo.
    if (imagen.dataset['respaldo'] === 'true') {
      return;
    }

    imagen.dataset['respaldo'] = 'true';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="800" height="450" viewBox="0 0 800 450">
        <rect width="800" height="450" fill="#e9eef5"/>
        <text x="400" y="215" text-anchor="middle"
              font-family="Arial" font-size="38" fill="#14243b">
          AutoMax
        </text>
        <text x="400" y="265" text-anchor="middle"
              font-family="Arial" font-size="22" fill="#526176">
          Imagen no disponible
        </text>
      </svg>
    `;

    imagen.src =
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg);
  }

  async verDetalles(vehiculo: Vehiculo): Promise<void> {
    // Se importa al pulsar el botón, en el navegador.
    // Esto evita ejecutar SweetAlert2 durante el SSR.
    const { default: Swal } = await import('sweetalert2');

    await Swal.fire({
      title: vehiculo.nombre,
      text:
        `${vehiculo.descripcion} ` +
        `Características: ${vehiculo.caracteristicas.join(', ')}. ` +
        `Marca: ${vehiculo.marca}. Modelo: ${vehiculo.modelo}. ` +
        `Año: ${vehiculo.anio}.`,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2457e6'
    });
  }

  limpiarFormulario(): void {
    this.formulario().reset(this.crearFormularioVacio());
    this.intentoGuardar.set(false);
  }

  async guardar(evento: Event): Promise<void> {
    evento.preventDefault();

    if (this.procesando()) {
      return;
    }

    this.procesando.set(true);
    this.intentoGuardar.set(true);

    try {
      const { default: Swal } = await import('sweetalert2');

      if (this.formulario().invalid()) {
        await Swal.fire({
          title: 'Revisa los datos',
          text: 'Completa los campos y corrige los errores indicados.',
          icon: 'warning',
          confirmButtonText: 'Revisar',
          confirmButtonColor: '#2457e6'
        });

        return;
      }

      const datos = this.modelo();

      if (
        !Number.isFinite(datos.precio) ||
        datos.precio <= 0 ||
        !Number.isInteger(datos.anio) ||
        datos.anio < 1900 ||
        datos.anio > this.anioMaximo
      ) {
        await Swal.fire({
          title: 'Precio o año incorrecto',
          text:
            'Ingresa un precio mayor que cero y un año entero ' +
            `entre 1900 y ${this.anioMaximo}.`,
          icon: 'warning',
          confirmButtonText: 'Corregir'
        });

        return;
      }

      const categoriaValida = this.categorias.some(
        (categoria) => categoria.id === datos.categoriaId
      );

      if (!categoriaValida) {
        await Swal.fire({
          title: 'Categoría incorrecta',
          text: 'Selecciona una categoría de la lista.',
          icon: 'warning',
          confirmButtonText: 'Corregir'
        });

        return;
      }

      let imagenUrl: URL;

      try {
        imagenUrl = new URL(datos.imagen.trim());

        if (imagenUrl.protocol !== 'https:') {
          throw new Error('Se requiere HTTPS.');
        }
      } catch {
        await Swal.fire({
          title: 'URL incorrecta',
          text: 'Ingresa una dirección HTTPS válida para la imagen.',
          icon: 'warning',
          confirmButtonText: 'Corregir'
        });

        return;
      }

      const caracteristicas = datos.caracteristicas
        .split(',')
        .map((caracteristica) => caracteristica.trim())
        .filter((caracteristica) => caracteristica.length > 0);

      const nuevoVehiculo = this.automax.guardar({
        nombre: datos.nombre.trim(),
        imagen: imagenUrl.href,
        precio: Math.round(datos.precio * 100) / 100,
        marca: datos.marca.trim(),
        modelo: datos.modelo.trim(),
        anio: datos.anio,
        categoriaId: datos.categoriaId,
        descripcion: datos.descripcion.trim(),
        caracteristicas
      });

      this.categoriaSeleccionada.set('');
      this.limpiarFormulario();

      await Swal.fire({
        title: 'Vehículo registrado',
        text:
          `${nuevoVehiculo.nombre} ya aparece en el catálogo. ` +
          'El registro se conserva hasta recargar la página.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#2457e6'
      });
    } finally {
      this.procesando.set(false);
    }
  }
}
