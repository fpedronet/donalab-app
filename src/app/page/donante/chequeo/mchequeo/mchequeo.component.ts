import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Combobox } from 'src/app/_model/combobox';
import { ChequeoFisico } from 'src/app/_model/donante/chequeofisico';

@Component({
  selector: 'app-mchequeo',
  templateUrl: './mchequeo.component.html',
  styleUrls: ['./mchequeo.component.css']
})
export class MchequeoComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];

  detalleChequeo: ChequeoFisico = new ChequeoFisico();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MchequeoComponent>,
  ) {
    //debugger;
    if(this.data.detalleChequeo !== undefined)
      this.detalleChequeo = this.data.detalleChequeo;

    if(this.data.listaTipoExtraccion !== undefined)
      this.listaTipoExtraccion = this.data.listaTipoExtraccion;
    if(this.data.listaLesionesPuncion !== undefined)
      this.listaLesionesPuncion = this.data.listaLesionesPuncion;
    if(this.data.listaGrupoSanguineo !== undefined)
      this.listaGrupoSanguineo = this.data.listaGrupoSanguineo;
    if(this.data.listaAspectoVenoso !== undefined)
      this.listaAspectoVenoso = this.data.listaAspectoVenoso;
  }

  ngOnInit(): void {
    this.inicializar();
    this.obtener();
  }

  inicializar(){
    this.form = new FormGroup({
      'pesoDonacion': new FormControl({ value: 'No definido', disabled: true}),
      'hemoglobina': new FormControl({ value: 'No definido', disabled: true}),
      'tallaDonacion': new FormControl({ value: 'No definido', disabled: true}),
      'hematocrito': new FormControl({ value: 'No definido', disabled: true}),
      'tipoExtraccion': new FormControl({ value: 'No definido', disabled: true}),
      'ideGrupo': new FormControl({ value: 'No seleccionado', disabled: true}),
      'estadoVenoso': new FormControl({ value: 'No seleccionado', disabled: true}),
      'lesionesVenas': new FormControl({ value: 'No seleccionado', disabled: true})
    });

    var des = new Combobox();
    des.codigo = 'No seleccionado';
    des.descripcion = 'No seleccionado';

    this.listaTipoExtraccion?.push(des);
    this.listaLesionesPuncion?.push(des);
    this.listaGrupoSanguineo?.push(des);
    this.listaAspectoVenoso?.push(des);
  }

  obtener(){
    var d = this.detalleChequeo;

    if(d.pesoDonacion !== null)
      this.form.patchValue({
        pesoDonacion: d.pesoDonacion
      });
    if(d.hemoglobina !== null)
      this.form.patchValue({
        hemoglobina: d.hemoglobina
      });
    if(d.tallaDonacion !== null)
      this.form.patchValue({
        tallaDonacion: d.tallaDonacion
      });
    if(d.hematocrito !== null)
      this.form.patchValue({
        hematocrito: d.hematocrito
      });
    if(d.tipoExtraccion !== null)
      this.form.patchValue({
        tipoExtraccion: d.tipoExtraccion
      });
    if(d.ideGrupo !== null)
      this.form.patchValue({
        ideGrupo: d.ideGrupo
      });
    if(d.estadoVenoso !== null)
      this.form.patchValue({
        estadoVenoso: d.estadoVenoso
      });
    if(d.lesionesVenas !== null)
      this.form.patchValue({
        lesionesVenas: d.lesionesVenas
      });
  }

  closeModal(){
    this.dialogRef.close();
  }

}
