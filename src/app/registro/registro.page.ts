// registro.page.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  formularioRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async registrarUsuario() {
    if (this.formularioRegistro.valid) {
      const usuario = this.formularioRegistro.value;

      // Verificar que las contraseñas coincidan
      if (usuario.password === usuario.confirmPassword) {
        this.authService.registrarUsuario(usuario);
  
        const alert = await this.alertController.create({
          header: 'REGISTRO:',
          message: 'Tu usuario ha sido creado exitosamente.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }
          ]
        });
  
        await alert.present();
      } else {
        console.log('Las contraseñas no coinciden.');
      }
    }
  }
}
