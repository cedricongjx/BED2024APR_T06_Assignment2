
let feedback_id = sessionStorage.getItem('feedback_id')

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

fetchSpecificFeedback(feedback_id);