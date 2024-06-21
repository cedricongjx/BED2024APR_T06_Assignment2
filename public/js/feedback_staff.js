
async function fetchFeedback()
{
    const response = await fetch("/feedback");
    const data = await response.json();
    const feedback_container = document.getElementsByClassName("feedback_section");
    var feedback_list = document.getElementsByClassName("row align-items-center");
    var count =0;
    var i = 0;
    // const feedback_list = document.getElementsByClassNam)_;
    var feedback_row = document.createElement("div");
    feedback_row.classList.add("row","align-items-center","feedback_row");
    feedback_container[0].appendChild(feedback_row);
    data.forEach((feedback)=>
    {
        feedback_list = document.getElementsByClassName("row align-items-center");
        if (count ==3)
            {
                feedback_row = document.createElement("div");
                feedback_row.classList.add("row","align-items-center","feedback_row");
                feedback_container[0].appendChild(feedback_row);
                count = 0
                i++;
            }
        const feedback_item = document.createElement("button")
        feedback_item.classList.add("col","feedback_item");
        feedback_item.textContent = feedback.title
        feedback_list[i].appendChild(feedback_item);
        count ++;
    });
    var items = document.getElementsByClassName("col feedback_item");
    for(i = 0; i<items.length; i++)
        {
            items[i].id = 'feedback-' + i;         
        }
    for(i = 0; i<items.length; i++)
        {
            items[i].addEventListener("click",function(e)
            {
                sessionStorage.setItem("feedback_id",e.target.id); 
                window.location.href = "staff_feedback_details.html"
            })
        }
    
}

fetchFeedback();







