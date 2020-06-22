const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
    if (user) {
        // account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().Name}</div>
        <div>${doc.data().Hospital_Name}</div>
        <div>${doc.data().Hospital_Department}</div>
        <div>${doc.data().Phone_Number}</div>
        <div>${doc.data().Registry_Link}</div>
        <div>${doc.data().Doc_Name}</div>
      `;
            accountDetails.innerHTML = html;
        });
        // toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
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
            if (num == 1){
                text = "<i style='color: #FFDD00;' class='material-icons'>warning</i>";
            } else if (num == 2){
                text = "<i style='color: #FFA600;' class='material-icons'>warning</i>";
            } else if (num == 3){
                text = "<i style='color: #FF6F00;' class='material-icons'>warning</i>";
            } else if (num == 4){
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
        <div style="font-size: 18px;" class="collapsible-body white"><a href="" ><strong>Fufill This Request</strong></a></div>
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