function getValues(){
 alert("Hello App!!!");
}

//get values from the screen and display them
function getValues2(){
    let inputMessage = document.getElementById("message").value; 

    let alertMessage = document.getElementById("alertMessage");

    alertMessage.innerText = inputMessage;
}