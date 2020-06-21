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
            const li = `
      <li>
        <div class="collapsible-header grey lighten-4"> ${guide.item} (${guide.amount}) </div>
        <div class="collapsible-body white"> ${guide.amount} </div>
        <div class="collapsible-body white"> ${guide.department} </div>
        <div class="collapsible-body white"> ${guide.hospital} </div>
        <div class="collapsible-body white"> ${guide.name} </div>
        <div class="collapsible-body white"> ${guide['phone number']} </div>
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