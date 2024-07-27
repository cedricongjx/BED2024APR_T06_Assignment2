
let feedback_id = sessionStorage.getItem('feedback_id');
let feedback_type = sessionStorage.getItem('feedback_type');
let feedback_category = sessionStorage.getItem("feedback_category");
const token = localStorage.getItem('token');

async function fetchDeleteFeedback(feedback_id)
{
    const response = await fetch(`/feedback/delete/${feedback_id}`,
        {
            method:'DELETE',
            headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type":'application/json'
            }
        }
    )
    .then
    (
        window.alert("Feedback Deleted")
    );
    
}

async function fetchAddJustification(justification,feedback_id)
{
    const response = await fetch('/feedback/verified',
        {
            method:'POST',
            headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type":'application/json'
            },
            body: JSON.stringify
            ({
                justification: justification,
                feedback_id: feedback_id
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
            window.alert("Justification submitted")
            console.log(data);
        }
    )
}

async function fetchUpdateResponse(response1,feedback_id)
{

    const response = await fetch('/feedback/response',
        {
            method:'PUT',
            headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type" : 'application/json'
            },
            body : JSON.stringify
            (
                {
                    response: response1,
                    feedback_id: feedback_id
                }
            )
        }
    )
    .then(res =>
        {
            res.json()
        }
    )
    .then(data =>
        {
            window.alert("Response submitted")
            console.log(data);
        }
    )
}

async function fetchUpdateFeedback(feedback_id)
{
    const response = await fetch(`/feedback/update/${feedback_id}`,
        {
            method:'PUT',
            headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type":'application/json'
            }
        }
    )
    const justification_button = document.getElementById("feedback_justification_submit");
    justification_button.addEventListener("click",() =>
    {
        const justification_text =document.getElementById("feedback_justification_text").value;
        fetchAddJustification(justification_text, feedback_id);
    })


    
}

async function fetchSpecificFeedback(feedback_id)
{
    const response = await fetch("/feedback",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}

async function fetchSpecificVerifiedFeedback(feedback_id)
{
    const response = await fetch("/feedback/verified",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}

async function fetchSpecificNotVerifiedFeeedback(feedback_id)
{
    const response = await fetch("/feedback/notverified",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}

async function fetchSpecificBugFeedback(feedback_id,)
{
    const response = await fetch("/feedback/bug",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificCustomerServiceFeedback(feedback_id)
{
    const response = await fetch("/feedback/customerservice",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificfeedbackFeedback(feedback_id)
{
    const response = await fetch("/feedback/feedback",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}
async function fetchSpecificOtherFeedback(feedback_id)
{
    const response = await fetch("/feedback/other",{
        headers:
        {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    fetchSpecificFeedback1(feedback_id,data);
}


async function fetchSpecificFeedback1(feedback_id,data)
{
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

    if(feedback.verified == "Y")
        {
            verify_button.innerText = "Response"
            verify_button.dataset.target = "#feedback_response_modal";
        }

    verify_button.addEventListener("click",() =>
    {
        if(feedback.verified == "Y")
            {
                const response_submit = document.getElementById("feedback_response_submit");
                const response_text = document.getElementById("feedback_response_text");
                response_submit.addEventListener("click" ,function(e)
                    {
                        e.preventDefault();
                        const response = response_text.value
                        fetchUpdateResponse(response, feedback.id);
                    })
                
                //fetchUpdateResponse()
            }
        else
            {
                fetchUpdateFeedback(feedback.id)

            }
        //window.location.href = "staff_feedback.html"
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
else if(feedback_category == "Verified")
    {
        fetchSpecificVerifiedFeedback(feedback_id)
    }
else if(feedback_category == "Not Verified")
    {
        fetchSpecificNotVerifiedFeeedback(feedback_id);
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