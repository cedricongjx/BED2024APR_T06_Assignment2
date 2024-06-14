
var items = document.getElementsByClassName("col feedback_item");

for(i = 0; i<items.length; i++)
    {
        items[i].addEventListener("click",()=>
            {
                window.location.href = "staff_feedback_details.html"
            })
    }
