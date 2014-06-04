(function() {
  var cities_data_arr, convertOffset, convertOffsetToFloat, countries_data_arr, full_data_arr, full_data_original_arr, getCities, getMonth, getNewTime, getRequiredOffset, get_google_cal_dates_param, k, locations, open_in_new_tab, origcities, renderRows, rowsortstart, rowsortstop, selecteddate, setSelectedDate, sr_click, tzdata, tzdatalower, updateUtc, utc;

  origcities = "";

  tzdata = "";

  tzdatalower = "";

  k = 0;

  locations = "";

  utc = 0;

  selecteddate = {};

  rowsortstart = "";

  rowsortstop = "";

  cities_data_arr = [];

  countries_data_arr = [];

  full_data_arr = [];

  full_data_original_arr = [];

  $(document).ready(function() {
    timezoneJS.timezone.zoneFileBasePath = '/olson';
    timezoneJS.timezone.init();
    setSelectedDate();
    return $.ajax({
      url: "tzdata.csv",
      success: function(tz) {
        var d, rem;
        tzdata = tz;
        tzdatalower = tz.toLowerCase();
        cities_data_arr = [];
        countries_data_arr = [];
        full_data_arr = tzdatalower.split("\n");
        full_data_original_arr = tzdata.split("\n");
        full_data_arr.forEach(function(each_line) {
          var each_line_arr;
          each_line_arr = each_line.split(";");
          cities_data_arr.push(each_line_arr[0]);
          return countries_data_arr.push(each_line_arr[1]);
        });
        cities_data_arr.pop();
        countries_data_arr.pop();
        full_data_original_arr.pop();
        full_data_arr.pop();
        renderRows();
        d = new Date();
        rem = 62 - d.getSeconds();
        renderRows();
        return setInterval((function() {
          return renderRows();
        }), 60000);
      },
      error: function(e) {}
    });
  });

  $("#search_input").live({
    keyup: function(e) {
      var st;
      $(".searchresult_li").removeClass("temp_active");
      if (e.keyCode === 13) {
        k = $(".searchresult_li.active_search").attr("k");
        $("#search_input").val("");
        sr_click(e, k);
        $("#search_result").hide();
        return;
      }
      if (e.keyCode === 40) {
        if ($(".searchresult_li").length === 0) return;
        if ($(".searchresult_li.active_search").length > 0) {
          if ($(".searchresult_li.active_search").next().length > 0) {
            $(".searchresult_li.active_search").addClass("temp_active");
            $(".searchresult_li").removeClass("active_search");
            $(".searchresult_li.temp_active").next().addClass("active_search");
          } else {
            $(".searchresult_li").removeClass("active_search").first().addClass("active_search");
          }
        } else {
          $(".searchresult_li").first().addClass("active_search");
        }
        return;
      }
      if (e.keyCode === 38) {
        if ($(".searchresult_li").length === 0) return;
        if ($(".searchresult_li.active_search").length > 0) {
          if ($(".searchresult_li.active_search").prev().length > 0) {
            $(".searchresult_li.active_search").addClass("temp_active");
            $(".searchresult_li").removeClass("active_search");
            $(".searchresult_li.temp_active").prev().addClass("active_search");
          } else {
            $(".searchresult_li").removeClass("active_search").last().addClass("active_search");
          }
        } else {
          $(".searchresult_li").first().addClass("active_search");
        }
        return;
      }
      st = $(e.target).val().trim().toLowerCase();
      st.toLowerCase();
      if (st.length < 1) {
        $("#search_result").slideUp();
        return;
      }
      locations = "<br><ul class='searchresult_ul'>";
      k = 0;
      $("#search_result").html("");
      updateUtc();
      locations = getCities(st);
      $("#search_result").html(locations);
      if ($("#search_result").css("display") === "none") {
        return $("#search_result").slideDown();
      }
    },
    focusout: function() {
      return setTimeout((function() {
        return $("#search_result").slideUp();
      }), 300);
    }
  });

  $("li.searchresult_li").live({
    click: function(e) {
      $("#search_input").val("");
      return sr_click(e);
    }
  });

  $(".searchresult_ul").live({
    mouseenter: function() {
      return $(".searchresult_li").removeClass("active_search");
    }
  });

  $("#content .row .dates ul li").live({
    mouseenter: function(e) {
      var idx, left;
      $(".row .dates li").first().css("position", "relative");
      idx = $(e.target).attr("idx");
      if (typeof idx !== "undefined") {
        $("#vband").attr("idx", idx);
        $("#vband").css("height", ($("#content .row").length) * 72 - 41);
        left = Number(idx) * 28 + 320;
        return $("#vband").css("left", left);
      }
    }
  });

  $("#content").live({
    mouseleave: function(e) {
      var left;
      left = Number($("#selectedband").css("left"));
      return $("#vband").css("left", left - 2);
    }
  });

  $("#selectedband").live({
    mouseenter: function(e) {
      return $("#content").sortable('disable');
    },
    mouseout: function(e) {
      return $("#content").sortable('enable');
    }
  });

  $("#vband").live({
    mouseenter: function(e) {
      return $("#content").sortable('disable');
    },
    mouseout: function(e) {
      return $("#content").sortable('enable');
    },
    click: function(e) {
      var city, country, ele, idx, ind, original_offset, t, tText, tabl, timezones, yeardetails, _i, _len, _ref;
      $(".canhide").css("opacity", "0.1");
      idx = $(e.target).attr("idx");
      if (idx === void 0) return;
      t = new Array();
      city = new Array();
      country = new Array();
      yeardetails = new Array();
      original_offset = new Array();
      timezones = new Array();
      _ref = $(".row");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ele = _ref[_i];
        tText = convertOffset($("#" + ele.id + " #lihr_" + idx).attr("t"));
        t.push(tText.substr(1));
        city.push($("#" + ele.id + " .city").text());
        country.push($("#" + ele.id + " .country").text());
        yeardetails.push($("#" + ele.id + " #lihr_" + idx).attr("details"));
        original_offset.push($(ele).attr("floatoffset"));
        timezones.push($(ele).attr("timezone"));
      }
      $("#newevent").show();
      $("#newevent_time").text("");
      $("#newevent_msg").text("");
      $("#event_name").text("");
      tabl = "<table id='newevent_table' class='table table-striped' ><thead><th>Select</th><th>City</th><th>Country</th><th>Time</th></thead>";
      for (ind in t) {
        tabl += "<tr floatoffset='" + original_offset[ind] + "' timezone='" + timezones[ind] + "'><td><input type='checkbox' checked /></td><td>" + city[ind] + "</td><td>" + country[ind] + "</td><td><span class='yeardetails'>" + yeardetails[ind] + "</span><span class='selected_time'>, " + t[ind] + "</td></tr>";
      }
      tabl += "</table>";
      $("#newevent_time").html(tabl);
      $("#newevent_time").attr("city", city);
      $("#newevent_time").attr("country", country);
      $("#newevent_time").attr("time", t);
      return $("#newevent_time").attr("yeardetails", yeardetails.join(";"));
    }
  });

  $("#wrapper button#saveevent").live({
    click: function(e) {
      var city, country, evname, len, msg, oldobj, selected, selected_time, total_checked, yeardetails;
      msg = $("#wrapper #newevent #newevent_msg").val().trim();
      evname = $("#wrapper #newevent #event_name").val().trim();
      if (msg.length < 1) {
        alert("Please enter description");
        return;
      }
      if (evname.length < 1) {
        alert("Please enter event name");
        return;
      }
      city = "";
      country = "";
      selected = "";
      yeardetails = "";
      selected_time = "";
      total_checked = 0;
      $("#newevent_table tr").each(function() {
        if ($(this).find("input[type='checkbox']").attr('checked')) {
          city += $($(this).find("td")[1]).text() + ",";
          country += $($(this).find("td")[2]).text() + ",";
          yeardetails += $($($(this).find("td")[3]).find(".yeardetails")).text() + ";";
          selected_time += $($($(this).find("td")[3]).find(".selected_time")).text().trim();
          return total_checked++;
        }
      });
      if (total_checked === 0) {
        alert("Select atleast one timezone .");
        return;
      }
      country = country.substr(0, country.length - 1);
      city = city.substr(0, city.length - 1);
      yeardetails = yeardetails.substr(0, yeardetails.length - 1);
      selected_time = selected_time.substr(1, selected_time.length);
      oldobj = {};
      if ("events" in localStorage) oldobj = JSON.parse(localStorage.events);
      len = Object.keys(oldobj).length;
      oldobj[len] = {};
      oldobj[len].name = evname;
      oldobj[len].desc = msg;
      oldobj[len].city = city;
      oldobj[len].country = country;
      oldobj[len].time = selected_time;
      oldobj[len].yeardetails = yeardetails;
      localStorage.events = JSON.stringify(oldobj);
      $("#event_close").trigger('click');
      $("#wrapper #showevents #showeventbody").hide();
      return $(".eventheader").trigger("click");
    }
  });

  $("#event_close").live({
    click: function(e) {
      $("#newevent").hide();
      return $(".canhide").css("opacity", "1");
    }
  });

  $("body").live({
    keydown: function(e) {
      if (e.keyCode === 27) {
        $("#newevent").hide();
        return $(".canhide").css("opacity", "1");
      }
    }
  });

  $("#content .row .icons_homedelete .icon_delete").live({
    click: function(e) {
      var defaultidx, i, key, len, newobj, oldobj, rowindex, val;
      rowindex = Number($(e.target).parent().parent().attr("rowindex"));
      oldobj = JSON.parse(localStorage.addedLocations);
      len = 0;
      for (key in oldobj) {
        len++;
      }
      defaultidx = Number(localStorage["default"]);
      if (defaultidx > rowindex) defaultidx--;
      delete oldobj[rowindex];
      i = 0;
      newobj = {};
      for (key in oldobj) {
        val = oldobj[key];
        key = Number(key);
        if (key > rowindex) {
          newobj[key - 1] = val;
        } else {
          newobj[key] = val;
        }
      }
      localStorage["default"] = defaultidx;
      localStorage.addedLocations = JSON.stringify(newobj);
      return renderRows();
    }
  });

  $("#content .row .icons_homedelete .icon_home").live({
    click: function(e) {
      var i, oldobj, rowindex, temp;
      rowindex = Number($(e.target).parent().parent().attr("rowindex"));
      oldobj = JSON.parse(localStorage.addedLocations);
      i = rowindex;
      temp = oldobj[rowindex];
      while (i > 0) {
        oldobj[i] = oldobj[i - 1];
        i--;
      }
      oldobj[0] = temp;
      localStorage.addedLocations = JSON.stringify(oldobj);
      localStorage["default"] = 0;
      return renderRows();
    }
  });

  $("#dateinput").live({
    mouseenter: function(e) {
      if ($("#error_inputdate").css("display") === "none") {
        return $("#date_help").show();
      }
    },
    mouseleave: function() {
      return $("#date_help").hide();
    },
    keyup: function(e) {
      if (e.keyCode === 13) return $("#setdate_go").trigger("click");
    }
  });

  $("#setdate_go").live({
    click: function(e) {
      var datestr, dd, errormsg, key, lenofdash, mm, options, year, _i, _len;
      errormsg = "mm-dd-yyyy format only";
      datestr = $("#dateinput").val().trim();
      $(".selected_date").text(datestr);
      window.da = datestr;
      if (datestr.length !== 10) {
        $("#error_inputdate").html(errormsg);
        $("#error_inputdate").show();
        return;
      }
      lenofdash = 0;
      for (_i = 0, _len = datestr.length; _i < _len; _i++) {
        key = datestr[_i];
        if (key === "-") lenofdash++;
      }
      if (lenofdash !== 2) {
        $("#error_inputdate").html(errormsg);
        $("#error_inputdate").show();
        return;
      }
      mm = Number(datestr.substr(0, 2));
      dd = Number(datestr.substr(3, 2));
      year = datestr.substr(6, 4);
      if (year.length !== 4) {
        $("#error_inputdate").html(errormsg);
        $("#error_inputdate").show();
        return;
      }
      year = Number(datestr.substr(6, 4));
      if (mm > 12 || mm < 1 || dd < 0 || dd > 31) {
        $("#error_inputdate").html(errormsg);
        $("#error_inputdate").show();
        return;
      }
      if ("display_date_animation" in localStorage) {
        if (localStorage.display_date_animation === "false") {
          $(".date_help_animation_box").hide();
        } else {
          $(".date_help_animation_box").show();
        }
      } else {
        $(".date_help_animation_box").show();
      }
      $("#error_inputdate").hide();
      setTimeout((function() {
        return $(".date_help_animation_box").fadeOut(3000);
      }), 15000);
      options = {};
      options.m = mm - 1;
      options.d = dd;
      options.year = year;
      setSelectedDate(options);
      return renderRows();
    }
  });

  $(".date_help_animation_box").live({
    click: function() {
      var that;
      that = this;
      if ($(this).find("input[type='checkbox']").attr("checked")) {
        localStorage.display_date_animation = "false";
      } else {
        localStorage.display_date_animation = "true";
      }
      return setTimeout((function() {
        return $(that).fadeOut();
      }), 1000);
    }
  });

  $("#error_inputdate").live({
    click: function() {
      return $("#error_inputdate").slideUp(50);
    },
    focusout: function() {
      return $("#error_inputdate").hide(500);
    }
  });

  $("#content").live({
    sortstop: function(e, ui) {
      var defaultind, i, key, oldobj, startobj, val;
      rowsortstop = ui.item.index() - 2;
      if (rowsortstart === rowsortstop) return;
      oldobj = JSON.parse(localStorage.addedLocations);
      startobj = oldobj[rowsortstart];
      for (key in oldobj) {
        val = oldobj[key];
        if (rowsortstart < rowsortstop) {
          if (key > rowsortstart && key <= rowsortstop) oldobj[key - 1] = val;
        }
      }
      if (rowsortstart > rowsortstop) {
        i = rowsortstart;
        while (i > rowsortstop) {
          oldobj[i] = oldobj[i - 1];
          i--;
        }
      }
      oldobj[rowsortstop] = startobj;
      defaultind = Number(localStorage["default"]);
      if (defaultind <= rowsortstop && defaultind > rowsortstart) {
        defaultind--;
      } else if (defaultind < rowsortstart && defaultind >= rowsortstop) {
        defaultind++;
      } else if (defaultind === rowsortstart) {
        defaultind = rowsortstop;
      }
      localStorage["default"] = defaultind;
      localStorage.addedLocations = JSON.stringify(oldobj);
      return renderRows();
    },
    sortstart: function(e, ui) {
      return rowsortstart = ui.item.index() - 2;
    }
  });

  $("#wrapper #showevents .eventheader").live({
    click: function(e) {
      var city, country, data, hr_i, i, key, objlen, oldobj, prev, t, tabl, yeardetails;
      prev = $("#wrapper #showevents #showeventbody").css("display");
      if (prev !== "none") {
        $("#wrapper #showevents #showeventbody").slideUp();
        return;
      }
      if (!("events" in localStorage)) {
        $("#wrapper #showevents #showeventbody").html("<h3>No events available, you can add events by clicking on any box showing time.</h3>");
        $("#wrapper #showevents #showeventbody").slideDown();
        $("body").scrollTo(".showevents");
        return;
      }
      oldobj = JSON.parse(localStorage.events);
      data = "";
      objlen = Object.keys(oldobj).length;
      hr_i = 1;
      for (key in oldobj) {
        city = new Array();
        country = new Array();
        yeardetails = new Array();
        t = new Array();
        city = oldobj[key].city.split(",");
        country = oldobj[key].country.split(",");
        t = oldobj[key].time.split(",");
        yeardetails = oldobj[key].yeardetails.split(";");
        tabl = "<table class='showevent_table table table-striped'><thead><th>City</th><th>Country</th><th>Time</th></thead><tbody>";
        for (i in city) {
          tabl += "<tr><td>" + city[i] + "</td><td>" + country[i] + "</td><td>" + yeardetails[i] + " " + t[i] + "</td></tr>";
        }
        tabl += "</tbody></table>";
        data += "<div class='each_event_header'><span class='event_name_desc'><span class='event_num'># " + (parseInt(key, 10) + 1) + "</span><span class='event_name'> " + oldobj[key].name + "</span> - <span class='event_desc'>" + oldobj[key].desc + "</span></span><span class='deleteEvent' key='" + key + "'>X&nbsp;</span></div>" + tabl + "<br>";
        if (hr_i !== objlen) data += "<hr>";
        hr_i++;
      }
      if (data === "") {
        data = "<h3>No events available, you can add events by clicking on any box showing time.</h3>";
      }
      data = "<div class='events'>" + data + "</div>";
      $("#wrapper #showevents #showeventbody").html(data);
      $("#wrapper #showevents #showeventbody").slideDown();
      return $("body").scrollTo("#showevents");
    },
    mouseenter: function(e) {
      return $("#event_help").show(75);
    },
    mouseleave: function(e) {
      return $("#event_help").hide(75);
    }
  });

  $(".deleteEvent").live({
    click: function(e) {
      var i, len, oldobj, r, rowindex;
      r = confirm("Do you really want to delete this event ? ");
      if (r !== true) return;
      rowindex = parseInt($(e.target).attr("key"), 10);
      oldobj = JSON.parse(localStorage.events);
      len = Object.keys(oldobj).length;
      if (i !== len - 1) {
        i = rowindex + 1;
        while (i < len) {
          oldobj[i - 1] = oldobj[i];
          i++;
        }
        delete oldobj[len - 1];
      } else {
        delete oldobj[rowindex];
      }
      localStorage.events = JSON.stringify(oldobj);
      $("#wrapper #showevents #showeventbody").css("display", "none");
      return $("#wrapper #showevents .eventheader").trigger("click");
    }
  });

  sr_click = function(e, k) {
    var both, botharr, city_country, clicked_ind, clicked_tz, each_line, key, key_arr, len, line_ind, newobj, oldobj, val, _len;
    if (typeof k === "undefined") k = $(e.target).attr("k");
    city_country = $("#lisr_" + k).attr("city_country");
    clicked_ind = full_data_original_arr.indexOf(city_country);
    for (line_ind = 0, _len = full_data_original_arr.length; line_ind < _len; line_ind++) {
      each_line = full_data_original_arr[line_ind];
      if (each_line.indexOf(city_country) > -1) {
        clicked_ind = line_ind;
        break;
      }
    }
    clicked_tz = full_data_original_arr[clicked_ind].split(";")[4];
    both = $("#lisr_" + k + " span.litz").text();
    botharr = both.split(",");
    console.log(both);
    oldobj = JSON.parse(localStorage.addedLocations);
    len = 0;
    key_arr = [];
    for (key in oldobj) {
      key_arr += key;
      len++;
    }
    for (key in oldobj) {
      val = oldobj[key];
      if (val['city'].trim() === botharr[1].trim() && val['country'].trim() === botharr[0].trim()) {
        return;
      }
    }
    newobj = {};
    oldobj[len] = {};
    oldobj[len].country = botharr[0];
    oldobj[len].city = botharr[1];
    oldobj[len].timezone = clicked_tz;
    localStorage.addedLocations = JSON.stringify(oldobj);
    return renderRows();
  };

  getRequiredOffset = function(original) {
    var finaloff, first, offset, second, timearr, timestr;
    offset = original;
    finaloff = "";
    if (offset.length === 9) {
      offset = offset.substr(3, 9);
      first = offset.substr(0, 3);
      second = offset.substr(4, 2) / 60;
      second = (second + "").substr(1);
      finaloff = parseFloat(first + second);
    } else {
      finaloff = 0;
    }
    timestr = getNewTime(finaloff);
    timearr = timestr.split(" ");
    timearr[4] = timearr[4].substr(0, 5);
    return [timestr, timearr[4], finaloff];
  };

  getCities = function(term) {
    var cur_time, key, len, max_items, temp_arr, val;
    term = term.toLowerCase();
    max_items = 7;
    len = 1;
    for (key in cities_data_arr) {
      val = cities_data_arr[key];
      if (len > max_items) break;
      if (val.indexOf(term) > -1) {
        temp_arr = full_data_original_arr[key].split(";");
        try {
          cur_time = new timezoneJS.Date(temp_arr[4]);
        } catch (err) {
          continue;
        }
        locations += "<li class='searchresult_li' id='lisr_" + len + "' k='" + len + "' city_country='" + temp_arr[0] + ";" + temp_arr[1] + "'>" + "<span class='litz' k='" + len + "'>" + temp_arr[1] + ", " + temp_arr[0] + " </span><span class='litime' k='" + len + "'>" + cur_time.getHours() + ":" + cur_time.getMinutes() + "</span></li>";
        len++;
      }
    }
    if (len < max_items + 1) {
      for (key in countries_data_arr) {
        val = countries_data_arr[key];
        if (len > max_items) break;
        if (val.indexOf(term) > -1) {
          temp_arr = full_data_original_arr[key].split(";");
          try {
            cur_time = new timezoneJS.Date(temp_arr[4]);
          } catch (err) {
            continue;
          }
          locations += "<li class='searchresult_li' id='lisr_" + len + "' k='" + len + "' city_country='" + temp_arr[0] + ";" + temp_arr[1] + "'>" + "<span class='litz' k='" + len + "'>" + temp_arr[1] + ", " + temp_arr[0] + " </span><span class='litime' k='" + len + "'>" + cur_time.getHours() + ":" + cur_time.getMinutes() + "</span></li>";
          len++;
        }
      }
    }
    return locations;
  };

  renderRows = function() {
    var cl, current_city, current_details_arr, current_timezone, d, datedetailstr, dayusedarr, dayusedstr, default_time_obj, defaultind, defaultobj, diff, diffoffset, diffoffsetstr, first_find_index, height, hourline, hours, hourstart, i, icons_homedelete, idx, ind, iorig, left, min, monInNum, newobj, nextDayStr, next_day, next_day_arr, nextdayarr, oldobj, presdate, presdatearr, presdatestr, prevdate, prevdatearr, prevdatestr, req_date, req_mon, row, selectedDateStr, sym, tempstr, time_obj, timearr, timeextrastr, timestr, today_arr, today_str, tval;
    oldobj = {};
    if ("addedLocations" in localStorage && "default" in localStorage) {
      oldobj = JSON.parse(localStorage.addedLocations);
      if (oldobj[0].timezone === void 0) {
        delete localStorage.addedLocations;
        window.location.reload();
      }
    } else {
      current_timezone = jstz.determine().name();
      current_city = current_timezone.split("/")[1];
      first_find_index = cities_data_arr.indexOf(current_city.toLowerCase());
      current_details_arr = full_data_original_arr[first_find_index].split(';');
      newobj = {};
      newobj[0] = {};
      newobj[0].city = current_details_arr[0];
      newobj[0].country = current_details_arr[1];
      newobj[0].timezone = current_timezone;
      localStorage.addedLocations = JSON.stringify(newobj);
      localStorage["default"] = "0";
      oldobj = JSON.parse(localStorage.addedLocations);
    }
    defaultind = localStorage["default"];
    defaultobj = oldobj[defaultind];
    default_time_obj = new timezoneJS.Date(defaultobj.timezone);
    default_time_obj = new timezoneJS.Date(selecteddate.year, selecteddate.m, selecteddate.d, default_time_obj.getHours(), default_time_obj.getMinutes(), defaultobj.timezone);
    row = "";
    for (ind in oldobj) {
      time_obj = new timezoneJS.Date(default_time_obj, oldobj[ind].timezone);
      hours = time_obj.getHours() - default_time_obj.getHours();
      min = time_obj.getMinutes() - default_time_obj.getMinutes();
      diff = hours + (min / 60);
      if (time_obj.getDate() !== default_time_obj.getDate()) {
        if (default_time_obj.getFullYear() !== time_obj.getFullYear()) {
          if (default_time_obj.getFullYear() > time_obj.getFullYear()) {
            diff = -(24 - diff);
          } else {
            diff = 24 + diff;
          }
        } else if (default_time_obj.getMonth() !== time_obj.getMonth()) {
          if (default_time_obj.getMonth() > time_obj.getMonth()) {
            diff = -(24 - diff);
          } else {
            diff = 24 + diff;
          }
        } else if (default_time_obj.getDate() > time_obj.getDate()) {
          diff = -(24 - diff);
        } else {
          diff = 24 + diff;
        }
      }
      oldobj[ind].diff = diff;
      oldobj[ind].timestr = time_obj._dateProxy + "";
    }
    for (ind in oldobj) {
      timestr = oldobj[ind].timestr;
      timearr = timestr.split(" ");
      diffoffset = oldobj[ind].diff;
      diffoffsetstr = diffoffset + "";
      hourstart = 1;
      if (diffoffsetstr.indexOf("-") > -1) {
        diffoffsetstr = diffoffsetstr.substr(1);
        hourstart = 24 + diffoffset;
      } else {
        hourstart = diffoffset;
      }
      i = hourstart;
      tempstr = " ";
      if ((i + "").indexOf(".") > -1) {
        tempstr = (i + "").substr((i + "").indexOf(".") + 1);
        tempstr = parseFloat(tempstr);
        if (tempstr >= 0.5) {
          tempstr = "30";
        } else {
          tempstr = " ";
        }
      }
      selectedDateStr = selecteddate.dayInText + ", " + selecteddate.mText + " " + selecteddate.d + ", " + selecteddate.year;
      timeextrastr = timearr[0] + ", " + timearr[1] + " " + timearr[2] + " " + timearr[3];
      hourline = "<ul class='hourline_ul'>";
      idx = 0;
      iorig = i;
      if (i === 0 || i === 0.5) {
        cl = "li_24";
        hourline += " <li class='" + cl + "' id='lihr_" + idx + "' idx='" + idx + "' t='" + i + "' details='" + selectedDateStr + "' ><div class='span_hl' idx='" + idx + "'><span idx='" + idx + "' class='small small-top' >" + selecteddate.mText + "</span><br><span idx='" + idx + "' class='small' >" + selecteddate.d + "</span></div></li>";
        i = 1;
        idx++;
      }
      monInNum = getMonth(timearr[1], {
        "type": "num"
      });
      d = new Date();
      d.setFullYear(selecteddate.year, selecteddate.m, selecteddate.d);
      presdate = d + "";
      presdatearr = presdate.split(" ");
      presdatestr = presdatearr[0] + ", " + presdatearr[1] + " " + presdatearr[2] + ", " + presdatearr[3];
      prevdate = new Date();
      prevdate.setFullYear(selecteddate.year, selecteddate.m, selecteddate.d);
      prevdate.setTime(prevdate.getTime() - 86400000);
      prevdate = prevdate + "";
      prevdatearr = prevdate.split(" ");
      prevdatestr = prevdatearr[0] + ", " + prevdatearr[1] + " " + prevdatearr[2] + ", " + prevdatearr[3];
      d.setTime(d.getTime() + 86400000);
      d = d + "";
      nextdayarr = d.split(" ");
      nextDayStr = nextdayarr[0] + ", " + nextdayarr[1] + " " + nextdayarr[2] + ", " + nextdayarr[3];
      dayusedarr = [];
      dayusedstr = "";
      if (diffoffset >= 0) {
        dayusedarr = nextdayarr;
        dayusedstr = nextDayStr;
        datedetailstr = presdatestr;
      } else {
        dayusedarr = presdatearr;
        dayusedstr = presdatestr;
        datedetailstr = prevdatestr;
      }
      while (i < 24) {
        if (i < 6) {
          cl = "li_n";
        } else if (i > 5 && i < 8) {
          cl = "li_m";
        } else if (i > 7 && i < 19) {
          cl = "li_d";
        } else if (i > 18 && i < 22) {
          cl = "li_e";
        } else {
          cl = "li_n";
        }
        tval = convertOffsetToFloat(parseInt(i, 10) + ":" + tempstr);
        next_day = new Date(default_time_obj._dateProxy);
        next_day.setDate(next_day.getDate() + 1);
        next_day_arr = next_day.toLocaleString().split(" ");
        today_str = new Date(default_time_obj._dateProxy);
        today_arr = today_str.toLocaleString().split(" ");
        req_mon = "";
        req_date = "";
        if (diffoffset > 0) {
          req_mon = next_day_arr[1];
          req_date = next_day_arr[2];
        } else {
          req_mon = today_arr[1];
          req_date = today_arr[2];
        }
        hourline += " <li class='" + cl + "' id='lihr_" + idx + "' idx='" + idx + "' t='" + tval + "'  details='" + datedetailstr + "'><div class='span_hl' idx='" + idx + "'><span class='medium' idx='" + idx + "'>" + parseInt(i, 10) + "</span><br><span class='small' idx='" + idx + "'>" + tempstr + "</span></div></li>";
        if (tempstr === " ") {
          hourline = hourline.replace("<span class='medium' idx='" + idx + "'>", "<span idx='" + idx + "' class='box_center' >");
        }
        idx++;
        i++;
      }
      if (hourstart !== 0) {
        cl = "li_24";
        if (iorig !== 0.5) {
          hourline += " <li class='" + cl + "' id='lihr_" + idx + "' idx='" + idx + "' t='" + (24 - i) + "' x=" + i + "  details='" + dayusedstr + "' ><div class='span_hl' idx='" + idx + "'><span idx='" + idx + "'  class='small small-top'> " + dayusedarr[1] + "</span><br><span idx='" + idx + "' class='small' >" + dayusedarr[2] + "</span></div></li>";
        }
        if (timestr === " ") {
          i = 1;
        } else {
          i = 1.5;
        }
        i = 1;
        idx++;
      }
      while (i < parseInt(hourstart, 10)) {
        if (i < 6) {
          cl = "li_n";
        } else if (i > 5 && i < 8) {
          cl = "li_m";
        } else if (i > 7 && i < 19) {
          cl = "li_d";
        } else if (i > 18 && i < 22) {
          cl = "li_e";
        } else {
          cl = "li_n";
        }
        tval = convertOffsetToFloat(parseInt(i, 10) + ":" + tempstr);
        if (diffoffset >= 0) {
          datedetailstr = nextDayStr;
        } else {
          datedetailstr = presdatestr;
        }
        hourline += " <li class='" + cl + "' id='lihr_" + idx + "' idx='" + idx + "' t='" + tval + "' details='" + datedetailstr + "' ><div class='span_hl' idx='" + idx + "'><span class='medium' idx='" + idx + "'>" + parseInt(i, 10) + "</span><br><span class='small' idx='" + idx + "'>" + tempstr + "</span></div></li>";
        if (tempstr === " ") {
          hourline = hourline.replace("<span class='medium' idx='" + idx + "'>", "<span idx='" + idx + "' class='box_center' >");
        }
        i++;
        idx++;
      }
      hourline += "</ul>";
      sym = "";
      if (diffoffset > 0) sym = "+";
      row += "<div class='row' id='row_" + ind + "' rowindex='" + ind + "' time='" + timearr[4].substr(0, 5) + "' floatoffset='" + diffoffset + "' timezone='" + oldobj[ind].timezone + "' ><div class='tzdetails'><div class='offset'>" + sym + diffoffset + "<br><span class='small' >Hours</span></div><div class='location'><span class='city'>" + oldobj[ind].city + "</span><br><span class='country'>" + oldobj[ind].country + "</span></div><div class='timedata'><span class='time'>" + timearr[4].substr(0, 5) + "</span><br><span class='timeextra'>" + timeextrastr + "</span></div></div><div class='dates'>" + hourline + "</div></div> ";
    }
    $("#content").html(row);
    $("#content").prepend("<div id='vband'></div><div id='selectedband'></div>");
    icons_homedelete = "<div class='icons_homedelete'><div class='icon_delete'>x</div><div class='icon_home'  ></div></div>";
    $("#content .row").append(icons_homedelete);
    defaultind = parseInt(localStorage["default"], 10);
    $("#content #row_" + defaultind + " .icons_homedelete").html("");
    $("#content #row_" + defaultind + " .tzdetails .offset").html("<div class='homeicon'></div>");
    $(".row .dates li").first().css("position", "relative");
    height = $("#content .row").length * 72 - 41;
    left = $("#content #row_" + defaultind).attr("time");
    left = left.substr(0, left.indexOf(":"));
    left = Number(left);
    left = left * 28 + 322;
    $("#selectedband").css("height", height);
    $("#selectedband").css("left", left);
    left = parseInt($("#selectedband").css("left"), 10);
    $("#vband").css("left", left - 2);
    $("#vband").css("height", $("#selectedband").css("height"));
    return $("#content").sortable({
      'containment': 'parent',
      'items': '.row'
    });
  };

  convertOffsetToFloat = function(str) {
    var first, second;
    first = str.substr(0, str.indexOf(":"));
    second = parseFloat(str.substr(str.indexOf(":") + 1)) / 60;
    second = (second + "").substr((second + "").indexOf(".") + 1);
    return parseFloat(first + "." + second);
  };

  convertOffset = function(ad_offset) {
    var first, second, sign, str;
    sign = "";
    str = "";
    first = "";
    second = "";
    ad_offset = ad_offset + "";
    if (ad_offset.indexOf("-") > -1) {
      sign = "-";
      str = ad_offset.substr(1);
    } else {
      sign = "+";
      str = ad_offset;
    }
    if (str.indexOf(".") > -1) {
      first = str.substr(0, str.indexOf("."));
      second = parseInt(str.substr(str.indexOf(".") + 1), 10) * 6 + "";
      if (first.length === 1) first = "0" + first;
      if (second.length === 1) second = "0" + second;
    } else {
      if (str.length === 1) {
        first = "0" + str;
      } else {
        first = str;
      }
      second = "00";
    }
    return sign + first + ":" + second;
  };

  getMonth = function(mon, options) {
    var m, month;
    month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    if (options.type === "num") {
      for (m in month) {
        if (month[m] === mon) return m;
      }
    } else if (options.type === "str") {
      return month[mon];
    }
  };

  setSelectedDate = function(options) {
    var d, dnew, dnewarr;
    if (options) {
      selecteddate = options;
      selecteddate.mText = getMonth(selecteddate.m, {
        "type": "str"
      });
      dnew = new Date();
      dnew.setMonth(selecteddate.m);
      dnew.setDate(selecteddate.d);
      dnew.setFullYear(selecteddate.year);
      dnew = dnew.toLocaleString();
      dnewarr = dnew.split(" ");
      selecteddate.dayInText = dnewarr[0];
      selecteddate.m = options.m;
      selecteddate.d = options.d;
      return selecteddate.year = options.year;
    } else {
      d = new Date();
      selecteddate.m = d.getMonth();
      selecteddate.d = d.getDate();
      selecteddate.year = d.getYear() + 1900;
      selecteddate.mText = getMonth(selecteddate.m, {
        "type": "str"
      });
      dnew = new Date();
      dnew.setMonth(selecteddate.m);
      dnew.setDate(selecteddate.d);
      dnew.setFullYear(selecteddate.year);
      dnew = dnew.toLocaleString();
      dnewarr = dnew.split(" ");
      return selecteddate.dayInText = dnewarr[0];
    }
  };

  updateUtc = function() {
    var d, datearr, dstr, localoffset, localtime;
    d = new Date();
    dstr = d.toLocaleString();
    datearr = dstr.split(" ");
    localtime = d.getTime();
    localoffset = d.getTimezoneOffset() * 60000;
    return utc = localtime + localoffset;
  };

  getNewTime = function(offset) {
    var nd, ndstr, newtime;
    newtime = utc + (3600000 * offset);
    nd = new Date(newtime);
    ndstr = nd.toLocaleString();
    return ndstr;
  };

  open_in_new_tab = function(url) {
    window.open(url, '_blank');
    return window.focus();
  };

  $(".link_export_google_cal").live({
    click: function(e) {
      var d, ele, gcal_url, gmt_str, google_cal_dates_param, link_desc, next_day, td_arr, timezone, _i, _len, _ref;
      e.preventDefault();
      link_desc = "";
      _ref = $("#newevent_table tr");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ele = _ref[_i];
        if ($(ele).find("input[type='checkbox']").attr("checked")) {
          td_arr = $(ele).find("td");
          link_desc += $(td_arr[1]).text().trim() + ", " + $(td_arr[2]).text().trim() + ", " + $(td_arr[3]).find('.yeardetails').text().trim() + " " + $(td_arr[3]).find('.selected_time').text().trim() + "\n";
        }
      }
      gmt_str = $($("#newevent_table tr")[1]).find("td")[3];
      timezone = $($("#newevent_table tr")[1]).attr("timezone");
      gmt_str = $($(gmt_str).find('.yeardetails')).text().trim() + " " + $($(gmt_str).find('.selected_time')).text().trim();
      d = new Date(gmt_str);
      d = new timezoneJS.Date(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), timezone);
      d.setDate(d.getUTCDate());
      d.setHours(d.getUTCHours());
      d.setMinutes(d.getUTCMinutes());
      google_cal_dates_param = get_google_cal_dates_param(d);
      next_day = d;
      next_day.setHours(d.getHours() + 1);
      google_cal_dates_param += "/" + get_google_cal_dates_param(next_day);
      gcal_url = "https://www.google.com/calendar/render?action=TEMPLATE&details=" + link_desc;
      if ($("#newevent_msg").val().trim().length > 0) {
        gcal_url += '\n' + $("#newevent_msg").val().trim();
      }
      if ($("#event_name").val().trim().length > 0) {
        gcal_url += "&text=" + $('#event_name').val().trim();
      }
      gcal_url += '\n' + "Powered by http://agiliq.com/timezones/";
      gcal_url += "&dates=" + google_cal_dates_param;
      $(".link_export_google_cal").attr("href", encodeURI(gcal_url));
      return open_in_new_tab($(".link_export_google_cal").attr('href'));
    }
  });

  get_google_cal_dates_param = function(d) {
    var day_str, google_cal_dates_param, hour_str, min_str, month_str;
    month_str = d.getMonth() + 1;
    if ((month_str + "").trim().length === 1) month_str = "0" + month_str;
    day_str = d.getDate();
    if ((day_str + "").trim().length === 1) day_str = "0" + day_str;
    min_str = d.getMinutes();
    if ((min_str + "").trim().length === 1) min_str = "0" + min_str;
    hour_str = d.getHours();
    if ((hour_str + "").trim().length === 1) hour_str = "0" + hour_str;
    return google_cal_dates_param = "" + d.getFullYear() + month_str + day_str + "T" + hour_str + min_str + "00Z";
  };

}).call(this);
