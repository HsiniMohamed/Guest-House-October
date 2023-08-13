//Functions Owners || Admin || Guests

function signup(role) {
  // controle de saisie sur  first name
  let firstName = document.getElementById("firstName").value;
  let verifFirstName = firstName.length > 5;
  displayErrors(
    verifFirstName,
    "firstNameError",
    "First Name should have at least 5 characters"
  );
  // controle de saisie sur last name
  let lastName = document.getElementById("lastName").value;
  let verifLastName = lastName.length > 4;
  displayErrors(
    verifLastName,
    "lastNameError",
    "last Name should have at least 4 characters"
  );
  // controle de saisie sur numero de telephone

  let phone = document.getElementById("phone").value;
  let verifPhone = phone.length == 8;
  displayErrors(
    verifPhone,
    "phoneError",
    "Phone should have at least 8 numbers"
  );
  // controle de saisie sur Email

  let email = document.getElementById("email").value;
  let verifEMail = validateEmail(email);
  displayErrors(verifEMail, "emailError", "E-mail Invalid");
  // controle de saisie sur mot de passe

  let password = document.getElementById("password").value;
  let verifPassword = validatePassword(password);
  displayErrors(verifPassword[0], "passwordError", verifPassword[1]);
  // controle et validation sur tous les champs de saisie || stockage des donnees Users dans local storage
  if (
    verifFirstName &&
    verifLastName &&
    verifPhone &&
    verifEMail &&
    verifPassword
  ) {
    //stockage des donnees "admins" dans local storage
    if (role === "admin") {
      let userId = getFromLsId("userId");
      let users = getFromLsArray("users");
      let data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password,
        role: role,
      };
      data.id = userId;
      users.push(data);
      setIntoLs("users", users);
      setIntoLs("userId", userId + 1);
    }
    // stockage des donnees "owners" dans local storage
    else if (role === "owner") {
      let userId = getFromLsId("userId");
      let users = getFromLsArray("users");
      let adress = document.getElementById("adress").value;
      let fax = document.getElementById("fax").value;
      let patente = document.getElementById("patente").value;
      let data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        fax: fax,
        adress: adress,
        patente: patente,
        email: email,
        password: password,
        role: role,
      };
      data.id = userId;
      users.push(data);
      setIntoLs("users", users);
      setIntoLs("userId", userId + 1);
    }
    //stockage des donnees "users" dans local storage
    else {
      let userId = getFromLsId("userId");
      let users = getFromLsArray("users");
      let adress = document.getElementById("adress").value;
      let data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        adress: adress,
        email: email,
        password: password,
        role: role,
      };
      data.id = userId;
      users.push(data);
      setIntoLs("users", users);
      setIntoLs("userId", userId + 1);
    }
  }
  window.location = "login.html";
}
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let users = getFromLsArray("users");
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      document.getElementById("loginError").innerHTML = "✔ SUCCES";
      document.getElementById("loginError").style.color = "green";

      //Stockage de l'identifiant de "Connected User" dans local Storage
      setIntoLs("idConnectedUser", users[i].id);
      if (users[i].role === "admin") {
        window.location = "display-houses-admin.html";
      }
      if (users[i].role === "user") {
        window.location = "houses-user.html";
      }
      if (users[i].role === "owner") {
        window.location = "houses-owner.html";
      }
    }
    //Affichage de message d'erreur Si l Email et/ou le Mot de passe ne sont pas valides
    if (users[i].email === email && users[i].password !== password) {
      displayErrors(false, "loginError", "Mot de passe erronée!! ✗");
    }
    if (users[i].email !== email && users[i].password === password) {
      displayErrors(false, "loginError", "Adresse incorrecte!! ✗");
    }
  }
}
function logOut() {
  localStorage.removeItem("idConnectedUser");
  location.replace("login.html");
}
function displayReservations() {
  let reservations = getFromLsArray("reservations");
  let idUser = getFromLsId("idConnectedUser");
  let role = searchById("users", idUser).role;
  let bookingData = ``;
  for (let i = 0; i < reservations.length; i++) {
    //Traitement et affichage des reservations de 'user' dans la page 'display-reservation-user'
    if (role === "user") {
      if (reservations[i].idUser === idUser) {
        let room = searchById("rooms", reservations[i].idRoom);
        //Masquer la bouton 'Annuler' si la situation de reservation est deja annulée
        if (reservations[i].situation === "Annulée") {
          bookingData =
            bookingData +
            `
        <tr>
                  <th scope="row">${reservations[i].id}</th>
                  <td>${room.nameRoom}</td>             
                  <td>${reservations[i].nbrOfPeople}</td>
                  <td>${reservations[i].situation}</td>
                </tr>
        `;
        }
        //Affichage la bouton 'Annuler' si la situation de reservation different de 'annulée'
        else {
          bookingData =
            bookingData +
            `
        <tr>
                  <th scope="row">${reservations[i].id}</th>
                  <td>${room.nameRoom}</td>             
                  <td>${reservations[i].nbrOfPeople}</td>
                  <td>${reservations[i].situation}</td>
                  <td>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onclick="cancelBooking(${reservations[i].id})"
                  >
                    Cancel
                  </button>
                </td> 
                </tr>
        `;
        }
      }
    }
    //Traitement et affichage des reservations de 'owner' dans la page 'display-reservation-owner'
    else if (role === "owner") {
      if (reservations[i].idOwner === idUser) {
        let room = searchById("rooms", reservations[i].idRoom);
        let house = searchById("houses", reservations[i].idHouse);
        let user = searchById("users", reservations[i].idUser);
        //Affichage de la bouton 'Confirm' si la situation de reservation est "En attente"
        if (reservations[i].situation === "En attente") {
          bookingData =
            bookingData +
            `
        <tr>
                  <th scope="row">${reservations[i].id}</th>
                  <td>${user.firstName} ${user.lastName}</td>
                  <td>${room.nameRoom}</td>             
                  <td>${house.nameHouse}</td>             
                  <td>${reservations[i].nbrOfPeople}</td>
                  <td>${reservations[i].situation}</td>
                  <td>
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    onclick="confirmBooking(${reservations[i].id})"
                  >
                    Confirm
                  </button>
                </td> 
                </tr>
        `;
        }
        //Masquer la bouton 'confirm' si la situation de reservation est different de 'en attente'
        else {
          bookingData =
            bookingData +
            `
        <tr>
                  <th scope="row">${reservations[i].id}</th>
                  <td>${user.firstName} ${user.lastName}</td>
                  <td>${room.nameRoom}</td>             
                  <td>${house.nameHouse}</td>             
                  <td>${reservations[i].nbrOfPeople}</td>
                  <td>${reservations[i].situation}</td>
                </tr>
        `;
        }
      }
    }
    //Traitement et affichage des reservations de 'admin' dans la page 'display-reservation-admin'
    else {
      let room = searchById("rooms", reservations[i].idRoom);
      let house = searchById("houses", reservations[i].idHouse);
      let user = searchById("users", reservations[i].idUser);
      let owner = searchById("users", reservations[i].idOwner);
      if (room && house && user && owner) {
        console.log("gggg");

        bookingData =
          bookingData +
          `
      <tr>
                <th scope="row">${reservations[i].id}</th>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${owner.firstName} ${owner.lastName}</td>
                <td>${room.nameRoom}</td>             
                <td>${house.nameHouse}</td>             
                <td>${reservations[i].nbrOfPeople}</td>
                <td>${reservations[i].situation}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onclick="deletObject('reservations',${i})"
                  >
                    Delete
                  </button>
                </td> 
              </tr>
      `;
      }
    }
  }
  document.getElementById("tableBooking").innerHTML = bookingData;
}
function displayHeader() {
  let header = ` <nav>
  <ul id="navigation">
    <li><a href="index.html">home</a></li>
    <li>
      <a href="#">Sign Up <i class="ti-angle-down"></i></a>
      <ul class="submenu">
        <li><a href="signup-owner.html">SignuUp Owner</a></li>
        <li><a href="signup-users.html">SignuUp Guest</a></li>
      </ul>
    </li>
    <li><a class="active" href="login.html">Loogin</a></li>
  </ul>
</nav>`;

  let idConnectedUser = localStorage.getItem("idConnectedUser");
  if (idConnectedUser) {
    let user = searchById("users", Number(idConnectedUser));
    if (user.role === "admin") {
      header = ` <nav>
      <ul id="navigation">
        <li><a href="display-users.html">Users</a></li>
        <li><a href="display-houses-admin.html">Houses</a></li>
        <li><a href="display-reservation-admin.html">Reservations</a></li>
      </ul>
    </nav> `;
    }
    if (user.role === "user") {
      header = `<nav>
      <ul id="navigation">
      <li><a href="index.html">home</a></li>
        <li><a href="houses-user.html">Houses</a></li>
        <li><a href="display-reservation-user.html">Reservations</a></li>
        <li><a onclick='logOut()'>LogOut</a></li>
      </ul>
    </nav> `;
    }
    if (user.role === "owner") {
      header = `<nav>
      <ul id="navigation">
      <li><a href="index.html">home</a></li>
        <li><a href="houses-owner.html">Houses</a></li>
        <li><a href="add-house.html">Add House</a></li>
        <li><a href="display-reservation-owner.html">Reservations</a></li>
        <li><a onclick='logOut()'>LogOut</a></li>
      </ul>
    </nav> `;
    }
  }
  document.getElementById("display-header").innerHTML = header;
}

//Functions Owners

function addHouse() {
  let nameHouse = document.getElementById("nameHouse").value;
  let adresse = document.getElementById("adresse").value;
  let city = document.getElementById("city").value;
  let view = document.getElementById("view").value;
  let houseId = getFromLsId("houseId");
  let houses = getFromLsArray("houses");
  let connectedOwner = getFromLsId("idConnectedUser");
  //Remplissage de tableau 'houses' dans l'etat initiale où le tableau est vide
  if (houses.length === 0) {
    let dataHouse = {
      nameHouse: nameHouse,
      adresse: adresse,
      city: city,
      view: view,
      id: houseId,
      idRef: connectedOwner,
    };
    houses.push(dataHouse);
    //message de reussite et validation de l'ajout de maison
    Swal.fire({
      position: "center",
      icon: "success",
      title: "",
      text: "Maison ajoutée avec succès !",
      showConfirmButton: false,
      timer: 5000,
    });
  } else {
    //Appel de la fonction counterByIdRef() afin de verifier le nombre maximal des maison pour chaque 'owner'
    let verifCount = counterByIdRef("houses", connectedOwner);
    if (verifCount < 3) {
      let dataHouse = {
        nameHouse: nameHouse,
        adresse: adresse,
        city: city,
        view: view,
        id: houseId,
        idRef: connectedOwner,
      };
      houses.push(dataHouse);
      //message de reussite et validation de l'ajout de maison
      Swal.fire({
        position: "center",
        icon: "success",
        title: "",
        text: "Maison ajoutée avec succès !",
        showConfirmButton: false,
        timer: 5000,
      });
    } else {
      //message d'erreur lors de l'ajout de maison
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "Desolé le nombre maximale des masion est de 3!",
        showConfirmButton: false,
      });
    }
  }
  setIntoLs("houses", houses);
  setIntoLs("houseId", houseId + 1);
}
function displayHouses(searchData) {
  let houses = searchData !== undefined ? searchData : getFromLsArray("houses");
  let ownerId = getFromLsId("idConnectedUser");
  let dataHouse = ``;
  for (let i = 0; i < houses.length; i++) {
    if (ownerId === houses[i].idRef) {
      dataHouse += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${houses[i].view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${houses[i].nameHouse}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${houses[i].city}</li>
          <li class="list-group-item">${houses[i].adresse}</li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm" onclick="navigateTo(${houses[i].id},'idHouseToEdit','rooms-owner.html')"
            >
              View Rooms
            </button>
          </li>
        </ul>
        <div class="card-body">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"onclick="navigateTo(${houses[i].id},'idHouseToEdit','add-rooms.html')"
          >
           Add Room
          </button>
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="deletObject('houses',${i})">
            Delete House
          </button>
        </div>
      </div>
    </div>
      `;
    }
  }
  document.getElementById("housesCard").innerHTML = dataHouse;
}
function searchHouse() {
  let searchValue = document.getElementById("search").value;
  let houses = getFromLsArray("houses");
  let T = [];
  // console.log("ff", listProducts[i].nameProduct);
  if (searchValue === undefined) {
    T = getFromLsArray("houses");
  } else {
    for (let i = 0; i < houses.length; i++) {
      if (
        houses[i].nameHouse.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        T.push(houses[i]);
      }
    }
  }
  displayHouses(T);
}
function addRoom() {
  let nameRoom = document.getElementById("nameRoom").value;
  let description = document.getElementById("description").value;
  let capacity = document.getElementById("capacity").value;
  let price = document.getElementById("price").value;
  let roomId = getFromLsId("roomId");
  let rooms = getFromLsArray("rooms");
  let houseId = getFromLsId("idHouseToEdit");
  //Remplissage de tableau 'rooms' dans l'etat initiale où le tableau est vide
  if (rooms.length === 0) {
    let dataroom = {
      nameRoom: nameRoom,
      description: description,
      capacity: capacity,
      price: price,
      id: roomId,
      idRef: houseId,
    };
    rooms.push(dataroom);
    //message de reussite et validation de l'ajout de chambre
    Swal.fire({
      position: "center",
      icon: "success",
      title: "",
      text: "Chambre ajoutée avec succès !",
      showConfirmButton: false,
      timer: 5000,
    });
  } else {
    //Appel de la fonction counterByIdRef() afin de verifier le nombre maximal des chambres pour chaque maison
    let verifCount = counterByIdRef("rooms", houseId);
    if (verifCount < 10) {
      let dataroom = {
        nameRoom: nameRoom,
        description: description,
        capacity: capacity,
        price: price,
        id: roomId,
        idRef: houseId,
      };
      rooms.push(dataroom);
      //message de reussite et validation de l'ajout de chambre
      Swal.fire({
        position: "center",
        icon: "success",
        title: "",
        text: "Chambre ajoutée avec succès !",
        showConfirmButton: false,
        timer: 5000,
      });
    } else {
      //message d'erreur lors de l'ajout de chambre
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "Desolé le nombre maximale des chambres est de 10!",
        showConfirmButton: false,
      });
    }
  }
  setIntoLs("rooms", rooms);
  setIntoLs("roomId", roomId + 1);
}
function displayRooms(searchData) {
  let rooms = searchData !== undefined ? searchData : getFromLsArray("rooms");
  let houseId = getFromLsId("idHouseToEdit");
  let dataRoom = ``;
  for (let i = 0; i < rooms.length; i++) {
    if (houseId === rooms[i].idRef) {
      let house = searchById("houses", rooms[i].idRef);
      dataRoom += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${house.view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${rooms[i].nameRoom}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${rooms[i].description}</li>
          <li class="list-group-item">${rooms[i].price}dt</li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm" onclick="navigateTo(${rooms[i].id},'idRoomToEdit','edit-room.html')"
            >
              Edit Room
            </button>
          </li>
        </ul>
        <div class="card-body">
         
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="deletObject('rooms',${i})">
            Delete Room
          </button>
        </div>
      </div>
    </div>
      `;
    }
  }
  document.getElementById("roomsCard").innerHTML = dataRoom;
}
function searchRoom() {
  let searchValue = document.getElementById("search").value;
  let rooms = getFromLsArray("rooms");
  let T = [];

  // console.log("ff", listProducts[i].nameProduct);
  if (searchValue === undefined) {
    T = getFromLsArray("rooms");
  } else {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].nameRoom.toLowerCase().includes(searchValue.toLowerCase())) {
        T.push(rooms[i]);
      }
    }
  }
  displayRooms(T);
}
function editInputRoom() {
  let idRoom = getFromLsId("idRoomToEdit");
  let roomtToEdit = searchById("rooms", idRoom);
  document.getElementById("nameRoom").value = roomtToEdit.nameRoom;
  document.getElementById("description").value = roomtToEdit.description;
  document.getElementById("capacity").value = roomtToEdit.capacity;
  document.getElementById("price").value = roomtToEdit.price;
}
function editRoom() {
  let idHouse = getFromLsId("idHouseToEdit");
  let idRoom = getFromLsId("idRoomToEdit");

  let nameRoom = document.getElementById("nameRoom").value;
  let description = document.getElementById("description").value;
  let capacity = document.getElementById("capacity").value;
  let price = document.getElementById("price").value;

  let dataRoom = {
    nameRoom: nameRoom,
    description: description,
    capacity: capacity,
    price: price,
    id: idRoom,
    idRef: idHouse,
  };
  let rooms = getFromLsArray("rooms");
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id === idRoom) {
      rooms.splice(i, 1, dataRoom);
    }
    setIntoLs("rooms", rooms);
    location.reload();
    location.replace("rooms-owner.html");
  }
}
function confirmBooking(id) {
  let reservations = getFromLsArray("reservations");
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].id === id) {
      reservations[i].situation = "Confirmed";
      setIntoLs("reservations", reservations);
      location.reload();
    }
  }
}
//Functions  Guests

function displayHousesUsers(searchData) {
  let houses = searchData !== undefined ? searchData : getFromLsArray("houses");
  let dataHouse = ``;
  for (let i = 0; i < houses.length; i++) {
    dataHouse += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${houses[i].view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${houses[i].nameHouse}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${houses[i].city}</li>
          <li class="list-group-item">${houses[i].adresse}</li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm" onclick="navigateTo(${houses[i].id},'idHouseToEdit','rooms-user.html')"
            >
              View Rooms
            </button>
          </li>
        </ul>
      </div>
    </div>
      `;
  }
  document.getElementById("housesCard").innerHTML = dataHouse;
}
function searchHouseUsers() {
  let searchValue = document.getElementById("search").value;
  let houses = getFromLsArray("houses");
  let T = [];

  // console.log("ff", listProducts[i].nameProduct);
  if (searchValue === undefined) {
    T = getFromLsArray("houses");
  } else {
    for (let i = 0; i < houses.length; i++) {
      if (
        houses[i].nameHouse.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        T.push(houses[i]);
      }
    }
  }
  displayHousesUsers(T);
}
function displayRoomsUsers() {
  let rooms = getFromLsArray("rooms");
  let houseId = getFromLsId("idHouseToEdit");
  let dataRoom = ``;
  for (let i = 0; i < rooms.length; i++) {
    if (houseId === rooms[i].idRef) {
      let house = searchById("houses", rooms[i].idRef);
      dataRoom += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${house.view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${rooms[i].nameRoom}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${rooms[i].description}</li>
          <li class="list-group-item">${rooms[i].price} dt</li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-outline-success btn-sm" onclick="navigateTo(${rooms[i].id},'idRoomToBook','details-reserved.html')"
            >
             To Book
            </button>
          </li>
        </ul>
      </div>
    </div>
      `;
    }
  }
  document.getElementById("roomsCard").innerHTML = dataRoom;
}
function getDetailsRoomToBook() {
  let idRoomToBook = getFromLsId("idRoomToBook");
  let room = searchById("rooms", idRoomToBook);

  document.getElementById("nameRoom").innerHTML = room.nameRoom;
  document.getElementById("description").innerHTML = room.description;
  document.getElementById("price").innerHTML = room.price + " dt";
}
function bookingRoom() {
  let idUser = getFromLsId("idConnectedUser");
  let idRoom = getFromLsId("idRoomToBook");
  let idHouse = getFromLsId("idHouseToEdit");
  let nbrOfPeople = document.getElementById("nbrOfPeople").value;
  let dateEntree = document.getElementById("datepicker").value;
  let dateSortie = document.getElementById("datepicker2").value;
  let room = searchById("rooms", idRoom);
  let house = searchById("houses", idHouse);
  //Appel de la fonction isAvailable() afin de verifier les dates saisis pour voir leurs disponibiltés
  let validateDate = isAvailable(dateEntree, dateSortie, idRoom);
  if (validateDate === false) {
    Swal.fire({
      icon: "error",
      title: "Sorry...",
      text: "the room  does not available for this date!",
      showConfirmButton: false,
    });
  } else {
    if (Number(room.capacity) >= Number(nbrOfPeople)) {
      let reservations = getFromLsArray("reservations");
      let dataBooking = {
        id: Date.now(),
        idUser: idUser,
        idRoom: idRoom,
        idHouse: idHouse,
        idOwner: house.idRef,
        nbrOfPeople: nbrOfPeople,
        dateEntree: dateEntree,
        dateSortie: dateSortie,
        situation: "En attente",
      };
      reservations.push(dataBooking);
      setIntoLs("reservations", reservations);
      //message de reussite et validation du requete de la reservation
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thank you for your reservation!",
        text: "We have registered your request!",
        showConfirmButton: false,
        timer: 5000,
      });
    } else {
      //message d'erreur
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "the room capacity does not meet the number of people!",
        showConfirmButton: false,
      });
    }
  }
}
// Fonction pour vérifier si une réservation est disponible pour les dates spécifiées
function isAvailable(dateEntree, dateSortie, idRoom) {
  let reservations = getFromLsArray("reservations");
  for (let i = 0; i < reservations.length; i++) {
    // Vérifie si les dates spécifiées pour la nouvelle réservation chevauchent une réservation existante
    if (
      reservations[i].idRoom === idRoom &&
      ((dateEntree >= reservations[i].dateEntree &&
        dateEntree <= reservations[i].dateSortie) ||
        (dateSortie >= reservations[i].dateEntree &&
          dateSortie <= reservations[i].dateSortie))
    ) {
      return false;
    }
  }
  // Si aucune réservation existante ne chevauche les dates spécifiées, la nouvelle réservation est disponible
  return true;
}

function cancelBooking(id) {
  let reservations = getFromLsArray("reservations");
  for (let i = 0; i < reservations.length; i++) {
    if (reservations[i].id === id) {
      reservations[i].situation = "Annulée";
      setIntoLs("reservations", reservations);
      location.reload();
    }
  }
}

//Functions Admin

function displayUsers() {
  let users = getFromLsArray("users");
  let listUsers = ``;
  for (let i = 0; i < users.length; i++) {
    if (users[i].role !== "admin") {
      listUsers =
        listUsers +
        `<tr>
      <th scope="row">${users[i].id}</th>
      <td>${users[i].firstName}</td>
      <td>${users[i].lastName}</td> 
      <td>${users[i].role}</td>
      <td>${users[i].email}</td>
      <td>${users[i].phone}</td>    
      <td><button type="button" onclick="deletobject('users',${i})" class="btn btn-danger" ><i class="fa fa-trash"></i> </button></td>     
    </tr>`;
    }
  }
  document.getElementById("listUsres").innerHTML = listUsers;
}
function displayHousesAdmin(searchData) {
  let houses = searchData !== undefined ? searchData : getFromLsArray("houses");
  let dataHouse = ``;
  for (let i = 0; i < houses.length; i++) {
    dataHouse += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${houses[i].view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${houses[i].nameHouse}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${houses[i].city}</li>
          <li class="list-group-item">${houses[i].adresse}</li>
          <li class="list-group-item">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm" onclick="navigateTo(${houses[i].id},'idHouseToEdit','display-rooms-admin.html')"
            >
              View Rooms
            </button>
          </li>
        </ul>
        <div class="card-body">
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="deletObject('houses',${i})">
            Delete House
          </button>
        </div>
      </div>
    </div>
      `;
  }
  document.getElementById("housesCard").innerHTML = dataHouse;
}
function displayRoomsAdmin(searchData) {
  let rooms = searchData !== undefined ? searchData : getFromLsArray("rooms");
  let houseId = getFromLsId("idHouseToEdit");
  let dataRoom = ``;
  for (let i = 0; i < rooms.length; i++) {
    if (houseId === rooms[i].idRef) {
      let house = searchById("houses", rooms[i].idRef);
      dataRoom += `<div class="col-sm-6 mb-5">
      <div class="card" style="width: 20rem">
        <img src=${house.view} class=" card-img-top " style="height:300px" />
        <div class="card-body">
          <h5 class="card-title">${rooms[i].nameRoom}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${rooms[i].description}</li>
          <li class="list-group-item">${rooms[i].price}dt</li>
        </ul>
        <div class="card-body">
         
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="deletObject('rooms',${i})">
            Delete Room
          </button>
        </div>
      </div>
    </div>
      `;
    }
  }
  document.getElementById("roomsCard").innerHTML = dataRoom;
}

// ******************** fonctions generiques begin ***********************

function validateEmail(email) {
  let mailFormat =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return mailFormat.test(email);
}
function validatePassword(password) {
  let lowerCaseLetters = password.match(/[a-z]/g);
  let upperCaseLetters = password.match(/[A-Z]/g);
  let numbers = password.match(/[0-9]/g);
  let length = password.length > 8;

  if (lowerCaseLetters && upperCaseLetters && numbers && length) {
    return [true, ""];
  }
  if (lowerCaseLetters && !upperCaseLetters && !numbers && !length) {
    return [false, "upper numbers length"];
  }
  if (!lowerCaseLetters && upperCaseLetters && !numbers && !length) {
    return [false, "lower numbers length"];
  }
  if (!lowerCaseLetters && !upperCaseLetters && numbers && !length) {
    return [false, "lower upper  length"];
  }
  if (lowerCaseLetters && !upperCaseLetters && !numbers && length) {
    return [false, " upper numbers "];
  }
  if (lowerCaseLetters && upperCaseLetters && !numbers && length) {
    return [false, " numbers "];
  }
  if (lowerCaseLetters && upperCaseLetters && numbers && !length) {
    return [false, "length !! "];
  }
  if (!lowerCaseLetters && upperCaseLetters && numbers && length) {
    return [false, "lower  !! "];
  }
  if (!lowerCaseLetters && !upperCaseLetters && numbers && length) {
    return [false, "lower !! upper!!  "];
  }
  if (!lowerCaseLetters && upperCaseLetters && !numbers && length) {
    return [false, "lower !!  numbers !! "];
  }
  if (!lowerCaseLetters && upperCaseLetters && numbers && !length) {
    return [false, "lower !! length !!"];
  }
  if (lowerCaseLetters && !upperCaseLetters && numbers && length) {
    return [false, " upper !!  "];
  }
  if (lowerCaseLetters && !upperCaseLetters && !numbers && length) {
    return [false, "upper !! numbers !!"];
  }
  if (lowerCaseLetters && !upperCaseLetters && numbers && !length) {
    return [false, " upper !! length !! "];
  }
  if (lowerCaseLetters && upperCaseLetters && !numbers && length) {
    return [false, " numbers !!"];
  }
  if (lowerCaseLetters && upperCaseLetters && !numbers && !length) {
    return [false, " numbers !! length !!"];
  }
}
function displayErrors(condition, elementId, msgError) {
  if (!condition) {
    document.getElementById(elementId).innerHTML = msgError;
    document.getElementById(elementId).style.color = "red";
  } else {
    document.getElementById(elementId).innerHTML = " ";
  }
}
function getFromLsArray(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function getFromLsId(key) {
  return JSON.parse(localStorage.getItem(key) || "0");
}
function setIntoLs(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function counterByIdRef(key, id) {
  let count = 0;
  let T = JSON.parse(localStorage.getItem(key) || "[]");
  for (let i = 0; i < T.length; i++) {
    if (T[i].idRef === id) {
      count = count + 1;
    }
  }
  return count;
}
function navigateTo(id, key, path) {
  localStorage.setItem(key, id);
  window.location = path;
}
function searchById(key, id) {
  let T = JSON.parse(localStorage.getItem(key) || "[]");
  for (let i = 0; i < T.length; i++) {
    if (T[i].id === id) {
      return T[i];
    }
  }
}
function deletObject(key, idPosition) {
  let objects = getFromLsArray(key);
  objects.splice(idPosition, 1);
  localStorage.setItem(key, JSON.stringify(objects));
  location.reload();
}

//******************  fonctions generiques End **********************
