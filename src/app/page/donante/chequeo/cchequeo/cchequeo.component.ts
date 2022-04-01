import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cchequeo',
  templateUrl: './cchequeo.component.html',
  styleUrls: ['./cchequeo.component.css']
})
export class CchequeoComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '#######', disabled: true}),
      'IdePersona': new FormControl({ value: 0, disabled: false}),
      'TipDocu': new FormControl({ value: '1', disabled: false}),
      'NumDocu': new FormControl({ value: '', disabled: false}),
      'apPaterno': new FormControl({ value: '', disabled: false}),
      'apMaterno': new FormControl({ value: '', disabled: false}),
      'nombres': new FormControl({ value: '', disabled: false}),
      'Sexo': new FormControl({ value: '', disabled: false}),
      'FecNacimiento': new FormControl({ value: null, disabled: false}),
      'CodPais': new FormControl({ value: '', disabled: false}),
      'Celular': new FormControl({ value: '', disabled: false}),
      'Telefono': new FormControl({ value: '', disabled: false}),
      'Correo': new FormControl({ value: '', disabled: false}),
      'IdeOrigen': new FormControl({ value: '', disabled: false}),
      'IdeCampania': new FormControl({ value: '', disabled: false}),
      'Fecha': new FormControl({ value: new Date(), disabled: false}),
    });
  }

  guardar(){

  }
}
