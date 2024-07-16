async function fetchResponse(userid)
{
    const response = await fetch(`/feedback/response/${userid}`);
    const data = await response.json();
    createHTML(data);
}

function createHTML(data)
{

    const inbox_container = document.getElementById("inbox_feedback_container");
    
    // console.log(inbox_container)
    for(i = 0; i<data.length; i++)
    {   
        const inbox_row_item = document.createElement("div");
        inbox_row_item.classList.add("row","inbox_feedback_item");
        inbox_row_item.textContent = data[i].title;
        inbox_container.appendChild(inbox_row_item);
        const count = i;
        inbox_row_item.addEventListener("click",function(e)
        {
            const modal_body = document.getElementById('feedback_response_modal_body');
            console.log(modal_body);
            modal_body.textContent = data[count].response
            $('#feedback_response').modal('show')
        })
    }
    
    

}


fetchResponse(2);