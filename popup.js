var InputField = ["Day", "Title", "Description"]; /* Input Fields == One Task */
var EditField = ["DayEdit", "TitleEdit", "DescriptionEdit"]; /* Edit Fields */
var Tasks = []; // Array List Containing All Tasks.

var DisplayID = []; // field for display.
var OutputID = []; // Field for housing all outputs.
var DisplayedIndex = []; // --> Items that are currently displayed.
var DescBoxID = []; /* Names of Event Blocks that are Displayed.  */

var NumOutputs = 0; /* Number of Current Tasks being Displayed For a certain day */ 
var IDs = 0; /* ID Identifier for Display Fields */ 

/* Creating Names for the Event Being Displayed */
var TitleName = "eventtitle"; 
var EventName = "event";
var DescBoxName = "descbox";

var edit = false; /* Tells us if we are in edit mode */

/* Display the activities for the current day by default. */
var Date = new Date(); // Create a Date Object.
var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Converter to a string Day.

var CurrentDay = Days[Date.getDay()]; /* Gets the current day */ 
document.getElementById(CurrentDay).style.color = "skyblue"; /* Highlights the Current Day */
document.getElementById(InputField[0]).value = CurrentDay; /* Defaults the Add function to the current Day */

/* Retrieve Information from storage */
chrome.storage.sync.get("Tasks", function(Task) // retrieve the list to update Tasks.
{
    if (Task.Tasks != null)
    {
        for (var counter = 0; counter < Task.Tasks.length; counter++)
        {
            Tasks.push(Task.Tasks[counter]); // Updates the array Tasks with the information contained in storage.
        }
    }
});

/* Display all Tasks for the Current Day */
Display();

/* Selects the Day to display Tasks for */
document.getElementById("Monday").addEventListener("click", SetDay);
document.getElementById("Tuesday").addEventListener("click", SetDay);
document.getElementById("Wednesday").addEventListener("click", SetDay);
document.getElementById("Thursday").addEventListener("click", SetDay);
document.getElementById("Friday").addEventListener("click", SetDay);
document.getElementById("Saturday").addEventListener("click", SetDay);
document.getElementById("Sunday").addEventListener("click", SetDay);

/* Adds the Delete Completed function to the button */
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById("deleteCompleted").addEventListener("click", DeleteCompleted);
});

// adds click event to add button.
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById("Add").addEventListener("click", Add);
});

/* Sets the Day to be displayed. */
function SetDay()
{
    /* Removes Tasks Displayed for Previously Selected Day */
    for (var counter = 0; counter < NumOutputs; counter++) 
    {
       var Main = document.getElementById(OutputID[counter]);
       Main.remove();
    }
    /* If edit is on for previous day, turn it off */
    if ( edit == true )
    {
        setUpEdit();
    }
    
    document.getElementById(CurrentDay).style.color = "whitesmoke"; // Sets the previous selected day to black again.
    CurrentDay = this.id; // Set the current day to be displayed to whatever they selected.
    document.getElementById(InputField[0]).value = CurrentDay; /* Defaults the Add function to the current Day */
    DisplayID = []; // Reset the # of display outputs.
    OutputID = []; // Reset the # of Output fields.
    DescBoxID = []; // Reset the description blocks.
    DisplayedIndex = []; // Reset the indices of what is being displayed.
    NumOutputs = 0; // Reset Counter.
    IDs = 0; // Reset ID Generators.
    document.getElementById(CurrentDay).style.color = "skyblue"; // Highlight the selected day.
    Display(); // Update the display with the correct tasks for the selected day.
    
}

/* Adds a new Task to the Schedule */
function Add()
{
    // creates a new task;
    if (document.getElementById(InputField[1]).value != "") // if there is atleast a title.
    {
        // Creates the Task Object.
        var NewTask = new Task(document.getElementById(InputField[0]).value, document.getElementById(InputField[1]).value, document.getElementById(InputField[2]).value, false);
        Tasks.push(NewTask); // Adds to the tasks Array.
        chrome.storage.sync.set({Tasks : Tasks}, function () {console.log("Data has been saved successfully."); }); // Add to memory.
        if (NewTask.Day == CurrentDay) // If the new task is on the selected day, then display.
        {
            AddDisplay(Tasks.length - 1); // pass the index.
        }
        
        // Clear the Input Fields.
        document.getElementById(InputField[1]).value = "";
        document.getElementById(InputField[2]).value = "";
    }
}

// Displays the contents in the storage.
function Display()
{
    // Retrieve Events from the Tasks(Each value) in memory.
    chrome.storage.sync.get("Tasks", function(Task)
    {
        if (Task.Tasks != null)
        {
            var DisplayCounter = 0; // Counter to keep track of content to be displayed for that specific day.

            for (var counter = 0; counter < Task.Tasks.length; counter++)
            {
                if (CurrentDay == Task.Tasks[counter].Day)
                {
                    Update(counter); // Create the fields to be displayed in.

                    /* Displays the Title  & Description of Each Event */
                    if (Task.Tasks[counter].Completed == true) /* Add Line Strike if it is a completed task */
                    {
                        document.getElementById(DisplayID[DisplayCounter]).innerHTML = Task.Tasks[counter].Title.strike();
                    }
                    else
                    {
                        document.getElementById(DisplayID[DisplayCounter]).innerHTML = Task.Tasks[counter].Title;
                    }
                
                    /* Displays a default message if there is no description */
                    if (Task.Tasks[counter].Description != "")
                    {
                        document.getElementById(DescBoxID[DisplayCounter]).innerHTML = Task.Tasks[counter].Description;
                    }
                    else
                    {
                        document.getElementById(DescBoxID[DisplayCounter]).innerHTML = "Nothing here...";
                    }
                    
                    DisplayCounter++; // increment after a display.
                }
            }
        }
    });
}

/* Displays an Event that was added onto the Current Day */
function AddDisplay(index) 
{
    /* Create its display fields */
    Update(index);
    /* Update with proper Info */
    document.getElementById(DisplayID[NumOutputs - 1]).innerHTML = Tasks[Tasks.length - 1].Title;
    document.getElementById(DescBoxID[NumOutputs - 1]).innerHTML = Tasks[Tasks.length - 1].Description;
}

// Updates the Number of Outputs.
function Update(index)
{
    /* Creating Names for the Event Being Displayed */
    var Title = TitleName + IDs;
    var Event = EventName + IDs;
    var Desc = DescBoxName + IDs;
    var UniqueID = IDs;

    /* Creating In Progress Image Icon */
    var Icon = document.createElement("img");
    Icon.setAttribute("src", "images/icons8-unchecked-checkbox-80.png");
    Icon.setAttribute("id", "icon" + IDs);
    Icon.setAttribute("class", "progressIcon");

    /* Side edit icon */
    var iconEdit = document.createElement("img");
    iconEdit.setAttribute("src", "images/icons8-edit-80.png");
    iconEdit.setAttribute("id", "editTask" + IDs);
    iconEdit.setAttribute("class", "editTaskIcon");

    /* Delete Icon */
    var iconDelete = document.createElement("span");
    iconDelete.setAttribute("id", "delete" + IDs);
    iconDelete.innerHTML = "&times;";
    iconDelete.setAttribute("class", "editDelete");

    /* Creating the field where text will be displayed */
    var Holder = document.createElement("div");
    var TitleDisplay = document.createElement("p"); // create a new p element.
    var Main = document.getElementById("main"); // append to main div.
    var BoxContainer = document.createElement("div");
    var BoxText = document.createElement("span");

    /* Setting IDs and Classes of Each Field. */
    TitleDisplay.setAttribute("id", Title); // sets the id for the p new p element.
    TitleDisplay.setAttribute("class", "main");
    BoxContainer.setAttribute("class", "eventbox");
    BoxText.setAttribute("id", Desc);


    /* Append to div element */
    Holder.appendChild(Icon);
    Holder.appendChild(iconEdit)
    Holder.appendChild(iconDelete);
    Holder.appendChild(TitleDisplay);
    BoxContainer.appendChild(BoxText);
    Holder.appendChild(BoxContainer);
    Main.appendChild(Holder);
    Holder.setAttribute("id", Event); // ID for Holder element.
    Holder.setAttribute("class", "maindisplay");
    
    // If the task is already completed, display appropriate image.
    if (Tasks[index].Completed == true)
    {
        Icon.setAttribute("src", "images/icons8-checked-checkbox-80.png"); // Updates the image of the icon to completed.
    }
    else
    {   /* Allow user to complete the task if not completed already */
        var CompletedFN = function(e)
        {
            Completed(Event, UniqueID);
            document.getElementById("icon" + UniqueID).removeEventListener("click", CompletedFN, true); /* remove after it is completed */
        }

        document.getElementById("icon" + UniqueID).addEventListener("click", CompletedFN, true);
    }

    /* Edit function added to the Title (TEMP) */
    document.getElementById("editTask" + UniqueID).addEventListener("click", function()
    {
        /* only allow edit if task is not done */
        if (Tasks[index].Completed == false)
        {
            TriggerEdit(Event, UniqueID);
        }
        else
        {   
            window.alert("Task is already completed.");
        }
    });

    /* Displays Description Upon Clicking the Title */ 
    document.getElementById(Title).addEventListener("click", function ()
    {
        if (document.getElementById(Desc).parentNode.style.display == "none")
        {
            document.getElementById(Desc).parentNode.style.display = "block";
        }
        else  
        {
            document.getElementById(Desc).parentNode.style.display = "none";
        }        
    }); 
       
    /* Delete Function to the Delete Icon */
    document.getElementById("delete" + UniqueID).addEventListener("click", function(e){
        removeTask(Event, UniqueID);
        e.stopImmediatePropagation();
    });

    /* Updating the Number of Outputs in Memory */
    DisplayID.push(Title); // create displayIDs.
    OutputID.push(Event); // create Output Fields.
    DescBoxID.push(Desc); // Box Desc IDs.
    DisplayedIndex.push(IDs); // Added item will always be last index.
    NumOutputs++; // Update number of outputs to be displayed.
    IDs++; // Increment ID generator to keep it unique.

}

/* -------------- EDIT FUNCTIONS ------------------- */ 
function TriggerEdit(Task, UniqueID)
{
    /* Open the form for editting */
    openFormEdit(); 

    var Edited = false; /* FOR CHECKING IF THEY EDIT WITH A "" TITLE --> Dont remove event listener */

    /* Fill Edit Form with Previous Details. */
    var Position = SetUpEdit(Task, UniqueID); /* Contains the position of the element to be changed in the array */
    var handler =  function(event){
        Edited = SaveTask(Task, Position); /* Function Updates the Array */
        if ( Edited == true ) /* If edit was sucessful, then remove this */
        {
            document.getElementById("saveEdit").removeEventListener("click", handler, false);
        }
    };
    document.getElementById("saveEdit").addEventListener("click", handler, false);
}


/* Searches for the Location of the Pursued Event using its ID.
Returns: Item Display Position, Position in Array.
*/
function SearchLocation(UniqueID)
{

    var counter;
    var ItemsIn = 0; /* Counts how many items into the Tasks lists has been checked for a specific day */ 
    var FoundItem = 0;
    var PositionsArray = []; /* Will Store the position in DisplayedIndex and in the actual array itself */

    /* Identify which item on that day is being deleted */ 
    for (counter = 0; counter < DisplayedIndex.length; counter++)
    {
        if (UniqueID == DisplayedIndex[counter])
        {
            FoundItem = counter; /* At this position of items on this day, delete it */
        }
    }
    
    /* Appends the position in Display */
    PositionsArray.push(FoundItem);

    /* Loop through the Tasks Array searching for the n-th position of the current day */
    for (counter = 0; counter < Tasks.length; counter++)
    {
        /* Check if the Task is assigned to the current day */
        if (Tasks[counter].Day == CurrentDay)
        {
            /* Check if the position of where it shud belong within items on the current day matches */
            if (FoundItem == ItemsIn)
            {
                /* Remove at this position */
                FoundItem = counter;
                break;
            }
            ItemsIn++; /* Continue to only index on this day */
        }

    }

    /* Appends the position in the array list */
    PositionsArray.push(FoundItem); 

    return PositionsArray;
}

/* Edits an Event on a given Day */
function SetUpEdit(Task, UniqueID)
{
    var PositionsArray = SearchLocation(UniqueID);

    /* Sets up the Input Fields with Previous Information */ 
    var EditDay = document.getElementById(EditField[0]);
    var EditTitle = document.getElementById(EditField[1]);
    var EditDesc = document.getElementById(EditField[2]); 

    EditDay.value = Tasks[PositionsArray[1]].Day;
    EditTitle.value = Tasks[PositionsArray[1]].Title;
    EditDesc.value = Tasks[PositionsArray[1]].Description;

    /* Returns the position of the item to be editted in the original array */
    return PositionsArray; 
}

/* Updates memory with Editted Task */
function SaveTask(Task, Position)
{
    /* Split the Position Element into respective components  */
    var PositionInDisplay = Position[0];
    var PositionInArray = Position[1];

    /* Retrieve the new updated values */
    var NewDay = document.getElementById(EditField[0]).value;
    var NewTitle = document.getElementById(EditField[1]).value;
    var NewDesc = document.getElementById(EditField[2]).value;
    
    /* If no title, then do not proceed */
    if ( NewTitle == "" )
    {
        return false; /* Do nothing -- cannot save changes. */
    }
    
    /* Update the information in the Tasks array */
    Tasks[PositionInArray].Day = NewDay;
    Tasks[PositionInArray].Title = NewTitle;
    Tasks[PositionInArray].Description = NewDesc; 

    /* Update memory */
    chrome.storage.sync.set({Tasks:Tasks}, function(){});

    /* Changes to Display based on the Updated Day */
    if (NewDay == CurrentDay) /* If it is the same day, then simply update the values in the display */
    {
        document.getElementById(DisplayID[PositionInDisplay]).innerHTML = Tasks[PositionInArray].Title;       
        if ( Tasks[PositionInArray].Description != "" )
        {     
            document.getElementById(DescBoxID[PositionInDisplay]).innerHTML = Tasks[PositionInArray].Description;    
        }
        else
        {
            document.getElementById(DescBoxID[PositionInDisplay]).innerHTML = "Nothing here...";
        }
    }
    else /* If the updated task is on another day, then remove from current display */
    {
        document.getElementById(Task).remove(); /* Remove the display */ 
        updateArrayMemory(PositionInDisplay); /* Remove from stored memory */
        NumOutputs--; /* Update the Number of outputs */
    }

    /* Close the edit form  */
    closeFormEdit();

    /* Edit was sucessful */
    return true;
}

/* Removes An Element from Stored Memory */
function updateArrayMemory(Position)
{
        /* Remove Displayed Elements from stored memory */
        OutputID.splice(Position, 1);
        DisplayID.splice(Position, 1);
        DescBoxID.splice(Position, 1);
        DisplayedIndex.splice(Position, 1);
}

/* Removes a Task on the selected Day */
function removeTask(Task, UniqueID)
{

    /* Retrieve the Element to be Deleted */
    var Positions = SearchLocation(UniqueID); /* Returns the Position being Displayed and Position in Array */
    var PositionInDisplay = Positions[0];
    var PositionInArray = Positions[1];
    
    /* Display Element to be Deleted */
    var Event = document.getElementById(Task);
 
    updateArrayMemory(PositionInDisplay);

    /* Remove the Item at the found position */
    Tasks.splice(PositionInArray, 1);

    /* Remove the Element within the Container */
    Event.remove();
    NumOutputs--; // Decrement the number of items being displayed.

    /* Store into Chrome Memory */
    chrome.storage.sync.set({Tasks:Tasks}, function(){});

}

/* Updates the Task to be completed */
function Completed(Event, ID)
{
    /* Searches for the Completed Task */
    var Positions = SearchLocation(ID); 
    var PositionInDisplay = Positions[0]; 
    var PositionInArray = Positions[1]; 

    /* Retrieves this image object */ 
    var Icon = document.getElementById("icon" + ID);  
  
    /* Updates the Image and Text */
    Icon.setAttribute("src", "images/icons8-checked-checkbox-80.png"); 
    var Display = document.getElementById(DisplayID[PositionInDisplay]);
    var Text = Display.innerHTML; 
    Display.innerHTML = Text.strike();

    /* Update Completed in Array */
    Tasks[PositionInArray].Completed = true; 

    /* Update Memory */
    chrome.storage.sync.set({Tasks:Tasks}, function(){});

}

/* Deletes all Tasks from memory that are Completed */
function DeleteCompleted()
{
    var counter; 
    var iteminDisplay = 0; /* Counts the number of items being displayed */

    /* Check every single Task */
    for (counter = 0; counter < Tasks.length; counter++ )
    {
        /* If The task is completed and not is not on the currently displayed day, then remove it */
        if ( Tasks[counter].Day != CurrentDay && Tasks[counter].Completed == true )
        {
            Tasks.splice(counter, 1); /* Remove this element */ 
            counter--; /* Keep the counter at this position since everything shifted left */
        }
        /* If the task is completed and on the displayed day, must delete from display */
        else 
            if ( Tasks[counter].Day == CurrentDay ) /* If it is the current day, then check if its completed. */
            {
                if ( Tasks[counter].Completed == true ) /* If it is completed, then identify which id matches its display and delete */
                {
                    var Event = OutputID[iteminDisplay]; /* This is the element housing the info */
                    var UniqueID = DisplayedIndex[iteminDisplay]; /* This is the ID corresponding to the event */
                    removeTask(Event, UniqueID); /* Removes from memory and display */
                    counter--; /* Keep the counter at this position since everything shifted left */
                }
                else
                {
                    iteminDisplay++; /* Increment to the next item if the current item is not completed */
                }
            }
    }
    /* update memory */
    chrome.storage.sync.set({Tasks:Tasks}, function(){});
}

// ----- Task Object -----
function Task(Day, Title, Description, Status)
{
    this.Day = Day;
    this.Title = Title;
    this.Description = Description;
    this.Completed = Status;
}