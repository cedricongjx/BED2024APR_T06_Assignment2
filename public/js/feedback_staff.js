
async function fetchBugFeedback(value)
{
    const response = await fetch("/feedback/bug");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchCustomerServiceFeedback(value)
{
    const response = await fetch("/feedback/customerservice");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchfeedbackFeedback(value)
{
    const response = await fetch("/feedback/feedback");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchOtherFeedback(value)
{
    const response = await fetch("/feedback/other");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

function createHTMLDOMFeedback(data,category)
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
        const feedback_time = new Date(feedback.time);
        const feedback_time_string = feedback_time.toISOString().substring(0,10);

        // console.log(feedback.time)
        // const year = feedback_time.getFullYear();
        // const month = feedback_time.getMonth();
        // const day = feedback_time.getDate();
        // const feedback_time_string = day+"/"+month+"/"+year
        feedback_item.innerHTML = `<h3>${feedback.title}</h3> <br> <div> ${feedback_time_string}</div>`

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
                const text = e.target.id.split("-")
                const id = text[1];
                sessionStorage.setItem("feedback_type",data[id].category);
                if(category == undefined)
                    {
                        category = "All"
                    }
                sessionStorage.setItem("feedback_category",category);
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

async function fetchAllFeedback(value)
{

    const response = await fetch("/feedback");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchAllVerifiedFeedback(value)
{
    const response = await fetch("/feedback/verified");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchAllNotVerifiedFeedback(value)
{
    const response = await fetch("/feedback/notverified");
    const data = await response.json();
    createHTMLDOMFeedback(data,value);
}

async function fetchFeedbackByName(name)
{
    const response = await fetch(`/feedback/name?searchTermFeedback=${name}`)
    const data = await response.json();
    createHTMLDOMFeedback(data,"All");

}

fetchAllFeedback();

const category = document.getElementById("staff_feedback_category");
    var value;
    category.addEventListener("change", function(e)
        {
            value = category.value;
            deleteHTML();

            if(value == "Not Verified")
            {
                fetchAllNotVerifiedFeedback(value);
            }
            else if(value == "Verified")
            {
                fetchAllVerifiedFeedback(value);
            }
            else if(value == "Bug")
                {
                    fetchBugFeedback(value);
                }
            else if(value == "Customer service")
                {
                    
                    fetchCustomerServiceFeedback(value);
                }
            else if(value == "Feedback")
                {
                    fetchfeedbackFeedback(value);
                }
            else if(value == "Other")
                {
                    
                    fetchOtherFeedback(value);
                }
            else if(value == "All")
                {
                    fetchAllFeedback(value);
                }
           
        });


//Search
const search = document.getElementById("feedback_search_value");
const search_button = document.getElementById("feedback_search_button");
search_button.addEventListener("click", function(e)
{
    e.preventDefault();
    const search_value = search.value

    if(search_value == "")
    {
        deleteHTML();
        fetchAllFeedback();
    }
    else
    {
        deleteHTML();
        fetchFeedbackByName(search_value);
    }
    
});







