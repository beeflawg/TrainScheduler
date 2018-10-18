// Initialize Firebase

var config = {
    apiKey: "AIzaSyDzFMCmZnBzLzM7eR4RP889a7Z2Ws6WT6g",
    authDomain: "trainscheduler-8b500.firebaseapp.com",
    databaseURL: "https://trainscheduler-8b500.firebaseio.com",
    projectId: "trainscheduler-8b500",
    storageBucket: "trainscheduler-8b500.appspot.com",
    messagingSenderId: "677748439772"
};
firebase.initializeApp(config);

var database = firebase.database();


$("#submit-employee").on("click", function () {

    event.preventDefault();

    
    var $name = $("#employee-name").val().trim();
    var $role = $("#role").val().trim();
    var $date = $("#start-date").val().trim();
    var $rate = $("#monthly-rate").val().trim();

    database.ref().push({
        name: $name,
        role: $role,
        date: $date,
        rate: $rate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });


    $("#employee-name").val('');
    $("#role").val('');
    $("#start-date").val('');
    $("#monthly-rate").val('');

    console.log($name);
    console.log($role);
    console.log($date);
    console.log($rate);

})

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().role);
    console.log(childSnapshot.val().date);
    console.log(childSnapshot.val().rate);
    console.log(childSnapshot.val().dateAdded);

    $name = childSnapshot.val().name;
    $role = childSnapshot.val().role;
    $date = childSnapshot.val().date;
    $rate = childSnapshot.val().rate;
   

    var tFrequency = $rate;

    // Time is 3:30 AM
    var firstTime = $date;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var $nextTrain = moment(nextTrain).format("LT");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    console.log(nextTrain);


    $("#table").append("<tr>"
        + "<td>" + childSnapshot.val().name + "</td>"
        + "<td>" + childSnapshot.val().role + "</td>"
        + "<td>" + childSnapshot.val().rate + "</td>"
        + "<td>" + $nextTrain + "</td>"
        + "<td>" + tMinutesTillTrain + "</td>"
        + "</tr>"
    );

})
