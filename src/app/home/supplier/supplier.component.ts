import { element } from 'protractor';
import { SupplierService } from './../services/supplier.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScriptLoaderService } from 'src/app/common/script-loader.service';
import { Supplier } from '../models/user.model';
import { HomeService } from '../services/home.service';
import { ModalService } from 'src/app/common/_modal';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  editForm = false;

  supplierList: any[] = [];
  sub: Subscription;
  companyList: any[] = [];
  supplier_id: number;
  supplierInfo: Supplier = new Supplier();
  supplier: Supplier = new Supplier();

  constructor(
    private route: ActivatedRoute,
    private _script: ScriptLoaderService,
    private service: HomeService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {
  }

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      val => {
        this.supplierList = val && val['suppliers'] ? val['suppliers'] : [];
      }
    );


    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact_person: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  openModal(modal: string) {
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  remove(id) {
    this.supplierService
      .deleteSupplier(id)
      .subscribe(res => {
        if (res.success === true) {
          this.supplierList = res.data;
          Swal.fire({
            position: "center",
            type: "success",
            title: "Done",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
  }

  submit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.supplierService.addSupplier(this.registerForm.value).then(
      res => {
        if (res.success === true) {
          this.modalService.close('supplier-modal');
          $('#myForm').trigger('reset');
          Swal.fire({
            position: "center",
            type: "success",
            title: "Supplier successfully added.",
            showConfirmButton: false,
            timer: 1500
          });

          this.supplierList = res.data;
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Please select a company."
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }

  editSupplier(id) {
    console.log(id);
    const supplier = this.supplierList.find(element => element.id === id);
    console.log(supplier);
    this.supplier_id = supplier.id;
    this.supplierInfo.name = supplier.name;
    this.supplierInfo.email = supplier.email;
    this.supplierInfo.mobile = supplier.mobile;
    this.supplierInfo.address = supplier.address;
    this.supplierInfo.contact_person = supplier.contact_person;
    this.supplierInfo.status = supplier.status;

    this.editForm = true;
    this.modalService.open('edit-modal');
  }

  closeForm() {
    $('#myForm').trigger('reset');
    this.editForm = false;
    this.modalService.close('edit-modal');
  }

  update() {
    this.supplierService.editSupplier(this.supplier_id, this.supplierInfo).then(
      res => {
        if (res.success === true) {
          $('#myForm').trigger('reset');
          this.editForm = false;
          this.modalService.close('edit-modal');
          Swal.fire({
            position: "center",
            type: "success",
            title: "Supplier successfully updated.",
            showConfirmButton: false,
            timer: 1500
          });

          this.supplierList = res.data;
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Something went wrong!"
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }

  trackList(index, pro) {
    return pro ? pro.id : null;
  }
}
