var urlString = window.location.href.split('?')[1].split('&');
var n = urlString[0].substring(2,);
var typ = urlString[1].substring(4,);

function getRndInteger(min, max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

if (typ == 1)
{
    // player goes first, generate pile with xor = 0
    var max = 16;
    var min = 1;
    while (1)
    {
        var values = [];
        var xor = 0;
        for (var i=0;i<n-1;i++)
        {
            values.push(getRndInteger(min,max));
            xor ^= values[i];
        }
        if (xor != 0)
        {
            values.push(xor);
            break;
        }
    }
}
else
{
    // player goes first, generate pile with non zero xor
    var max = 16;
    var min = 1;
    while (1)
    {
        var values = [];
        var xor = 0;
        for (var i=0;i<n;i++)
        {
            values.push(getRndInteger(min,max));
            xor ^= values[i];
        }
        if (xor != 0)
        {
            break;
        }
    }
}

var xValues = [];
var colors = [];
for (var i=0;i<n;i++)
{
    xValues.push("");
    colors.push("red")
}

var barIndex = -1;
var canvas = document.getElementById('myChart');
var myChart = new Chart(canvas.getContext('2d'),
{
    type: "bar",
    data: 
    {
        labels: xValues,
        datasets: 
        [{
            backgroundColor: Array.from(colors),
            data: values
        }]
    },
    options: 
    {
        scales: {
            yAxes:[{
                display: true,
                ticks: {
                    suggestedMin:0,
                    suggestedMax:15,
                    fontSize:20,
                    fontStyle:"bold"
        }}]},
        title:{display:false},
        legend: {display:false},
        events: ['click'], onClick: function(e)
        {
            barIndex = -1;
            var element = this.getElementAtEvent(e);
            if(element.length > 0)
            {
                this.data.datasets[0].backgroundColor = Array.from(colors);
                myChart.update();
        		var idx = element[0]._index;
                barIndex = idx;
                this.data.datasets[0].backgroundColor[idx] = "green";
            }
        }
    }
});

function computerTurn()
{
    var xor = 0,idx = 0;
    var barValues = myChart.data.datasets[0].data;
    for (var i=0;i<n;i++)
    {
        xor ^= barValues[i];
    }
    for (var i=0;i<n;i++)
    {
        var xor1 = xor^barValues[i];
        if (xor1 < barValues[i])
        {
            idx = i+1;
            break;
        }
    }
    xor ^= barValues[idx-1];
    var choose = barValues[idx-1]-xor;
    setTimeout(() => {document.getElementById("instruction").innerHTML = 
    "Computer chooses to decrease value "+choose+" from bar "+idx},1000);
    barValues[idx-1] -= choose;
    setTimeout(() => {myChart.update()},2500);
    var newMax = 0;
    for (var i=0;i<n;i++)
    {
        newMax = Math.max(newMax,barValues[i]);
    }
    if (newMax == 0)
    {
        setTimeout(() => 
        {
            document.getElementById("instruction").innerHTML = "YOU LOSE";
            document.getElementById("instruction").style.fontSize = "5vw"
            var btn = document.getElementById("submit");
            btn.innerHTML = "PLAY AGAIN";
            btn.style.fontSize = "3vw";
            btn.onclick = function(){location.href = "index.html";}
            document.getElementById("myChart").remove();
            document.getElementById("numInput").remove();
        },3500);
    }
    else
    {
        setTimeout(() => {document.getElementById("instruction").innerHTML = 
        "Select bar, enter the value you want to decrease and click PLAY";},3500);
    }
}

function playUserTurn()
{
    var dec = Number(document.getElementById("numInput").value);
    var barValues = myChart.data.datasets[0].data;
    if (barIndex == -1)
    {
        alert("Select a bar");
        document.getElementById("numInput").value = "";
    }
    else if (dec == NaN)
    {
        alert("Enter value");
        document.getElementById("numInput").value = "";
    }
    else if (Number.isInteger(dec) == false || dec <= 0)
    {
        alert("Enter positive integer value");
        document.getElementById("numInput").value = "";
    }
    else if (barValues[barIndex] < dec)
    {
        alert("Chosen value cannot be greater than bar value");
        document.getElementById("numInput").value = "";
    }
    else
    {
        barValues[barIndex] -= dec;
        myChart.data.datasets[0].backgroundColor[barIndex] = "red";
        myChart.update();
        document.getElementById("numInput").value = "";
        computerTurn();
    }
}

if (typ == 2)
{
    computerTurn();
}

document.getElementById("submit").onclick = playUserTurn;