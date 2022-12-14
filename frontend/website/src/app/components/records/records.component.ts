import {Component, OnInit} from '@angular/core';
import {MediaxService} from "../../services/mediax.service";
import {Mediax} from "../../interfaces/Mediax";
import * as $ from 'jquery';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  hoveredDate: NgbDate | null = null;
  // @ts-ignore
  fromDate: NgbDate | null;
  // @ts-ignore
  toDate: NgbDate | null;
  fromTime = {hour: 0, minute: 0};
  toTime = {hour: 23, minute: 59};

  closeResult = '';

  safeUrl: SafeResourceUrl | undefined;
  currentmx: Mediax = {} as Mediax;

  p: number = 1;

  constructor(public mediaxServ: MediaxService,
              public authServ: AuthService,
              private router: Router,
              private modalService: NgbModal,
              private _sanitizer: DomSanitizer,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private activatedRouter: ActivatedRoute) {
  }

  listOfMediax: Mediax[] = [];
  mediaFilter = 0;
  monthFilter = 1;
  timeFilter = 0;

  favorites = false;
  videos = true;
  images = true;
  deviceId = ""
  
  ngOnInit(): void {
    this.getAllMedia();
    this.resetFilter();
    this.deviceId = this.activatedRouter.snapshot.paramMap.get('deviceId')!;
    console.log("Device Id:", this.deviceId)
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  resetFilter() {
    // @ts-ignore
    this.fromDate = null;
    // @ts-ignore
    this.toDate = null;
    this.fromTime = {hour: 0, minute: 0};
    this.toTime = {hour: 23, minute: 59};
    this.favorites = false;
    this.videos = true;
    this.images = true;
    this.p = 1;
    this.getAllMedia();
  }

  startFilter() {
    this.p = 1;

    let fromDate: Date = new Date(Number(this.fromDate?.year), Number(this.fromDate?.month) - 1, this.fromDate?.day);
    let toDate: Date = new Date(Number(this.toDate?.year), Number(this.toDate?.month) - 1, this.toDate?.day);

    this.mediaxServ.getUserMediax(this.activatedRouter.snapshot.paramMap.get('deviceId')!).subscribe((data: Mediax[]) => {

      // search with no data paramaters set (default settings like when you first visit the page)
      if (this.fromDate == null && this.toDate == null) {
        fromDate = new Date(1000, 5, 5);
        toDate = new Date(3000, 5, 5);
      }

      // search within 2 different dates
      if (this.fromDate != null) {
        if (this.toDate == null) {
          toDate = fromDate;
        }
      }

      let listOfMediaxTemp1 = data;
      console.log(listOfMediaxTemp1)
      let listOfMediaxTemp2: Mediax[] = [];
      let listOfMediaxFavoritesTemp3: Mediax[] = [];

      for (let i = 0; i < listOfMediaxTemp1.length; i++) {

        // get Media time for comparison
        let firstSlash = listOfMediaxTemp1[i].timestamp.indexOf("/");
        let secondSlash = listOfMediaxTemp1[i].timestamp.indexOf("/", firstSlash + 1);
        let comma = listOfMediaxTemp1[i].timestamp.indexOf(",");
        let firstColon = listOfMediaxTemp1[i].timestamp.indexOf(":");
        let secondColon = listOfMediaxTemp1[i].timestamp.indexOf(":", firstColon + 1);
        let mediaDay = parseInt(listOfMediaxTemp1[i].timestamp.substring(firstSlash + 1, secondSlash));
        let mediaMonth = parseInt(listOfMediaxTemp1[i].timestamp.substring(0, firstSlash));
        let mediaYear = parseInt(listOfMediaxTemp1[i].timestamp.substring(secondSlash + 1, secondSlash + 5));
        let mediaHour = parseInt(listOfMediaxTemp1[i].timestamp.substring(comma + 2, firstColon));
        let mediaMinute = parseInt(listOfMediaxTemp1[i].timestamp.substring(firstColon + 1, secondColon));
        let mediaSecond = parseInt(listOfMediaxTemp1[i].timestamp.substring(secondColon + 1, secondColon + 3));
        if (listOfMediaxTemp1[i].timestamp.slice(-2) === "PM" && mediaHour < 12) {
          mediaHour = mediaHour + 12
        }
        if (listOfMediaxTemp1[i].timestamp.slice(-2) === "AM") {
          if (mediaHour == 12) {
            mediaHour = 0;
          }
        }
        // @ts-ignore
        let mediaDate: Date = new Date(Number(mediaYear), Number(mediaMonth) - 1, mediaDay);

        // compare dates/times for filtering
        if (mediaDate.getTime() >= fromDate.getTime() && mediaDate.getTime() <= toDate.getTime()) {
          if ((this.fromTime.hour * 60 + this.fromTime.minute) <= (mediaHour * 60 + mediaMinute) && (this.toTime.hour * 60 + this.toTime.minute) >= (mediaHour * 60 + mediaMinute)) {
            listOfMediaxTemp2.push(listOfMediaxTemp1[i])

            if (!this.videos) {
              if (listOfMediaxTemp1[i].isvideo) {
                listOfMediaxTemp2.pop()
              }
            }
            if (!this.images) {
              if (!listOfMediaxTemp1[i].isvideo) {
                listOfMediaxTemp2.pop()
              }
            }
          }
        }
      }

      for (let i = 0; i < listOfMediaxTemp2.length; i++) {
        if (this.favorites) {
          if (listOfMediaxTemp2[i].isfavorite) {
            listOfMediaxFavoritesTemp3.push(listOfMediaxTemp2[i])
          }
        }
      }

      if (this.favorites) {
        this.listOfMediax = listOfMediaxFavoritesTemp3;
      } else {
        this.listOfMediax = listOfMediaxTemp2;
      }
      this.listOfMediax.reverse()
    });
  }

  downloadVideo(url:string) {
    window.location.href = url;
  }
  updateFavorite(mx: Mediax) {
    mx.isfavorite = !mx.isfavorite;
    this.mediaxServ.editMediax(mx);
    // alert("Favorite Setting Changed Successfully!!");

    // this.startFilter()
  }

  updateShared(mx: Mediax, mediaData: any) {
    mx.shared = !mx.shared;
    mx.title = mediaData.value.title;
    mx.category = this.selectedCategory
    this.mediaxServ.toggleSharedMedia(mx).subscribe((data) => {
      this.getAllMediaChronological();
    })
    this.titlePlaceholder = "Enter Title...";
    this.categoryPlaceholder = "Choose a Category";
  }

  unshareMedia(mx: Mediax) {
    mx.shared = !mx.shared;
    this.mediaxServ.toggleSharedMedia(mx).subscribe((data) => {
      this.getAllMediaChronological();
    })
  }

  // get media in reserve chronological order
  getAllMedia() {
    this.mediaxServ.getUserMediax(this.activatedRouter.snapshot.paramMap.get('deviceId')!).subscribe((data: Mediax[]) => {
      this.listOfMediax = data;
      this.listOfMediax.reverse()
      console.log(this.listOfMediax)
    });
  }

  // get media in chronological order
  getAllMediaChronological() {
      this.startFilter()
  }

  deleteMediax(mediaxDelete: Mediax) {
    this.mediaxServ.deleteMediax(mediaxDelete);
    this.getAllMedia()
  }

  rename(mx: Mediax) {
    let newname = prompt("New file name:");
    mx.filename = newname || mx.filename;
    this.editMediax(mx);
  }

  dowload(mxdto: Mediax) {
    // let url = window.URL.createObjectURL(mxdto.url||"#");
    // let a = document.createElement('a');
    // document.body.appendChild(a);
    // a.setAttribute('style', 'display: none');
    // a.href = url;
    // a.download = mxdto.filename;
    // a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
  }

  open(imagemodal: any, mxdto: Mediax) {
    this.currentmx = mxdto;
    this.titlePlaceholder = this.currentmx.title!
    this.categoryPlaceholder = this.currentmx.category!
    this.modalService.open(imagemodal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  openvideomodal(videomodal: any, mxdto: Mediax) {
    this.currentmx = mxdto;
    this.titlePlaceholder = this.currentmx.title!
    this.categoryPlaceholder = this.currentmx.category!
    this.modalService.open(videomodal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openShareModal(sharemodal: any, mxdto: Mediax) {
    this.currentmx = mxdto;
    // this.titlePlaceholder = this.currentmx.title!
    // this.categoryPlaceholder = this.currentmx.category!
    this.modalService.open(sharemodal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  titlePlaceholder = "Enter Title...";
  categoryPlaceholder = "Choose a Category";
  selectedCategory = ""

  setCategory(category: string) {
    this.categoryPlaceholder = category
    this.selectedCategory = category
  }

  clearTitle() {
    this.titlePlaceholder = ""
  }

  clearCategory() {
    this.categoryPlaceholder = ""
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editMediax(mx: Mediax) {
    this.mediaxServ.editMediax(mx);
  }

  showhide(mxdto: Mediax, i: number) {

    let elem = $("#img" + i);

    console.log($("#img" + i).is(":hidden"));


    if (elem.css("visibility") == "hidden") {
      elem.css("visibility", "visible");
    } else {
      elem.css("visibility", "hidden");
    }


  }
}
