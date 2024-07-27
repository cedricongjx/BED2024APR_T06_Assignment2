
const ctx = document.getElementById('feedback_chart');
const token = localStorage.getItem('token');

async function getFeedbackByCategories()
{
  const response = await fetch("/feedback/categorycount",
    {
      headers:
            {
                'Authorization' : `Bearer ${token}`,
                "Content-Type" : 'application/json'
            },
    }
  )
    const data = await response.json();
    const categories = []
    const feedback_count = []
    for(i = 0; i<data.length; i++)
    {
      categories.push(data[i].category);
      feedback_count.push(data[i].Feedback_Count)
    }

    ctx = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,

      datasets: [{
        label: 'Number of feedback by categories',
        data: feedback_count,
        borderColor:"black",
        backgroundColor: ['darkblue','blue','red', 'green'],
        
      }],
      hoverOffset: 4

    },
    
    options: {
      // scales: {
      //   y: {
      //     beginAtZero: true
      //   }
      // }
      
      plugins: {
        
        legend: {
            display: true,
            labels:
            {
              font:
              {
                size:20
              },
            },
            
        }
    }
    }
  });
    



  
}
getFeedbackByCategories();
console.log(ctx)