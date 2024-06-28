
async function fetchBugFeedback()
{
    const response = await fetch("/feedback/bug");
    const data = await response.json();
    createHTMLDOMFeedback(data);
}

async function fetchCustomerServiceFeedback()
{
    const response = await fetch("/feedback/customerservice");
    const data = await response.json();
    createHTMLDOMFeedback(data);
}

async function fetchfeedbackFeedback()
{
    const response = await fetch("/feedback/feedback");
    const data = await response.json();
    createHTMLDOMFeedback(data);
}

async function fetchOtherFeedback()
{
    const response = await fetch("/feedback/other");
    const data = await response.json();
    createHTMLDOMFeedback(data);
}

function createHTMLDOMFeedback(data)
{
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

function deleteHTML()
{
    const feedback_container = document.getElementById("feedback_test");
    while(feedback_container.childElementCount != 1)
        {
            feedback_container.removeChild(feedback_container.lastChild);
        }
}   

async function fetchAllFeedback()
{

    const response = await fetch("/feedback");
    const data = await response.json();
    createHTMLDOMFeedback(data);
}

fetchAllFeedback();

const category = document.getElementById("staff_feedback_category");
    var value;
    category.addEventListener("change", function(e)
        {
            value = category.value;
            console.log(value);
            deleteHTML();
            if(value == "Bug")
                {
                    fetchBugFeedback();
                }
            else if(value == "Customer service")
                {
                    
                    fetchCustomerServiceFeedback();
                }
            else if(value == "Feedback")
                {
                    fetchfeedbackFeedback();
                }
            else if(value == "Other")
                {
                    
                    fetchOtherFeedback();
                }
            else if(value == "All")
                {
                    fetchAllFeedback();
                }
           
        });









