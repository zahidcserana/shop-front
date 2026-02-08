import { CustomerService } from './../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from '../models/user.model';
import { ModalService } from 'src/app/common/_modal';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  editForm = false;
  baseUrl = environment.api_url

  customerList: any[] = [];
  sub: Subscription;
  customer_id: number;
  customerInfo: Customer = new Customer();
  documentList: any[] = [];
  documentCustomer: any;
  documentType = '';
  documentFiles: File[] = [];
  isUploadingDocuments = false;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.sub = this.route.data.subscribe(
      val => {
        this.customerList = val && val['customers'] ? val['customers']['data'] : [];
      }
    );

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      mobile: [''],
      address: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  openModal(modal: string) {
    this.modalService.open(modal);
  }

  openDocumentModal(customer: any) {
    this.documentCustomer = customer;
    this.documentType = '';
    this.documentFiles = [];
    this.documentList = [];
    if (customer && customer.id) {
      this.customerService.listDocuments(customer.id).subscribe((res) => {
        this.documentList = res || [];
      });
    }
    this.modalService.open('documents-modal');
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  getFileUrl(path: string) {
    return this.sanitizer.bypassSecurityTrustUrl(
      this.baseUrl + path
    );
  }

  remove(id) {
    this.customerService
      .deleteCustomer(id)
      .subscribe(res => {
        if (res.success === true) {
          this.getCustomerList();
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

  getCustomerList() {
    this.customerService.getCustomers()
      .subscribe((res) => {
        this.customerList = res.data;
      });
  }

  submit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.customerService.addCustomer(this.registerForm.value).then(
      res => {
        if (res.status === true) {
          this.modalService.close('create-modal');
          this.registerForm.reset();
          $('#myForm').trigger('reset');
          Swal.fire({
            position: "center",
            type: "success",
            title: "Customer successfully added.",
            showConfirmButton: false,
            timer: 1500
          });
          this.getCustomerList();
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Please check the customer details."
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

  editCustomer(id) {
    const customer = this.customerList.find(element => element.id === id);
    if (!customer) {
      return;
    }
    this.customer_id = customer.id;
    this.customerInfo.name = customer.name;
    this.customerInfo.email = customer.email;
    this.customerInfo.mobile = customer.mobile;
    this.customerInfo.address = customer.address;
    this.customerInfo.status = customer.status;

    this.editForm = true;
    this.modalService.open('edit-modal');
  }

  closeForm() {
    $('#myForm').trigger('reset');
    this.editForm = false;
    this.modalService.close('edit-modal');
  }

  update() {
    this.customerService.editCustomer(this.customer_id, this.customerInfo).then(
      res => {
        if (res.status === true) {
          $('#myForm').trigger('reset');
          this.editForm = false;
          this.modalService.close('edit-modal');
          Swal.fire({
            position: "center",
            type: "success",
            title: "Customer successfully updated.",
            showConfirmButton: false,
            timer: 1500
          });

          this.getCustomerList();
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

  onDocumentFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files) {
      this.documentFiles = [];
      return;
    }
    this.documentFiles = Array.from(input.files);
  }

  uploadDocuments() {
    if (!this.documentCustomer || !this.documentCustomer.id) {
      return;
    }
    if (!this.documentType) {
      Swal.fire({
        type: "warning",
        title: "Document type is required.",
      });
      return;
    }
    if (!this.documentFiles.length) {
      Swal.fire({
        type: "warning",
        title: "Please select at least one file.",
      });
      return;
    }

    const payload = new FormData();
    payload.append('type', this.documentType);
    this.documentFiles.forEach((file) => {
      payload.append('files[]', file);
    });

    this.isUploadingDocuments = true;
    this.customerService.uploadDocuments(this.documentCustomer.id, payload).subscribe(
      (res) => {
        const uploaded = Array.isArray(res) ? res : [];
        this.documentList = [...uploaded, ...this.documentList];
        this.documentType = '';
        this.documentFiles = [];
        this.isUploadingDocuments = false;
        Swal.fire({
          position: "center",
          type: "success",
          title: "Documents uploaded.",
          showConfirmButton: false,
          timer: 1500
        });
      },
      () => {
        this.isUploadingDocuments = false;
        Swal.fire({
          type: "warning",
          title: "Upload failed.",
          text: "Something went wrong!"
        });
      }
    );
  }

  deleteDocument(document) {
    if (!this.documentCustomer || !this.documentCustomer.id) {
      return;
    }
    this.customerService.deleteDocument(this.documentCustomer.id, document.id).subscribe(() => {
      this.documentList = this.documentList.filter((item) => item.id !== document.id);
      Swal.fire({
        position: "center",
        type: "success",
        title: "Document deleted.",
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
}
