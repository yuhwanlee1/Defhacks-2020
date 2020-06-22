const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {

    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
<<<<<<< HEAD
            const phone = doc.data().Phone_Number
            fetch('http://mednet.space:3000/phone/' + phone)
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }
                return response.json()
            })
            .then(data => {
                data = data[0]
                const hospital = data.hospital.split("_").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ")
                db.collection('users').doc(user.uid).update({
                    Name: data.name,
                    Hospital_Name: hospital,
                    Hospital_Department: data.department,
                });
                    const html = `
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Email:</strong> ${user.email}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Name:</strong> ${data.name}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Hospital Name: </strong>${hospital}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Hospital Department:</strong> ${data.department}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Phone Number:</strong> ${phone}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Registry Link:</strong> ${doc.data().Registry_Link}</div><br>
                <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Document Name:</strong> ${doc.data().Doc_Name}</div><br>
                `;
                accountDetails.innerHTML = html;
                // toggle user UI elements
                loggedInLinks.forEach(item => item.style.display = 'block');
                loggedOutLinks.forEach(item => item.style.display = 'none');
            });
        })
=======
            const html = `
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Email:</strong> ${user.email}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Name:</strong> ${doc.data().Name}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Hospital Name: </strong>${doc.data().Hospital_Name}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Hospital Department:</strong> ${doc.data().Hospital_Department}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Phone Number:</strong> ${doc.data().Phone_Number}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Registry Link:</strong> ${doc.data().Registry_Link}</div><br>
            <div style="color: #777; font-size: 24px;"><strong style="color: #555" >Document Name:</strong> ${doc.data().Doc_Name}</div><br>
      `;
            accountDetails.innerHTML = html;
        });
        // toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
>>>>>>> b66b63289fbe338529ae12dbda13a970001f2242
    } else {
        // clear account info
        accountDetails.innerHTML = '';
        // toggle user elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};
//setup guides
const setupGuides = (data) => {

    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const guide = doc.data();
            var num = parseInt(guide.urgency, 10);
            var text = "";
            if (num == 1) {
                text = "<i style='color: #FFDD00;' class='material-icons'>warning</i>";
            } else if (num == 2) {
                text = "<i style='color: #FFA600;' class='material-icons'>warning</i>";
            } else if (num == 3) {
                text = "<i style='color: #FF6F00;' class='material-icons'>warning</i>";
            } else if (num == 4) {
                text = "<i style='color: #FF3700;' class='material-icons'>warning</i>";
            } else {
                text = "<i style='color: #FF0000;' class='material-icons'>warning</i>";
            }
            const li = `
      <li>
        <div style="font-size: 20px;" class="collapsible-header grey lighten-4"> ${text} <strong>${guide.item}</strong>&nbsp;(${guide.amount}) </div>
        <div class="collapsible-body white"> <strong>Department Name:</strong> ${guide.department} </div>
        <div class="collapsible-body white"> <strong>Hospital Name:</strong> ${guide.hospital} </div>
        <div class="collapsible-body white"> <strong>Requester Name:</strong> ${guide.name} </div>
        <div class="collapsible-body white"> <strong>Requester Phone Number:</strong> ${guide['phone number']} </div>
        <div class="collapsible-body white"> <strong>Urgency of Request:</strong> ${guide.urgency} </div>
        <div style="font-size: 18px;" class="collapsible-body white"><a href="sms://${guide['phone number']}" ><strong>Fufill This Request</strong></a></div>
      </li>
    `;
            html += li;
        })

        guideList.innerHTML = html;
    } else {
        guideList.innerHTML = '<h5 class="center-align">Login to view requests</h5>';
    }

}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});
