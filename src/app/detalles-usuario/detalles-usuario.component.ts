import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalles-usuario',
  templateUrl: './detalles-usuario.component.html',
  styleUrls: ['./detalles-usuario.component.scss'],
})
export class DetallesUsuarioComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const usuarioId = this.obtenerIdUsuario(params);  // Llama a la función con los parámetros necesarios
      // Realiza las operaciones necesarias con el usuarioId
    });
  }

  obtenerIdUsuario(params: any): string {
    // Implementa la lógica para obtener el id del usuario a partir de los parámetros
    // Por ejemplo, si el id está en params['id'], puedes devolverlo
    return params['id'];
  }
}

