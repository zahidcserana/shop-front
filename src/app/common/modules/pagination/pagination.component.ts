import {Component, AfterViewInit, Input, HostListener, Output, EventEmitter, OnChanges} from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'boot-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements AfterViewInit, OnChanges {

    maxSize: number;
    start: number = 0;
    end: number = 0;
    @Input('itemList') itemList = true;
    @Input('page') page: number;
    @Input('pagelimit') pagelimit: number;
    @Input('options') options: number[];
    @Input('totalSize') collectionSize: number;
    @Input('listSize') listSize: number;
    @Input('color') color: string;
    @Output('pageChange') pageChange: EventEmitter<any> = new EventEmitter();

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.maxPageSize();
    }


    constructor() {
        this.maxPageSize();
        if (!this.options) {
            this.options = [10, 20, 30, 50, 100, 500, 1000];
        }
        if (!this.pagelimit) {
            this.pagelimit = 100;
        }
        if (!this.page) {
            this.page = 1;
        }
    }

    ngOnChanges() {
        this.calculateDataCount();
    }

    ngAfterViewInit() {
        let rong = this.color ? this.color : '#041531';
        $('.styled-select select').hover(function() {
            $(this).css('background-color', rong);
            $(this).css('color', '#fff');
            $('.styled-select').css('background-color', rong);
            $('.styled-select').css('color', '#fff');
        }, function() {
            $(this).css('background-color', '#ebe9f2');
            $(this).css('color', '#3f4047');
            $('.styled-select').css('background-color', '#ebe9f2');
            $('.styled-select').css('color', '#3f4047');
        });
        $('styled-select').hover(function() {
            $(this).css('background-color', rong);
            $(this).css('color', '#fff');
            $('.styled-select select').css('background-color', rong);
            $('.styled-select select').css('color', '#fff');
        }, function() {
            $(this).css('background-color', '#ebe9f2');
            $(this).css('color', '#3f4047');
            $('.styled-select select').css('background-color', '#ebe9f2');
            $('.styled-select select').css('color', '#3f4047');
            ;
        });
    }

    maxPageSize() {
        let w = $(window).width();
        if (w > 767) {
            this.maxSize = 5;
        } else {
            this.maxSize = 3;
        }
    }


    changePage(page?) {
        if (page) {
            this.page = page;
        }
        this.calculateDataCount();
        this.pageChange.emit({page: this.page, limit: +this.pagelimit, start: this.start});

    }

    calculateDataCount() {
        this.start = (this.page * this.pagelimit) - this.pagelimit + 1;
        let last = this.start + this.listSize - 1;
        // console.log(this.start,this.listSize,last,this.collectionSize)
        this.end = (last > this.collectionSize) ? this.collectionSize : last;
    }

}
