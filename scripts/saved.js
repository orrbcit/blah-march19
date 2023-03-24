function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore();
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();


function insertNameFromFirestore() {
    //check if user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) { //if user logged in
            console.log(user.uid)
            db.collection("users").doc(user.uid).get().then(userDoc => {
                console.log(userDoc.data().name)
                userName = userDoc.data().name;
                console.log(userName)
                document.getElementById("name-goes-here").innerHTML = userName;

            })
        }
    })
}

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let newcardTemplate = document.getElementById("savedCardTemplate");
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("hikes").doc(thisHikeID).get().then(doc => {
                    var title = doc.data().name; // get value of the "name" key
                    var details = doc.data().details; // get value of the "details" key
                    var hikeCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
                    var hikeLength = doc.data().length; //gets the length field
                    var docID = doc.id;
                    let newcard = newcardTemplate.content.cloneNode(true);

                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = hikeLength + "km";
                    newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                    newcard.querySelector('a').href = "eachHike.html?docID=" + docID;

                    //NEW LINE: update to display length, duration, last updated
                    newcard.querySelector('.card-length').innerHTML =
                        "Length: " + doc.data().length + " km <br>" +
                        "Duration: " + doc.data().hike_time + "min <br>" +
                        "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();

                    hikeCardGroup.appendChild(newcard);

                })

            });
        })
}