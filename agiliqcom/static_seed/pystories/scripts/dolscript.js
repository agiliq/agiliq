//document has been loaded
//create an event for the radio button click
//the moment he cliks that 
 $(document).ready(function() {   
   $("input.fbutton").click(handleFeedback);
   $("#widgetcode").click(selectWidgetCode);
   //select all the code in the textarea
   
 });
 
 function handleFeedback()
 {
   var value = $("input[@name=feedback]:checked").val();
    $('#feedbackbox').replaceWith("<span class='green'> Thanks for your feedback</span>");
    var data = {}
    data.feedback_value = value;
    $.post("/buzz/postfeedback/",
                data,
                handleResponse,
                "text"
            );
 }
 
 function selectWidgetCode()
 {
    $("#widgetcode").select();   
 }
 
 
//handle the response data not much to handle now................
function handleResponse(responseData) {
    
}
