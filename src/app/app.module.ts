import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';  // Cambiado
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Cambiado
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  // Cambiado
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalEditarUsuarioPage } from './modal-editar-usuario/modal-editar-usuario.page';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: "AIzaSyADc9LY71lB_IOyqGD7Y2T7OD3DvDl_F6U",
  authDomain: "solarsolutions-88af9.firebaseapp.com",
  projectId: "solarsolutions-88af9",
  storageBucket: "solarsolutions-88af9.appspot.com",
  messagingSenderId: "628083495906",
  appId: "1:628083495906:web:8280a70587bd537d8e5fbb",
  measurementId: "G-H192YCEFM7"
};

@NgModule({
  declarations: [AppComponent],  // No incluir ModalEditarUsuarioPage aquí
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp({
      "projectId":"solarsolutions-88af9",
      "appId":"1:628083495906:web:8280a70587bd537d8e5fbb",
      "storageBucket":"solarsolutions-88af9.appspot.com",
      "apiKey":"AIzaSyADc9LY71lB_IOyqGD7Y2T7OD3DvDl_F6U",
      "authDomain":"solarsolutions-88af9.firebaseapp.com",
      "messagingSenderId":"628083495906",
      "measurementId":"G-H192YCEFM7"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFirebaseApp(() => initializeApp({"projectId":"solarsolutions-88af9","appId":"1:628083495906:web:8280a70587bd537d8e5fbb","storageBucket":"solarsolutions-88af9.appspot.com","apiKey":"AIzaSyADc9LY71lB_IOyqGD7Y2T7OD3DvDl_F6U","authDomain":"solarsolutions-88af9.firebaseapp.com","messagingSenderId":"628083495906","measurementId":"G-H192YCEFM7"})),
  ],
  providers: [[AuthService], { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

