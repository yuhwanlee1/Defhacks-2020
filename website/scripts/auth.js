//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs)
            setupUI(user);
        }, err =>{
            console.log(err.message);
        });
    } else {
        setupUI();
        setupGuides([]);
    }
});

function formatDate() {
    let date = new Date()
    let output = ''
    output += (date.getHours() + ':' + date.getMinutes() + ' ')
    output += ((date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + ' EST')
    return output
}

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    let user = auth.currentUser;
    db.collection('users').doc(user.uid).get().then(doc => {
        db.collection('guides').add({
            item: createForm['item'].value,
            amount: createForm['amount'].value,
            urgency: createForm['urgency'].value,
            department: doc.data().Hospital_Department,
            hospital: doc.data().Hospital_Name,
            'phone number': doc.data().Phone_Number,
            name: doc.data().Name,
            date: formatDate()
        }).then(() =>{
            //close the modal and reset form
            const modal = document.querySelector('#modal-create');
            M.Modal.getInstance(modal).close();
            createForm.reset();
        }).catch(err => {
            console.log(err.message);
        })
    });
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    console.log(email, password)

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        fetch('http://mednet.space:3000/phone/' + signupForm['signup-phone-number'].value)
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
            db.collection('users').doc(cred.user.uid).set({
                Name: data.name,
                Hospital_Name: hospital,
                Registry_Link: signupForm['signup-link-worker-registry'].value,
                Hospital_Department: data.department,
                Phone_Number: signupForm['signup-phone-number'].value,
                Doc_Name: signupForm['signup-link-doc-name'].value
            });

            const modal = document.querySelector('#modal-signup');
            M.Modal.getInstance(modal).close();
            signupForm.reset();

            return;
        });
    });
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) =>{
    e.preventDefault();
    auth.signOut();
});


// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});