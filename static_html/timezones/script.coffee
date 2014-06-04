
origcities = ""
tzdata=""
tzdatalower = ""
k=0
locations=""
utc = 0
selecteddate = {}
rowsortstart = ""
rowsortstop = ""
cities_data_arr = []
countries_data_arr = []
full_data_arr = []
full_data_original_arr = []
#first set selecteddate to current date, later user can change

$(document).ready ->

  timezoneJS.timezone.zoneFileBasePath = '/olson'
  timezoneJS.timezone.init()
  setSelectedDate()
  

  $.ajax
    url : "tzdata.csv"
    success : (tz) ->
      tzdata = tz
      tzdatalower = tz.toLowerCase()
      cities_data_arr = []
      countries_data_arr = []

      full_data_arr = tzdatalower.split "\n"
      full_data_original_arr = tzdata.split "\n"
      full_data_arr.forEach (each_line) ->
        each_line_arr = each_line.split ";"
        cities_data_arr.push each_line_arr[0]
        countries_data_arr.push each_line_arr[1]
      cities_data_arr.pop()
      countries_data_arr.pop()
      full_data_original_arr.pop()
      full_data_arr.pop()

      #console.log "tzdata loaded successfully"
      renderRows()
      d = new Date()
      rem = 62-d.getSeconds()
      renderRows()
      setInterval (->
        renderRows()
      ), 60000
    error : (e) ->
      #console.log "Error loading tz data"




$("#search_input").live
  keyup : (e) ->
    $(".searchresult_li").removeClass("temp_active")
    if e.keyCode == 13
      k = $(".searchresult_li.active_search").attr "k"
      $("#search_input").val("")
      sr_click(e, k)
      $("#search_result").hide()
      return
    if e.keyCode == 40
      if $(".searchresult_li").length == 0
        return
      if $(".searchresult_li.active_search").length > 0
        if $(".searchresult_li.active_search").next().length > 0
          $(".searchresult_li.active_search").addClass("temp_active")
          $(".searchresult_li").removeClass("active_search")
          $(".searchresult_li.temp_active").next().addClass("active_search")
        else
          $(".searchresult_li").removeClass("active_search").first().addClass("active_search")
      else
        $(".searchresult_li").first().addClass("active_search")
      return
    if e.keyCode == 38
      if $(".searchresult_li").length == 0
        return
      if $(".searchresult_li.active_search").length > 0
        if $(".searchresult_li.active_search").prev().length > 0
          $(".searchresult_li.active_search").addClass("temp_active")
          $(".searchresult_li").removeClass("active_search")
          $(".searchresult_li.temp_active").prev().addClass("active_search")
        else
          $(".searchresult_li").removeClass("active_search").last().addClass("active_search")
      else
        $(".searchresult_li").first().addClass("active_search")
      return
    st = $(e.target).val().trim().toLowerCase()
    st.toLowerCase()
    if st.length < 1
      #$("#search_result").hide(200)
      $("#search_result").slideUp()
      return
    locations = "<br><ul class='searchresult_ul'>"
    k = 0
    $("#search_result").html ""
    updateUtc()
    locations = getCities(st)
    $("#search_result").html locations
    if $("#search_result").css("display") == "none"
      $("#search_result").slideDown()

  focusout : ->
    #$("#search_result").hide(1000)
    setTimeout (->
      $("#search_result").slideUp()
    ), 300


# add locations to the localStorage
$("li.searchresult_li").live
  click : (e) ->
    $("#search_input").val("")
    sr_click(e)

$(".searchresult_ul").live
  mouseenter: () ->
    $(".searchresult_li").removeClass("active_search")




$("#content .row .dates ul li").live
  mouseenter : (e) ->
    $(".row .dates li").first().css "position","relative"
    idx = $(e.target).attr("idx")
    if typeof(idx) != "undefined"
      $("#vband").attr "idx",idx
      $("#vband").css "height",($("#content .row").length)*72-41
      left = Number(idx)*28 + 320
      $("#vband").css "left",left

#$("#content .row .dates").live
$("#content").live
  mouseleave : (e) ->
    left = Number($("#selectedband").css("left"))
    $("#vband").css "left",(left-2)


$("#selectedband").live
  mouseenter: (e) ->
    $("#content").sortable('disable')
  mouseout: (e) ->
    $("#content").sortable('enable')


$("#vband").live
  mouseenter: (e) ->
    $("#content").sortable('disable')
  mouseout: (e) ->
    $("#content").sortable('enable')

  click : (e) ->
    $(".canhide").css "opacity","0.1"

    idx = $(e.target).attr "idx"
    if idx is undefined
      return
    t = new Array()
    city = new Array()
    country = new Array()
    yeardetails = new Array()
    original_offset = new Array()
    timezones = new Array()
    for ele in $(".row")
      tText = convertOffset $("#"+ele.id+" #lihr_"+idx).attr("t")
      t.push tText.substr(1)
      city.push $("#"+ele.id+" .city").text()
      country.push $("#"+ele.id+" .country").text()
      yeardetails.push $("#"+ele.id+" #lihr_"+idx).attr("details")
      original_offset.push $(ele).attr "floatoffset"
      timezones.push $(ele).attr "timezone"


    $("#newevent").show()
    $("#newevent_time").text ""
    $("#newevent_msg").text ""
    $("#event_name").text ""
    tabl = "<table id='newevent_table' class='table table-striped' ><thead><th>Select</th><th>City</th><th>Country</th><th>Time</th></thead>"

    for ind of t

      tabl+="<tr floatoffset='"+original_offset[ind]+"' timezone='"+timezones[ind]+"'><td><input type='checkbox' checked /></td><td>"+city[ind]+"</td><td>"+country[ind]+"</td><td><span class='yeardetails'>"+yeardetails[ind]+"</span><span class='selected_time'>, "+t[ind]+"</td></tr>"
    tabl+="</table>"

    $("#newevent_time").html tabl
    $("#newevent_time").attr "city",city
    $("#newevent_time").attr "country",country
    $("#newevent_time").attr "time",t
    $("#newevent_time").attr "yeardetails",yeardetails.join(";")

$("#wrapper button#saveevent").live
  click : (e) ->
    msg= $("#wrapper #newevent #newevent_msg").val().trim()
    evname =  $("#wrapper #newevent #event_name").val().trim()
    if msg.length<1
      alert "Please enter description"
      return
    if evname.length<1
      alert "Please enter event name"
      return


    city = ""
    country = ""
    selected = ""
    yeardetails = ""
    selected_time = ""
    total_checked = 0
    $("#newevent_table tr").each () ->
      if $(@).find("input[type='checkbox']").attr 'checked'
        city += $($(@).find("td")[1]).text() + ","
        country += $($(@).find("td")[2]).text() + ","
        yeardetails += $($($(@).find("td")[3]).find(".yeardetails")).text() + ";"
        selected_time += $($($(@).find("td")[3]).find(".selected_time")).text().trim()
        total_checked++
    if total_checked == 0
      alert "Select atleast one timezone ."
      return

    country = country.substr 0, country.length-1
    city = city.substr 0, city.length-1
    yeardetails = yeardetails.substr 0, yeardetails.length-1
    selected_time = selected_time.substr 1, selected_time.length

    #   end of getting the data

    oldobj = {}
    if "events" of localStorage
      oldobj = JSON.parse localStorage.events
    len = Object.keys(oldobj).length
    oldobj[len] = {}
    oldobj[len].name = evname
    oldobj[len].desc = msg
    oldobj[len].city = city
    oldobj[len].country = country
    oldobj[len].time = selected_time
    oldobj[len].yeardetails = yeardetails
    localStorage.events = JSON.stringify oldobj
    $("#event_close").trigger 'click'
    $("#wrapper #showevents #showeventbody").hide()
    $(".eventheader").trigger "click"


$("#event_close").live
  click : (e) ->
    $("#newevent").hide()
    $(".canhide").css "opacity","1"

$("body").live
  keydown: (e) ->
    if e.keyCode == 27
      $("#newevent").hide()
      $(".canhide").css "opacity","1"




$("#content .row .icons_homedelete .icon_delete").live
  click : (e) ->
    rowindex = Number($(e.target).parent().parent().attr("rowindex"))
    oldobj = JSON.parse localStorage.addedLocations

    len = 0
    for key of oldobj
      len++
    defaultidx = Number localStorage.default
    if defaultidx > rowindex
      defaultidx--
    delete oldobj[rowindex]
    i = 0
    newobj = {}
    for key, val of oldobj
      key = Number key
      if key > rowindex
        newobj[key-1] = val
      else
        newobj[key] = val

    localStorage.default = defaultidx
    localStorage.addedLocations = JSON.stringify newobj

    renderRows()

$("#content .row .icons_homedelete .icon_home").live
  click : (e) ->
    rowindex = Number($(e.target).parent().parent().attr("rowindex"))
    oldobj = JSON.parse localStorage.addedLocations
    i = rowindex
    temp = oldobj[rowindex]
    while i>0
      oldobj[i] = oldobj[i-1]
      i--
    oldobj[0] = temp

    localStorage.addedLocations = JSON.stringify oldobj
    localStorage.default = 0
    renderRows()


$("#dateinput").live
  mouseenter : (e) ->
    if $("#error_inputdate").css("display") is "none"
      $("#date_help").show()

  mouseleave :->
    $("#date_help").hide()
  keyup: (e) ->
    if e.keyCode == 13
      $("#setdate_go").trigger "click"

$("#setdate_go").live
  click : (e) ->
    errormsg = "mm-dd-yyyy format only"

    datestr = $("#dateinput").val().trim()
    $(".selected_date").text datestr
    window.da = datestr
    unless datestr.length is 10
      $("#error_inputdate").html errormsg
      $("#error_inputdate").show()
      return
    lenofdash = 0

    for key in datestr
      lenofdash++ if key is "-"
    #console.log lenofdash
    unless lenofdash is 2
      $("#error_inputdate").html errormsg
      $("#error_inputdate").show()
      return
    #console.log (datestr.substr(0,2))
    mm = Number datestr.substr(0,2)
    dd = Number datestr.substr(3,2)

    year =  datestr.substr(6,4)
    unless year.length is 4
      $("#error_inputdate").html errormsg
      $("#error_inputdate").show()
      return

    #console.log "---"
    year = Number datestr.substr(6,4)
    #console.log mm+" : "+dd+" : "+year
    #console.log (mm >12 or mm<1 or dd<0 or dd>31)
    if (mm >12 or mm<1 or dd<0 or dd>31)
      $("#error_inputdate").html errormsg
      $("#error_inputdate").show()
      return

    if "display_date_animation" of localStorage
      if localStorage.display_date_animation == "false"
        $(".date_help_animation_box").hide()
      else
        $(".date_help_animation_box").show()
    else
        $(".date_help_animation_box").show()
    $("#error_inputdate").hide()

    setTimeout (->
      $(".date_help_animation_box").fadeOut(3000)
    ), 15000

    options = {}
    options.m = mm-1
    options.d = dd
    options.year = year
    setSelectedDate options
    renderRows()


$(".date_help_animation_box").live
  click: ->
    that = @
    if $(@).find("input[type='checkbox']").attr("checked")
      localStorage.display_date_animation = "false"
    else
      localStorage.display_date_animation = "true"
    setTimeout (->
      $(that).fadeOut()
    ), 1000


$("#error_inputdate").live
  click : ->
    $("#error_inputdate").slideUp(50)
  focusout : ->
    $("#error_inputdate").hide(500)


$("#content").live
  sortstop : (e,ui) ->
    rowsortstop = ui.item.index() - 2
    if rowsortstart == rowsortstop
      return
    oldobj = JSON.parse localStorage.addedLocations

    startobj = oldobj[rowsortstart]

    for key, val of oldobj
      if rowsortstart < rowsortstop
        if key > rowsortstart and key <= rowsortstop
          oldobj[key-1] = val

    if rowsortstart > rowsortstop
      i=rowsortstart
      while i > rowsortstop
        oldobj[i] = oldobj[i-1]
        i--


    oldobj[rowsortstop] = startobj

    defaultind = Number localStorage.default
    if (defaultind <= rowsortstop and defaultind > rowsortstart)
      defaultind--
    else if  (defaultind <rowsortstart and defaultind >= rowsortstop )
      defaultind++

    else if defaultind == rowsortstart
      defaultind = rowsortstop

    localStorage.default = defaultind
    localStorage.addedLocations = JSON.stringify oldobj
    renderRows()

  sortstart: (e, ui) ->
    rowsortstart = ui.item.index() - 2



$("#wrapper #showevents .eventheader").live

  click : (e) ->
    #console.log "cloic"
    prev = $("#wrapper #showevents #showeventbody").css "display"
    #console.log prev
    unless prev is "none"
      $("#wrapper #showevents #showeventbody").slideUp()
      return
    unless "events" of localStorage
      $("#wrapper #showevents #showeventbody").html "<h3>No events available, you can add events by clicking on any box showing time.</h3>"
      #$("#wrapper #showevents #showeventbody").css "display","block"
      $("#wrapper #showevents #showeventbody").slideDown()
      $("body").scrollTo(".showevents")

      return
    oldobj = JSON.parse localStorage.events
    #console.log oldobj
    data = ""
    objlen = Object.keys(oldobj).length
    hr_i = 1
    for key of oldobj
      #console.log oldobj[key]
      city = new Array()
      country = new Array()
      yeardetails = new Array()
      t = new Array()
      city = oldobj[key].city.split(",")
      country  = oldobj[key].country.split(",")
      t  = oldobj[key].time.split(",")
      yeardetails  = oldobj[key].yeardetails.split(";")
      tabl = "<table class='showevent_table table table-striped'><thead><th>City</th><th>Country</th><th>Time</th></thead><tbody>"
      for i of city
        tabl+="<tr><td>"+city[i]+"</td><td>"+country[i]+"</td><td>"+yeardetails[i]+" "+t[i]+"</td></tr>"
      tabl+="</tbody></table>"
      data+= "<div class='each_event_header'><span class='event_name_desc'><span class='event_num'># "+(parseInt(key, 10)+1)+"</span><span class='event_name'> "+oldobj[key].name+"</span> - <span class='event_desc'>"+oldobj[key].desc+"</span></span><span class='deleteEvent' key='"+key+"'>X&nbsp;</span></div>"+tabl+"<br>"
      if hr_i != objlen
        data += "<hr>"
      hr_i++


    if data is ""
      data="<h3>No events available, you can add events by clicking on any box showing time.</h3>"
    data = "<div class='events'>"+data+"</div>"
    $("#wrapper #showevents #showeventbody").html data
    #$("#wrapper #showevents #showeventbody").css "display","block"
    $("#wrapper #showevents #showeventbody").slideDown()
    $("body").scrollTo("#showevents")

  mouseenter : (e) ->
    $("#event_help").show(75)
  mouseleave : (e) ->
    $("#event_help").hide(75)


$(".deleteEvent").live
  click : (e) ->

    r = confirm "Do you really want to delete this event ? "
    unless r is true
      return
    rowindex = parseInt($(e.target).attr("key"), 10)

    #console.log rowindex

    oldobj = JSON.parse localStorage.events
    len = Object.keys(oldobj).length

    if i != len-1
      i=rowindex+1
      while i<len
        oldobj[i-1] = oldobj[i]
        i++
      delete oldobj[len-1]
    else
      delete oldobj[rowindex]
    localStorage.events = JSON.stringify oldobj
    $("#wrapper #showevents #showeventbody").css "display","none"
    $("#wrapper #showevents .eventheader").trigger "click"



sr_click = (e, k) ->
  if typeof(k) == "undefined"
    k = $(e.target).attr "k"
  #offset = $("#lisr_"+k).attr "offset"
  #timestr = $("#lisr_"+k).attr "timestr"
  city_country = $("#lisr_"+k).attr "city_country"
  clicked_ind = full_data_original_arr.indexOf(city_country)
  for each_line,line_ind in full_data_original_arr
    if each_line.indexOf(city_country) > -1
      clicked_ind = line_ind
      break

  clicked_tz = full_data_original_arr[clicked_ind].split(";")[4]
  both = $("#lisr_"+k+" span.litz").text()
  botharr = both.split ","
  console.log both
  #botharr[0] country
  #botharr[1] city
  oldobj = JSON.parse localStorage.addedLocations
  len = 0
  key_arr = []
  for key of oldobj
    key_arr += key
    len++

  for key, val of oldobj
    if val['city'].trim() == botharr[1].trim()  and val['country'].trim() == botharr[0].trim()
      return

  newobj = {}
  #i = 0
  #for key, val of oldobj
  #  newobj[i] = val
  #  i += 1
  #console.log JSON.stringify newobj
  #newobj[i] = {}
  #newobj[i].country = botharr[0]
  #newobj[i].city = botharr[1]
  #newobj[i].offset = offset
  #localStorage.addedLocations = JSON.stringify newobj
  oldobj[len] = {}
  oldobj[len].country = botharr[0]
  oldobj[len].city = botharr[1]
  #oldobj[len].offset = offset
  oldobj[len].timezone = clicked_tz
  localStorage.addedLocations = JSON.stringify oldobj
  renderRows()


getRequiredOffset = (original) ->

    offset = original
    finaloff = ""
    if offset.length is 9
      offset = offset.substr(3,9)
      first = offset.substr(0,3)
      second = offset.substr(4,2)/60
      second = (second+"").substr(1)
      finaloff = parseFloat(first+second)

      #console.log "final : "+finaloff
    else
      finaloff = 0
    timestr = getNewTime(finaloff)
    #console.log timestr.toLocaleString()
    timearr = timestr.split(" ")
    timearr[4] = (timearr[4]).substr(0,5)
    return [timestr, timearr[4], finaloff]


getCities = (term) ->
  term = term.toLowerCase()
  max_items = 7
  len = 1
  for key, val of cities_data_arr
    if len > max_items
      break
    if val.indexOf(term) > -1
      temp_arr = full_data_original_arr[key].split(";")
      #required_offset = getRequiredOffset temp_arr[3]
      #console.log required_offset
      try
        cur_time = new timezoneJS.Date(temp_arr[4])
      catch err
        continue
      


      #locations += "<li class='searchresult_li' offset='"+required_offset[2]+"' timestr='"+required_offset[0]+"' id='lisr_"+len+"' k='"+len+"' city_country='"+temp_arr[0]+";"+temp_arr[1]+"'>"+
      #  "<span class='litz' k='"+len+"'>"+temp_arr[1]+", "+temp_arr[0]+"<span class='invisible_comma_search_result'>,</span> </span><span class='litime' k='"+len+"'>"+required_offset[1]+"</span></li>"
      locations += "<li class='searchresult_li' id='lisr_"+len+"' k='"+len+"' city_country='"+temp_arr[0]+";"+temp_arr[1]+"'>"+
        "<span class='litz' k='"+len+"'>"+temp_arr[1]+", "+temp_arr[0]+" </span><span class='litime' k='"+len+"'>"+cur_time.getHours()+":"+cur_time.getMinutes()+"</span></li>"
      len++
  if len < max_items+1
    for key, val of countries_data_arr
      if len > max_items
        break
      if val.indexOf(term) > -1
        temp_arr = full_data_original_arr[key].split(";")
        try
          cur_time = new timezoneJS.Date(temp_arr[4])
        catch err
          continue

        #required_offset = getRequiredOffset temp_arr[3]
        #locations += "<li class='searchresult_li' offset='"+required_offset[2]+"' timestr='"+required_offset[0]+"' id='lisr_"+len+"' k='"+len+"'  city_country='"+temp_arr[0]+";"+temp_arr[1]+"'   >"+
        #  "<span class='litz' k='"+len+"'>"+temp_arr[1]+", "+temp_arr[0]+"<span class='invisible_comma_search_result'>,</span> </span><span class='litime' k='"+len+"'>"+required_offset[1]+"</span></li>"
        locations += "<li class='searchresult_li' id='lisr_"+len+"' k='"+len+"' city_country='"+temp_arr[0]+";"+temp_arr[1]+"'>"+
          "<span class='litz' k='"+len+"'>"+temp_arr[1]+", "+temp_arr[0]+" </span><span class='litime' k='"+len+"'>"+cur_time.getHours()+":"+cur_time.getMinutes()+"</span></li>"
        len++
  return locations


renderRows = ->
  oldobj = {}
  if "addedLocations" of localStorage and "default" of localStorage

    oldobj = JSON.parse localStorage.addedLocations
    if oldobj[0].timezone == undefined
      delete localStorage.addedLocations
      window.location.reload()
  else
    #autodetect
    
    current_timezone = jstz.determine().name()
    current_city = current_timezone.split("/")[1]
    first_find_index = cities_data_arr.indexOf(current_city.toLowerCase())
    current_details_arr = full_data_original_arr[first_find_index].split(';')
    
    newobj = {}

    newobj[0] = {}
    newobj[0].city = current_details_arr[0]
    newobj[0].country = current_details_arr[1]
    newobj[0].timezone = current_timezone

    localStorage.addedLocations = JSON.stringify newobj
    localStorage.default = "0"
    oldobj = JSON.parse localStorage.addedLocations


  defaultind = localStorage.default

  defaultobj = oldobj[defaultind]
  default_time_obj = new timezoneJS.Date(defaultobj.timezone)
  default_time_obj = new timezoneJS.Date(selecteddate.year, selecteddate.m, selecteddate.d, default_time_obj.getHours(), default_time_obj.getMinutes(), defaultobj.timezone)

  row = ""
  for ind of oldobj
    time_obj = new timezoneJS.Date(default_time_obj, oldobj[ind].timezone)
    hours = time_obj.getHours() - default_time_obj.getHours()
    min = time_obj.getMinutes() - default_time_obj.getMinutes()
    diff = hours + (min/60)
    if time_obj.getDate() != default_time_obj.getDate()
      if default_time_obj.getFullYear() != time_obj.getFullYear()
        if default_time_obj.getFullYear() > time_obj.getFullYear()
          diff = -(24-diff)
        else
          diff = 24+diff
      else if default_time_obj.getMonth() != time_obj.getMonth()
        if default_time_obj.getMonth() > time_obj.getMonth()
          diff = -(24-diff)
        else
          diff = 24+diff

      else if default_time_obj.getDate() > time_obj.getDate()
        diff = -(24-diff)
      else
        diff = 24+diff
    oldobj[ind].diff = diff
    oldobj[ind].timestr = time_obj._dateProxy+""



  for ind of oldobj 
    timestr = oldobj[ind].timestr
    timearr = timestr.split " "
    diffoffset = oldobj[ind].diff


    #now do hourline operation , and finally add it to "dates"
    diffoffsetstr = diffoffset+""
    hourstart = 1
    if diffoffsetstr.indexOf("-") > -1
      diffoffsetstr = diffoffsetstr.substr(1)

      hourstart = 24+diffoffset

    else
      hourstart = diffoffset

    i=hourstart

    tempstr = " "
    if (i+"").indexOf(".") > -1
        tempstr = (i+"").substr((i+"").indexOf(".")+1)
        tempstr = parseFloat tempstr
        if tempstr >= 0.5
          tempstr="30"
        else
          tempstr=" "
    selectedDateStr = selecteddate.dayInText+", "+selecteddate.mText+" "+selecteddate.d+", "+selecteddate.year

    #timeextrastr = selecteddate.dayInText+", "+selecteddate.mText+" "+selecteddate.d+"  "+selecteddate.year
    timeextrastr = timearr[0]+", "+timearr[1]+" "+timearr[2]+" "+timearr[3]
    hourline = "<ul class='hourline_ul'>"
    idx = 0

    iorig = i
    if i is 0 or i is 0.5

      cl = "li_24"
      hourline+=" <li class='"+cl+"' id='lihr_"+idx+"' idx='"+idx+"' t='"+i+"' details='"+selectedDateStr+"' ><div class='span_hl' idx='"+idx+"'><span idx='"+idx+"' class='small small-top' >"+selecteddate.mText+"</span><br><span idx='"+idx+"' class='small' >"+selecteddate.d+"</span></div></li>"

      i = 1
      idx++
    #first loop, till 24-1


    monInNum = getMonth timearr[1],{"type":"num"}
    d = new Date()
    #d.setFullYear timearr[3],monInNum,timearr[2]
    d.setFullYear selecteddate.year,selecteddate.m,selecteddate.d
    #presdate = d.toLocaleString()
    presdate = d+""

    presdatearr = presdate.split " "
    presdatestr = presdatearr[0]+", "+presdatearr[1]+" "+presdatearr[2]+", "+presdatearr[3]

    prevdate = new Date()
    prevdate.setFullYear selecteddate.year,selecteddate.m,selecteddate.d

    prevdate.setTime prevdate.getTime() - 86400000
    #prevdate = prevdate.toLocaleString()
    prevdate = prevdate+""
    prevdatearr = prevdate.split " "
    prevdatestr = prevdatearr[0]+", "+prevdatearr[1]+" "+prevdatearr[2]+", "+prevdatearr[3]


    d.setTime d.getTime()+86400000

    #d = d.toLocaleString()
    d = d+""
    nextdayarr = d.split " "
    nextDayStr = nextdayarr[0]+", "+nextdayarr[1]+" "+nextdayarr[2]+", "+nextdayarr[3]


    dayusedarr = []
    dayusedstr = ""

    if diffoffset >= 0
      dayusedarr = nextdayarr
      dayusedstr = nextDayStr
      datedetailstr = presdatestr
    else
      dayusedarr = presdatearr
      dayusedstr = presdatestr
      datedetailstr = prevdatestr



    while i<24
      if i<6
        cl="li_n"
      else if i>5 and i<8
        cl = "li_m"
      else if i>7 and i<19
        cl = "li_d"
      else if i>18 and i<22
        cl = "li_e"
      else
        cl = "li_n"


      tval = convertOffsetToFloat(parseInt(i, 10)+":"+tempstr)
      #console.log "tval : "+tval+" ------- "+tempstr


      #next_day = new Date(timestr)
      #
      #next_day.setDate(next_day.getDate()+1)
      #next_day_arr = next_day.toLocaleString().split(" ")

      next_day = new Date(default_time_obj._dateProxy)
      next_day.setDate(next_day.getDate()+1)
      next_day_arr = next_day.toLocaleString().split(" ")

      today_str = new Date(default_time_obj._dateProxy)
      today_arr = today_str.toLocaleString().split " "
      req_mon = ""
      req_date = ""
      if diffoffset > 0
        req_mon = next_day_arr[1]
        req_date = next_day_arr[2]
      else
        #req_mon = timearr[1]
        #req_date = timearr[2]
        req_mon = today_arr[1]
        req_date = today_arr[2]

      hourline+=" <li class='"+cl+"' id='lihr_"+idx+"' idx='"+idx+"' t='"+tval+"'  details='"+datedetailstr+"'><div class='span_hl' idx='"+idx+"'><span class='medium' idx='"+idx+"'>"+parseInt(i, 10)+"</span><br><span class='small' idx='"+idx+"'>"+tempstr+"</span></div></li>"

      if tempstr is " "
        hourline = hourline.replace "<span class='medium' idx='"+idx+"'>","<span idx='"+idx+"' class='box_center' >"
      idx++
      i++


    #second, directly put date

    unless hourstart is 0



      cl = "li_24"
      if iorig != 0.5
        hourline+=" <li class='"+cl+"' id='lihr_"+idx+"' idx='"+idx+"' t='"+(24-i)+"' x="+i+"  details='"+dayusedstr+"' ><div class='span_hl' idx='"+idx+"'><span idx='"+idx+"'  class='small small-top'> "+dayusedarr[1]+"</span><br><span idx='"+idx+"' class='small' >"+dayusedarr[2]+"</span></div></li>"
      if timestr is " "
        i=1
      else
        i=1.5
      i=1
      idx++

    # third, loop upto hourstart-1

    #console.log "Before while : "+i
    while i<parseInt(hourstart, 10)
      if i<6
        cl="li_n"
      else if i>5 and i<8
        cl = "li_m"
      else if i>7 and i<19
        cl = "li_d"
      else if i>18 and i<22
        cl = "li_e"
      else
        cl = "li_n"


      #console.log i
      tval = convertOffsetToFloat(parseInt(i, 10)+":"+tempstr)
      #console.log "tval : "+tval+" ------- "+tempstr

      if diffoffset >=0
        datedetailstr = nextDayStr
      else
        datedetailstr =  presdatestr

      hourline+=" <li class='"+cl+"' id='lihr_"+idx+"' idx='"+idx+"' t='"+tval+"' details='"+datedetailstr+"' ><div class='span_hl' idx='"+idx+"'><span class='medium' idx='"+idx+"'>"+parseInt(i, 10)+"</span><br><span class='small' idx='"+idx+"'>"+tempstr+"</span></div></li>"
      if tempstr is " "
        hourline = hourline.replace "<span class='medium' idx='"+idx+"'>","<span idx='"+idx+"' class='box_center' >"
      i++
      idx++

    hourline+="</ul>"

    sym = ""
    if diffoffset > 0
      sym = "+"


    row+= "<div class='row' id='row_"+ind+"' rowindex='"+ind+"' time='"+timearr[4].substr(0, 5)+"' floatoffset='"+diffoffset+"' timezone='"+oldobj[ind].timezone+"' ><div class='tzdetails'><div class='offset'>"+sym+(diffoffset)+"<br><span class='small' >Hours</span></div><div class='location'><span class='city'>"+oldobj[ind].city+"</span><br><span class='country'>"+oldobj[ind].country+"</span></div><div class='timedata'><span class='time'>"+timearr[4].substr(0, 5)+"</span><br><span class='timeextra'>"+timeextrastr+"</span></div></div><div class='dates'>"+hourline+"</div></div> "

  #$("#content").html "<div id='vband'></div><div id='selectedband'></div>"
  $("#content").html row
  #$("#content .row .dates li").first().append "<div id='vband'></div><div id='selectedband'></div>"
  $("#content").prepend "<div id='vband'></div><div id='selectedband'></div>"
  #home, delete icons
  icons_homedelete = "<div class='icons_homedelete'><div class='icon_delete'>x</div><div class='icon_home'  ></div></div>"
  $("#content .row").append icons_homedelete

  #modifying style of default location row
  defaultind = parseInt localStorage.default, 10

  $("#content #row_"+defaultind+" .icons_homedelete").html ""

  $("#content #row_"+defaultind+" .tzdetails .offset").html "<div class='homeicon'></div>"

  $(".row .dates li").first().css "position","relative"
  height =$("#content .row").length*72-41
  left   = $("#content #row_"+defaultind).attr("time")
  left = left.substr 0,left.indexOf(":")
  left = Number left

  #console.log "left : "+left
  left = left*28 + 322
  #console.log left+" : "+height
  $("#selectedband").css "height",height
  $("#selectedband").css "left",left
  left = parseInt($("#selectedband").css("left"), 10)
  $("#vband").css "left",(left-2)
  $("#vband").css "height",$("#selectedband").css("height")
  $("#content").sortable({'containment':'parent', 'items':'.row'})

convertOffsetToFloat = (str) ->
  first = str.substr(0,str.indexOf(":"))
  second = parseFloat(str.substr(str.indexOf(":")+1))/60
  second = (second+"").substr((second+"").indexOf(".")+1)
  return parseFloat(first+"."+second)


convertOffset = (ad_offset) ->
  sign = ""
  str = ""
  first = ""
  second = ""
  ad_offset = ad_offset+""
  if ad_offset.indexOf("-") > -1
    sign = "-"
    str = ad_offset.substr(1)
  else
    sign = "+"
    str = ad_offset
  if str.indexOf(".") > -1

    first = str.substr(0,str.indexOf("."))
    second = parseInt(str.substr(str.indexOf(".")+1), 10)*6+""
    if first.length is 1
      first = "0"+first
    if second.length is 1
      second = "0"+second
  else
    if str.length is 1
      first = "0"+str
    else
      first = str
    second = "00"
  return sign+first+":"+second


getMonth = (mon,options) ->
  month = new Array()
  month[0]="Jan"
  month[1]="Feb"
  month[2]="Mar"
  month[3]="Apr"
  month[4]="May"
  month[5]="Jun"
  month[6]="Jul"
  month[7]="Aug"
  month[8]="Sep"
  month[9]="Oct"
  month[10]="Nov"
  month[11]="Dec"
  if options.type is "num"
    for m of month
      if month[m] is mon
        return m
  else if options.type is "str"
    return month[mon]

setSelectedDate = (options) ->
#  HERE IN OPTIONS, SEND MONTH IN ZERO INDEXED FORMAT
  if options
    selecteddate = options
    selecteddate.mText = getMonth selecteddate.m,{"type":"str"}
    #dnew = new Date(selecteddate.m+"-"+selecteddate.d+"-"+selecteddate.year)
    dnew = new Date()
    dnew.setMonth(selecteddate.m)
    dnew.setDate(selecteddate.d)
    dnew.setFullYear(selecteddate.year)
    dnew = dnew.toLocaleString()
    dnewarr = dnew.split " "
    selecteddate.dayInText = dnewarr[0]
    selecteddate.m = options.m
    selecteddate.d = options.d
    selecteddate.year = options.year



  else
    d = new Date()
    selecteddate.m = d.getMonth()
    selecteddate.d = d.getDate()
    selecteddate.year = d.getYear()+1900
    selecteddate.mText = getMonth selecteddate.m,{"type":"str"}
    #dnew = new Date((parseInt(selecteddate.m+1))+"-"+selecteddate.d+"-"+selecteddate.year)
    dnew = new Date()
    dnew.setMonth(selecteddate.m)
    dnew.setDate(selecteddate.d)
    dnew.setFullYear(selecteddate.year)
    dnew = dnew.toLocaleString()
    dnewarr = dnew.split " "
    selecteddate.dayInText = dnewarr[0]
  #renderRows()

updateUtc = ->
  d = new Date()
  dstr=d.toLocaleString()
  datearr = dstr.split(" ")
  #console.log "time : "+datearr[4]+" off : "+datearr[5]+" stand : "+datearr[6]
  localtime = d.getTime()
  localoffset = d.getTimezoneOffset()*60000
  utc = localtime + localoffset

getNewTime = (offset) ->
  newtime = utc + (3600000*offset)
  nd = new Date(newtime)
  ndstr = nd.toLocaleString()
  return ndstr

open_in_new_tab = (url) ->
  window.open url, '_blank'
  window.focus()


$(".link_export_google_cal").live
  click: (e) ->
    e.preventDefault()
    link_desc = ""
    for ele in $("#newevent_table tr")
      if $(ele).find("input[type='checkbox']").attr "checked"
        td_arr = $(ele).find("td")
        link_desc += $(td_arr[1]).text().trim()+", "+$(td_arr[2]).text().trim()+", "+$(td_arr[3]).find('.yeardetails').text().trim()+" "+$(td_arr[3]).find('.selected_time').text().trim()+"\n"

    #calculating utc
    #d = timezoneJS.Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), timezone)
    #d = timezoneJS.Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), timezone)
    gmt_str = $($("#newevent_table tr")[1]).find("td")[3]
    timezone = $($("#newevent_table tr")[1]).attr "timezone"
    #floatoffset =$( $("#newevent_table tr")[1]).attr "floatoffset"
    gmt_str = $($(gmt_str).find('.yeardetails')).text().trim()+" "+$($(gmt_str).find('.selected_time')).text().trim()
    d = new Date(gmt_str)
    #d.setHours(d.getHours()+Number(floatoffset))
    d = new timezoneJS.Date(d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), timezone)
    d.setDate(d.getUTCDate())

    d.setHours(d.getUTCHours())
    d.setMinutes(d.getUTCMinutes())

    google_cal_dates_param = get_google_cal_dates_param(d)

    next_day = d
    next_day.setHours d.getHours()+1

    google_cal_dates_param += "/"+get_google_cal_dates_param(next_day)

    gcal_url = "https://www.google.com/calendar/render?action=TEMPLATE&details="+link_desc
    if $("#newevent_msg").val().trim().length > 0
      gcal_url += '\n'+$("#newevent_msg").val().trim()
    if $("#event_name").val().trim().length > 0
      gcal_url += "&text="+$('#event_name').val().trim()
    gcal_url += '\n'+"Powered by http://agiliq.com/timezones/"
    gcal_url += "&dates="+google_cal_dates_param


    $(".link_export_google_cal").attr "href", encodeURI(gcal_url)
    open_in_new_tab($(".link_export_google_cal").attr('href'))


get_google_cal_dates_param = (d) ->
    month_str = d.getMonth()+1
    if (month_str+"").trim().length == 1
      month_str = "0"+month_str
    day_str = d.getDate()
    if (day_str+"").trim().length == 1
      day_str = "0"+day_str
    min_str = d.getMinutes()
    if (min_str+"").trim().length == 1
      min_str = "0"+min_str
    hour_str = d.getHours()
    if (hour_str+"").trim().length == 1
      hour_str = "0"+hour_str
    google_cal_dates_param = ""+d.getFullYear()+month_str+day_str+"T"+hour_str+min_str+"00Z"

