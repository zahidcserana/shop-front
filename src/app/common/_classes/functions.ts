import * as $ from 'jquery';
export function chcekPassowrd(pass, conf) {
  if (pass === conf) return false;
  return true;
}

export function changeUser(prop, name) {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    user[prop] = name;
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    user = JSON.parse(sessionStorage.getItem("currentUser"));
    user[prop] = name;
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }
}

export function switchLocalToSession() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    localStorage.removeItem("currentUser");
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }
}

export function GET_USER() {
  return JSON.parse(
    localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
  );
}

export function GET_STORE_ID() {
  return GET_USER().store_id;
}

export function GET_STORE_ID_GEUST() {
  return localStorage.getItem("storeID") || 24;
}

export function FORMAT_DATE_TIME(date) {
  let d = new Date(date);
  let y = d.getFullYear();
  let m = (d.getMonth() + 1).toLocaleString();
  let day = d.getDate().toLocaleString();
  let h = d.getHours().toLocaleString();
  let min = d.getMinutes().toLocaleString();

  return (
    (day.length > 1 ? day : "0" + day) +
    "-" +
    (m.length > 1 ? m : "0" + m) +
    "-" +
    y +
    " " +
    (h.length > 1 ? h : "0" + h) +
    ":" +
    (min.length > 1 ? min : "0" + min)
  );
}

export function Format_Year_Month_date(date) {
  let d = new Date(date);
  let y = d.getFullYear();
  let m = (d.getMonth() + 1).toLocaleString();
  let day = d.getDate().toLocaleString();
  let h = d.getHours().toLocaleString();
  let min = d.getMinutes().toLocaleString();

  return (
    y +
    "-" +
    (m.length > 1 ? m : "0" + m) +
    "-" +
    (day.length > 1 ? day : "0" + day) +
    " " +
    (h.length > 1 ? h : "0" + h) +
    ":" +
    (min.length > 1 ? min : "0" + min)
  );
}

export function convertUTCtoLocal(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
}

export function FORMAT_DATE(date) {
  let d = new Date(date);
  let y = d.getFullYear();
  let m = (d.getMonth() + 1).toLocaleString();
  let day = d.getDate().toLocaleString();

  return (
    y +
    "-" +
    (m.length > 1 ? m : "0" + m) +
    "-" +
    (day.length > 1 ? day : "0" + day)
  );
}

export function FORMAT_DATE_TIME_PRO(date) {
  let d = new Date(date);
  let y = d.getFullYear();
  let m = (d.getMonth() + 1).toLocaleString();
  let day = d.getDate().toLocaleString();
  let h = d.getHours().toLocaleString();
  let min = d.getMinutes().toLocaleString();
  let ampm = "AM";

  if (parseInt(h) > 12) {
    h = (parseInt(h) - 12).toLocaleString();
    ampm = " PM";
  }

  return (
    (day.length > 1 ? day : "0" + day) +
    "/" +
    (m.length > 1 ? m : "0" + m) +
    "/" +
    y +
    ", " +
    (h.length > 1 ? h : "0" + h) +
    ":" +
    (min.length > 1 ? min : "0" + min) +
    ampm
  );
}

export function GETTIME(d?) {
  const now = d ? new Date(d) : new Date();
  const h = now.getHours();
  const hour = ("0" + (h > 12 ? h - 12 : h)).slice(-2);
  const min = ("0" + now.getMinutes()).slice(-2);
  return hour + ":" + min + ":00 " + (h > 12 ? "PM" : "AM");
}

export function calandarDateFormat(d?) {
  const now = d ? new Date(d) : new Date();
  const y = now.getFullYear();
  const m = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const h = now.getHours();
  const hour = ("0" + (h > 12 ? h - 12 : h)).slice(-2);
  const min = ("0" + now.getMinutes()).slice(-2);
  return (
    m + "/" + day + "/" + y + " " + hour + ":" + min + (h > 12 ? " PM" : " AM")
  );
}

export function FORMAT_SEARCH(param) {
  let filter = "";
  for (let k in param) {
    if (param[k] && param[k] != "" && param[k] != "null") {
      filter += "&" + k + "=" + param[k];
    }
  }
  return filter;
}

export function FORMATE_ATTR_VALUE(attribute) {
  if (attribute) {
    return attribute
      .map(data => {
        return data.name;
      })
      .join(", ");
  }
  return "";
}

export function calculatePage(page, limit, total) {
  const data = { page: page, limit: limit, change: true };
  const pn = Math.max(Math.ceil(total / limit), 1);
  if (page == pn) {
    const remain = total - (page - 1) * limit;
    if (remain < 2) {
      data.page = page - 1;
    }
    data.change = false;
    return data;
  }
  return data;
}

export function SORTING(id?, sort?) {
  if (id) {
    if (sort["order_by"] == id) {
      switch (sort["order"]) {
        case "asc":
          $(`#${id}`)
            .removeClass("la-arrow-up")
            .addClass("la-arrow-down");
          sort["order"] = "desc";
          break;
        case "desc":
          $(`#${id}`)
            .removeClass("la-arrow-down")
            .addClass("la-arrow-up");
          sort["order"] = "asc";
          break;
      }
    } else {
      $(".icon").css("display", "none");
      $(`#${id}`).css("display", "inline");
      sort["order_by"] = id;
      sort["order"] = "asc";
      $(`#${id}`)
        .removeClass("la-arrow-down")
        .addClass("la-arrow-up");
    }
  } else {
    $(".icon").css("display", "none");
  }
  return sort;
}

export function FORMATESORT(sort) {
  if (sort["order_by"]) {
    return `&order_by=${sort["order_by"]}&order=${sort["order"]}`;
  }
  return "";
}

export function FormateStatus(data) {
  return data
    .split(" ")
    .join("-")
    .toLowerCase();
}

export function FormatPrice(data) {
    // console.log(data)
    const prices = data[0];
    const price = { base: {}, rent: [] };
    if (prices.base.price > 0) {
        price.base["price"] = prices.price;
        price.base["rent_type"] = null;
        price.base["rent_duration"] = null;
        price.base["duration"] = null;
        price.base["id"] = prices.base.id;
    }
    if(prices.fixed){
        let rent = {};
        rent["price"] = prices.fixed.price;
        rent["duration"] = "";
        rent["rent_duration"] = 1;
        rent["rent_type"] = "";
        rent["id"] = prices.fixed.id;
        rent["serial"] = 1;
        rent['rent_start']=prices.fixed.rent_start;
        rent['rent_end']=prices.fixed.rent_end;
        //  console.log(rent ,  prices.fixed)
        price.rent.push(rent);
    }else {
        let serial=1;
        for(let c in prices){
            for(let i=0;i<prices[c].length;i++){
                let rent = {};
                rent["price"] = prices[c][i].price;
                rent["duration"] = prices[c][i].duration;
                rent["rent_duration"] = 1;
                rent["rent_type"] = prices[c][i].label;
                rent["serial"] = serial;
                rent["id"] = prices[c][i].id;
                rent['rent_start']=prices[c][i].rent_start;
                rent['rent_end']=prices[c][i].rent_end;
                serial++;
                price.rent.push(rent);
            }
        }
    }

    //   if (p.hourly_price > 0) {
    //     const rent = {};
    //     rent["price"] = p.hourly_price;
    //     rent["duration"] = p.hourly_duration ? p.hourly_duration : 1;
    //     rent["rent_duration"] = 1;
    //     rent["rent_type"] = "hourly";
    //     rent["serial"] = 1;
    //     price.rent.push(rent);
    //   }
    //  console.log(price.rent)

    //   if (p.hourly_price > 0) {
    //     const rent = {};
    //     rent["price"] = p.hourly_price;
    //     rent["duration"] = p.hourly_duration ? p.hourly_duration : 1;
    //     rent["rent_duration"] = 1;
    //     rent["rent_type"] = "hourly";
    //     rent["serial"] = 1;
    //     price.rent.push(rent);
    //   }
    //   if (p.daily_price > 0) {
    //     const rent = {};
    //     rent["price"] = p.daily_price;
    //     rent["duration"] = p.daily_duration ? p.daily_duration : 1;
    //     rent["rent_duration"] = 1;
    //     rent["rent_type"] = "daily";
    //     rent["serial"] = 2;
    //     price.rent.push(rent);
    //   }
    //   if (p.weekly_price > 0) {
    //     const rent = {};
    //     rent["price"] = p.weekly_price;
    //     rent["duration"] = p.weekly_duration ? p.weekly_duration : 1;
    //     rent["rent_duration"] = 1;
    //     rent["rent_type"] = "weekly";
    //     rent["serial"] = 3;
    //     price.rent.push(rent);
    //   }
    // }
    price.rent.sort((a, b) => {
        return a["serial"] - b["serial"];
    });

    return price;
}


export function FormateAttribute(data) {
  if (data && data.length > 0) {
    const att = [];
    for (let a of data) {
      att.push(a.attributes[0].id);
    }
    return att;
  }
  return [];
}

export function convertTime12to24(time12h) {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return hours + ":" + minutes;
}

export function iframe(id, iFram) {
  setTimeout(() => {
    let height = $("#" + id).outerHeight();
    let width = $("#" + id).outerWidth();
    const fram = `<iframe id="tokenframe" name="tokenframe" src="https://fts.cardconnect.com:8443/itoke/ajax-tokenizer.html?css=input{width:${width -
      30}px;height: ${height -
      12}px;padding: .375rem .75rem;font-size: 1rem;line-height: 1.5;border: 1px solid rgb(206, 212, 218);border-radius: 4px;box-shadow: none;outline:none;}" frameborder="0" scrolling="no" width="${width +
      6}" height="${height +
      12}" style="position:relative; left:-6px"></iframe>`;
    $(iFram + " iframe").remove();
    $(iFram).append(fram);
  }, 500);
}

export const monthsArray = [
  { text: "-Select Month-", value: null },
  { text: "01 January", value: "01" },
  { text: "02 February", value: "02" },
  { text: "03 March", value: "03" },
  { text: "04 April", value: "04" },
  { text: "05 May", value: "05" },
  { text: "06 June", value: "06" },
  { text: "07 July", value: "07" },
  { text: "08 August ", value: "08" },
  { text: "09 September ", value: "09" },
  { text: "10 October ", value: "10" },
  { text: "11 November", value: "11" },
  { text: "12 December", value: "12" }
];

export function createYearArray() {
  const year = [{ text: "-Select Year-", value: null }];
  const y = new Date().getFullYear();
  for (let i = 0; i < 15; i++) {
    let n = (y + i).toFixed();
    year.push({ text: n, value: n.slice(2) });
  }
  return year;
}

export const shipping = [];

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function formatProductSearch(data) {
  return data.map(r => {
    const arr = [];
    for (let i = 0; i < r.variant_chain_name.length; i++) {
      arr.push(
        `${r.variant_set_name[r.variant_set_id[i]]}: ${r.variant_chain_name[i]}`
      );
    }
    r["chain"] = r.variant_set_id.includes(1) ? "" : arr.join(" -> ");
    return r;
  });
}

export function downloadFile(file: Blob) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function getSubDomainName(param: string) {
  const href = window.location.href;
  const s = href.indexOf("//") + 2;
  const e = href.indexOf(".rentmy");
  const sub = href.substring(s, e);
  return sub.includes(param);
}

export function checkFileSize(file, limit) {
  let FileSize = file.size / 1024 / 1024;
  if (FileSize > limit) return false;
  return true;
}

export function changeNullToEmpty(data) {
  const obj = {};
  for (let d in data) {
    obj[d] = data[d] == null ? "" : data[d];
  }
  return obj;
}

export function getSubdomain() {
  const domain = window.location.host;
  // console.log(domain);
  return domain.split(".")[0];
}

export function getOriginalUrl() {
  return window.location.origin;
}

export function formateConfig(obj, name) {
  const arr = [];
  for (let d in obj) {
    let o = {};
    o["id"] = d;
    o[name] = obj[d];
    arr.push(o);
  }
  return arr;
}

function getType(type) {
  switch (type) {
    case "lower":
      return { l: 97, u: 122 };
    case "upper":
      return { l: 65, u: 90 };
    default:
      return { l: 48, u: 57 };
  }
}

export function encrypt(text, type?) {
  const bound = getType(type);
  return text
    .split("")
    .map(m => {
      let c = m.charCodeAt(0);
      if (c > bound.l - 1 && c < bound.u + 1) {
        if (c + 5 > bound.u) {
          let x = 5 - (bound.u - c);
          m = String.fromCharCode(bound.l + x - 1);
        } else {
          m = String.fromCharCode(c + 5);
        }
      }
      return m;
    })
    .join("");
}

export function dcrypt(text, type?) {
  const bound = getType(type);
  return text
    .split("")
    .map(m => {
      let c = m.charCodeAt(0);
      if (c > bound.l - 1 && c < bound.u + 1) {
        if (c - 5 < bound.l) {
          let x = 5 - (c - bound.l);
          m = String.fromCharCode(bound.u + 1 - x);
        } else {
          m = String.fromCharCode(c - 5);
        }
      }
      return m;
    })
    .join("");
}

export function eLogin(text) {
  return text
    .split("")
    .map(m => {
      let c = m.charCodeAt(0);
      if (c === 58) {
        m = String.fromCharCode(33);
      } else if (c === 34) {
        m = String.fromCharCode(36);
      } else if (c === 123) {
        m = String.fromCharCode(94);
      } else if (c === 125) {
        m = String.fromCharCode(92);
      } else if (c === 47) {
        m = String.fromCharCode(59);
      } else if (c === 32) {
        m = String.fromCharCode(126);
      }
      return m;
    })
    .join("");
}

export function dLogin(text) {
  return text
    .split("")
    .map(m => {
      let c = m.charCodeAt(0);
      if (c === 33) {
        m = String.fromCharCode(58);
      } else if (c === 36) {
        m = String.fromCharCode(34);
      } else if (c === 94) {
        m = String.fromCharCode(123);
      } else if (c === 92) {
        m = String.fromCharCode(125);
      } else if (c === 59) {
        m = String.fromCharCode(47);
      } else if (c === 126) {
        m = String.fromCharCode(32);
      }
      return m;
    })
    .join("");
}

export const ErrorMessage = {
  message: "Something wrong Please try again !!!"
};

export function validateCard(cardNo) {
  let isValid = false;
  let cardTypeimg = "";
  let cardName = "";
  const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  const amexpRegEx = /^(?:3[92][0-9]{13})$/;
  const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

  if (visaRegEx.test(String(cardNo))) {
    cardTypeimg = "./assets/img/home/credit-card/visa.png";
    isValid = true;
    cardName = "VISA";
  } else if (mastercardRegEx.test(String(cardNo))) {
    isValid = true;
    cardTypeimg = "./assets/img/home/credit-card/mastercard.png";
    cardName = "MASTERCARD";
  } else if (amexpRegEx.test(String(cardNo))) {
    isValid = true;
    cardTypeimg = "./assets/img/home/credit-card/amex.png";
    cardName = "American Express";
  } else if (discovRegEx.test(String(cardNo))) {
    isValid = true;
    cardTypeimg = "./assets/img/home/credit-card/discover.png";
    cardName = "Discover";
  }

  if (isValid) {
    return { status: true, cardImg: cardTypeimg, cardName: cardName };
  } else {
    return { status: false, cardImg: cardTypeimg, cardName: cardName };
  }
}

export function formatValue(actualValue) {
  const len = actualValue.length;
  const grid = getScreenWidth();
  const slide = grid.s;
  const size = len / slide;
  if (len > 0) {
    let obj = {};
    for (let i = 0; i < size; i++) {
      obj[i] = actualValue.slice(i * slide, i * slide + slide);
    }
    return { product: Object.values(obj), grid: grid };
  }
  return null;
}

function getScreenWidth() {
  const w = window.innerWidth;
  // console.log(w);
  switch (true) {
    case w > 992:
      return { s: 4, c: 3 };
    case 767 < w && w <= 992:
      return { s: 3, c: 4 };
    case 500 < w && w <= 767:
      return { s: 2, c: 6 };
    default:
      return { s: 1, c: 12 };
  }
}

export function getBillingInfo(url) {
  if (url.includes("admin")) {
    const data = sessionStorage.getItem("billInfo");
    return data ? JSON.parse(data) : null;
  } else {
    const data = localStorage.getItem("billingInfo");
    return data ? JSON.parse(data) : null;
  }
}

//  For Calender
export function formateCalenderDate(type, date?) {
  let fDay: Date;
  const to = date ? new Date(date) : new Date();
  const y = to.getFullYear();
  const m = to.getMonth();
  if (type === "month") {
    fDay = new Date(y, m, 1);
    return formatWeek(fDay, "month");
  } else if (type === "listWeek" || type === "agendaWeek") {
    return formatWeek(to, "week");
  } else {
    return { start_date: FORMAT_DATE(to), end_date: FORMAT_DATE(to) };
  }
}

function formatWeek(fDay, option) {
  let fDate = fDay.getDay();
  let lDay;
  if (fDate !== 0) {
    fDay = new Date(fDay.getTime() - 60 * 60 * 24 * 1000 * fDate);
  }
  if (option === "month") {
    lDay = new Date(fDay.getTime() + 60 * 60 * 24 * 1000 * 41);
  } else {
    lDay = new Date(fDay.getTime() + 60 * 60 * 24 * 1000 * 6);
  }
  return { start_date: FORMAT_DATE(fDay), end_date: FORMAT_DATE(lDay) };
}

export function getQtyFromCartList(list, pro, date, duration) {
  if (list) {
    const sum = list
      .filter(d => {
        return (
          d.product.id === pro.id &&
          d.product_variant.quantity.id === pro.default_variant.quantity.id &&
          checkDate(d.rent_start, d.rent_end, date, duration)
        );
      })
      .map(q => q.quantity)
      .reduce((t, i) => t + i, 0);
    return sum;
  }
  return 0;
}

export function getQtyFromProductList(list, date, duration) {
  if (list) {
    const sum = list
      .filter(d => {
        return checkDate(d.start_date, d.end_date, date, duration);
      })
      .map(q => q.quantity)
      .reduce((t, i) => t + i, 0);
    return sum;
  }
  return 0;
}

function checkDate(s, e, i, d) {
  const cur = i ? new Date(i).getTime() : new Date().getTime();
  const curEnd = cur + 86400000 * (d - 1);
  const st = new Date(s).getTime();
  const end = new Date(e).getTime();
  // console.log({c: new Date(cur), cE: new Date(curEnd), r1: new Date(st), r2:new Date(end)});
  return (st <= cur && end >= cur) || (end > cur && st < curEnd);
}

export function formateRentType(d, t) {
  switch (d.toUpperCase()) {
    case "HOURLY":
      return singleOrNot(t) ? "Hour" : "Hours";
    case "DAILY":
      return singleOrNot(t) ? "Day" : "Days";
    case "WEEKLY":
      return singleOrNot(t) ? "Week" : "Weeks";
  }
}

export function singleOrNot(v) {
  if (v) {
    if (typeof v === "string") v = parseInt(v, 10);
    return v > 1 ? false : true;
  }
  return true;
}

export function formatStoreList(data) {
  if (data) {
    return data.map(d => {
      d["features"] = makeFeatures(d["settings"]).join(", ");
      return d;
    });
  }
  return [];
}

export function makeFeatures(setting) {
  const arr = [];
  for (const key in setting) {
    if (setting[key]) {
      arr.push(formateStoreName(key));
    }
  }
  return arr;
}

function formateStoreName(name: string) {
  const nameArr: string[] = name
    .replace(/-/g, ",")
    .replace(/_/g, ",")
    .split(",");
  return nameArr.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
}

export function formatListPrice(price) {
  // console.log(price)
  const config = JSON.parse(localStorage.getItem('currency'));
    
  if (price) {
    if(config.pre == true && config.post== false){
      if (price.base && price.base.price) {
        return config.symbol + price.base.price.toFixed(2);
      }
          if (price.fixed && price.fixed.price) {
        return "Starting at "+ config.symbol + price.fixed.price.toFixed(2);
      }
      if (price.hourly && price.hourly.length) {
        return "Starting at "+ config.symbol + price.hourly[0].price.toFixed(2);
      }
      if (price.daily && price.daily.length) {
        return "Starting at " +config.symbol + price.daily[0].price.toFixed(2);
      }
      if (price.weekly && price.weekly.length) {
        return "Starting at "+ config.symbol + price.weekly[0].price.toFixed(2);
      }
      if  (price.monthly && price.monthly.length) {
        return "Starting at " +config.symbol + price.monthly[0].price.toFixed(2);
      }
    } else if(config.pre == false && config.post== true){
      if (price.base && price.base.price) {
        return  price.base.price.toFixed(2) +" "+ config.code ;
      }
      if (price.fixed && price.fixed.price) {
        return "Starting at " + price.fixed.price.toFixed(2) + " "+ config.code;
      }
      if (price.hourly && price.hourly.length) {
        return "Starting at " + price.hourly[0].price.toFixed(2) + " "+ config.code;
      }
      if (price.daily && price.daily.length) {
        return "Starting at " + price.daily[0].price.toFixed(2) + " " +config.code ;
      }
      if (price.weekly && price.weekly.length) {
        return "Starting at " + price.weekly[0].price.toFixed(2) + " " + config.code;
      }
      if  (price.monthly && price.monthly.length) {
        return "Starting at " + price.monthly[0].price.toFixed(2) +" "+config.code ;
      }
    } else {
      if (price.base && price.base.price) {
        return config.symbol + price.base.price.toFixed(2)+ " " + config.code;
      }
          if (price.fixed && price.fixed.price) {
        return "Starting at "+ config.symbol + price.fixed.price.toFixed(2)+ " " + config.code;
      }
      if (price.hourly && price.hourly.length) {
        return "Starting at "+ config.symbol + price.hourly[0].price.toFixed(2)+ " " + config.code;
      }
      if (price.daily && price.daily.length) {
        return "Starting at " +config.symbol + price.daily[0].price.toFixed(2)+ " " + config.code;
      }
      if (price.weekly && price.weekly.length) {
        return "Starting at "+ config.symbol + price.weekly[0].price.toFixed(2)+ " " + config.code;
      }
      if  (price.monthly && price.monthly.length) {
        return "Starting at " +config.symbol + price.monthly[0].price.toFixed(2)+ " " + config.code;
      }
    }
    
  }
  return "";
}

export function getShipMethod(data, id) {
  const d = data.find(f => f.id == id);
  switch (d.name.toLowerCase()) {
    case "fedex":
      return 4;
    case "ups":
      return 5;
  }
}

export function getShipId(data, id) {
  let name = "";
  switch (id) {
    case 4:
      name = "fedex";
      break;
    case 5:
      name = "ups";
      break;
  }
  const d = data.find(f => f.name.toLowerCase() == name);
  return d ? d.id : 0;
}

export function forPickUp(inS, id, from?) {
  const data = {
    instore: inS,
    pickup: id
  };
  if (from) {
    sessionStorage.setItem("inStore", JSON.stringify(data));
  } else {
    localStorage.setItem("inStore", JSON.stringify(data));
  }
}
export function formatSlideValue(actualValue) {
  const len = actualValue.length;
  const grid = getScreenWidthForSlide();
  const slide = grid.s * 2;
  const size = len / slide;
  if (len > 0) {
    let obj = {};
    for (let i = 0; i < size; i++) {
      obj[i] = actualValue.slice(i * slide, i * slide + slide);
    }
    return { type: Object.values(obj), grid };
  }
}

function getScreenWidthForSlide() {
  const w = window.innerWidth;
  switch (true) {
    case w > 1200:
      return { s: 4, c: 3 };
    case 992 < w && w <= 1200:
      return { s: 3, c: 4 };
    case 767 < w && w <= 992:
      return { s: 2, c: 6 };
    default:
      return { s: 1, c: 12 };
  }
}

export function getRentalPriceType(pType) {
  let type = "";
  if (pType === 2) {
    type = "fixed";
  } else if (pType === 3) {
    type = "flat";
  } else if (pType === 4) {
    type = "flex";
  }
  return type;
}
export function getRentalPriceTypeId(pType) {
  let type: number;
  if (pType === "fixed") {
    type = 2;
  } else if (pType === "flat") {
    type = 3;
  } else if (pType === "flex") {
    type = 4;
  }
  return type;
}

export function getStartDate() {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (Number(date.getMonth()) + 1) +
    "-" +
    date.getDate()
  );
}
export function FORMATE_DATE(day) {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (Number(date.getMonth()) + 1) +
    "-" +
    (Number(date.getDate()) + day)
  );
}
export function getEndDate(day){
    const date = new Date();
    return date.getFullYear()+'-'+(Number(date.getMonth()) + 1)+'-'+(Number(date.getDate())+day)

}
export const ASSETS_CONDITION = [
  { text: "In Stock", value: 1, color: "#3498db" },
  { text: "Rented Out", value: 2, color: "#e67e22" },
  { text: "Sold", value: 3, color: "#2ecc71" },
  { text: "Damaged", value: 4, color: "#c0392b" },
  { text: "In Service", value: 5, color: "#e74c3c" },
  { text: "In Transit", value: 6, color: "#e74D3c" },
  { text: "Deleted", value: 7, color: "#e74c3D" },
  { text: "Retired", value: 8, color: "#e74c3E" }
];
export const ASSETS_RETURN_CONDITION = [
  { text: "New", value: 1, color: "#3498db" },
  { text: "Good", value: 2, color: "#e67e22" },
  { text: "Fair", value: 3, color: "#2ecc71" },
  { text: "Poor", value: 4, color: "#c0392b" },
  { text: "Need Service", value: 5, color: "#e74c3c" },
  { text: "Damaged", value: 6, color: "#e74D3c" },
  { text: "Missing", value: 7, color: "#e74c3D" },

];

export const ASSETS_STATUS = [
  { text: "Available ", value: 1, color: "#f39c12" },
  { text: "Unavailable ", value: 2, color: "#2980b9" },
  { text: "Deleted ", value: 3, color: "#c0392b" },
];
