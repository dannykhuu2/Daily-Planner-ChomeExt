
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("addImg").addEventListener("click", openForm);
});
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("btnCan").addEventListener("click", closeForm);
});
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("btnCanEdit").addEventListener("click", closeFormEdit);
});
document.addEventListener('DOMContentLoaded',function(){
    document.getElementById("settingsImg").addEventListener("click", setUpEdit);
});

/* Display the about page */
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("helpImg").addEventListener("click", function(){
        document.getElementById("about").style.display = "block";
        document.getElementById("main").style.display = "none"; /* Hide the tasks */
        var sidebar = document.getElementsByClassName("sidenav");
        sidebar[0].style.display = "none"; /* Hide the side bar */
    });
});

function openForm() {
    document.getElementById("textinput").style.display = "block";
}

function closeForm() {
    document.getElementById("textinput").style.display = "none";
}
function openFormEdit() {
    document.getElementById("editinput").style.display = "block";

}
function closeFormEdit() {
    document.getElementById("editinput").style.display = "none";
}

function setUpEdit(){
    if(edit == false)
    {
        document.getElementById("editLabel").style.display = "block";
        var elementsArray = document.getElementsByClassName("editDelete");
        var elementsEditArray = document.getElementsByClassName("editTaskIcon");
        var i;
        for(i = 0; i < elementsArray.length; i++)
        {
            elementsArray[i].style.display = "block";
            elementsEditArray[i].style.display = "block";
        }
        edit = true;
    }
    else if(edit == true)
    {
        document.getElementById("editLabel").style.display = "none";
        var elementsArray = document.getElementsByClassName("editDelete");
        var elementsEditArray = document.getElementsByClassName("editTaskIcon");
        var i;
        for(i = 0; i < elementsArray.length; i++)
        {
            elementsArray[i].style.display = "none";
            elementsEditArray[i].style.display = "none";
        }
        edit = false;
    }

}
