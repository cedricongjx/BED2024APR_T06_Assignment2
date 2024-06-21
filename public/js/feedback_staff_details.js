
let feedback_id = sessionStorage.getItem('feedback_id')
async function fetchSpecificFeedback(feedback_id)
{
    const response = await fetch("/feedback");
    const data = await response.json();
    const text = feedback_id.split("-")
    const id = text[1];
    const feedback = data[id];
    document.getElementById("feedback_title").innerHTML = "Title: "+ feedback.title;
    document.getElementById("feedback_description").innerHTML = "Description: " + feedback.description;

}
fetchSpecificFeedback(feedback_id);