
let feedback_id = sessionStorage.getItem('feedback_id');
let feedback_type = sessionStorage.getItem('feedback_type');
let feedback_category = sessionStorage.getItem("feedback_category");

async function fetchDeleteFeedback(feedback_id)
{
    const response = await fetch(`/feedback/${feedback_id}`,
        {
            method:'DELETE',
            headers:
            {
                "Content-Type":'application/json'
            }
        }
    )
    .then
    (
        window.alert("Feedback Deleted")
    );
    
}

async function fetchUpdateFeedback(feedback_id)
{
    const response = await fetch(`/feedback/${feedback_id}`,
        {
            method:'PUT',
            headers:
            {
                "Content-Type":'application/json'
            }
        }
    )
    .then
    (
        window.alert("Feedback Updated")
    );
}

async function fetchSpecificFeedback(feedback_id)
{
    const response = await fetch("/feedback");
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}

async function fetchSpecificBugFeedback(feedback_id,)
{
    const response = await fetch("/feedback/bug");
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificCustomerServiceFeedback(feedback_id)
{
    const response = await fetch("/feedback/customerservice");
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificfeedbackFeedback(feedback_id)
{
    const response = await fetch("/feedback/feedback");
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificOtherFeedback(feedback_id)
{
    const response = await fetch("/feedback/other");
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}


async function fetchSpecificFeedback1(feedback_id,data)
{
    console.log(feedback_id);
    // const response = await fetch("/feedback");
    // const data = await response.json();
    const text = feedback_id.split("-")
    const id = text[1];
    const feedback = data[id];
    document.getElementById("feedback_title").innerHTML = "Title: "+ feedback.title;
    document.getElementById("feedback_category").innerHTML = "Category: " + feedback.category;
    document.getElementById("feedback_description").innerHTML = "Description: " + feedback.description;

    const verify_button = document.getElementById("feedback_verify");
    const delete_button = document.getElementById("feedback_delete");

    verify_button.addEventListener("click",() =>
    {
        fetchUpdateFeedback(feedback.id)
        window.location.href = "staff_feedback.html"
    })
    delete_button.addEventListener("click",() =>
        {
            fetchDeleteFeedback(feedback.id)
            window.location.href = "staff_feedback.html"
        })
}

if(feedback_category == "All")
    {
        fetchSpecificFeedback(feedback_id);
    }
else if(feedback_category == "Bug")
    {
        fetchSpecificBugFeedback(feedback_id);
    }
else if(feedback_category == "Customer service")
    {
        fetchSpecificCustomerServiceFeedback(feedback_id);
    }
else if(feedback_category == "Feedback")
    {
        fetchSpecificfeedbackFeedback(feedback_id)
    }
else if(feedback_category == "Other")
    {
        fetchSpecificOtherFeedback(feedback_id)
    }