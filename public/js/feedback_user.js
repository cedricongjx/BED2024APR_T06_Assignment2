
const button = document.getElementById("submit_button_feedback");
const token = localStorage.getItem('token');
const user_id = localStorage.getItem("userid");

async function postInfo()
{
    // const title = document.getElementById("inputTitle").value;
    const title = document.getElementById("feedbackTitle").value;

    // const description = document.getElementById("description").value;
    const description = document.getElementById("feedbackDescription").value;

    const cateogry  = document.getElementById("feedback_category").value;


    const res = await fetch("/feedback/create",
        {
            method:'POST',
            headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type":'application/json'
            },
            body: JSON.stringify
            ({
                title: title,
                description: description,
                category:cateogry,
                user_id:user_id
            })
        }
    )
    .then(res =>
        {
            res.json()
        }
    )
    .then(data =>
        {
            window.alert("Feedback submitted")
            console.log(data);
        }
    )
}


button.addEventListener("click", (e)=>
{
    e.preventDefault();
    postInfo();
    document.getElementById("feedback_form_id").reset();
});


