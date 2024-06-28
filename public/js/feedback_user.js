
const button = document.getElementById("submit_button_feedback");

async function postInfo()
{
    const title = document.getElementById("inputTitle").value;
    const description = document.getElementById("description").value;
    const cateogry  = document.getElementById("feedback_category").value;
    const res = await fetch("/feedback",
        {
            method:'POST',
            headers:
            {
                "Content-Type":'application/json'
            },
            body: JSON.stringify
            ({
                title: title,
                description: description,
                category:cateogry
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


