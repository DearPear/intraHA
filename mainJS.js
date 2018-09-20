var WidgetVisibility = false;
var ProfileVisibility = false;
var TotalUpdates = "";
var ShownAlerts = "";
var lastScrollValue = 0;
var listOfStaff = [[]];
var listOfAlerts = [[]];
var wontflicker = true;

// var name for default form values MUST be Default + form ID.
var DefaultHomeMobileNumber = "";
// var name for unsaved modifications should be modified + form ID.
var modifiedHomeMobileNumber = "";


// var name for default form values MUST be Default + form ID.
var DefaultOfficeMobileNumber = "";
// var name for unsaved modifications should be modified + form ID.
var modifiedOfficeMobileNumber = "";


// add in array all  profile form ID that allows modification.
var formIDs = ["OfficeMobileNumber"];
// add in array all profile form ID that does not allow modification.
var fixedformIDs = ["HomeMobileNumber"];

function SetPage() {
    //Feed informations to vars. Must be set by back-end somehow.
    setAlerts();
    FeedStaffList();
    setPhoneAndAdress();

    //clean alerts
    EmptyOverflowUpdates();

    //sets all connections between HTML and JS - EventListeners and behaviors.
    setEventListeners();
    setBehaviors();

    //adds a trim method if absent to check for strings content.
    setTrimPrototype();


}

function setTrimPrototype() {

    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/, '');
        };
    }
}

function setEventListeners() {

    if (window.addEventListener) {
        window.addEventListener("resize", EmptyOverflowUpdates, false);
    } else if (window.attachEvent) {
        window.attachEvent("onresize", EmptyOverflowUpdates);
    }

    document.getElementById("ProfilePicture").addEventListener('click', ToggleProfile, false);
    document.getElementById("ProfileCrossCloser").addEventListener('click', ToggleProfile, false);
    document.getElementById("Updates").addEventListener('click', ShowUpdates, false);
    document.getElementById("More").addEventListener('click', ShowUpdates, false);

    document.getElementById("BurgerImage").addEventListener('click', ToggleWidgetMenu, false);
    document.getElementById("saveButton").addEventListener('click', saveFormChanges, false);
    document.getElementById("InProfilePicture").addEventListener('click', UploadNewIDPhoto, false);
    document.getElementById("InProfileUpload").addEventListener('click', UploadNewIDPhoto, false);
    document.getElementById("cancelButton").addEventListener('click', cancelAllFormChanges, false);
    document.getElementById("saveButton").addEventListener('click', saveAllFormChanges, false);



    formIDs.forEach(function(value) {
        FormsListeners(value);

    });

    document.getElementById("my-staff").addEventListener('click', function(evt) {

        //uncomment "loadFromFileInto" to work with files
        //  loadFromFileInto("MyStaff.html","MainContentWrapper");

        //uncomment "loadFromStringInto" to work with strings
        var myStaffString = '<div class="title">My Staff</div><div id="MainContent" class="MainContent"><div class="StaffContainer" id="StaffContainer"><div class="leftStaff" id="leftStaff"></div></div></div>';
        loadFromStringInto(myStaffString, "MainContentWrapper");
        FeedMyStaffContent();
    });

    document.getElementById("dashboard").addEventListener('click', function(evt) {
        loadDashboard();
    });
}

function FormsListeners(value) {

    document.getElementById(value).addEventListener('blur', function(evt) {

        if (document.getElementById(value).getAttribute("contenteditable") == "true") {
            ValidateInput(value);
        }
    });


    document.getElementById(value).addEventListener('focus', function(evt) {
        placeCaretAtEnd(document.getElementById(value));
    });

    document.getElementById("editButton" + value).addEventListener('click', function() {
        EditableMobileNumber(value);
    }, false);


}

function setBehaviors() {

    EmptyOverflowUpdates();


    //Mobile number behavior. Prevent break lines, prevent adding more than 10 numbers (to be changed)
    //prevents anything but numbers and '(' ')' '+' to be written.
    document.getElementById("HomeMobileNumber").addEventListener('keypress', function(evt) {

        if (evt.which === 13) {

            evt.preventDefault();
            document.getElementById("HomeMobileNumber").blur();


        } else if (document.getElementById("HomeMobileNumber").textContent.trim().length >= 10 && evt.which !== 8 && evt.which !== 46 && evt.keyCode !== 46 && evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40) {


            evt.preventDefault();
        } else if (evt.which !== 48 && evt.which !== 49 && evt.which !== 50 && evt.which !== 51 && evt.which !== 52 && evt.which !== 53 && evt.which !== 54 && evt.which !== 55 && evt.which !== 56 && evt.which !== 57 && evt.which !== 8 && evt.keyCode !== 46 && evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40) {

            evt.preventDefault();

        }

    });


    document.getElementById("OfficeMobileNumber").addEventListener('keypress', function(evt) {

        if (evt.which === 13) {

            evt.preventDefault();
            document.getElementById("OfficeMobileNumber").blur();


        } else if (document.getElementById("OfficeMobileNumber").textContent.trim().length >= 10 && evt.which !== 8 && evt.which !== 46 && evt.keyCode !== 46 && evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40) {


            evt.preventDefault();
        } else if (evt.which !== 48 && evt.which !== 49 && evt.which !== 50 && evt.which !== 51 && evt.which !== 52 && evt.which !== 53 && evt.which !== 54 && evt.which !== 55 && evt.which !== 56 && evt.which !== 57 && evt.which !== 8 && evt.keyCode !== 46 && evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40) {

            evt.preventDefault();

        }

    });



}

function setAlerts() {

    listOfAlerts[0] = ["info", "Your profile changes have been validated"];
    listOfAlerts[1] = ["alert", "Policies Updates Due"];
    listOfAlerts[2] = ["alert", "Fraud, Waste and Abuse training training due -9/21/18"];
    listOfAlerts[3] = ["info", "Your new badge is ready to be picked up"];

    document.getElementById('Updates').innerHTML == "";

    if (listOfAlerts[0] != "") {
        for (var i = 0; i < listOfAlerts.length; i++) {

            document.getElementById('Updates').innerHTML += ' <div class="li' + listOfAlerts[i][0] + '">' + listOfAlerts[i][1] + '</div>';

        }
    }
    TotalUpdates = "<img class=\"CloserCross\"  onclick=\"HideUpdates();\" src=\"res/croix.png\">" + document.getElementById('Updates').innerHTML + "<div class=\"CloserText\" onclick=\"HideUpdates();\">Close</div>";

    ShownAlerts = document.getElementById('Updates').innerHTML;



}

function setPhoneAndAdress() {
    DefaultHomeMobileNumber = "8035847474";
    DefaultOfficeMobileNumber = "8038871148";


    document.getElementById("OfficeMobileNumber").textContent = formatMobileNumber(DefaultOfficeMobileNumber);

    document.getElementById("HomeMobileNumber").textContent = formatMobileNumber(DefaultHomeMobileNumber);
}


function isThereAChangedForm() {
    var thereIsAChangedForm = false;
    formIDs.forEach(function(value) {
        if (document.getElementById(value).dataset.haschanged == "true") {
            thereIsAChangedForm = true;
        }

    });
    return thereIsAChangedForm;
}


function ValidateInput(ID) {

    //set to non editable
    document.getElementById(ID).setAttribute("contenteditable", false);
    document.getElementById(ID).classList.remove("TextBorder");

    var validate = false;
    var phone = document.getElementById(ID).textContent.trim();

    //if empty, fill with default value
    if (phone.length == 0) {
        document.getElementById(ID).textContent = window["Default" + ID];

    }


    //Cases
    else if (ID == "HomeMobileNumber" || ID == "OfficeMobileNumber") {
        if (phone.length > 10) {
            alert("test");
            document.getElementById(ID).textContent = phone.replace(/\D/g, '').slice(0, 10);

        }
        validate = validateNumber(phone);
        document.getElementById(ID).textContent = formatMobileNumber(phone);
    }



    if (phone != window["Default" + ID]) {

        document.getElementById(ID).dataset.haschanged = "true";

        if (validate) {

            document.getElementById(ID).dataset.valid = "true";


        } else {


            document.getElementById(ID).dataset.valid = "false";



        }



    } else {

        document.getElementById(ID).dataset.haschanged = "false";
    }

    //display or hide savebutton
    if (isThereAChangedForm() == true) {

        document.getElementById("saveButton").classList.remove("displayNone");
        document.getElementById("cancelButton").classList.remove("displayNone");
    } else {

        document.getElementById("saveButton").classList.add("displayNone");
        document.getElementById("cancelButton").classList.add("displayNone");

    }

    CheckMarks();

}


function validateNumber(phone) {
    var validation = false;

    if (phone.trim().length == 10) {

        validation = true;

    } else if (phone.trim().length == 12) {

        validation = true;
    }
    return validation;

}


function formatMobileNumber(phone) {
    var formatedPhone = "";

    if (phone.trim().length == 10) {
        formatedPhone = phone.trim();

        formatedPhone = phone.substring(0, 3) + "-" + phone.substring(3, 6) + "-" + phone.substring(6);


    } else if (phone.trim().length == 12) {

        formatedPhone = phone.substring(0, 3) + phone.substring(4, 7) + phone.substring(8, 12);

    } else {

        formatedPhone = phone.trim();

    }
    return formatedPhone;
}



function CheckMarks() {

    formIDs.forEach(function(value) {

        if (document.getElementById(value).dataset.haschanged == "false") {

            document.getElementById("CheckMark" + value).classList.add("displayNone");

        } else if (document.getElementById(value).dataset.haschanged == "true" && document.getElementById(value).dataset.valid == "true") {

            document.getElementById("CheckMark" + value).setAttribute("src", "res/valid.png");
            document.getElementById("CheckMark" + value).classList.remove("displayNone");

        } else

        {

            document.getElementById("CheckMark" + value).setAttribute("src", "res/invalid.png");
            document.getElementById("CheckMark" + value).classList.remove("displayNone");


            ;
        }


    });

}

function loadDashboard() {

    loadFromStringInto('<div class="title">Dashboard</div>', "MainContentWrapper");

}

function saveFormChanges(ID) {

    if (document.getElementById(ID).dataset.haschanged == "true" && document.getElementById(ID).dataset.valid == "false") {

        alert("Error (invalid entry)");

    } else if (document.getElementById(ID).dataset.haschanged == "true" && document.getElementById(ID).dataset.valid == "true") {

        if (saveToServer(ID)) {

            alert("Entry saved");

            window["Default" + ID] = formatMobileNumber(document.getElementById(ID).textContent);
            window["modified" + ID] = "";
            document.getElementById(ID).dataset.haschanged = "false";
            document.getElementById("CheckMark" + ID).classList.add("displayNone");




        } else {

            alert("server error, try again later");


        }

    }


    if (isThereAChangedForm()) {

        document.getElementById("saveButton").classList.remove("displayNone");
        document.getElementById("cancelButton").classList.remove("displayNone");

    } else {

        document.getElementById("saveButton").classList.add("displayNone");
        document.getElementById("cancelButton").classList.add("displayNone");

    }

}

function saveToServer(ID) {


    return true;
}


function saveAllFormChanges() {


    formIDs.forEach(function(value) {
        saveFormChanges(value);

    });

}


function cancelAllFormChanges() {


    formIDs.forEach(function(value) {
        cancelFormChanges(value);

    });

}

function formatForm(ID) {

    if (ID.indexOf("MobileNumber") !== -1) {

        document.getElementById(ID).textContent = formatMobileNumber(document.getElementById(ID).textContent);

    }

}

function cancelFormChanges(ID) {

    document.getElementById(ID).textContent = window["Default" + ID];

    document.getElementById(ID).dataset.haschanged = "false";

    document.getElementById(ID).dataset.valid = "true";

    document.getElementById("CheckMark" + ID).classList.add("displayNone");

    window["modified" + ID] = "";

    formatForm(ID);
    if (isThereAChangedForm() == "true") {

        document.getElementById("saveButton").classList.remove("displayNone");
        document.getElementById("cancelButton").classList.remove("displayNone");

    } else {

        document.getElementById("saveButton").classList.add("displayNone");
        document.getElementById("cancelButton").classList.add("displayNone");

    }

}

function EditableMobileNumber(ID) {

    if (document.getElementById(ID).textContent.length > 10) {
        document.getElementById(ID).textContent = document.getElementById(ID).textContent.substring(0, 3) + document.getElementById(ID).textContent.substring(4, 7) + document.getElementById(ID).textContent.substring(8, 12);
    }
    document.getElementById(ID).setAttribute("contenteditable", true);
    document.getElementById(ID).focus();
    document.getElementById(ID).classList.add("TextBorder");


}


function checkOverflow(el) {

    if (el.offsetHeight < el.scrollHeight) {

        return true;

        // your element have overflow
    } else {

        return false;

        // your element doesn't have overflow
    }
}



function EmptyOverflowUpdates() {




    document.getElementById('Updates').innerHTML = ShownAlerts;




    while (checkOverflow(document.getElementById('Updates'))) {

        document.getElementById('Updates').removeChild(document.getElementById('Updates').lastChild);

    }
    if (document.getElementById('Updates').innerHTML.trim() == "") {

        if (listOfAlerts[0] != "") {

            document.getElementById('Updates').innerHTML = '<div class="li' + listOfAlerts[0][0] + '">' + listOfAlerts[0][1] + '</div>';

        } else {

            document.getElementById('Updates').innerHTML = 'No alerts';
        }

    }

}



function HideUpdates() {

    document.getElementById('UpdateOverlay').classList.add("hidden");

}

function ShowUpdates() {

    document.getElementById('UpdateOverlay').innerHTML = TotalUpdates;

    document.getElementById('UpdateOverlay').classList.remove("hidden");


}

function ToggleWidgetMenu() {

    if (WidgetVisibility) {

        document.getElementById('WidgetMenu').classList.add("HideWidgetMenu");
        WidgetVisibility = !WidgetVisibility;
        document.getElementById('BurgerButton').classList.remove("ButtonTurned");

    } else {

        document.getElementById('WidgetMenu').classList.remove("HideWidgetMenu");
        WidgetVisibility = !WidgetVisibility;

        document.getElementById('BurgerButton').classList.add("ButtonTurned");
    }

}

function ToggleProfile() {

    if (ProfileVisibility) {

        document.getElementById('ProfileMenu').classList.add("ProfileHidden");
        ProfileVisibility = !ProfileVisibility;


    } else {

        document.getElementById('ProfileMenu').classList.remove("ProfileHidden");
        ProfileVisibility = !ProfileVisibility;


    }

}

function UploadNewIDPhoto() {


}

function loadFromStringInto(query, ID) {


    document.getElementById(ID).innerHTML = query;
}

function loadFromFileInto(url, ID) {

    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {

            var resp = request.responseText;

            document.getElementById(ID).innerHTML = resp;


        } else {

            document.getElementById(ID).innerHTML = "ERROR : " + request.status;
            console.log("REQUEST : " + url + " / ERROR : " + request.status);
        }
    };

    request.send();

}

//TODO : function to feed listOfStaff with a list of arrays. Each array = 1 person. Each person = [surname,name,position,pictureURL[,informations,...]];
function FeedStaffList() {

    listOfStaff[0] = ["John", "Center", "Assistant", "./res/employee/John_Center.png", "Policies Update due", "Profile changes to validate", "Profile changes to validate", "Security Training due"];
    listOfStaff[1] = ["Jessica", "Pineapple", "DAS III", "./res/employee/Jessica_Pineapple.png", "Security Training Due", "TB test due"];
    listOfStaff[2] = ["Maria", "Hive", "DAS II", "./res/employee/Maria_Hive.png", "Probation ends in 2 weeks"];
    listOfStaff[3] = ["Douglas", "Vault", "Assistant", "./res/employee/Douglas_Vault.png", "Policies Update due", "Profile changes to validate"];
    listOfStaff[4] = ["Paul", "Thunder", "DAS III", "./res/employee/Paul_Thunder.png", "Security Training Due", "TB test due"];
    listOfStaff[5] = ["Emeline", "Theater", "DAS II", "./res/employee/Emeline_Theater.png", "Probation ends in 2 weeks"];


}

function FeedMyStaffContent() {

    for (i = 0; i < listOfStaff.length; i++) {

        document.getElementById("leftStaff").insertAdjacentHTML('beforeend', '<div class="personOfStaff"><div class="StaffPicturalContainer"><div class="StaffAlertButton"><img style="width:100%; height:100%;" src="res/alert.svg"></div><div class="StaffPictureContainer"><img id="InProfilePicture" src="' + listOfStaff[i][3] + '"></div> </div><div class="StaffInfoInList"><div><span class="StaffFullname">' + listOfStaff[i][0] + ' ' + listOfStaff[i][1] + '</span><br><span class="StaffPosition">' + listOfStaff[i][2] + '</span></div><div style="align-self: flex-end;"><img id="staff' + i + '" class="moreStaffInfo" src="res/plus.png"></div></div></div><div class="personInfos" id="person' + i + '" data-shown="false"></div>');




        FeedMyStaffListenersCreator(i);

    }

}

function FeedMyStaffListenersCreator(index) {
    document.getElementById("staff" + index).addEventListener('click', function(evt) {

        personClickedOnStaff(index);

    });

}

function personClickedOnStaff(index) {

    if (document.getElementById("person" + index).dataset.shown == "true") {
        document.getElementById("staff" + index).setAttribute("src", "./res/plus.png");
        document.getElementById("person" + index).innerHTML = "";
        document.getElementById("person" + index).dataset.shown = "false";

    } else {
        var fillDiv = "";
        for (j = 4; j < listOfStaff[index].length; j++) {

            fillDiv += listOfStaff[index][j] + '<br>';

        }
        document.getElementById("person" + index).dataset.shown = "true";
        document.getElementById("person" + index).innerHTML = fillDiv + '<br><br>';
        document.getElementById("staff" + index).setAttribute("src", "./res/less.png");
    }
}



function placeCaretAtEnd(el) {

    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}